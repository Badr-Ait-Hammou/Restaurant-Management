import {Link, useParams} from 'react-router-dom';
import axios from '../service/callerService';
import {useEffect, useState, useRef} from "react";
import { Rating} from "@mui/material";
import React from "react";
import {accountService} from "../service/accountService";
import {Toast} from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.min.css";
import {Tag} from "primereact/tag";
import Skeleton from "../skeleton/ProfileSkeleton"
import { Card, CardContent, Grid, Typography } from "@mui/material";
import {Button} from 'primereact/button';




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

            <Card className="mt-4 mx-2" style={{ backgroundColor: "whitesmoke" }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <div className=" d-flex">
                                <img
                                    alt="badr"
                                    src={products.photo}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        maxHeight: "300px",
                                        borderRadius: "10px",
                                    }}
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6} className="md:flex md:flex-col md:items-start text-center text-md-start">
                            <div className="map-container d-flex">
                                <div className="flex flex-column ">
                                    <Typography  gutterBottom>
                                       <span className="font-extrabold text-2xl">Product Name: {products.nom}</span>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <span className="font-extrabold text-1xl">Product Description: </span>
                                        <span className="font-monospace text-1xl"> {products.description}</span>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <span className="font-extrabold text-1xl">Stock: </span>
                                        <span className="font-monospace text-1xl"> {products.stock} pcs</span>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <span className="font-extrabold text-1xl">Restaurant: </span>
                                        <span className="font-monospace text-1xl"> {products.restaurant && products.restaurant.nom ||''} </span>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <span className="font-extrabold text-1xl">Speciality: </span>
                                        <span className="font-monospace text-1xl"> {products.restaurant && products.restaurant.specialite.nom ||''} </span>
                                    </Typography>
                                    <div >
                                        <Typography variant="body1" gutterBottom>
                                            <span className="font-extrabold text-1xl">Status: </span>

                                        {products.promotion === true ? (
                                            <Tag className="mx-2"  value="On Sale" severity="danger" icon="pi pi-tag" />
                                        ) : (
                                            <Tag className="mx-2"  value="New" severity="success" icon="pi pi-tag" />
                                        )}
                                        </Typography>
                                    </div>
                                    <div className="mb-1 ">

                                        <Typography variant="body1" gutterBottom>
                                            <div>
                                                <Rating value={getAverageRating(products)} readOnly cancel={false} />
                                                <small className=" text-black">({getReviews(products)}) review</small>
                                            </div>
                                        </Typography>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center ">
                                        <Typography variant="h6">Price: {products.prix} Dh</Typography>
                                        <div>
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
                            </div>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>


        </>
    );
}


