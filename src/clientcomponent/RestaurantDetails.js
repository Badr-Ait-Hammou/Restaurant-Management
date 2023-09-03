import {Link, useParams} from 'react-router-dom';
import axios from '../service/callerService';
import { useEffect, useState,useRef } from "react";
import {Card, CardContent} from "@mui/material";
import {Col,Row} from "react-bootstrap";
import React from "react";
import {accountService} from "../service/accountService";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button } from 'primereact/button';
import {Toast} from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.min.css";
import {Tag} from "primereact/tag";


export default function RestaurantDetails() {
    const [longitude, setLongitude] = useState();
    const [latitude, setLatitude] = useState();
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const [addedProducts, setAddedProducts] = useState([]);
    const toast = useRef(null);









    useEffect(() => {
        const fetchUserData = async () => {
            const tokenInfo = accountService.getTokenInfo();
            if (tokenInfo) {
                try {
                    const user = await accountService.getUserByEmail(tokenInfo.sub);
                    setUserId(user.id);
                    console.log('user',user.id);
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
                    setAddedProducts(prevProducts => [...prevProducts, product.id]);
                    showSuccess();
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
        return <div>Loading...</div>;
    }

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'item added to cart', life: 1000});
    }



    return (
        <>
            <Button  icon="pi pi-shopping-cart"
                     raised
                     className="mx-2 mt-2"  style={{backgroundColor:"transparent",color:"lightseagreen",fontSize:"20px"}} />

        <Card className="mt-3 mx-2" style={{backgroundColor:"whitesmoke"}}>
            <CardContent>
                <Row>
                    <Col sm={12} md={6} className="mb-3 mb-md-0">
                        <div className="justify-content-center d-flex">
                            <img alt="badr" src={restaurant.photo}  style={{width: "70%",
                                height: "300px",objectFit:"fill",borderRadius:"20px"}} />
                        </div>
                        <div className="details-container" style={{  padding: '10px', marginBottom: '10px' }}>
                            <h3 style={{ fontFamily: 'sans-serif', fontSize: '40px', marginBottom: '20px', color: '#20b0a8' }}>{restaurant.nom}</h3>
                            <strong style={{ fontSize: '18px', color: '#181818' }}>Address: {restaurant.adresse}</strong>
                        </div>
                        <div className="details-container" style={{  padding: '10px' }}>
                            <strong className="card-title" style={{ fontSize: '18px', color: '#333' }}>OPEN : {restaurant.dateOuverture} / {restaurant.dateFermeture}</strong>
                        </div>


                    </Col>
                    <Col sm={12} md={6}>
                        <div className="map-container justify-content-center d-flex">
                            <iframe id="iframeId" height="450px" width="80%" title="Example website" style={{borderRadius:"20px"}}></iframe>
                        </div>
                    </Col>
                </Row>

            </CardContent>
        </Card>


            <div className="mt-2">
                <Toast ref={toast} position="top-center" />
                <h1 className="mt-3">Products</h1>
                <div className="container mt-5">
                    <div className="row row-cols-2 row-cols-md-2 row-cols-lg-4 g-4">
                        {products.map((product) => (
                            <div key={product.id} className={`col mb-4 ${product.stock <= 0 ? "out-of-stock" : ""}`}>
                                <div className="card h-100">
                                    <Link to={`products/${product.id}`}>
                                        <div style={{ position: "relative" }}>
                                            <img
                                                src={product.photo}
                                                className="card-img-top"
                                                alt="rest"
                                                style={{ objectFit: "cover", height: "auto" }}
                                            />
                                            {product.stock <= 0 ? (
                                                <Tag
                                                    severity="warning"
                                                    value="Out of Stock"
                                                    className="stock-tag"
                                                    style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        right: "10px",
                                                    }}
                                                />
                                            ) : (
                                                <Tag
                                                    severity="success"
                                                    value="In Stock"
                                                    className="stock-tag"
                                                    style={{
                                                        position: "absolute",
                                                        top: "10px",
                                                        right: "10px",
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </Link>
                                    <div className="card-body">
                                        <h5 className="card-title">{product.nom}</h5>
                                        <p className="card-text">Prix: {product.prix}</p>
                                        <p className="card-text">Stock: {product.stock}</p>

                                        <Button
                                            raised
                                            className="mx-2"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={product.stock <= 0 || addedProducts.includes(product.id)}
                                            style={{
                                                backgroundColor: addedProducts.includes(product.id) ? 'lightseagreen' : 'lightgreen',
                                                cursor: product.stock <= 0 || addedProducts.includes(product.id) ? 'not-allowed' : 'pointer',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '0.5rem',
                                                padding: '0.5rem',
                                                borderRadius: '4px',
                                                border: 'none',
                                                color: '#fff',
                                            }}
                                        >
                                            {addedProducts.includes(product.id) ? (
                                                <>
                                                    <ShoppingCartIcon />
                                                    Added
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCartIcon />
                                                    Add to Cart
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>




                </div>
            </div>


</>
    );
}



