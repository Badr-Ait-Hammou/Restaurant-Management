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

import { Image } from 'primereact/image';






export default function RestaurantProductDetails() {
    const {id} = useParams();
    const [products, setProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [productInCart, setProductInCart] = useState({});
    const [productSpeciality, setProductsSpeciality] = useState({});
    const icon = (<i className="pi pi-check"></i>)



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
            });
    }, [id]);

    useEffect(() => {
        // Define specialiteId after products have been set
        const specialiteId = products.restaurant && products.restaurant.specialite.id;

        // Check if specialiteId is defined before making the request
        if (specialiteId !== undefined) {
            axios.get(`/api/controller/produits/restaurant/speciality/${specialiteId}`)
                .then((response) => {
                    setProductsSpeciality(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching products with speciality:', error);
                });
        }
    }, [products]);




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



    const itemTemplate = (product) => {
        if (!product) {
            return;
        }
        return (
            <div key={product.id} className={`col mb-4 ${product.stock <= 0 ? 'out-of-stock' : ''}`}>
                <div className="card h-100">
                    <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
                        <Link to={`/admin/all_products/product/${product.id}`}>
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
                                <Rating value={getAverageRating(product)} readOnly cancel={false}  ></Rating>
                                <Typography className="font-monospace ">({getReviews(product)})review</Typography>
                                <div className="flex align-items-center gap-3">
                                    {product.promotion === true && (
                                        <Tag value="On Sale" severity="danger" icon="pi pi-tag" />
                                    )}
                                    <span className="flex align-items-center gap-2">
                                    <span className="font-semibold">{product.stock} Pcs</span>

                                </span>
                                </div>
                                <span className="font-semibold">{product.restaurant && product.restaurant.specialite.nom} Pcs</span>
                                <span className="font-semibold">{product.restaurant.nom } Pcs</span>
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
    for (let i = 0; i < productSpeciality.length; i += 4) {
        groupedProducts.push(productSpeciality.slice(i, i + 4));
    }






    return (
        <>
            <Toast ref={toast}/>

            <Card className="mt-4 mx-4" style={{ backgroundColor: "whitesmoke" }}>
                <CardContent>
                    <Grid container spacing={2} >
                        <Grid item xs={12} md={6} >
                            <div>
                                <Image

                                    alt="badr"
                                    src={products.photo}
                                    indicatorIcon={icon}
                                    preview

                                    imageStyle={{
                                        width: 350,
                                        height: 250,
                                        borderRadius: 10,
                                        objectFit:"fill"
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
                                        <span className="font-monospace text-1xl"> {products.restaurant && products.restaurant.nom } </span>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        <span className="font-extrabold text-1xl">Speciality: </span>
                                        <span className="font-monospace text-1xl"> {products.restaurant && products.restaurant.specialite.nom } </span>
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


