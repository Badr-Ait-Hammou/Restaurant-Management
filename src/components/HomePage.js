import React from 'react';
import {Toast} from "primereact/toast";
import {Link} from "react-router-dom";
import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import axios from "../service/callerService";
import {Tag} from "primereact/tag";
import {Rating} from "@mui/material";
import {useRef} from "react";
import {accountService} from "../service/accountService";
import {Carousel} from 'primereact/carousel';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import HomPageSkeleton from "../skeleton/HomePageSkeleton";
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import logo from "../images/logo.svg";
import {Card, CardContent, Avatar, Grid, Box} from '@mui/material';
import Typography from "@mui/material/Typography";
import RestaurantSlick from "../slick-Slider/RestaurantSlick"
import HomeImgSlick from "../slick-Slider/HomeImgSlick";
import SpecialitySlick from "../slick-Slider/SpecialitySlick";


export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [productsno, setProductsno] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [productInCart, setProductInCart] = useState({});
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        axios.get("/api/controller/produits/promotion").then((response) => {
            setProducts(response.data);
        });
        axios.get("/api/controller/produits/nopromotion").then((response) => {
            setProductsno(response.data);
        });
        loadProductsUser();
        setLoading(false);
    }, []);




    const getAverageRating = (product) => {
        const ratings = product.avisList.map((avis) => avis.rating);
        if (ratings.length > 0) {
            const totalRating = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return totalRating / ratings.length;
        } else {
            return 0;
        }
    };

    const getReviews = (product) => {
        const ratings = product.avisList.map((avis) => avis.rating);
        const reviewCount = product.avisList.length;

        if (ratings.length > 0) {
            return reviewCount;
        } else {
            return 0;
        }
    };


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

        products.forEach((product) => {
            checkProductInCart(product.id);
        });
    };

    // useEffect(() => {
    //     loadProductsUser();
    //     setLoading(false);
    //
    // }, [userId, products]);


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

    const showSuccess = () => {
        toast.current.show({severity: 'success', summary: 'Success', detail: 'item added to cart', life: 1000});
    }



    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    if (loading || products.length === 0) {
        return (<HomPageSkeleton/>)
    }


    const productTemplate = (product) => {
        return (
            <div key={product.id} className="border-1 surface-border border-round m-2 text-center py-5 px-3">
                <Link to={`product/${product.id}`}>
                    <div style={{position: 'relative'}}>
                        <img
                            className="shadow-2"
                            src={product.photo}
                            alt={product.nom}
                            style={{
                                width: '100%',
                                height: '200px',
                                borderRadius: '8px',
                            }}
                        />
                        {product.stock <= 0 ? (
                            <Tag
                                severity="danger"
                                value="Out of Stock"
                                style={{
                                    fontSize: '10px',
                                    position: 'absolute',
                                    top: '3px',
                                    right: '11px',
                                }}
                            />
                        ) : product.stock < 20 ? (
                            <Tag
                                severity="warning"
                                value="LOWSTOCK"
                                style={{
                                    fontSize: '10px',
                                    position: 'absolute',
                                    top: '3px',
                                    right: '11px',
                                }}
                            />
                        ) : (
                            <Tag
                                severity="success"
                                value="In Stock"
                                style={{
                                    fontSize: '10px',
                                    position: 'absolute',
                                    top: '3px',
                                    right: '11px',
                                }}
                            />
                        )}

                    </div>
                </Link>
                <div>
                    <h4 className="mb-1">{product.nom}</h4>
                    <Rating value={getAverageRating(product)} readOnly cancel={false} precision={0.5}></Rating>
                    <Typography
                        className="font-monospace ">({getReviews(product)})review{getReviews(product) !== 1 ? 's' : ""}</Typography>

                    {product.promotion === true && (
                        <Tag value="On Sale" severity="danger" icon="pi pi-tag"/>
                    )}
                    <span className="font-semibold ml-1">{product.stock} Pcs</span>
                    <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
                        <span className="text-2xl font-semibold">{product.prix} Dh</span>

                        {productInCart[product.id] ? (
                            <Link to="/admin/cart">
                                <Button
                                    style={{
                                        background:
                                            'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)',
                                    }}
                                    icon="pi pi-external-link"
                                    className="p-button-rounded "
                                    disabled={product.stock <= 0}
                                />
                            </Link>
                        ) : (
                            <Button
                                icon="pi pi-shopping-cart"
                                className="p-button-rounded "
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock <= 0 || productInCart[product.id]}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <>
            <Toast ref={toast}/>
            <div style={{position: 'relative'}}>
                <Grid container spacing={2}>
                    <Grid item xs={6} className="mt-2 mb-2  ">
                        <Box display="flex" justifyContent="start" alignItems="center">
                            <Avatar src={logo} sx={{width: 84, height: 34, marginX: 1}}/>
                        </Box>
                    </Grid>


                    <Grid item xs={6} className="mt-2 mb-2">
                        <Box display="flex" justifyContent="end" alignItems="center">
                            <Tag className="mx-1" icon={<PhoneRoundedIcon/>} severity="success"
                                 value="+212 0666995588"/>
                        </Box>
                    </Grid>
                </Grid>

                <div style={{width: '100%', height: '250px'}}>
                    <HomeImgSlick/>
                    <div
                        style={{
                            position: 'absolute',
                            top: 60,
                            left: 0,
                            width: '100%',
                            height: '410px',
                            backgroundColor: 'black',
                            opacity: 0.6,
                        }}
                    >
                    </div>
                    <div style={{
                        position: 'absolute',
                        display: 'flex',
                        top: '95%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>


                        <Button label="Best Offers" severity="help" raised className="m-1 p-1"
                                style={{fontSize: "11px"}}/>
                        <Button label="Today's Deals " severity="warning" raised className="m-1 p-1"
                                style={{fontSize: "11px"}}/>

                    </div>
                    <div style={{position: 'absolute', top: '55%', left: '50%', transform: 'translateX(-50%)'}}>
                        <Typography variant="h4" align="center" gutterBottom style={{color: "white"}}>
                            Welcome
                        </Typography>
                    </div>


                </div>

            </div>

            <div style={{marginTop: "135px"}}>
                <Card variant="outlined"
                      sx={{borderColor: "white", backgroundColor: 'rgba(234,230,233,0.27)'}}>
                    <CardContent>
                        <SpecialitySlick/>
                    </CardContent>
                </Card>

            </div>

            <div className="mt-3">

                <div className=" mx-3 mb-2 text-lg-start text-2xl ">
                    <strong className="font-serif ">Our Restaurants</strong>
                </div>
                <Card variant="outlined"
                      sx={{marginX: 2, backgroundColor: 'rgba(239,230,236,0.29)'}}>
                    <CardContent>
                        <RestaurantSlick/>
                    </CardContent>
                </Card>


                <div style={{marginTop: "50px"}}>
                    <div className=" mx-3 mb-2 text-lg-start text-2xl ">
                        <strong className="font-serif ">On Sale</strong>
                    </div>
                    <div >

                        <Carousel
                            value={products}
                            numVisible={4} numScroll={1}
                            responsiveOptions={responsiveOptions}
                            className="custom-carousel"
                            circular
                            prevIcon={<SkipPreviousRoundedIcon/>}
                            nextIcon={<SkipNextRoundedIcon/>}
                            autoplayInterval={3000} itemTemplate={productTemplate}

                        />
                    </div>
                </div>

            </div>


            <div className="mt-2">
                <div className=" mx-3 mb-2 text-lg-start text-2xl ">
                    <strong className="font-serif ">Best Plans</strong>
                </div>
                <div className=" mt-5">
                    <div >

                        <Carousel value={productsno}
                                  numVisible={4}
                                  numScroll={1}
                                  responsiveOptions={responsiveOptions}
                                  className="custom-carousel"
                                  circular
                                  prevIcon={<SkipPreviousRoundedIcon/>}
                                  nextIcon={<SkipNextRoundedIcon/>}
                                  autoplayInterval={3000} itemTemplate={productTemplate}


                        />
                    </div>
                </div>
            </div>

        </>

    );
}
