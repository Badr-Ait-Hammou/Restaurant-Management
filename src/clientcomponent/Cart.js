import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';

import axios from '../service/callerService';
import { accountService } from "../service/accountService";
import {InputNumber} from "primereact/inputnumber";






    export default function Cart() {
    const [cartProducts, setCartProducts] = useState([]);
    const [userId, setUserId] = useState("");




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

    useEffect(() => {
        if (userId) {
            axios.get(`/api/controller/carts/userid/${userId}`)
                .then(response => {
                    setCartProducts(response.data);
                })
                .catch(error => {
                    console.error('Error fetching cart products:', error);
                });
        }
    }, [userId]);

    return (
        <div className="card">

            <section className="h-100" style={{ backgroundColor: "#eee" }}>
                <div className="container h-100 py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-10">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-normal mb-0 text-black">Shopping Cart</h3>
                                <div>
                                    <p className="mb-0">
                                        <span className="text-muted">Sort by:</span>{" "}
                                            price <i className="fas fa-angle-down mt-1"></i>
                                    </p>
                                </div>
                            </div>

                            {cartProducts.map((product) => (
                                <div className="card rounded-3 mb-4" key={product.id}>
                                    <div className="card-body p-4">
                                        <div className="row d-flex justify-content-between align-items-center">
                                            <div className="col-md-2 col-lg-2 col-xl-2">
                                                <img
                                                    src={product.produit.photo}
                                                    className="img-fluid rounded-3"
                                                    alt={product.produit.nom}
                                                />
                                            </div>
                                            <div className="col-md-3 col-lg-3 col-xl-3">
                                                <p className="lead fw-normal mb-2">{product.produit.nom}</p>
                                                <p>
                                                    <span className="text-muted">Size: </span>
                                                    {product.produit.size}{" "}
                                                    <span className="text-muted">Color: </span>
                                                    {product.produit.color}
                                                </p>
                                            </div>
                                            <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                                                <button
                                                    className="btn btn-link px-2"
                                                    // onClick={() => decreaseQuantity(product.id)}
                                                >
                                                    <i className="fas fa-minus"></i>
                                                </button>
                                                <InputNumber
                                                    placeholder="qty"
                                                />
                                                <Button icon="pi pi-plus" severity="info"
                                                    // onClick={() => increaseQuantity(product.id)}
                                                     aria-label="Cancel"
                                                />
                                            </div>
                                            <div className="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                                                <h5 className="mb-0">${product.totalprice}</h5>
                                            </div>
                                            <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                                                <Button icon="pi pi-trash" severity="danger" aria-label="Cancel" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="card">
                                <div className="card-body">
                                    <Button label="Proceed to Pay" severity="info" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}