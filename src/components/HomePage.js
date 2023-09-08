import React from 'react';
import "../styles/homepage.css"
import {Toast} from "primereact/toast";
import {Link} from "react-router-dom";
import {Button} from "primereact/button";
import {useEffect, useState} from "react";
import axios from "../service/callerService";
import {Tag} from "primereact/tag";
import {Rating} from "@mui/material";
import {useRef} from "react";
import {accountService} from "../service/accountService";
import { Skeleton } from 'primereact/skeleton';




export default function HomePage(){
    const [products, setProducts] = useState([]);
    const [productsno, setProductsno] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [productInCart, setProductInCart] = useState({});
    const [loading, setLoading] = useState(true); // Add loading state



    useEffect(() => {
        axios.get("/api/controller/produits/promotion").then((response) => {
            setProducts(response.data);
        });
    }, []);

    useEffect(() => {
        axios.get("/api/controller/produits/nopromotion").then((response) => {
            setProductsno(response.data);
        });
    }, []);

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

        products.forEach((product) => {
            checkProductInCart(product.id);
        });
    };

    useEffect(() => {
        loadProductsUser();
        setLoading(false);

    }, [userId, products]);


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

    const showSuccess = () => {
        toast.current.show({severity: 'success', summary: 'Success', detail: 'item added to cart', life: 1000});
    }

    const itemTemplate = (product) => {
        if (!product ) {
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
    const groupedProductsNopro = [];
    for (let i = 0; i < productsno.length; i += 4) {
        groupedProductsNopro.push(productsno.slice(i, i + 4));
    }



    return (
        <div>
            <Toast ref={toast}/>

            <>
                <main>
                    <section id="home">

                        <h1>PLANET FOOD</h1>
                        <strong className="text-white">We have what you need</strong>

                        <div className="mt-5">
                            <Button  label="Make A Reservation" severity="help" raised  className="mx-1"/>
                            <Button  label="Discover Our Restaurants" severity="warning" raised  className="mx-1"/>
                            <Button  label="More About Us" severity="success" raised  className="mx-1"/>
                        </div>
                    </section>
                </main>
            </>
            <>
                <div className="mt-2">
                    <h2 className="promotion-title">PROMOTION</h2>
                    <div className="container mt-5">
                        {loading ? (
                            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className={`col mb-4 out-of-stock`}>
                                        <div className="card h-100">
                                            <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
                                                <div style={{ position: 'relative' }}>
                                                    <Skeleton className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"   />
                                                </div>
                                                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                                        <Skeleton className="w-8rem border-round h-2rem" />
                                                        <Skeleton className="w-6rem border-round h-1rem" />
                                                        <div className="flex align-items-center gap-3">
                                                            <Skeleton className="w-6rem border-round h-1rem" />
                                                            <Skeleton className="w-3rem border-round h-1rem" />
                                                        </div>
                                                    </div>
                                                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm-gap-2">
                                                        <Skeleton className="w-4rem border-round h-2rem" />
                                                        <Skeleton shape="circle" className="w-3rem h-3rem" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                                {groupedProducts.map((group) =>
                                    group.map((product) => itemTemplate(product))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </>

            <>
                <div className="mt-2">
                    <h2 className="promotion-title">OUR BEST PLANS</h2>
                    <div className="container mt-5">
                        {loading ? (
                            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                                {Array.from({ length: 8 }).map((_, index) => (
                                    <div key={index} className={`col mb-4 out-of-stock`}>
                                        <div className="card h-100">
                                            <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
                                                <div style={{ position: 'relative' }}>
                                                    <Skeleton className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" />
                                                </div>
                                                <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                                    <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                                        <Skeleton className="w-8rem border-round h-2rem" />
                                                        <Skeleton className="w-6rem border-round h-1rem" />
                                                        <div className="flex align-items-center gap-3">
                                                            <Skeleton className="w-6rem border-round h-1rem" />
                                                            <Skeleton className="w-3rem border-round h-1rem" />
                                                        </div>
                                                    </div>
                                                    <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm-gap-2">
                                                        <Skeleton className="w-4rem border-round h-2rem" />
                                                        <Skeleton shape="circle" className="w-3rem h-3rem" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                                {groupedProductsNopro.map((group) =>
                                    group.map((product) => itemTemplate(product))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </>
        </div>
    );
}