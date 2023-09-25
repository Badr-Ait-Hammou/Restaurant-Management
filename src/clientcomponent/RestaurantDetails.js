import {Link, useParams} from 'react-router-dom';
import axios from '../service/callerService';
import {useEffect, useState, useRef} from "react";
import { Rating} from "@mui/material";
import React from "react";
import {accountService} from "../service/accountService";
import {Button} from 'primereact/button';
import {Toast} from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.min.css";
import {Tag} from "primereact/tag";
import Skeleton from "../skeleton/ProfileSkeleton"
import Typography from "@mui/material/Typography";
import {DataView} from "primereact/dataview";
import blackImage from "../images/blackbackground.jpg";
import {Avatar} from "primereact/avatar";
import Image1 from "../images/deliver.jpg";
import {Toolbar} from "primereact/toolbar";
import Chip from "@mui/material/Chip";
import ShareLocationIcon from "@mui/icons-material/ShareLocation";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import LinkIcon from "@mui/icons-material/Link";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import {Divider} from "primereact/divider";

export default function RestaurantDetails() {
    const [longitude, setLongitude] = useState();
    const [latitude, setLatitude] = useState();
    const {id} = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [productInCart, setProductInCart] = useState({});




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


    if (!restaurant) {
        return <Skeleton/>;
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
        return   product.avisList.length;
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
            <div className="col-6 sm:col-6 lg:col-4 xl:col-3 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            {product.promotion === true && (
                                <Tag value="On Sale" severity="danger" icon="pi pi-tag"/>
                            )}
                        </div>
                        <Tag value={product.restaurant && product.restaurant.specialite.nom} style={{backgroundColor:"rgb(23,113,122)"}}></Tag>
                    </div>
                    <div className="flex flex-column align-items-center gap-2 py-2">
                        <Link to={`product/${product.id}`}>
                            <div style={{position: 'relative'}}>
                                <img className=" w-16 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                                     src={product.photo}
                                     alt={product.nom}
                                     style={{
                                         width: '100%',
                                         height: '140px',
                                         borderRadius: '8px'
                                     }}/>
                                {product.stock <= 0 ? (
                                    <Tag
                                        severity="warning"
                                        value="Out of Stock"
                                        style={{
                                            fontSize: "10px",
                                            position: 'absolute',
                                            top: '3px',
                                            right: '5px',
                                        }}
                                    />
                                ) : (
                                    <Tag
                                        severity="success"
                                        value="In Stock"
                                        style={{
                                            fontSize: "10px",
                                            position: 'absolute',
                                            top: '3px',
                                            right: '5px',
                                        }}
                                    />
                                )}
                            </div>
                        </Link>
                        <div className="text-2xl font-bold">{product.nom}</div>
                        <Typography variant="body2" className="ml-1"
                                    color="text.secondary">{product.description}</Typography>
                        <Rating value={getAverageRating(product)} readOnly cancel={false} precision={0.5}></Rating>
                        <Typography
                            className="font-monospace ">({getReviews(product)})review{getReviews(product) !== 1 ? 's' : ''}</Typography>
                    </div>
                    <div className=" flex align-items-center justify-content-between">
                        <span className="text-2xl font-semibold">{product.prix} Dh</span>
                        {productInCart[product.id] ? (
                            <Link to="/admin/cart">
                                <Button
                                    style={{background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'}}
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
        );
    };




    return (
        <>
            <Toast ref={toast}/>

            <div className=" relative shadow-2  p-1 border-50 w-full sm:h-64 h-64 bg-cover bg-center"
                 style={{backgroundImage: `url(${blackImage})`}}>
                <div className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm  border-spacing-1 shadow-2 p-0.5 border-50 border-round"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 sm:-bottom-1/3 -bottom-1/3">
                    <Avatar image={restaurant.photo || Image1} style={{width: "160px", height: "160px"}}
                            shape="circle"
                            className=" shadow-4 shadow-indigo-400 mb-3 "/>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-1/2 text-white text-2xl text-uppercase">
                    {restaurant.nom || "Restaurant Name"} Restaurant<br/>
                    <Rating value={restaurantRating}  readOnly cancel={false} precision={0.5} />
                </div>
            </div>

            <div className=" mx-2 p-1 card  mt-8 ">
                <Toolbar className="mb-2 p-1"
                         start={<Chip
                             avatar={<Avatar alt={"restaurantName"} style={{width: "60px", height: "60px"}}
                                             image={Image1}
                                             shape="circle" className=" shadow-4 shadow-indigo-400  "/>}
                             label={<Typography className="font-monospace mx-2"><span
                                 className="font-bold">Owner : {restaurant.user && restaurant.user.username} </span>
                             </Typography>}
                             variant="filled"
                             size="medium"
                             sx={{width: 300, height: 70, backgroundColor: "transparent"}}
                         />}
                         // end={<div className="template"><Button className="pay" label="Update"  onClick={openNew}/></div>}
                >
                </Toolbar>
                <div
                    className="font-monospace text-3xl text-black mb-5 mt-2  ">Restaurant Information</div>
                <div className="surface-section w-full h-full border-1 shadow-2 bg-cover bg-center border-round" style={{backgroundImage: `url(${blackImage})`}}>

                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-2 font-medium">Restaurant Name</div>
                            <div className="text-900 w-6 md:w-2 text-uppercase ">
                                <Tag value={restaurant.nom} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Address"}
                                     style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}}
                                     icon={<ShareLocationIcon
                                         style={{fontSize: "20px", marginRight: "8px", color: "rgb(23,113,122)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6  ">
                                <Tag value={restaurant.adresse}  style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Open at :"}
                                     style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}}
                                     icon={<AccessTimeFilledIcon
                                         style={{fontSize: "20px", marginRight: "8px", color: "rgb(38,243,95)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6  ">
                                <Tag  value={restaurant.dateOuverture} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Close at :"}
                                     style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}}
                                     icon={<NightsStayIcon
                                         style={{fontSize: "20px", marginRight: "8px", color: "rgb(239,90,90)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6  ">
                                <Tag  value={restaurant.dateFermeture} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"City  :"} style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}} icon={<LocationCityIcon style={{fontSize: "20px", marginRight: "8px", color: "rgb(90,150,239)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6 text-uppercase ">
                                <Tag value={`${restaurant.zone && restaurant.zone.ville.nom} -- ${restaurant.zone && restaurant.zone.nom}`} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Serie  :"} style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}} icon={<LinkIcon style={{fontSize: "20px", marginRight: "8px", color: "rgb(49,141,141)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6 text-uppercase ">
                                <Tag  value={restaurant.serie && restaurant.serie.nom} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Speciality  :"} style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}} icon={<SmartButtonIcon style={{fontSize: "20px", marginRight: "8px", color: "rgb(191,20,238)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6 text-uppercase ">
                                <Tag  value={restaurant.specialite && restaurant.specialite.nom} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <iframe id="iframeId" height="250px" width="100%"
                                    style={{borderRadius: "10px"}}></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <Divider/>

            <div>
                <DataView value={products} itemTemplate={itemTemplate}
                            paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={12}/>
            </div>
        </>
    );
}


