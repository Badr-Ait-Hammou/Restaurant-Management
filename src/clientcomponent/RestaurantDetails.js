import {Link, useParams} from 'react-router-dom';
import axios from '../service/callerService';
import { useEffect, useState,useRef } from "react";
import {Card, CardContent} from "@mui/material";
import {Col,Row} from "react-bootstrap";
import React from "react";
import {accountService} from "../service/accountService";
import Modal from "react-modal";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Button } from 'primereact/button';
import {Toast} from "primereact/toast";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.min.css";
import {AiOutlineFieldTime} from "react-icons/ai";


export default function RestaurantDetails() {
    const [longitude, setLongitude] = useState();
    const [latitude, setLatitude] = useState();
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);   // const [produit, setProduit] = useState([]);
    const [userId, setUserId] = useState("");
    const [total, setTotal] = useState("");
    const [selectedproduct, setselectedproduct] = useState(null);
    const [showCart, setShowCart] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [addedProducts, setAddedProducts] = useState([]);
    const [quantities, setQuantities] = useState({}); // State to store the quantities of each product
    const [quantity, setQuantity] = useState(1);
    const toast = useRef(null);



    const handleOpenModal = () => {
        setShowCart(!showCart);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false)
        setShowCart(false)
    };

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'item added to cart', life: 1000});
    }

    useEffect(() => {
        console.log('selectedproduct', selectedproduct);
        updateStockNumber();
    }, [selectedproduct]);



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

    const submitOrder = async (e) => {
        console.log("userid<<<<", userId);
        try {
            const productData = cart.map((product) => ({
                ...product,
                quantity: quantities[product.id] || 0,
            }));
            console.log("quantity", quantities);

            // Construct the order details for the confirmation dialog
            const orderDetails = {
                products: productData,
                productQuantity:2,
                totalPrice: calculateTotalAmount(),
                user: {
                    id: userId
                }
            };

            // Display the confirmation dialog
            if (window.confirm(`Are you sure you want to submit this order?`)) {
                const response = await axios.post('/api/controller/orders/save', orderDetails);

                console.log('Order submitted successfully!', response.data);

                // Clear the cart
                setCart([]);

                // Close the cart
                handleCloseModal();
            } else {
                console.log('Order submission cancelled.');
            }
        } catch (error) {
            console.error('Failed to submit the order:', error);
        }
    };


    const handleQuantityChange = (productId, quantity) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: quantity,

        }));
    };

// Function to calculate the total order amount
    const calculateTotalAmount = () => {
        let total = 0;
        cart.forEach((product) => {
            const quantity = quantities[product.id] || 0;
            total += quantity * product.prix;
        });
        return total;
    };

    const updateStockNumber = (productId, quantity) => {
        const updatedCart = cart.map((product) => {
            if (product.id === productId) {
                return {
                    ...product,
                    stock: product.stock - quantity,
                };
            }
            return product;
        });
        setCart(updatedCart);
    };

   /* const handleAddToCartc = (product) => {
        const totalPrice = product.prix * quantity;
        const data = {
            quantity: quantity,
            totalPrice: totalPrice,
            user:{}
        };

        axios.post('/api/controller/orders/', data)
            .then((response) => {
                if (response.status === 200) {
                    // Product added successfully
                    // Perform any necessary actions (e.g., update state, show success message, etc.)
                } else {
                    // Error adding product
                    // Handle the error (e.g., show error message)
                }
            })
            .catch((error) => {
                // Handle network errors or other errors
            });
    };
*/
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


      /*  const handleAddToCart = (product) => {
            setCart([...cart, product]);
            setAddedProducts([...addedProducts, product.id]);

            console.log('added');
        };
        */

    const handleAddToCart = (product, quantity) => {
        setCart([...cart, { ...product, quantity }]);
        setAddedProducts([...addedProducts, product.id]);
        showSuccess();

    };





    const handleRemoveFromCart = (productId) => {
        // Remove the product from the cart
        const updatedCart = cart.filter((product) => product.id !== productId);

        // Update the cart state
        setCart(updatedCart);

    };



    return (
        <>
            <Button  icon="pi pi-shopping-cart"
                     raised
                     className="mx-2 mt-2"  style={{backgroundColor:"transparent",color:"lightseagreen",fontSize:"20px"}} onClick={handleOpenModal}/>

        <Card className="mt-3 mx-2" style={{backgroundColor:"whitesmoke"}}>
            <CardContent>
                <Row>
                    <Col sm={12} md={6} className="mb-3 mb-md-0">
                        <div className="justify-content-center d-flex">
                            <img src={restaurant.photo}  style={{width: "70%",
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
                            <div key={product.id} className="col mb-4">
                                <div className="card h-100">
                                    <Link to={`products/${product.id}`}>
                                        <img
                                            src={product.photo}
                                            className="card-img-top"
                                            alt="Pharmacy"
                                            style={{ objectFit: "cover", height: "auto" }}
                                        />
                                    </Link>
                                    <div className="card-body">
                                        <h5 className="card-title">{product.nom}</h5>
                                        <p className="card-text">Prix: {product.prix}</p>
                                        <p className="card-text">Stock: {product.stock}</p>

                                        <Button

                                            raised
                                            className="mx-2"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={addedProducts.includes(product.id)}
                                            style={{
                                                backgroundColor: addedProducts.includes(product.id)
                                                    ? 'lightseagreen'
                                                    : 'lightgreen',
                                                cursor: addedProducts.includes(product.id)
                                                    ? 'not-allowed'
                                                    : 'pointer',

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

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999
                    },
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#fff',
                        borderRadius: '10px',
                        boxShadow: '20px 30px 25px rgba(0, 0, 0, 0.2)',
                        padding: '20px',
                        width: '100%',
                        maxWidth: '700px',
                        height: 'auto',
                        maxHeight: '90%',
                        overflow: 'auto'
                    }
                }}
            >
                <div>
                    {showCart && (
                        <div>
                            <h4>Shopping Cart</h4>
                            {cart.map((product) => (
                                <div key={product.id} className="row mb-4">
                                    <div className="col-md-3">
                                        <img
                                            src={product.photo}
                                            className="img-thumbnail"
                                            alt="Product"
                                            style={{ objectFit: "cover", height: "auto" }}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h6>{product.nom}</h6>
                                        <h6>Stock: {product.stock}</h6>
                                        <h6>Price: ${product.prix}</h6>
                                        <h6>
                                            Quantity:
                                            <input
                                                className="mx-2"
                                                style={{ width: "100px", height: "20px", fontSize: "15px" }}

                                                type="number"
                                                value={quantities[product.id] || ""}

                                                onChange={(e) =>
                                                    handleQuantityChange(product.id, e.target.value)

                                                }

                                            />
                                        </h6>

                                    </div>
                                    <div className="col-md-3">
                                        <div>
                                            <Button
                                                className="mx-2"
                                                icon="pi pi-trash"
                                                style={{ backgroundColor: "red" }}
                                                onClick={() => handleRemoveFromCart(product.id)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <h4 className="align-content-center">Total Order Amount: ${calculateTotalAmount()}</h4>
                            <Button onClick={submitOrder}>Submit Order</Button>
                        </div>
                    )}
                </div>
            </Modal>
</>
    );
}



