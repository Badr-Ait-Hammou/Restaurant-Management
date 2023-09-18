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
import {Tag} from "primereact/tag";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Switch from '@mui/material/Switch';
import Typography from "@mui/material/Typography";
import CartSkeleton from "../skeleton/CartSkeleton";
import {Divider} from "primereact/divider";
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom';




export default function Cart() {
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [cartProducts, setCartProducts] = useState([]);
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState([]);
    const [email, setemail] = useState("");
    const [photo, setPhotos] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [adresse, setAdresse] = useState('');
    const [telephone, setTelephone] = useState('');
    const [area, setArea] = useState('');
    const navigate = useNavigate();
    const [postcode, setpostcode] = useState('');
    const [productQuantities, setProductQuantities] = useState({});
    const toast = useRef(null);
    const [loading, setLoading] = useState(true);
    const shippingfee=30;
    const [activeStep, setActiveStep] = useState(0);
    const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
    const [isOnlinePayment, setIsOnlinePayment] = useState(false);
    const steps = ['Verify Email and Address', 'Choose Payment Method', 'Review and Confirm'];



    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

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
        loadUser();

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


    const loadUser = async () => {
        axios.get(`/api/controller/users/${userId}`).then((response) => {
            const userData= response.data;
            setUser(userData);

            if (!firstName && userData) setFirstName(userData.firstName);
            if (!lastName && userData) setLastName(userData.lastName);
            if (!email && userData) setemail(userData.email);
            if (!adresse && userData) setAdresse(userData.adresse);
            if (!area && userData) setArea(userData.area);
            if (!photo && userData) setPhotos(userData.photo);
            if (!telephone && userData) setTelephone(userData.telephone);
            if (!postcode && userData) setpostcode(userData.postcode);
        });
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
        loadUser();
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

                    const deleteCartPromise = axios.delete(`/api/controller/carts/${product.id}`);
                    deleteCartPromises.push(deleteCartPromise);
                });

                return Promise.all([...updateStockPromises, ...deleteCartPromises]);
            })
            .then(() => {
                console.log('All cart items deleted');
                loadCartProducts();
                showSuccess();
                navigate('/ifoulki_meals/orders');

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

    if(loading ){
        return(
            <CartSkeleton/>
        );
    }


    const itemTemplate = (product) => {
        return (
            <div key={product.id} className="flex col-12 flex-wrap p-2 align-items-center gap-3">
                <img
                    className="w-4rem shadow-2 flex-shrink-0 border-round"
                    src={product.produit.photo}
                    alt={product.produit.nom}
                />
                <div className="flex-1 flex flex-column -mb-2 xl:mr-1">
                    <div className="flex justify-content-between">
                        <span className="font-bold text-left ml-2 ">{product.produit.nom}</span>
                        <span className="font-bold mr-2">
                            <Tag style={{ fontSize: "10px" }} value={`In Stock :${product.produit.stock} Pcs`} />
                        </span>
                    </div>
                    <div className="flex align-items-center sm:col-12  md:col-12 xl:col-12 justify-content-sm-center justify-content-between ">
                        <div>
                            <Tag
                                style={{ fontSize: "10px", float: "left", backgroundColor: "rgba(224,200,200,0.21)", color: "black" }}
                                value={`Price :${product.totalprice} Dh`}
                            /><br />
                            <Typography variant="body2" color="text.secondary" style={{fontSize:"12px",float: "left"}} className="ml-1">{product.produit.description}</Typography><br/>
                            <Tag style={{ fontSize: "10px", float: "left" }} severity="success" className="mr-1" value={`Total :`} />
                            {product.totalprice * (productQuantities[product.id] || 1)} Dh<br/>
                        </div>

                        <div>
                            <TextField
                                sx={{width:90}}
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
                                                sx={{p:-1,m:-1}}

                                            >
                                                <DeleteIcon sx={{fontSize:20}}/>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>
                </div>
                <Divider className="-mt-3 -mb-3"/>

            </div>
        );
    };

    const groupProductsByRestaurant = () => {
        const groupedProducts = {};
        cartProducts.forEach((product) => {
            const restaurantName = product.produit.restaurant.nom;
            const restaurantPhoto = product.produit.restaurant.photo;
            if (!groupedProducts[restaurantName]) {
                groupedProducts[restaurantName] = {
                    photo: restaurantPhoto,
                    products: [],
                };
            }
            groupedProducts[restaurantName].products.push(product);
        });
        return groupedProducts;
    };


    const renderRestaurantCards = () => {
        const groupedProducts = groupProductsByRestaurant();
        return Object.keys(groupedProducts).map((restaurantName) => (
            <div key={restaurantName} className="card m-1">
                <div className="restaurant-header text-left">
                    <Divider align="left" className="-mb-2">
                        <div className="inline-flex align-items-center -mt-3 ">
                            <Chip
                                avatar={<Avatar alt={restaurantName} src={groupedProducts[restaurantName].photo} />}
                                label={restaurantName}
                                variant="outlined"
                                size="medium"
                            />
                        </div>
                    </Divider>

                </div>
                {groupedProducts[restaurantName].products.map((product) => itemTemplate(product))}
            </div>
        ));
    };


    /**************************************************User info **************************** **/


    const handleUpdate = (event) => {
        event.preventDefault();

        const requestData = {
            id:user.id,
            firstName  :firstName || user.firstName,
            lastName : lastName || user.lastName,
            adresse : adresse || user.adresse,
            email:user.email,
            telephone :telephone || user.telephone,
            postcode :postcode || user.postcode,
            photo:user.photo,
            area :area || user.area,
            role:user.role,
            password:user.password,
        };

        axios.put(`/api/controller/users/${userId}`, requestData)
            .then((response) => {
                console.log("API Response:", response.data);
                loadUser();
                showupdate();
            })
            .catch((error) => {
                console.error("Error while saving project:", error);
            });
    };

    const showupdate = () => {
        toast.current.show({severity:'info', summary: 'success', detail:'Delivery info updated successfully', life: 3000});
    }


    return (
        <>
            <Toast ref={toast}/>
            <Box sx={{mx:3,mt:3}}>
                <Grid item container spacing={1}  columns={12} >
                    <Grid item xs={12} md={7}  >
                        <div className="card " style={{width:"100%",height:"40px",backgroundColor:"rgb(23,113,122)",borderBottomRightRadius:"0px",borderBottomLeftRadius:"0px"}}><Typography className="font-monospace text-center text-white text-1xl mt-1">Shopping Cart</Typography></div>
                        <div className="card" style={{backgroundColor:"rgba(23,113,122,0.04)",borderTopRightRadius:"0px",borderTopLeftRadius:"0px"}}>
                            {renderRestaurantCards()}

                        </div>
                    </Grid>
                    <Grid item xs={12} md={5}   >
                        <div className="card " style={{width:"100%",height:"40px",backgroundColor:"rgb(23,113,122)",borderBottomRightRadius:"0px",borderBottomLeftRadius:"0px"}}></div>
                        <div className="card" style={{backgroundColor:"rgba(23,113,122,0.04)",borderTopRightRadius:"0px",borderTopLeftRadius:"0px"}}>
                        {cartProducts.length === 0 ? (
                                <Skeleton width="100%" height="233px"  />

                        ) : (
                            <div className="grid mt-1 p-1" >
                                <div className="col-6">
                                    <div className="text-center p-1 border-round-sm  font-bold">
                                        <p className="mb-1">Total Quantity :</p>

                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="text-center p-1 border-round-sm  font-bold">{getTotalQuantity()}</div>
                                </div>
                                <Divider type={"solid"} className="mx-2 -mt-1 -mb-1"/>

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
                                <Divider type={"solid"} className="mx-2 -mt-1 -mb-1"/>
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
                                <Divider type={"solid"} className="mx-2 -mt-1 -mb-1"/>

                                <div className="col-12">
                                    <div className=" template text-center p-1 border-round-sm  font-bold ">
                                        <Button className="pay p-0" aria-label="Slack" disabled={isProceedToPayDisabled} onClick={opendialog}>
                                            <i className="pi pi-money-bill px-2"></i>
                                            <span className="px-3">Proceed to Pay</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            )}
                        </div>
                    </Grid>
                </Grid>
            </Box>



            <Dialog
                visible={isDialogVisible}
                maximizable

                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}
                onHide={() => setDialogVisible(false)}
                header="Confirm Payment"
            >
                <Box sx={{ width: '100%',mb:1 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
                <div>
                    {activeStep === 0 && (
                        <>
                            <Grid container spacing={1} mt={1}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="firstName"
                                        value={firstName}
                                        placeholder={user ? user.firstName || "firstName" : "firstName"}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="lastName"
                                        value={lastName}
                                        placeholder={user ? user.lastName || "lastName" : "lastName"}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} mt={1}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Address"
                                        value={adresse}
                                        onChange={(e) => setAdresse(e.target.value)}
                                        placeholder={user ? user.adresse || "Address" : "Address"}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Post Code"
                                        value={postcode}
                                        onChange={(e) => setpostcode(e.target.value)}
                                        placeholder={user ? user.postcode || "Post Code" : "Post Code"}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} mt={1}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Area"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        placeholder={user ? user.area || "Area" : "Area"}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Telephone"
                                        value={telephone}
                                        onChange={(e) => setTelephone(e.target.value)}
                                        placeholder={user ? user.telephone || "phone" : "PHONE"}
                                    />
                                </Grid>
                            </Grid>

                            <Grid container justifyContent="center">
                                <Grid item xs={12} textAlign="end" mt={1} className="template">
                                    {/*<Button label="Update" className="mx-1" severity="info" raised onClick={handleUpdate} />*/}
                                    {/*<Button label="Next"  onClick={handleNext} />*/}
                                    <Button className="edit p-0" aria-label="Slack"  onClick={handleUpdate}>
                                        <i className="pi pi-pencil px-2"></i>
                                        <span className="px-3">Update</span>
                                    </Button>
                                    <Button className="next p-0" aria-label="Slack"  onClick={handleNext}>
                                        <i className="pi pi-angle-double-right px-2"></i>
                                        <span className="px-3">Next</span>
                                    </Button>

                                </Grid>
                            </Grid>
                        </>
                    )}
                    {activeStep === 1 && (
                        <>
                            <div className="flex">
                                <div>
                                    <label>Cash on Delivery</label>
                                    <Switch
                                        checked={isCashOnDelivery}
                                        onChange={() => setIsCashOnDelivery(!isCashOnDelivery)}
                                        color="primary"
                                    />

                                    <label>Online Payment</label>
                                    <Switch
                                        checked={isOnlinePayment}
                                        onChange={() => setIsOnlinePayment(!isOnlinePayment)}
                                        color="primary"
                                        disabled={true}
                                    />
                                    <div >
                                        <Typography variant="body2" color="text.secondary" >
                                            Explore the Convenience of Cash on Delivery! Learn more about our Cash on Delivery payment method by clicking the 'Learn More' link below.
                                            Discover how this hassle-free and secure payment option allows you to pay for your purchases at the time of delivery,
                                            providing peace of mind and flexibility in your online shopping experience.
                                        </Typography>
                                            <Button label="Learn More" className="p-button-link" />
                                    </div>
                                </div>
                            </div>
                            <div className="template text-right mt-4 ">
                                {/*<Button label="Back" className="mx-1" onClick={handleBack} />*/}
                                {/*<Button label="Next" onClick={handleNext} />*/}

                                <Button className="export p-0" aria-label="Slack" onClick={handleBack}>
                                    <i className="pi pi-angle-double-left px-2"></i>
                                    <span className="px-3">Back</span>
                                </Button>
                                <Button className="next p-0" aria-label="Slack"  onClick={handleNext}>
                                    <i className="pi pi-angle-double-right px-2"></i>
                                    <span className="px-3">Next</span>
                                </Button>
                            </div>
                        </>
                    )}
                    {activeStep === 2 && (
                        <>
                            <Grid container spacing={1} mt={1}>
                                <Grid item xs={6}>
                                    <p><strong>FirstName </strong>:{user.firstName}</p>
                                    <p><strong>LastName </strong>:{user.lastName}</p>
                                    <p><strong>Phone </strong>:{user.telephone}</p>
                                </Grid>
                                <Grid item xs={6}>
                                    <p><strong>Area </strong>:{user.area}</p>
                                    <p><strong>Post Code </strong>:{user.postcode}</p>
                                    <p><strong>Delivery Method </strong>: {isCashOnDelivery ? 'Cash on Delivery' : 'Online Payment'}</p>
                                </Grid>
                            </Grid>
                            <div className="template">
                                <p><strong>Address </strong>:{user.adresse}</p>
                                {/*<Button label="Confirm Payment" style={{float:"right"}} onClick={handleConfirmPayment} />*/}
                                <Button className="pay p-0" aria-label="Slack" style={{float:"right"}} onClick={handleConfirmPayment}>
                                    <i className="pi pi-money-bill px-2"></i>
                                    <span className="px-3">Confirm Payment</span>
                                </Button>
                                <Button className="export p-0" aria-label="Slack" style={{float:"right"}} onClick={handleBack}>
                                    <i className="pi pi-angle-double-left px-2"></i>
                                    <span className="px-3">Back</span>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </Dialog>

        </>
    );
}