import {Link, useParams} from 'react-router-dom';
import axios from '../service/callerService';
import {useEffect, useState, useRef} from "react";
import {Card, CardContent, Rating} from "@mui/material";
import {Col, Row} from "react-bootstrap";
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

            <Card className="mt-4 mx-2" style={{backgroundColor: "whitesmoke"}}>
                <CardContent>
                    <Row>
                        <Col sm={12} md={6} className="mb-3 mb-md-0">
                            <div className="justify-content-center d-flex">
                                <img alt="badr" src={restaurant.photo} style={{
                                    width: "70%",
                                    height: "300px", objectFit: "fill", borderRadius: "20px"
                                }}/>
                            </div>
                            <div className="details-container" style={{padding: '10px', marginBottom: '10px'}}>
                                <h3 style={{
                                    fontFamily: 'sans-serif',
                                    fontSize: '40px',
                                    marginBottom: '20px',
                                    color: '#20b0a8'}}>
                                    {restaurant.nom}
                                </h3>
                                <Rating value={restaurantRating} readOnly cancel={false} precision={0.5} ></Rating>
                                <Typography className="font-monospace ">({products.length})review</Typography>
                                <strong
                                    style={{fontSize: '18px', color: '#181818'}}>Address: {restaurant.adresse}</strong>
                            </div>
                            <div className="details-container" style={{padding: '10px'}}>
                                <strong className="card-title" style={{fontSize: '18px', color: '#333'}}>OPEN
                                    : {restaurant.dateOuverture} / {restaurant.dateFermeture}</strong>
                            </div>


                        </Col>
                        <Col sm={12} md={6}>
                            <div className="map-container justify-content-center d-flex">
                                <iframe id="iframeId" height="450px" width="80%" title="Example website"
                                        style={{borderRadius: "20px"}}></iframe>
                            </div>
                        </Col>
                    </Row>

                </CardContent>
            </Card>
            <div>
                <DataView value={products} itemTemplate={itemTemplate}
                            paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={12}/>
            </div>
        </>
    );
}


