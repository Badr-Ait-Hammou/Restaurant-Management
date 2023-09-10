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
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';


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
    }, []);


    useEffect(() => {
        axios.get("/api/controller/produits/nopromotion").then((response) => {
            setProductsno(response.data);
        });
    }, []);

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

    useEffect(() => {
        loadProductsUser();
        setLoading(false);

    }, [userId, products]);


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


    const chunkArray = (myArray, chunkSize) => {
        const arrayCopy = [...myArray];
        const results = [];
        while (arrayCopy.length) {
            results.push(arrayCopy.splice(0, chunkSize));
        }
        return results;
    };

    const responsiveOptions = [
        {
            breakpoint: '1199px',
            numVisible: 3,
            numScroll: 1,
        },
        {
            breakpoint: '991px',
            numVisible: 2,
            numScroll: 1,
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1,
        },
    ];

    const groupedProducts = chunkArray(products, 1);
    const groupedProductsNo = chunkArray(productsno, 1);


    const carouselItemTemplate = (productsGroup) => {
        if (!productsGroup || !Array.isArray(productsGroup)) {
            return;
        }

        return (
            <div className="p-grid p-nogutter">
                {productsGroup.map((product) => (
                    <div key={product.id}>
                        <div className="card h-100 m-2">
                            <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
                                <Link to={`/admin/home/restaurants`}>
                                    <div style={{position: 'relative'}}>
                                        <img
                                            className="w-90 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                                            src={product.photo}
                                            alt={product.nom}
                                            style={{
                                                width: '180px',
                                                height: '140px',
                                                borderRadius: '8px',
                                            }}
                                        />
                                        {product.stock <= 0 ? (
                                            <Tag
                                                severity="warning"
                                                value="Out of Stock"
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
                                <div
                                    className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                        <div className="text-2xl font-bold text-900">
                                            {product.nom}
                                        </div>
                                        <Rating
                                            value={product.id}
                                            readOnly
                                            cancel={false}
                                        ></Rating>
                                        <div className="flex align-items-center gap-3">
                                            {product.promotion === true && (
                                                <Tag value="On Sale" severity="danger" icon="pi pi-tag"/>
                                            )}
                                            <span className="flex align-items-center gap-2">
                                                <span className="font-semibold">{product.stock} Pcs</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-lg-between gap-3 align-items-center mt-3">
                                        <span className="text-2xl font-semibold">{product.prix} Dh</span>

                                        {productInCart[product.id] ? (
                                            <Link to="/admin/cart">
                                                <Button
                                                    style={{
                                                        background:
                                                            'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)',
                                                    }}
                                                    icon="pi pi-external-link"
                                                    className="p-button-rounded mt-2"
                                                    disabled={product.stock <= 0}
                                                />
                                            </Link>
                                        ) : (
                                            <Button
                                                icon="pi pi-shopping-cart"
                                                className="p-button-rounded mt-2"
                                                onClick={() => handleAddToCart(product)}
                                                disabled={product.stock <= 0 || productInCart[product.id]}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        );
    };

    if (loading) {
        return (<HomPageSkeleton/>)
    }


    return (
        <>
            <Toast ref={toast}/>
            <Grid container spacing={1} style={{backgroundColor: 'rgb(13,77,84)'}} justifyContent="center">
                <Box style={{display: 'flex', alignItems: 'center',fontSize:"9px"}}>
                    <span style={{color: 'white'}}>
                        <LocalShippingRoundedIcon/>
                    </span>
                    <span className="mx-2 text-amber-300">Free Shipping on Orders Over 100 Dh</span>
                    <span className=" text-white"> * Estimated Delivery: 10-30 Minutes </span>
                </Box>

            </Grid>
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


            <div style={{marginTop: "190px"}}>

                <div className=" mx-3 mb-2 text-lg-start text-2xl ">
                    <strong className="font-serif ">Our Restaurants</strong>
                </div>
                <Card variant="outlined"
                      sx={{ marginX: 2, backgroundColor: 'rgba(239,230,236,0.29)'}}>
                    <CardContent>
                        <RestaurantSlick/>
                    </CardContent>
                </Card>


                <div style={{marginTop: "50px"}}>
                    <div className=" mx-3 mb-2 text-lg-start text-2xl ">
                        <strong className="font-serif ">On Sale</strong>
                    </div>
                    <Carousel
                        prevIcon={<SkipPreviousRoundedIcon/>}
                        nextIcon={<SkipNextRoundedIcon/>}
                        value={groupedProducts}
                        numVisible={3}
                        numScroll={1}
                        circular
                        responsiveOptions={responsiveOptions}
                        autoplayInterval={3000}
                        itemTemplate={carouselItemTemplate}
                    />
                </div>

            </div>


            <div className="mt-2">
                <div className=" mx-3 mb-2 text-lg-start text-2xl ">
                    <strong className="font-serif ">Best Plans</strong>
                </div>
                <div className=" mt-5">
                    <Carousel
                        prevIcon={<SkipPreviousRoundedIcon/>}
                        nextIcon={<SkipNextRoundedIcon/>}
                        value={groupedProductsNo}
                        numVisible={3}
                        numScroll={1}
                        circular
                        responsiveOptions={responsiveOptions}
                        autoplayInterval={3000}
                        itemTemplate={carouselItemTemplate}
                    />
                </div>
            </div>

        </>

    );
}
