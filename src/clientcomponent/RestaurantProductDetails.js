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


export default function RestaurantProductDetails() {
    const {id} = useParams();
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

        if (products && products.id) {
            checkProductInCart(products.id);
        }
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
        axios.get(`/api/controller/produits/${id}`)
            .then((response) => {
                //const product = response.data;
                setProducts(response.data);
                //console.log(product);
            })
            .catch((error) => {
                console.error("Error fetching product:", error);
            });
    }, [id]);




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








    return (
        <>
            <Toast ref={toast}/>

            <Card className="mt-4 mx-2" style={{backgroundColor: "whitesmoke"}}>
                <CardContent>
                    <Row>
                        <Col sm={12} md={6} className="mb-3 mb-md-0">
                            <div className="justify-content-center d-flex">
                                <img alt="badr" src={products.photo} style={{
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
                                    {products.nom}
                                </h3>
                                <Rating value={getAverageRating(products)} readOnly cancel={false}  ></Rating>
                                <Typography className="font-monospace ">({products.description})</Typography>

                                <strong
                                    style={{fontSize: '18px', color: '#181818'}}>Address: {products.nom}</strong>
                            </div>
                            <div className="details-container" style={{padding: '10px'}}>
                                <strong className="card-title" style={{fontSize: '18px', color: '#333'}}>OPEN
                                    : {products.stock} / {products.nom}</strong>
                            </div>


                        </Col>
                        <Col sm={12} md={6}>
                            <div className="map-container justify-content-center d-flex">
                                <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                    <div className="text-2xl font-bold text-900">{products.nom}</div>
                                    <Rating value={getAverageRating(products)} readOnly cancel={false}  ></Rating>
                                    <Typography className="font-monospace ">({getReviews(products)})review</Typography>
                                    <div className="flex align-items-center gap-3">
                                        {products.promotion === true && (
                                            <Tag value="On Sale" severity="danger" icon="pi pi-tag" />
                                        )}
                                        <span className="flex align-items-center gap-2">
                                    <span className="font-semibold">{products.stock} Pcs</span>
                                </span>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-lg-between gap-3 align-items-center mt-3">
                                    <span className="text-2xl font-semibold">{products.prix} Dh</span>

                                    {productInCart[products.id] ? (
                                        <Link to="/admin/cart">
                                            <Button
                                                style={{background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'}}
                                                icon="pi pi-external-link"
                                                className="p-button-rounded mt-2"
                                                disabled={products.stock <= 0}
                                            />
                                        </Link>
                                    ) : (
                                        <Button
                                            icon="pi pi-shopping-cart"
                                            className="p-button-rounded mt-2"
                                            onClick={() => handleAddToCart(products)}
                                            disabled={products.stock <= 0 || productInCart[products.id]}
                                        />
                                    )}
                                </div>
                            </div>
                        </Col>
                    </Row>

                </CardContent>
            </Card>
        </>
    );
}


