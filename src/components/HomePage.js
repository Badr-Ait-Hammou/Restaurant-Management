import React from 'react';
import {Toast} from "primereact/toast";
import {Link} from "react-router-dom";
import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import axios from "../service/callerService";
import {Tag} from "primereact/tag";
import {Rating,Box} from "@mui/material";
import {useRef} from "react";
import {accountService} from "../service/accountService";
import {Carousel} from 'primereact/carousel';
import SkipPreviousRoundedIcon from '@mui/icons-material/SkipPreviousRounded';
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded';
import HomPageSkeleton from "../skeleton/HomePageSkeleton";
import {Card, CardContent, Grid} from '@mui/material';
import Typography from "@mui/material/Typography";
import RestaurantSlick from "../slick-Slider/RestaurantSlick"
import HomeImgSlick from "../slick-Slider/HomeImgSlick";
import SpecialitySlick from "../slick-Slider/SpecialitySlick";
import ContactSlick from "../slick-Slider/ContactSlick";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import shoppingCartIcon from "../images/shopping-cardIcon.gif";
import saleIcon from "../images/onsaleIcon.gif"
import {useDarkMode} from "./DarkModeContext";


export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [productsno, setProductsno] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [productInCart, setProductInCart] = useState({});
    const [loading, setLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const { isDarkMode } = useDarkMode();





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


        [...products, ...productsno].forEach((product) => {
            checkProductInCart(product.id);
        });
    };

    // useEffect(() => {
    //     loadProductsUser();
    //     setLoading(false);
    //
    // }, [userId, products]);


    const handleAddToCart = (product) => {
        setIsLoading(true);
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
                loadProductsUser();

                console.log('Product added to cart successfully!');
                showSuccess();

                setTimeout(() => {
                    setIsLoading(false);
                }, 2000);
            })
            .catch(error => {
                console.error('Error adding product to cart:', error);
                setIsLoading(false);
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
                <Box sx={{height:"450px"}} key={product.id} className={`border-2   border-teal-400 border-round m-1 text-center py-2 px-1 ${isDarkMode ? 'bg-black text-white ' : 'bg-white text-black'}`} >

                <Link to={`product/${product.id}`}>
                    <div style={{position: 'relative'}}
                    >
                        <img
                            className="shadow-2 border-2 border-white"
                            src={product.photo}
                            alt={product.nom}
                            style={{
                                backgroundColor:"white",
                                width: '400px',
                                height: '200px',
                                borderRadius: '8px',
                            }}
                        />
                        {product.stock <= 0 ? (
                            <Tag
                                severity="danger"
                                value="Out of Stock"
                                style={{
                                    fontSize: '8px',
                                    position: 'absolute',
                                    top: '3px',
                                    right: '11px',
                                }}
                            />
                        ) : product.stock < 20 ? (
                            <Tag
                                severity="warning"
                                value={` Low Stock :${product.stock} Pcs`}
                                style={{
                                    fontSize: '8px',
                                    position: 'absolute',
                                    top: '3px',
                                    right: '11px',
                                }}
                            />
                        ) : (
                            <Tag
                                value={` In Stock :${product.stock} Pcs`}
                                style={{
                                    fontSize: '8px',
                                    position: 'absolute',
                                    top: '3px',
                                    right: '11px',
                                    backgroundColor:"rgb(1,169,164)",

                                }}

                            />
                        )}

                        {product.promotion === true ?(
                            <Tag value={"On sale"}
                                 severity="danger"
                                 className="animate-pulse"
                                 style={{
                                     fontSize: '8px',
                                     position: 'absolute',
                                     top: '3px',
                                     left: '11px',
                                 }}
                                 icon={<img src={saleIcon} alt="saleicon" width={"12px"} />}
                            />
                        ):(
                            <Tag value={"New"}
                                 severity="info"
                                 style={{
                                     fontSize: '8px',
                                     position: 'absolute',
                                     top: '3px',
                                     left: '11px',
                                 }}
                            />
                        )}

                    </div>
                </Link>
                    <div className="text-xl font-monospace">{product.nom}</div>
                    <Typography sx={{height:"40px",fontSize:"10px",color: isDarkMode ? "white" : "grey"}}  >
                    {product.description}
                    </Typography>
                    <div className="flex align-items-center justify-content-between py-2 px-0 gap-0">
                        <div className="flex align-items-center gap-2">
                            <Rating value={getAverageRating(product)} readOnly  precision={0.5} style={{fontSize:"16px"}}></Rating>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <Typography
                                className="font-monospace ">({getReviews(product)})review{getReviews(product) !== 1 ? 's' : ''}
                            </Typography>
                        </div>
                    </div>
                    <div  className="flex align-items-center justify-content-between py-2  px-0 gap-0" >
                        {product.prix >= 100 ?(
                            <div className="flex align-items-center justify-content-center   surface-border " >
                                <Tag value={"Free Shipping"} className="  border border-teal-400" style={{backgroundColor:"transparent",fontSize:"8px",color: isDarkMode ? "white" : "black"}} icon={<DeliveryDiningIcon style={{fontSize:"20px",color: isDarkMode ? "white" : "rgb(34,129,104)",marginRight:"5px"}}/>}/>
                            </div>
                        ):(
                            <div
                                className="flex align-items-center justify-content-center   surface-border ">
                                <Tag value={"Shipping fee : 30 DH"} className="  border border-teal-400" style={{backgroundColor:"transparent",fontSize:"8px",color: isDarkMode ? "white" : "black"}} icon={<DeliveryDiningIcon style={{fontSize:"20px",marginRight:"5px",color: isDarkMode ? "white" : "rgb(34,129,104)"}}/>}/>

                            </div>
                        )}
                        <div
                            className="flex align-items-center gap-1 justify-content-center   surface-border px-1">
                            <Tag  value={product.restaurant && product.restaurant.nom} className="border border-teal-400" style={{backgroundColor:"transparent",color: isDarkMode ? "white" : "black",fontSize:"8px"}} icon={<RestaurantIcon style={{fontSize:"17px",marginRight:"5px",color: isDarkMode ? "white" : "rgb(34,129,104)"}}/>}/>
                        </div>
                    </div>

                    <div className="flex align-items-center justify-content-between py-1  gap-1">
                        <Tag value={`${product.prix} Dh`} style={{fontSize:"17px",color: isDarkMode ? "white" : "black"}} className="font-monospace p-tag-rounded bg-transparent border border-teal-400 mt-2 p-2  shadow shadow-2"/>
                        {productInCart[product.id] ? (
                            <Link to="/ifoulki_meals/cart" style={{textDecoration: "none", color: "white"}}>
                                <Button
                                    icon={<ShoppingCartCheckoutIcon style={{fontSize:"28px"}}  />}
                                    label={"View" }
                                    className={`p-button-rounded gap-1 border-teal-400  p-button-text text-teal-600   mt-2 p-1 ${isDarkMode ? "bg-white" : "p-button-raised"}`}
                                    disabled={product.stock <= 0}
                                />
                            </Link>
                        ) : (
                            <div>
                                <Button
                                    style={{backgroundColor:"rgb(1,169,164)"}}
                                    icon={<img src={shoppingCartIcon} alt="Shopping Cart"  width="30px" />}
                                    label={"Add"}
                                    className="p-button-rounded p-button-raised gap-2 border-teal-400  p-button-text text-white   mt-2 p-1   "
                                    onClick={() => handleAddToCart(product)}
                                    disabled={product.stock <= 0 || productInCart[product.id] || isLoading }
                                />
                            </div>
                        )}
                    </div>
            </Box>
        );
    };




    return (
        <>
            <Toast ref={toast}/>
            <div style={{position: 'relative'}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <ContactSlick/>
                    </Grid>

                </Grid>

                <div style={{width: '100%', height: '250px'}}>
                    <HomeImgSlick/>
                    <div
                        style={{
                            position: 'absolute',
                            top: 38,
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
                        <Typography variant="h2" className=" font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-teal-800" align="center" gutterBottom >
                            Welcome
                        </Typography>
                    </div>


                </div>

            </div>

            <div style={{marginTop: "135px"}}>
                <Card variant="outlined"
                      sx={{ backgroundColor: 'rgba(234,230,233,0.27)'}}>
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
                            indicatorsContentClassName
                            autoplayInterval={3000} itemTemplate={productTemplate}
                            showIndicators={false}
                        />
                    </div>
                </div>

            </div>


            <div className="mt-2">
                <div className=" mx-3 mb-2 text-lg-start text-2xl ">
                    <strong className="font-serif ">Best Plans</strong>
                </div>
                <div className=" mt-5">
                    {/*<div >*/}
                    <div className={`${isDarkMode ? 'bg-black text-white' : 'bg-white'}`}>

                    <Carousel value={productsno}
                                  numVisible={4}
                                  numScroll={1}
                                  responsiveOptions={responsiveOptions}
                                  circular
                                  prevIcon={<SkipPreviousRoundedIcon/>}
                                  nextIcon={<SkipNextRoundedIcon/>}
                                  autoplayInterval={3000} itemTemplate={productTemplate}
                                  showIndicators={false}
                        />
                    </div>
                </div>
            </div>

        </>

    );
}
