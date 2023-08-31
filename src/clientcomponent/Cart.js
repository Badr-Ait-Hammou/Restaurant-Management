import React, {useState, useEffect} from 'react';
import {Button} from 'primereact/button';

import axios from '../service/callerService';
import {accountService} from "../service/accountService";
import {InputNumber} from "primereact/inputnumber";

export default function Cart() {
    const [cartProducts, setCartProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const [productQuantities, setProductQuantities] = useState({});

    // Update product quantity
    const updateQuantity = (productId, newQuantity) => {
        setProductQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: newQuantity,
        }));
    };


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

    const deleteProduct = (productId) => {
        axios
            .delete(`/api/controller/carts/${productId}`)
            .then((response) => {
                setCartProducts((prevProducts) =>
                    prevProducts.filter((product) => product.id !== productId)
                );
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
            });
    };


    const getTotalAmount = () => {
        let totalAmount = 0;
        cartProducts.forEach((product) => {
            totalAmount += (product.totalprice * (productQuantities[product.id] || 0));
        });
        return totalAmount;
    };

    const getTotalQuantity = () => {
        let totalQuantity = 0;
        cartProducts.forEach((product) => {
            totalQuantity += (productQuantities[product.id] || 0);
        });
        return totalQuantity;
    };

    return (
        <div className="card mt-5 mx-2">
            <section style={{ backgroundColor: "#eee" }}>
                <div className="container h-100 py-5">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-10">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-normal mb-0 text-black">Shopping Cart</h3>
                            </div>

                            {cartProducts.map((product) => (
                                <div className="card rounded-3 mb-4" key={product.id}>
                                    <div className="card-body p-4">
                                        <div className="row d-flex justify-content-between align-items-center">
                                            <div className="col-4 col-md-2 col-lg-2 col-xl-2">
                                                <img
                                                    src={product.produit.photo}
                                                    className="img-fluid rounded-3"
                                                    alt={product.produit.nom}
                                                />
                                            </div>
                                            <div className="col-8 col-md-3 col-lg-3 col-xl-3">
                                                <p className="lead fw-normal mb-2">{product.produit.nom}</p>

                                                <p>
                                                    <span className="text-muted">Price: </span>
                                                    <strong>{product.totalprice}Dh</strong><br/>
                                                    <span className="text-muted">In stock: </span>
                                                    {product.produit.stock}<br/>
                                                    <span className="text-muted">Restaurant: </span>
                                                    {product.produit.restaurant.nom}

                                                </p>
                                            </div>
                                            <div className="col-8 col-md-3 col-lg-3 col-xl-2 d-flex mt-3 mt-md-0">
                                                <InputNumber
                                                    value={productQuantities[product.id] || product.quantity}
                                                    mode="decimal"
                                                    showButtons
                                                    min={1}
                                                    max={product.produit.stock}
                                                    onChange={(e) => {
                                                        const newQuantity = parseInt(e.value, 10);
                                                        if (newQuantity >= 0 && newQuantity <= product.produit.stock) {
                                                            updateQuantity(product.id, newQuantity);
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <div className="col-4 col-md-3 col-lg-2 col-xl-2 offset-md-1 mt-3 mt-md-0">
                                                <h5 className="mb-0">{product.totalprice * (productQuantities[product.id] || 1)}Dh</h5>
                                            </div>
                                            <div className="col-3 col-md-1 col-lg-1 col-xl-1 text-end mt-3 mt-md-0">
                                                <Button
                                                    icon="pi pi-trash"
                                                    severity="danger"
                                                    aria-label="Cancel"
                                                    onClick={() => deleteProduct(product.id)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="card">
                                <div className="card-body">
                                    <div className="row d-flex justify-content-between align-items-center">
                                        <div className="col-12 col-md-6">
                                            <p className="mb-1">Total Quantity: {getTotalQuantity()}</p>
                                            <p className="mb-0">Total Amount: {getTotalAmount()}Dh</p>
                                        </div>
                                        <div className="col-12 col-md-6 text-md-end mt-3 mt-md-0">
                                            <Button label="Proceed to Pay" severity="info" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

    );
}