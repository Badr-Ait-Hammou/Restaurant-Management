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
import { Grid, Typography } from "@mui/material";
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
import Avatar from "@mui/material/Avatar";
import { formatDistanceToNow, format } from 'date-fns';
import RestaurantRating from "./RestaurantRating";
import {InputTextarea} from "primereact/inputtextarea";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import shoppingCartIcon from "../images/shopping-cardIcon.gif";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import Proskeleton from "../skeleton/ProfileSkeleton"


export default function RestaurantProductDetails() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [productInCart, setProductInCart] = useState({});
    const [productSpeciality, setProductsSpeciality] = useState([]);
    const restaurantId = products.restaurant && products.restaurant.id;
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const tokenInfo = accountService.getTokenInfo();
            if (tokenInfo) {
                try {
                    const user = await accountService.getUserByEmail(tokenInfo.sub);
                    setUserId(user.id);
                    console.log('user', user.id);
                    const respo = await axios.get(`/api/controller/produits/${id}`);
                    setProducts(respo.data);
                    const specialiteId = respo.data && respo.data.restaurant.specialite.id;
                    const resp = await axios.get(`/api/controller/produits/restaurant/speciality/${specialiteId}`);
                    setProductsSpeciality(resp.data);
                    setLoading(false);

                } catch (error) {
                    console.log('Error retrieving user:', error);
                }
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        loadProductsUser();

    }, [id,userId, productSpeciality]);


    const loadProductsUser = async () => {
        const checkProductInCart = async (productId) => {
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

        productSpeciality.forEach((specialityProduct) => {
            checkProductInCart(specialityProduct.id);
        })


    };

    if (loading || productSpeciality.length === 0) {
        return <Proskeleton />;
    }



    const handleAddToCart = (product) => {
        setIsLoading(true); // Set loading state to true

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
            .then(() => {
                setIsLoading(false);
                console.log('Product added to cart successfully!');
                showSuccess();
                loadProductsUser();
            })
            .catch(error => {
                console.error('Error adding product to cart:', error);
            })
    };



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
            <div className="col-12">
                <div className="flex flex-wrap p-2 align-items-center gap-3">
                    <Link to={`/ifoulki_meals/all_products/product/${product.id}`}>
                        <img className="w-4rem shadow-2 flex-shrink-0 border-round"
                             src={product.photo} alt={product.nom}  style={{
                            width: '800%',
                            height: '50%',
                            borderRadius: '8px'
                        }}
                        />
                    </Link>
                    <div className="flex-1 flex flex-column gap-1 xl:mr-8  ">
                        <p className="font-bold text-left" >{product.nom}</p>
                        <Typography variant="body1" gutterBottom >
                            <div style={{float:"left"}}>
                                <Rating value={averageRating} style={{float:"left",fontSize:"15px"}} readOnly  />
                                <Typography  className="font-monospace" style={{float:"left",fontSize:"12px"}}  >({totalReviews}) <ThumbUpOffAltIcon style={{fontSize:"15px"}}/></Typography>
                            </div>
                        </Typography>
                        <div className="flex align-items-center ">
                            {product.promotion === true ? (
                                <Tag   value="On Sale" severity="danger" icon="pi pi-tag" />
                            ) : (
                                <Tag   value="New" severity="success" icon="pi pi-tag" />
                            )}
                        </div>
                    </div>
                    <span className="font-bold text-900">{product.prix} Dh</span>
                    {productInCart[product.id] ? (

                        <Link to="/ifoulki_meals/cart" style={{textDecoration: "none", color: "white"}}>
                            <Button
                                icon={<ShoppingCartCheckoutIcon style={{fontSize:"28px"}}  />}
                                label={"View" }
                                className="p-button-rounded p-button-raised gap-1 border-teal-400  p-button-text text-teal-600   mt-2 p-2   "
                                disabled={product.stock <= 0}
                            />
                        </Link>
                    ) : (
                        <div>
                            <Button
                                style={{backgroundColor:"rgb(1,169,164)"}}
                                icon={<img src={shoppingCartIcon} alt="Shopping Cart"  width="30px" />}
                                label={"Add"}

                                className="p-button-rounded p-button-raised gap-2 border-teal-400  p-button-text text-white   mt-2 p-2   "
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock <= 0 || productInCart[product.id] || isLoading}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const itemTemplateFeedback = (comment) => {
        return (

            <Box sx={{mt:1}} className="col-12 p-1">
                <Grid item  container  columns={12}>
                    <Grid  item xs={3} md={2}   >
                        <div>
                            <Avatar sx={{backgroundColor:"rgba(50,121,99,0.18)",mx:1,p:1,width:70,height:70,mt:2}} src={comment.user && comment.user.photo} alt={"badr"} />
                        </div>
                    </Grid>
                    <Grid item xs={9} md={10}   >
                        <div className="card mb-2  flex justify-content-start" style={{backgroundColor:"transparent",borderColor:"transparent"}}>
                            <Typography variant="body1" gutterBottom>
                                <div>
                                    <small className="text-black font-monospace" style={{ float: 'left' }}>{formatCommentDate(comment.commentDate)}</small><br/>
                                    <strong className="text-black" style={{ float: 'left' }}>{comment.user && comment.user.firstName}</strong>
                                    <Rating value={comment.rating} readOnly  style={{ float: 'left', marginLeft: '10px' }} />
                                </div>
                            </Typography>
                            <InputTextarea readOnly={true} value={comment.note || 'nice'} className="font-bold" />
                        </div>
                    </Grid>
                </Grid>
            </Box>

        );
    };


    return (
        <>
            <Toast ref={toast}/>
            <Box className="mx-4 mt-5" sx={{mt:5,mx:3,p:2,backgroundColor:"rgba(43,115,94,0.09)",borderRadius:2}}>
                <Grid  item columns={12} spacing={2}  container >
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
                    <Grid item columns={12} md={7} container spacing={1}  className="md:flex md:flex-col md:items-start  text-md-start">
                        <div className="flex flex-col col-12  ">
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
                                {products.promotion === true ? (
                                    <Tag className="mx-2"  value="On Sale" severity="danger" icon="pi pi-tag" />
                                ) : (
                                    <Tag className="mx-2"  value="New" severity="success" icon="pi pi-tag" />
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
                                {/*<Typography variant="body1" gutterBottom>*/}
                                {/*    <span className="font-extrabold text-1xl">Status: </span>*/}


                                {/*</Typography>*/}
                            </div>
                            <div >

                                <Typography variant="body1" gutterBottom>
                                    <Rating style={{float:"left"}} value={getAverageRating(products)} readOnly  />
                                    <Typography style={{float:"right"}} className="font-monospace ">({getReviews(products)} review{getReviews(products) !== 1 ? 's' : ''})</Typography>
                                </Typography>

                            </div>
                        </div>
                        <Grid columns={12}  container alignItems={"center"} justifyContent={"center"}  style={{backgroundColor:"rgba(140,134,134,0.15)",borderRadius:"10px"}}>
                            <Grid item xs={6} mt={1}>

                                <Typography variant="body1" className=" text-left" gutterBottom>
                                    <span className="font-extrabold  mx-2 text-1xl">Price: </span>
                                    <span className="font-monospace text-1xl"> {products.prix} Dh </span>
                                </Typography>
                            </Grid>
                            <Grid item xs={6} className=" mt-1 sm:mt-1 lg:mt-0 md:mt-1">
                                <div className="flex justify-content-end align-items-center  ">
                                    {productInCart[products.id] ? (
                                        <Link to="/ifoulki_meals/cart" style={{textDecoration: "none", color: "white"}}>
                                            <Button
                                                icon={<ShoppingCartCheckoutIcon style={{fontSize:"28px"}}  />}
                                                label={"View" }
                                                className="p-button-rounded p-button-raised  border-teal-400  p-button-text text-teal-600 p-2   "
                                                disabled={products.stock <= 0}
                                            />
                                        </Link>
                                    ) : (
                                        <div>
                                            <Button
                                                style={{backgroundColor:"rgb(1,169,164)"}}
                                                icon={<img src={shoppingCartIcon} alt="Shopping Cart"  width="30px" />}
                                                label={"Add"}
                                                className="p-button-rounded p-button-raised border-teal-400 p-button-text text-white p-2   "
                                                onClick={() => handleAddToCart(products)}
                                                disabled={products.stock <= 0 || productInCart[products.id] || isLoading}
                                            />
                                        </div>
                                    )}
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>

            <div className="card mx-4 mt-2">
                <Box sx={{mx:1,mt:1}}>
                    <Grid item  container spacing={3} columns={12}>
                        <Grid  item xs={3} md={1}   >
                            <div>
                                <Avatar sx={{backgroundColor:"rgba(50,121,99,0.18)",width:70,height:70}}  alt={"badr"} />
                            </div>
                        </Grid>
                        <Grid item xs={9} md={11}   >
                            <div className="card  flex justify-content-start" style={{backgroundColor:"transparent",borderColor:"transparent"}}>
                                <Typography variant="body1" className="ml-1" gutterBottom>
                                    <strong className="text-black" style={{float:"left"}} >time</strong>
                                </Typography>
                                <Typography variant="body2" className="ml-1" color="text.secondary" sx={{float:"left"}}>
                                    <p  style={{float:"left"}} >delivery info</p>
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            {/*             Restaurant info         */}

            <div className="card mx-4 mt-2">
                <Box sx={{mx:1,mt:1}}>
                    <Grid item  container spacing={3} columns={12}>
                        <Grid  item xs={3} md={1}   >
                            <div>
                                <Avatar sx={{backgroundColor:"rgba(50,121,99,0.18)",width:70,height:70}}  src={products.restaurant && products.restaurant.photo} alt={"badr"} />
                            </div>
                        </Grid>
                        <Grid item xs={9} md={11}   >
                            <div className="card  flex justify-content-start" style={{backgroundColor:"transparent",borderColor:"transparent"}}>
                                <Link to={`/ifoulki_meals/restaurants/${restaurantId}`}>

                                    <Typography variant="body1" className="ml-1 mb-5" gutterBottom>
                                        <strong className="text-black" style={{float:"left"}} >{products.restaurant && products.restaurant.nom}</strong>
                                    </Typography>
                                </Link>
                                <RestaurantRating restaurantId={restaurantId} />

                                <Typography variant="body2" className="ml-1 text-left" color="text.secondary"   sx={{float:"left"}}>
                                    <p  style={{float:"left"}} >{products.restaurant && products.restaurant.adresse}</p>
                                </Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </div>


            <Box sx={{mx:3,mt:3}}>
                <Grid item container spacing={1}  columns={12} >
                    <Grid item xs={12} md={7}  >
                        <div className="card">
                            <DataView value={products.avisList} itemTemplate={itemTemplateFeedback} paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={3} header="Feedback" />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={5}   >
                        <div className="card ">
                            <DataView value={productSpeciality} itemTemplate={itemTemplate3} paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={3} header="Similar products" />
                        </div>
                    </Grid>
                </Grid>
            </Box>



        </>
    );
}


