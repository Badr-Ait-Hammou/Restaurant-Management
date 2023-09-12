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
                setProducts(response.data);
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
                                    height: "250px", objectFit: "fill", borderRadius: "10px"
                                }}/>
                            </div>
                        </Col>
                        <Col sm={12} md={6}>
                            <div className="map-container justify-content-start d-flex">
                                <div className="flex flex-column align-items-start sm:align-items-start ">
                                    <div >
                                        <span className="text-1xl font-monospace text-900">Product Name :</span>
                                        <span className="text-1xl font-bold text-900">{products.nom}</span>
                                    </div>
                                    <div className="mt-1">
                                        <span className="text-1xl font-monospace text-900">Product Description :</span>
                                        <span className="text-1xl font-bold text-900">{products.description}</span>
                                    </div>
                                    <div className="mt-1">
                                        <span className="text-1xl font-monospace text-900">Stock :</span>
                                        <span className="text-1xl font-bold text-900">{products.stock} Pcs</span>
                                    </div>

                                    <div className="mt-1 flex">
                                        <span className="text-1xl font-monospace text-900">Status :</span>
                                        {products.promotion === true ? (
                                            <Tag value="On Sale" severity="danger" icon="pi pi-tag" />
                                        ):(
                                            <Tag value="New" severity="success" icon="pi pi-plus" />
                                        )}
                                    </div>
                                    <div className="mt-1 flex">
                                        <Rating value={getAverageRating(products)} readOnly cancel={false}  />
                                        <Typography className="font-monospace ">({getReviews(products)})review</Typography>
                                    </div>
                                    <div className="d-flex justify-content-lg-between gap-3 align-items-start mt-3">
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

                            </div>
                        </Col>
                    </Row>

                </CardContent>
            </Card>
        </>
    );
}


