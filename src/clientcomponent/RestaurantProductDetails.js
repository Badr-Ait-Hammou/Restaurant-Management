import {Link, useParams} from 'react-router-dom';
import axios from '../service/callerService';
import {useEffect, useState, useRef} from "react";
import { Rating} from "@mui/material";
import React from "react";
import {accountService} from "../service/accountService";
import {Toast} from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import {Tag} from "primereact/tag";
import Skeleton from "../skeleton/ProfileSkeleton"
import { Card, CardContent, Grid, Typography } from "@mui/material";
import {Button} from 'primereact/button';
import { Image } from 'primereact/image';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import RotateLeftRoundedIcon from '@mui/icons-material/RotateLeftRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import ZoomInRoundedIcon from '@mui/icons-material/ZoomInRounded';
import ZoomOutRoundedIcon from '@mui/icons-material/ZoomOutRounded';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import {DataView} from "primereact/dataview";
import Box from "@mui/material/Box";
import {InputText} from "primereact/inputtext";
import Avatar from "@mui/material/Avatar";
import { formatDistanceToNow, format } from 'date-fns';
import RestaurantRating from "./RestaurantRating";


export default function RestaurantProductDetails() {
    const {id} = useParams();
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [productInCart, setProductInCart] = useState({});
    const [productSpeciality, setProductsSpeciality] = useState({});
    const  restaurantId= products.restaurant && products.restaurant.id;






    const loadProductsUser = () => {
        const checkProductInCart = (productId) => {
            if (userId) {
                axios.get(`/api/controller/carts/incart/${userId}/${productId}`)
                    .then(response => {
                        setProductInCart(prevProductInCart => ({
                            ...prevProductInCart,
                            [productId]: response.data,
                        }));
                    })
                    .catch(error => {
                        console.error('Error checking product in cart:', error);
                    });
            }
        };

        if (products && products.id) {
            checkProductInCart(products.id);
        }

        if (productSpeciality && productSpeciality.length > 0) {
            productSpeciality.forEach(specialityProduct => {
                if (specialityProduct.id) {
                    checkProductInCart(specialityProduct.id);
                }
            });
        }
    };

    useEffect(() => {
        loadProductsUser();
    }, [userId, products, productSpeciality]);


    useEffect(() => {
        const fetchUserData = async () => {
            const tokenInfo = accountService.getTokenInfo();
            if (tokenInfo) {
                try {
                    const user = await accountService.getUserByEmail(tokenInfo.sub);
                    setUserId(user.id);
                    console.log('user', user.id);
                } catch (error) {
                    console.log('Error retrieving user:', error);
                }
            }
        };
        fetchUserData();
    }, []);


    const handleAddToCart = (product) => {
        const cartItem = {
            quantity: 1,
            totalprice: product.prix,
            user: {
                id: userId,
            },
            produit: {
                id: product.id,
            }
        };

        axios.post('/api/controller/carts/', cartItem)
            .then(response => {
                console.log('Product added to cart successfully!');
                showSuccess();
                loadProductsUser();
            })
            .catch(error => {
                console.error('Error adding product to cart:', error);
            });
    };


    useEffect(() => {
        axios.get(`/api/controller/produits/${id}`)
            .then((response) => {
                setProducts(response.data);
            });
    }, [id]);

    useEffect(() => {
        const specialiteId = products.restaurant && products.restaurant.specialite.id;

        if (specialiteId !== undefined) {
            axios.get(`/api/controller/produits/restaurant/speciality/${specialiteId}`)
                .then((response) => {
                    setProductsSpeciality(response.data);

                })
                .catch((error) => {
                    console.error('Error fetching products with speciality:', error);
                });
        }
    }, [products]);


    if (!products) {
        return <Skeleton/>;
    }

    const showSuccess = () => {
        toast.current.show({severity: 'success', summary: 'Success', detail: 'item added to cart', life: 1000});
    }
    const getAverageRating = (product) => {
        if (product && product.avisList && Array.isArray(product.avisList) && product.avisList.length > 0) {
            const ratings = product.avisList.map((avis) => avis.rating);
            const totalRating = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return totalRating / ratings.length;
        } else {
            return 0;
        }
    };

    const getReviews = (product) => {
        if (product && product.avisList && Array.isArray(product.avisList)) {
            return product.avisList.length;
        } else {
            return 0;
        }
    };

    /******************************* Date ******************************/

    function formatCommentDate(commentDate) {
        const now = new Date();
        const commentDateTime = new Date(commentDate);
        const timeDifference = now - commentDateTime;

        if (timeDifference < 3600000) {
            return formatDistanceToNow(commentDateTime, { addSuffix: true });
        } else {
            return format(commentDateTime, 'dd-MM-yyyy HH:mm');
        }
    }



    const itemTemplate3 = (product) => {
        const averageRating = getAverageRating(product);
        const totalReviews = getReviews(product);
        return (
            <div key={product.id} className="flex flex-wrap p-2 align-items-center gap-3">
                <img  className="w-90 sm:w-6rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={product.photo} alt={product.nom} />
                <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                    <span className="font-bold">{product.nom}</span>
                    <Typography variant="body1" gutterBottom>
                        <div>
                            <Rating value={averageRating} readOnly cancel={false} />
                            <small className="text-black">({totalReviews} review{totalReviews !== 1 ? 's' : ''})</small>
                        </div>
                    </Typography>

                    <div className="flex align-items-center gap-2">
                        {product.promotion === true ? (
                            <Tag className="mx-2"  value="On Sale" severity="danger" icon="pi pi-tag" />
                        ) : (
                            <Tag className="mx-2"  value="New" severity="success" icon="pi pi-tag" />
                        )}
                    </div>
                </div>
                <span className="font-bold text-900">${product.prix}</span>
                {productInCart[product.id] ? (
                    <Link to="/admin/cart">
                        <Button
                            style={{ background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)' }}
                            icon="pi pi-external-link"
                            className="p-button-rounded"
                            disabled={product.stock <= 0}
                        />
                    </Link>
                ) : (
                    <Button
                        icon="pi pi-shopping-cart"
                        className="p-button-rounded"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0 || productInCart[product.id]}
                    />
                )}
            </div>
        );
    };

    const itemTemplateFeedback = (comment) => {
        return (

            <Box sx={{mx:1,mt:1}}>
                <Grid item  container  columns={12}>
                    <Grid  item xs={3} md={2}   >
                        <div>
                            <Avatar sx={{backgroundColor:"rgba(50,121,99,0.18)",p:1,width:70,height:70,mt:2}} src={comment.user && comment.user.photo} alt={"badr"} />
                        </div>
                    </Grid>
                    <Grid item xs={9} md={10}   >
                        <div className="card mb-2 ml-1 flex justify-content-start" style={{backgroundColor:"transparent",borderColor:"transparent"}}>
                            <Typography variant="body1" gutterBottom>
                                <div>
                                    <small className="text-black font-monospace" style={{ float: 'left' }}>{formatCommentDate(comment.commentDate)}</small><br/>
                                    <strong className="text-black" style={{ float: 'left' }}>{comment.user && comment.user.firstName}</strong>
                                    <Rating value={comment.rating} readOnly cancel={false} style={{ float: 'left', marginLeft: '10px' }} />
                                </div>
                            </Typography>
                            <InputText disabled={true} value={comment.note || 'nice'} className="font-bold" />
                        </div>
                    </Grid>
                </Grid>
            </Box>

        );
    };


    return (
        <>
            <Toast ref={toast}/>
            <Card className="mt-4 mx-4 p-1 m-1" variant="outlined" style={{ backgroundColor: "rgba(88,176,154,0.03)" }}>
                <CardContent>
                    <Grid item container spacing={2}  columns={12}>
                        <Grid item xs={12} md={5}  >
                            <div className="mt-2">

                                <Image
                                    downloadIcon={<DownloadRoundedIcon/>}
                                    closeIcon={<HighlightOffRoundedIcon/>}
                                    rotateLeftIcon={<RotateLeftRoundedIcon/>}
                                    rotateRightIcon={<RotateRightRoundedIcon/>}
                                    zoomInIcon={<ZoomInRoundedIcon/>}
                                    zoomOutIcon={<ZoomOutRoundedIcon/>}
                                    downloadable={true}
                                    alt="badr"
                                    src={products.photo}
                                    indicatorIcon={<RemoveRedEyeRoundedIcon/>}
                                    preview
                                    imageStyle={{
                                        width: 350,
                                        height: 250,
                                        borderRadius: 10,
                                        objectFit:"fill"
                                    }}
                                />
                            </div>
                        </Grid>
                        <Grid item columns={12} md={7} container spacing={1}  className="md:flex md:flex-col md:items-start text-center text-md-start">
                            <div className="map-container d-flex">
                                <div className="flex flex-column ">
                                    <Typography  gutterBottom>
                                        {products.stock <= 0 ? (
                                            <Tag
                                                severity="warning"
                                                value="Out of Stock"

                                            />
                                        ) : (
                                            <Tag
                                                severity="success"
                                                value="In Stock"

                                            />
                                        )}
                                    </Typography>
                                    <Typography  gutterBottom>
                                       <span className="font-extrabold text-2xl">Product Name: {products.nom}</span>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <span className="font-extrabold text-1xl">Product Description: </span>
                                        <span className="font-monospace text-1xl"> {products.description}</span>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <span className="font-extrabold text-1xl">Stock: </span>
                                        <span className="font-monospace text-1xl"> {products.stock} pcs</span>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <span className="font-extrabold text-1xl">Restaurant: </span>
                                        <span className="font-monospace text-1xl"> {products.restaurant && products.restaurant.nom } </span>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <span className="font-extrabold text-1xl">Speciality: </span>
                                        <span className="font-monospace text-1xl"> {products.restaurant && products.restaurant.specialite.nom } </span>
                                    </Typography>
                                    <div >
                                        <Typography variant="body1" gutterBottom>
                                            <span className="font-extrabold text-1xl">Status: </span>

                                        {products.promotion === true ? (
                                            <Tag className="mx-2"  value="On Sale" severity="danger" icon="pi pi-tag" />
                                        ) : (
                                            <Tag className="mx-2"  value="New" severity="success" icon="pi pi-tag" />
                                        )}
                                        </Typography>
                                    </div>
                                    <div >

                                        <Typography variant="body1" gutterBottom>
                                            <div>
                                                <Rating style={{float:"left"}} value={getAverageRating(products)} readOnly cancel={false} />
                                                <Typography  className="font-monospace ">({getReviews(products)} review{getReviews(products) !== 1 ? 's' : ''})</Typography>
                                            </div>
                                        </Typography>

                                    </div>
                                </div>
                            </div>
                            <Grid columns={12}  container  style={{backgroundColor:"rgba(140,134,134,0.15)",borderRadius:"10px"}}>
                                <Grid xs={6} >

                                    <Typography variant="body1" className="mt-2 " gutterBottom>
                                        <span className="font-extrabold  mx-2 text-1xl">Price: </span>
                                        <span className="font-monospace text-1xl"> {products.prix} Dh </span>
                                    </Typography>
                                </Grid>
                                <Grid xs={6} >
                                    <div className="flex justify-content-end">
                                        {productInCart[products.id] ? (
                                            <Link to="/admin/cart">
                                                <Button
                                                    style={{background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'}}
                                                    icon="pi pi-external-link"
                                                    className="p-button-rounded"
                                                    disabled={products.stock <= 0}
                                                />
                                            </Link>
                                        ) : (
                                            <Button
                                                icon="pi pi-shopping-cart"
                                                className="p-button-rounded "
                                                onClick={() => handleAddToCart(products)}
                                                disabled={products.stock <= 0 || productInCart[products.id]}
                                            />
                                        )}
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>


            <div className="card mx-4 mt-2">
            <Box sx={{mx:1,mt:1}}>
                <Grid item  container spacing={3} columns={12}>
                    <Grid  item xs={3} md={1}   >
                        <div>
                            <Avatar sx={{backgroundColor:"rgba(50,121,99,0.18)",width:70,height:70}} src={products.restaurant && products.restaurant.photo} alt={"badr"} />
                        </div>
                    </Grid>
                    <Grid item xs={9} md={11}   >
                        <div className="card  flex justify-content-start" style={{backgroundColor:"transparent",borderColor:"transparent"}}>
                            <Typography variant="body1" className="ml-1" gutterBottom>
                                <strong className="text-black" style={{float:"left"}} >{products.restaurant && products.restaurant.nom}</strong>
                            </Typography>
                            <Typography variant="body2" className="ml-1" color="text.secondary" sx={{float:"left"}}>
                                <p  style={{float:"left"}} >{products.restaurant && products.restaurant.adresse}</p>
                            </Typography>
                            <RestaurantRating restaurantId={restaurantId} />
                        </div>
                    </Grid>
                </Grid>
            </Box>
            </div>


            <Box sx={{mx:3,mt:3}}>
                <Grid item container spacing={2}  columns={12}>
                    <Grid item xs={12} md={7}  >
                        <div className="card">
                            <DataView value={products.avisList} itemTemplate={itemTemplateFeedback} paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={3} header="Feedback" />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={5}  >
                        <div className="card">
                            <DataView value={productSpeciality} itemTemplate={itemTemplate3} paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={3} header="Similar products" />
                        </div>
                    </Grid>
                </Grid>
            </Box>



        </>
    );
}


