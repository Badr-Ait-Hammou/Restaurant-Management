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


    const itemTemplate = (product) => {
        if (!product) {
            return;
        }
        return (
            <div key={product.id} className={`col mb-4 ${product.stock <= 0 ? 'out-of-stock' : ''}`}>
                <div className="card h-100">
                    <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
                        <Link to={`products/${product.id}`}>
                            <div style={{position: 'relative'}}>
                                <img className="w-90 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                                     src={product.photo}
                                     alt={product.nom}
                                     style={{
                                         width: '180px',
                                         height: '140px',
                                         borderRadius: '8px'
                                     }}/>
                                {product.stock <= 0 ? (
                                    <Tag
                                        severity="warning"
                                        value="Out of Stock"
                                        style={{
                                            fontSize:"10px",
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
                                            fontSize:"10px",
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
                                <div className="text-2xl font-bold text-900">{product.nom}</div>
                                <Rating value={product.id} readOnly cancel={false}></Rating>
                                <div className="flex align-items-center gap-3">
                                    {product.promotion === true && (
                                        <Tag value="On Sale" severity="danger" icon="pi pi-tag" />
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
                </div>
            </div>
        );
    };


    const groupedProducts = [];
    for (let i = 0; i < products.length; i += 4) {
        groupedProducts.push(products.slice(i, i + 4));
    }


    return (
        <>
            <Toast ref={toast}/>

            {/*<Button icon="pi pi-shopping-cart"*/}
            {/*        raised*/}
            {/*        className="mx-2 mt-2"*/}
            {/*        style={{backgroundColor: "transparent", color: "lightseagreen", fontSize: "20px"}}/>*/}

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
                                    color: '#20b0a8'
                                }}>{restaurant.nom}</h3>
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
            <div className="container mt-5">
                {groupedProducts.map((group) => (
                    <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                        {group.map((product) => itemTemplate(product))}
                    </div>
                ))}
            </div>
        </>
    );
}


