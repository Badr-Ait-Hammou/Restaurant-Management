import React, {useState, useEffect} from 'react';
import {Button} from 'primereact/button';
import axios from '../service/callerService';
import {accountService} from "../service/accountService";
import {Dialog} from 'primereact/dialog';
import {Toast} from "primereact/toast";
import {useRef} from "react";
import {Skeleton} from "primereact/skeleton";
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import {DataView} from "primereact/dataview";
import {Tag} from "primereact/tag";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';


export default function Cart() {
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [cartProducts, setCartProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const [productQuantities, setProductQuantities] = useState({});
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);

    const shippingfee=30;

    const updateQuantity = (productId, newQuantity) => {
        setProductQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: newQuantity,
        }));
    };

    const handleConfirmPayment = () => {
        handleProceedToPay();
        setDialogVisible(false);
    };

    const opendialog = () => {
        setDialogVisible(true);
    };


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


    const loadCartProducts = () => {
        if (userId) {
            axios.get(`/api/controller/carts/userid/${userId}`)
                .then(response => {
                    setCartProducts(response.data);
                })
                .catch(error => {
                    console.error('Error fetching cart products:', error);
                });
            setLoading(false);
        }
    };


    useEffect(() => {
        loadCartProducts();
        fetchUserData();

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

    const showSuccess = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Success',
            detail: 'order submitted successfully',
            life: 1000
        });
    }

    const getTotalAmount = () => {
        const orderTotal = cartProducts.reduce((total, product) => {
            total += product.totalprice * (productQuantities[product.id] || 1);
            return total;
        }, 0);

        const shippingFee = calculateShippingFee(orderTotal);
        return orderTotal + shippingFee;
    };

    const getTotalQuantity = () => {
        let totalQuantity = 0;
        cartProducts.forEach((product) => {
            totalQuantity += (productQuantities[product.id] || 1);
        });
        return totalQuantity;
    };
    const isProceedToPayDisabled = cartProducts.some((product) => {
        const quantity = productQuantities[product.id] || 1;
        return product.produit.stock < quantity;
    });

    function saveOrder(cartProducts, userId) {
        const orderPromises = cartProducts.map((product) => {
            const orderItem = {
                user: {id: userId},
                totalPrice: (product.totalprice * (productQuantities[product.id] || 1)) + calculateShippingFee(getTotalAmount()),
                status: "Pending",
                productQuantity: productQuantities[product.id] || 1,
                produit: {
                    id: product.produit.id,
                }
            };
            return axios.post('/api/controller/orders/save', orderItem)
                .then((response) => response.data)
                .catch((error) => {
                    console.error('Error saving order:', error);
                    throw error;
                });
        });
        return Promise.all(orderPromises);
    }

    const handleProceedToPay = () => {
        const updateStockPromises = [];
        const deleteCartPromises = [];

        saveOrder(cartProducts, userId)
            .then((orderResponses) => {
                console.log('Orders saved successfully:', orderResponses);

                cartProducts.forEach((product) => {
                    const quantity = productQuantities[product.id] || 1;

                    const updateStockPromise = axios.put(`/api/controller/produits/stock/${product.produit.id}`, {
                        stock: product.produit.stock - quantity,
                    });

                    updateStockPromises.push(updateStockPromise);

                    // Create a promise to delete the cart item
                    const deleteCartPromise = axios.delete(`/api/controller/carts/${product.id}`);
                    deleteCartPromises.push(deleteCartPromise);
                });

                return Promise.all([...updateStockPromises, ...deleteCartPromises]);
            })
            .then(() => {
                console.log('All cart items deleted');
                loadCartProducts();
                showSuccess();
            })
            .catch((error) => {
                console.error('Error saving orders or updating product stocks:', error);
            });
    };

    const calculateShippingFee = (totalAmount) => {

        if (totalAmount >= 100) {
            return 0;
        } else {
            return shippingfee;
        }
    };

    if(loading){
        return( <div className="card mt-5 mx-2">
            <section style={{backgroundColor: "#eee"}}>
                <div className="container mt-2 ">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-10">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h3 className="fw-normal mb-0 text-black">Shopping Cart</h3>
                            </div>
                            <Skeleton width="100%" height="120px" className="mb-5"  />


                        </div>
                    </div>
                </div>
            </section>
            </div>
        );
    }

    const itemTemplate = (product) => {
        return (
            <div key={product.id} className="flex col-12 flex-wrap p-2 align-items-center gap-3">
                <img className="w-4rem shadow-2 flex-shrink-0 border-round"
                     src={product.produit.photo} alt={product.produit.nom} />
                <div className="flex-1 flex flex-column gap-1 xl:mr-1">
                    <div className="flex justify-content-between">
                         <span className="font-bold text-left">{product.produit.nom}
                    </span>
                        <span className="font-bold mr-2">
                            <Tag style={{fontSize:"10px"}}  value={`In Stock :${product.produit.stock} Pcs`}/>
                    </span>
                    </div>


                    <div className="flex align-items-center sm:col-12  md:col-12 xl:col-12 justify-content-sm-center justify-content-between ">


                        <div>
                            <Tag style={{fontSize:"10px",float:"left",backgroundColor:"rgba(224,200,200,0.21)",color:"black"}}  value={`Price :${product.totalprice} Dh`}/><br/>
                            <Tag style={{fontSize:"10px",float:"left"}} severity="success"  className="mr-1" value={`Total :`}/>{product.totalprice * (productQuantities[product.id] || 1)}Dh<br/>
                            {/*<PriceCheckIcon style={{float:"left"}}/> {product.totalprice * (productQuantities[product.id] || 1)}Dh*/}
                        </div>

                        <div>
                            <TextField
                                className="text-right "
                                type="number"
                                value={productQuantities[product.id] || product.quantity}
                                onChange={(e) => {
                                    const newQuantity = parseInt(e.target.value, 10);
                                    if (newQuantity >= 0 && newQuantity <= product.produit.stock) {
                                        updateQuantity(product.id, newQuantity);
                                    }
                                }}
                                InputProps={{
                                    inputProps: { min: 1, max: product.produit.stock },
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconButton
                                                onClick={() => deleteProduct(product.id)}
                                                color="error"
                                                size="small"
                                            >
                                                <DeleteIcon  />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                        </div>



                    </div>

                </div>

                {/*<Button*/}
                {/*    icon="pi pi-trash"*/}
                {/*    severity="danger"*/}
                {/*    aria-label="Cancel"*/}
                {/*    onClick={() => deleteProduct(product.id)}*/}
                {/*/>*/}
            </div>
        );
    };

    {/*<InputNumber*/}
    {/*    className="small"*/}
    {/*    value={productQuantities[product.id] || product.quantity}*/}
    {/*    mode="decimal"*/}
    {/*    showButtons*/}
    {/*    min={1}*/}
    {/*    max={product.produit.stock}*/}
    {/*    onChange={(e) => {*/}
    {/*        const newQuantity = parseInt(e.value, 10);*/}
    {/*        if (newQuantity >= 0 && newQuantity <= product.produit.stock) {*/}
    {/*            updateQuantity(product.id, newQuantity);*/}
    {/*        }*/}
    {/*    }}*/}
    {/*/>*/}
    return (
        <>
            <Toast ref={toast}/>

            {/*<div className="card mt-5 mx-2">*/}
            {/*    <section style={{backgroundColor: "#eee"}}>*/}
            {/*        <div className="container mt-2 ">*/}
            {/*            <div className="row d-flex justify-content-center align-items-center h-100">*/}
            {/*                <div className="col-12 col-md-10">*/}
            {/*                    <div className="d-flex justify-content-between align-items-center mb-4">*/}
            {/*                        <h3 className="fw-normal mb-0 text-black">Shopping Cart</h3>*/}
            {/*                    </div>*/}
            {/*                    {cartProducts.length === 0 ? (*/}
            {/*                        <div className="alert alert-secondary mb-5 p-5" >*/}
            {/*                            oops! There are no products in the cart.*/}
            {/*                        </div>*/}
            {/*                    ) : (*/}
            {/*                        <>*/}
            {/*                            {cartProducts.map((product) => (*/}
            {/*                                <div className="card rounded-3 mb-2" key={product.id}>*/}
            {/*                                    <div className="card-body p-3 ">*/}
            {/*                                        <div*/}
            {/*                                            className="row d-flex justify-content-between align-items-center">*/}
            {/*                                            <div className="col-4 col-md-2 col-lg-2 col-xl-2">*/}
            {/*                                                <img*/}
            {/*                                                    src={product.produit.photo}*/}
            {/*                                                    className="img-fluid rounded-3"*/}
            {/*                                                    alt={product.produit.nom}*/}
            {/*                                                />*/}
            {/*                                            </div>*/}
            {/*                                            <div className="col-8 col-md-3 col-lg-3 col-xl-3">*/}
            {/*                                                <p className="lead fw-normal mb-2">{product.produit.nom}</p>*/}

            {/*                                                <p>*/}
            {/*                                                    <span className="text-muted">Price:</span>*/}
            {/*                                                    <strong>{product.totalprice}Dh</strong><br/>*/}
            {/*                                                    <span className="text-muted">In stock: </span>*/}
            {/*                                                    {product.produit.stock}<br/>*/}
            {/*                                                    <span className="text-muted">Restaurant: </span>*/}
            {/*                                                    {product.produit.restaurant.nom}*/}
            {/*                                                </p>*/}

            {/*                                            </div>*/}
            {/*                                            <div*/}
            {/*                                                className="col-8 col-md-3 col-lg-3 col-xl-2 d-flex mt-3 mt-md-0">*/}
            {/*                                                <InputNumber*/}
            {/*                                                    value={productQuantities[product.id] || product.quantity}*/}
            {/*                                                    mode="decimal"*/}
            {/*                                                    showButtons*/}
            {/*                                                    min={1}*/}
            {/*                                                    max={product.produit.stock}*/}
            {/*                                                    onChange={(e) => {*/}
            {/*                                                        const newQuantity = parseInt(e.value, 10);*/}
            {/*                                                        if (newQuantity >= 0 && newQuantity <= product.produit.stock) {*/}
            {/*                                                            updateQuantity(product.id, newQuantity);*/}
            {/*                                                        }*/}
            {/*                                                    }}*/}
            {/*                                                />*/}
            {/*                                            </div>*/}
            {/*                                            <div*/}
            {/*                                                className="col-4 col-md-3 col-lg-2 col-xl-2 offset-md-1 mt-3 mt-md-0">*/}
            {/*                                                <h5 className="mb-0"> {product.totalprice * (productQuantities[product.id] || 1)}Dh</h5>*/}
            {/*                                            </div>*/}
            {/*                                            <div*/}
            {/*                                                className="col-3 col-md-1 col-lg-1 col-xl-1 text-end mt-3 mt-md-0">*/}
            {/*                                                <Button*/}
            {/*                                                    icon="pi pi-trash"*/}
            {/*                                                    severity="danger"*/}
            {/*                                                    aria-label="Cancel"*/}
            {/*                                                    onClick={() => deleteProduct(product.id)}*/}
            {/*                                                />*/}
            {/*                                            </div>*/}
            {/*                                        </div>*/}
            {/*                                    </div>*/}
            {/*                                </div>*/}
            {/*                            ))}*/}
            {/*                            <div className="card mb-2">*/}
            {/*                                <div className="card-body">*/}
            {/*                                    <div className="row d-flex justify-content-between align-items-center">*/}
            {/*                                        <div className="col-12 col-md-6">*/}
            {/*                                            <p className="mb-1">Total Quantity: {getTotalQuantity()}</p>*/}
            {/*                                            <p className="mb-0">Shipping Fee: {calculateShippingFee(getTotalAmount())}Dh</p>*/}
            {/*                                            <p className="mb-0">Total Amount: {getTotalAmount()}Dh</p>*/}
            {/*                                        </div>*/}
            {/*                                        <div className="col-12 col-md-6 text-md-end mt-5 mt-md-0">*/}
            {/*                                            <Button label="Proceed to Pay"*/}
            {/*                                                    disabled={isProceedToPayDisabled}*/}
            {/*                                                    severity="info" onClick={opendialog}*/}
            {/*                                            />*/}
            {/*                                        </div>*/}
            {/*                                    </div>*/}
            {/*                                </div>*/}
            {/*                            </div>*/}
            {/*                        </>*/}
            {/*                    )}*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </section>*/}
            {/*</div>*/}

            <Dialog
                visible={isDialogVisible}
                onHide={() => setDialogVisible(false)}
                header="Confirm Payment"
            >
                <p>Are you sure you want to proceed with the payment?</p>
                <Button label="Confirm" onClick={handleConfirmPayment}/>
                <Button label="Cancel" onClick={() => setDialogVisible(false)} className="p-button-secondary"/>
            </Dialog>

            <Box sx={{mx:3,mt:3}}>
                <Grid item container spacing={1}  columns={12} >
                    <Grid item xs={12} md={7}  >
                        <div className="card">
                            <DataView value={cartProducts} itemTemplate={itemTemplate}   header="Cart" />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={5}   >
                        <div className="card ">
                        {cartProducts.length === 0 ? (
                            <div className="alert alert-secondary mb-5 p-5" >
                                oops! There are no products in the cart.
                            </div>
                        ) : (
                            // <div className="card mb-2">
                            //     <div className="card-body">
                            //         <div className="row d-flex justify-content-between align-items-center">
                            //             <div className="col-12 col-md-6">
                            //                 <p className="mb-1">Total Quantity: {getTotalQuantity()}</p>
                            //                 <p className="mb-0">Shipping Fee: {calculateShippingFee(getTotalAmount())}Dh</p>
                            //                 <p className="mb-0">Total Amount: {getTotalAmount()}Dh</p>
                            //             </div>
                            //             <div className="col-12 col-md-6 text-md-end mt-5 mt-md-0">
                            //                 <Button label="Proceed to Pay"
                            //                         disabled={isProceedToPayDisabled}
                            //                         severity="info" onClick={opendialog}
                            //                 />
                            //             </div>
                            //         </div>
                            //     </div>
                            // </div>

                            <div className="grid mt-1 p-1" >
                                <div className="col-6">
                                    <div className="text-center p-1 border-round-sm  font-bold">
                                        <p className="mb-1">Total Quantity :</p>

                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center p-1 border-round-sm  font-bold">{getTotalQuantity()}</div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center p-1 border-round-sm  font-bold">
                                        <p className="mb-0">Shipping Fee :</p>

                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center p-1 border-round-sm  font-bold">
                                        {calculateShippingFee(getTotalAmount())}Dh
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center p-1 border-round-sm  font-bold">
                                        <p className="mb-0">Total Amount :</p>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center p-1 border-round-sm  font-bold">
                                        {getTotalAmount()}Dh
                                    </div>
                                </div>
                                <div className="col-12">
                                    <div className="text-center p-1 border-round-sm  font-bold">
                                        <Button label="Proceed to Pay"
                                                disabled={isProceedToPayDisabled}
                                                severity="info" onClick={opendialog}
                                        />
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>
                    </Grid>
                </Grid>
            </Box>

        </>
    );
}