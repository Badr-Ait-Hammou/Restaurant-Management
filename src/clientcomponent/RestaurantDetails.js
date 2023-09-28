import {Link, useParams} from 'react-router-dom';
import axios from '../service/callerService';
import {useEffect, useState, useRef} from "react";
import {Rating} from "@mui/material";
import React from "react";
import {accountService} from "../service/accountService";
import {Button} from 'primereact/button';
import {Toast} from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.min.css";
import {Tag} from "primereact/tag";
import Typography from "@mui/material/Typography";
import {DataView} from "primereact/dataview";
import blackImage from "../images/blackbackground.jpg";
import {Avatar} from "primereact/avatar";
import {Toolbar} from "primereact/toolbar";
import Chip from "@mui/material/Chip";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import LinkIcon from "@mui/icons-material/Link";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import {Divider} from "primereact/divider";
import RestaurantProfileSkeleton from "../skeleton/RestaurantProfileSkeleton"
import shoppingCartIcon from "../images/shopping-cardIcon.gif";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import saleIcon from "../images/onsaleIcon.gif";
import Box from "@mui/material/Box";


export default function RestaurantDetails() {
    const [longitude, setLongitude] = useState();
    const [latitude, setLatitude] = useState();
    const {id} = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [productInCart, setProductInCart] = useState({});
    const [isLoading, setIsLoading] = useState(false);



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
    }, [userId, products]);

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


    useEffect(() => {
        axios.get(`/api/controller/restaurants/${id}`).then((response) => {
            setLatitude(response.data.latitude);
            setLongitude(response.data.longitude);
            setRestaurant(response.data);
        });
    }, [id]);

    useEffect(() => {
        if (restaurant) {
            axios.get(`/api/controller/produits/restaurant/${id}`).then((response) => {
                setProducts(response.data);
                console.log(response.data);
            });
        }
    }, [id, restaurant]);

    useEffect(() => {
        const iframeData = document.getElementById("iframeId");
        if (iframeData) {
            iframeData.src = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=es;&output=embed`;
        }
    }, [latitude, longitude]);


    if (!restaurant || !blackImage) {
        return <RestaurantProfileSkeleton/>;
    }

    const showSuccess = () => {
        toast.current.show({severity: 'success', summary: 'Success', detail: 'item added to cart', life: 1000});
    }
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
        return product.avisList.length;
    };

    const getRestaurantRating = (products) => {
        const productsWithReviews = products.filter((product) => product.avisList.length > 0);

        if (productsWithReviews.length > 0) {
            const averageRatings = productsWithReviews.map((product) => getAverageRating(product));
            const sumOfAverageRatings = averageRatings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return sumOfAverageRatings / productsWithReviews.length;
        } else {
            return 0;
        }
    };

    const restaurantRating = getRestaurantRating(products);


    const itemTemplate = (product) => {
        if (!product) {
            return;
        }
        return (
            <Box sx={{height:"450px"}} className="col-12 sm:col-6 lg:col-4 xl:col-3 p-1 mt-2 mb-2">
                <div className="p-1 border-1 surface-border surface-card border-round">
                    <div className="flex flex-column align-items-center gap-1">
                        <Link to={`product/${product.id}`}>
                            <div style={{position: 'relative'}}>
                                <img className=" w-20 sm:w-20rem xl:w-20rem  shadow-2 block xl:block mx-auto border-round"
                                    src={product && product.photo}
                                    alt={product.nom}
                                    style={{
                                        width: '400px',
                                        height: '200px',
                                        borderRadius: '8px'
                                    }}/>
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
                        <div className="text-2xl font-monospace">{product.nom}</div>
                        <Typography sx={{height:"40px",fontSize:"10px"}}   color="text.secondary">
                            {product.description}
                        </Typography>
                        </div>


                    <div className="content-info">
                        <div className="flex align-items-center justify-content-between py-2 px-3 gap-2">
                            <div className="flex align-items-center gap-2">
                                <Rating value={getAverageRating(product)} readOnly  precision={0.5} style={{fontSize:"16px"}}></Rating>
                            </div>
                            <div className="flex align-items-center gap-2">
                                <Typography
                                    className="font-monospace ">({getReviews(product)})review{getReviews(product) !== 1 ? 's' : ''}
                                </Typography>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-between py-2 px-1 ">
                            {product.prix >= 100 ?(
                                <div
                                    className="flex align-items-center justify-content-center   surface-border ">
                                    <Tag value={"Free Shipping"} className="border border-teal-400" style={{backgroundColor:"transparent",color:"black"}} icon={<DeliveryDiningIcon style={{fontSize:"20px",marginRight:"5px",color:"rgb(34,129,104)"}}/>}/>
                                </div>
                            ):(
                                <div
                                    className="flex align-items-center justify-content-center   surface-border ">
                                    <Tag value={"Shipping fee : 30 DH"} className="border border-teal-400" style={{backgroundColor:"transparent",color:"black",fontSize:"10px"}} icon={<DeliveryDiningIcon style={{fontSize:"20px",marginRight:"5px",color:"rgb(34,129,104)"}}/>}/>

                                </div>
                            )}
                            <div
                                className="flex align-items-center gap-1 justify-content-center   surface-border px-1">
                                <Tag  value={product.restaurant && product.restaurant.nom} className="border border-teal-400" style={{backgroundColor:"transparent",color:"black",fontSize:"10px"}} icon={<RestaurantIcon style={{fontSize:"17px",marginRight:"5px",color:"rgb(34,129,104)"}}/>}/>
                            </div>
                        </div>
                    </div>


                    <div className=" flex align-items-center justify-content-between">
                        <Tag value={`${product.prix} Dh`} style={{fontSize:"20px"}} className="font-monospace p-tag-rounded bg-transparent border border-teal-400 mt-2 p-2 text-black shadow shadow-2"/>
                        {productInCart[product.id] ? (
                            <Link to="/ifoulki_meals/cart">
                                <Button
                                    icon={<ShoppingCartCheckoutIcon style={{fontSize:"28px"}}  />}
                                    label={"View" }
                                    className="p-button-rounded p-button-raised gap-1 border-teal-400  p-button-text text-teal-600   mt-2 p-2   "
                                    disabled={product.stock <= 0}
                                />
                            </Link>
                        ) : (
                            <Button
                                style={{backgroundColor:"rgb(1,169,164)"}}
                                icon={<img src={shoppingCartIcon} alt="Shopping Cart"  width="30px" />}
                                label={"Add"}
                                className="p-button-rounded p-button-raised gap-2 border-teal-400  p-button-text text-white   mt-2 p-2   "
                                onClick={() => handleAddToCart(product)}
                                disabled={product.stock <= 0 || productInCart[product.id] || isLoading}
                            />
                        )}
                    </div>
                </div>
            </Box>
        );
    };

    function isRestaurantOpen(openingTime, closingTime) {
        const now = new Date();
        const openTime = parseTimeString(openingTime);
        const closeTime = parseTimeString(closingTime);

        return now >= openTime && now <= closeTime;
    }

    function parseTimeString(timeString) {
        const [hours, minutes] = timeString.split(':');
        const now = new Date();
        now.setHours(parseInt(hours, 10));
        now.setMinutes(parseInt(minutes, 10));
        return now;
    }


    return (
        <>
            <Toast ref={toast}/>

            <div className=" relative shadow-2  p-1 border-50 w-full sm:h-64 h-64 bg-cover bg-center"
                 style={{backgroundImage: `url(${blackImage})`}}>
                <div className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm  border-spacing-1 shadow-2 p-0.5 border-50 border-round"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 sm:-bottom-1/3 -bottom-1/3">
                    <Avatar image={restaurant && restaurant.photo } style={{width: "160px", height: "160px"}}
                            shape="circle"
                            className=" shadow-4 shadow-indigo-400 mb-3 "/>
                </div>
                <div
                    className="absolute left-1/2 transform -translate-x-1/2 bottom-1/2 text-white text-2xl text-uppercase">
                    {restaurant.nom || "Restaurant Name"} Restaurant<br/>
                    <Rating value={restaurantRating} readOnly precision={0.5}/>
                </div>
            </div>

            <div className=" mx-2 p-1 card  mt-8 ">
                <Toolbar className="mb-2 p-1"
                         start={<Chip
                             avatar={<Avatar alt={"restaurantName"} style={{width: "30px", height: "30px"}}
                                             image={restaurant.user && restaurant.user.photo}
                                             shape="circle" className=" shadow-4 shadow-indigo-400  "/>}
                             label={<Typography className="font-monospace mx-2"><span
                                 className="font-bold text-uppercase">Owner : {restaurant.user && restaurant.user.firstName} </span>
                             </Typography>}
                             variant="filled"
                             size="medium"
                             // sx={{width: 300, height: 70, backgroundColor: "transparent"}}
                         />}
                         end={
                             <span className="card-text-value mx-2">
                                    {restaurant.dateOuverture && restaurant.dateFermeture ? (
                                        isRestaurantOpen(restaurant.dateOuverture, restaurant.dateFermeture) ? (
                                            <Tag severity="info" icon="pi pi-check">
                                                Open
                                            </Tag>
                                        ) : (
                                            <Tag severity="danger" icon="pi pi-moon">
                                                Closed
                                            </Tag>
                                        )
                                    ) : (
                                        "N/A"
                                    )}
                                </span>
                         }
                >
                </Toolbar>
                <div
                    className="font-monospace text-3xl text-black mb-5 mt-2  ">About  {restaurant.nom}
                </div>
                <div className="surface-section w-full h-full border-1 shadow-2 bg-cover bg-center border-round"
                     style={{backgroundImage: `url(${blackImage})`}}>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Open / close :"}
                                     style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black", width: "120px"}}
                                     icon={<NightsStayIcon
                                         style={{fontSize: "20px", marginRight: "8px", color: "rgb(239,90,90)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6  ">
                                <Tag value={`${restaurant.dateOuverture}/${restaurant.dateFermeture}`}
                                     style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Serie  :"}
                                     style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black", width: "110px"}}
                                     icon={<LinkIcon
                                         style={{fontSize: "20px", marginRight: "8px", color: "rgb(49,141,141)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6 text-uppercase ">
                                <Tag value={restaurant.serie && restaurant.serie.nom}
                                     style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Speciality  :"}
                                     style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black", width: "110px"}}
                                     icon={<SmartButtonIcon
                                         style={{fontSize: "20px", marginRight: "8px", color: "rgb(191,20,238)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6 text-uppercase ">
                                <Tag value={restaurant.specialite && restaurant.specialite.nom}
                                     style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>

                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Address"}
                                     style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black", width: "110px"}}
                                     icon={<ShareLocationIcon
                                         style={{fontSize: "20px", marginRight: "8px", color: "rgb(23,113,122)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6  ">
                                <Tag
                                    value={`${restaurant.adresse} - ${restaurant.zone && restaurant.zone.ville.nom} ${restaurant.zone && restaurant.zone.nom}`}
                                    style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>

                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <iframe id="iframeId" height="250px" width="100%" title="test"
                                    style={{borderRadius: "10px"}}></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <Divider/>
            <div
                className="font-monospace text-3xl text-black mb-5 mt-2  ">{restaurant.nom}'s Products
            </div>
            <Divider/>

            <div>
                <DataView value={products} itemTemplate={itemTemplate}
                          paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={12}/>
            </div>
        </>
    );
}


