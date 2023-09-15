import {Button} from 'primereact/button';
import {Fieldset} from 'primereact/fieldset';
import "../styles/clientreservation.css";
import axios from '../service/callerService';
import React, {useState, useEffect, useRef} from "react";
import { Card, CardContent} from '@mui/material';
import {accountService} from "../service/accountService";
import moment from "moment";
import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog';
import {Toast} from "primereact/toast";
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import {Tag} from "primereact/tag";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RailwayAlertRoundedIcon from '@mui/icons-material/RailwayAlertRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import Tab from '@mui/material/Tab';
import Tabs, {tabsClasses} from '@mui/material/Tabs';
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import ClientOrdersSkeleton from "../skeleton/ClientOrdersSkeleton";
import {Dialog} from "primereact/dialog";
import {Rating} from "primereact/rating";
import {InputTextarea} from "primereact/inputtextarea";
import Avatar from "@mui/material/Avatar";
import RestaurantIcon from '@mui/icons-material/Restaurant';


export default function ClientOrders() {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState("");
    const toast = useRef(null);
    const [value, setValue] = React.useState(0);
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentDialog, setCommentDialog] = useState(false);


    //const [selectedProducts, setSelectedProducts] = useState([]);
    const [feedbackData, setFeedbackData] = useState([]);
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);


    const shippingfee = 30;

    const loadComments = () => {
        axios.get(`/api/controller/avis/`)
            .then((response) => {
                setComments(response.data);
            })
            .catch((error) => {
                console.error("Error loading comments:", error);
            });
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
        loadOrders();
        loadComments();
    }, [userId]);

    const loadOrders = () => {
        axios.get(`/api/controller/orders/userorder/${userId}`)
            .then((response) => {
                setOrders(response.data);
                setLoading(false);
            })
    };


    const groupOrdersByCreatedDate = () => {
        const grouped = [];
        let currentGroup = null;
        for (const order of orders) {
            const createdDate = moment(order.dateCreated);
            if (!currentGroup || createdDate.diff(moment(currentGroup.createdDate), 'seconds') > 2) {
                currentGroup = {createdDate: createdDate.format("YYYY-MM-DD HH:mm:ss"), orders: []};
                grouped.push(currentGroup);
            }
            currentGroup.orders.push(order);
        }
        grouped.sort((a, b) => moment(b.createdDate).diff(moment(a.createdDate)));
        return grouped;
    };


    const hideDialog = () => {
        setCommentDialog(false);
    };
    /******************************************************* Save comment **************************************/

    const openFeedbackDialog = (productsGroup) => {
        const initialFeedbackData = productsGroup.map((product) => {
            const existingComment = comments.find((comment) => comment.produit.id === product.produit.id && comment.orders.id === product.id);
            return {
                id: product.produit.id,
                orderId: product.id,
                nom: product.produit.nom,
                photo: product.produit.photo,
                rating: existingComment ? existingComment.rating : null,
                note: existingComment ? existingComment.note : '',
            };
        });

        setFeedbackData(initialFeedbackData);

        const allProductsHaveComments = initialFeedbackData.every((product) => {
            return product.rating !== null && product.note !== '';
        });

        setIsSaveButtonDisabled(allProductsHaveComments);
        setCommentDialog(true);
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (feedbackData.some((product) => !product.rating || !product.note)) {
            showuEmpty();
            return;
        }

        console.log("feedbackData:", feedbackData);

        const feedbackPromises = feedbackData.map((product) => {
            return axios.post("/api/controller/avis/save", {
                note: product.note,
                rating: product.rating,
                produit: {
                    id: product.id,
                },
                orders: {
                    id: product.orderId,
                },
                user: {
                    id: userId,
                },
            });
        });

        try {
            await Promise.all(feedbackPromises);
            console.log("All comments have been saved successfully");
            setFeedbackData([]);
            hideDialog();
            loadComments();
            showuSave();
        } catch (error) {
            console.error("Error while saving comments:", error);
        }
    };


    const commentDialogFooter = (
        <div>
            <Button
                label="Submit"
                icon="pi pi-check"
                onClick={handleSubmit}
                disabled={isSaveButtonDisabled}
            />
            <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} className="p-button-text"/>
        </div>
    );


    const handleRatingChange = (e, product) => {
        const updatedFeedbackData = feedbackData.map((p) => {
            if (p.id === product.id) {
                return {...p, rating: e.value};
            }
            return p;
        });
        setFeedbackData(updatedFeedbackData);
    };

    const handleNoteChange = (e, product) => {
        const updatedFeedbackData = feedbackData.map((p) => {
            if (p.id === product.id) {
                return {...p, note: e.target.value};
            }
            return p;
        });
        setFeedbackData(updatedFeedbackData);
    };


    const renderFeedbackForm = () => {
        return feedbackData.map((product) => (
            <div key={product.id} className="card mb-2 mt-1 " style={{backgroundColor: "rgba(13,77,84,0.05)"}}>
                <Grid container spacing={2} sx={{mt: 1, mb: 1}}>

                    <Grid item xs={12} sm={4}>
                        <Box display="flex" sx={{mt: 3}} alignItems="center">
                            <Avatar variant="square"
                                    sx={{width: 50, height: 50, borderRadius: 2, backgroundColor: "white"}}
                                    src={product.photo} className="mx-3"/>
                            <div>
                                <h5>{product.nom}</h5>
                            </div>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={8}>
                        <Box alignItems="center" sx={{mr: 1}}>
                            <Rating
                                value={product.rating}
                                onChange={(e) => handleRatingChange(e, product)}
                                cancel={false}
                            />
                            <InputTextarea
                                style={{marginTop: '5px'}}
                                id={`newcmt-${product.id}`}
                                value={product.note}
                                placeholder="Your feedback "
                                onChange={(e) => handleNoteChange(e, product)}
                                required
                            />
                        </Box>
                    </Grid>
                </Grid>
            </div>
        ));
    };


    /******************************************************* update status **************************************/


    const updateStatus = (group) => {
        const validOrders = group.orders.filter(order => order.status !== null);

        if (validOrders.length === 0) {
            console.error("No valid orders to update.");
            return;
        }

        const confirmCancel = () => {
            const updatePromises = validOrders.map(order => {
                return axios.put(`/api/controller/orders/status/${order.id}`, {
                    status: 'Cancelled'
                });
            });

            Promise.all(updatePromises)
                .then(() => {
                    loadOrders();
                    toast.current.show({
                        severity: 'info',
                        summary: 'Success',
                        detail: 'order Cancelled successfully',
                        life: 3000
                    });
                })
        };

        confirmDialog({
            message: 'Are you sure you want to Cancel this Order?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmCancel
        });
    };

    /******************************************************* Toast   **************************************/
    const showuSave = () => {
        toast.current.show({
            severity: 'success',
            summary: 'Done',
            detail: 'Feedback submitted  successfully',
            life: 3000
        });
    }
    const showuEmpty = () => {
        toast.current.show({severity: 'error', summary: 'Warning', detail: 'One of the fields is empty ', life: 3000});
    }

    /******************************************************* return   **************************************/



    function renderOrderDetails(group, statusFilter, updateStatus) {
        const filteredOrders = group.orders.filter((order) => order.status === statusFilter);

        if (filteredOrders.length === 0) {
            return null;
        }

        return (
            <div key={group.createdDate} className="order-group">
                <div className="content mt-5">
                    <Fieldset legend={`Order Details (${group.createdDate})`} toggleable>
                        {filteredOrders.map((order, orderIndex) => (
                            <div key={order.id} className="order-item ">
                                {orderIndex > 0 && <Divider component="" className="m-2"/>}
                                <Grid container alignItems="center ">
                                    <Grid item xs={4} className="left">
                                        <img
                                            src={order.produit.photo}
                                            alt={order.produit.nom}
                                            style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4} className="right">
                                        <p>
                                            <strong className="mt-2 mx-2">Product :</strong> {order.produit.nom}<br/>
                                            <strong className="mt-2 mx-2">Restaurant
                                                :</strong> {order.produit.restaurant.nom} <br/>
                                            <strong className="mt-2 mx-2">Price :</strong> {order.produit.prix} Dh<br/>
                                        </p>
                                    </Grid>
                                    <Grid item xs={4} className="right">
                                        <p>
                                            <strong className="mt-2 mx-2">Total
                                                amount:</strong> {order.totalPrice} Dh<br/>
                                            <strong className="mt-2 mx-2">Quantity:</strong> {order.productQuantity} Pcs<br/>
                                        </p>
                                    </Grid>
                                </Grid>
                            </div>
                        ))}
                        <Divider component="" className="m-2"/>


                        <div className="d-flex justify-content-center align-items-center ">
                            <div className="m-1">
                                {filteredOrders[0].status === statusFilter && (
                                    <div>

                                        <Tag
                                            severity={statusFilter === 'Delivered' ? 'success' : statusFilter === 'Cancelled' ? 'danger' : statusFilter === 'Shipped' ? 'info' : 'warning'}
                                            rounded>
                                            {statusFilter === 'Delivered' && <CheckCircleOutlineIcon className="mx-1"/>}
                                            {statusFilter === 'Cancelled' &&
                                                <RailwayAlertRoundedIcon className="mx-1"/>}
                                            {statusFilter === 'Shipped' && <LocalShippingIcon className="mx-1"/>}
                                            {statusFilter === 'Pending' && <PendingRoundedIcon className="mx-1"/>}
                                            {filteredOrders[0].status}
                                        </Tag>

                                    </div>
                                )}

                            </div>
                            <div>
                                <Tag className=" p-2" rounded>
                                    <strong className="m-2">Order Amount
                                        :</strong> {filteredOrders.reduce((total, order) => total + order.totalPrice, 0)} Dh
                                </Tag>
                                <Tag severity="secondary" className=" p-2" rounded>
                                    {filteredOrders.reduce((total, order) => total + order.totalPrice, 0) < 100 ? (
                                        <p className="mb-0">
                                            <strong className="mt-2 mx-2">Shipping
                                                fee:</strong> {shippingfee} Dh<br/>
                                        </p>
                                    ) : (
                                        <p className="mb-0">
                                            <strong className="mt-2 mx-2">Shipping
                                                fee:</strong> 0 Dh<br/>
                                        </p>
                                    )}
                                </Tag>
                            </div>
                            {statusFilter === 'Pending' ? (
                                <div>
                                    {groupOrdersByCreatedDate().some((group) => group.orders.some((order) => order.status === 'Pending')) && (
                                        <Button
                                            className="p-1 mx-1"
                                            label="cancel"
                                            severity="danger"
                                            onClick={() => {
                                                updateStatus(group);
                                            }}
                                        />
                                    )}
                                </div>
                            ) : (statusFilter === 'Delivered') ?
                                (
                                    <div>
                                        {groupOrdersByCreatedDate().some((group) => group.orders.some((order) => order.status === 'Delivered')) && (
                                            <Button
                                                className="p-1 mx-1"
                                                label="feedback"
                                                severity="info"
                                                onClick={() => openFeedbackDialog(group.orders)}


                                            />
                                        )}
                                    </div>
                                ) : ("")
                            }
                        </div>

                    </Fieldset>
                </div>
            </div>
        );
    }

    if (loading || orders.length === 0) {
        return (<ClientOrdersSkeleton/>);
    }

    return (
        <>
            <div>
                <Toast ref={toast}/>
                <ConfirmDialog/>

                <Card className="mx-3 p-2 mt-1">
                    <CardContent>
                        <div style={{alignItems: "center"}}>
                            <h2>ORDERS</h2>
                        </div>
                    </CardContent>

                    <div>

                        <Box sx={{display: 'flex', justifyContent: 'center'}}>
                            <Tabs
                                value={value}
                                onChange={(event, newValue) => setValue(newValue)}
                                variant="scrollable"
                                scrollButtons
                                aria-label="visible arrows tabs example"
                                sx={{
                                    [`& .${tabsClasses.scrollButtons}`]: {
                                        '&.Mui-disabled': {opacity: 0.3},
                                    },
                                    overflowX: 'auto',
                                }}
                            >
                                <Tab label="All"/>
                                <Tab label="Pending"/>
                                <Tab label="Cancelled"/>
                                <Tab label="Shipped"/>
                                <Tab label="Delivered"/>
                            </Tabs>
                        </Box>

                        {value === 0 && (
                            <div>
                                {groupOrdersByCreatedDate().some((group) => group.orders.some((order) => order.length !== 0)) ? (

                                    groupOrdersByCreatedDate().map((group, index) => (
                                        <div key={index} className="order-group">
                                            <div className="content mt-5">
                                                <Fieldset legend={`Order Details (${group.createdDate})`} toggleable>
                                                    {group.orders.map((order, orderIndex) => (
                                                        // <div key={order.id} className="order-item ">
                                                        //     {orderIndex > 0 && <Divider component="" className="m-2"/>}
                                                        //     <Grid container alignItems="center">
                                                        //         <Grid item xs={4} className="left">
                                                        //             <img
                                                        //                 src={order.produit.photo}
                                                        //                 alt={order.produit.nom}
                                                        //                 style={{
                                                        //                     width: '100px',
                                                        //                     height: '100px',
                                                        //                     borderRadius: '8px'
                                                        //                 }}
                                                        //             />
                                                        //         </Grid>
                                                        //         <Grid item xs={4} className="right">
                                                        //             <p>
                                                        //                 <strong className="mt-2 mx-2">Product
                                                        //                     :</strong> {order.produit.nom}<br/>
                                                        //                 <strong className="mt-2 mx-2">Restaurant
                                                        //                     :</strong> {order.produit.restaurant.nom} <br/>
                                                        //                 <strong className="mt-2 mx-2">Price
                                                        //                     :</strong> {order.produit.prix} Dh<br/>
                                                        //             </p>
                                                        //         </Grid>
                                                        //         <Grid item xs={4} className="right">
                                                        //             <p>
                                                        //                 <strong className="mt-2 mx-2">Total
                                                        //                     amount:</strong> {order.totalPrice} Dh<br/>
                                                        //                 <strong
                                                        //                     className="mt-2 mx-2">Quantity:</strong> {order.productQuantity} Pcs<br/>
                                                        //
                                                        //             </p>
                                                        //         </Grid>
                                                        //     </Grid>
                                                        // </div>

                                                        // <div className="col-12">
                                                        //     <div
                                                        //         className="flex flex-column sm:flex-row xl:flex-row justify-content-between md:align-items-start sm:align-items-start p-2 gap-2">
                                                        //         <img
                                                        //             className="w-4  shadow-2 block xl:block  border-round"
                                                        //             src={order.produit.photo}
                                                        //             alt={order.produit.nom}/>
                                                        //         <div
                                                        //             className="flex flex-column sm:flex-row justify-content-between sm:align-items-start md:align-items-start xl:align-items-start flex-1 gap-4">
                                                        //             <div
                                                        //                 className="flex flex-column align-items-center sm:align-items-start gap-3">
                                                        //                 <div className="text-2xl font-bold text-900">{order.produit.nom}</div>
                                                        //                 <div className="text-2xl font-bold text-900">{order.produit.restaurant.nom}</div>
                                                        //                 {/*<Rating value={product.rating} readOnly*/}
                                                        //                 {/*        cancel={false}></Rating>*/}
                                                        //                 <div className="flex align-items-center gap-3">
                                                        //                 <span className="flex align-items-center gap-2">
                                                        //                     <i className="pi pi-tag"></i>
                                                        //                     <span className="font-semibold">{order.produit.prix} Dh</span>
                                                        //                     <span className="font-semibold">{order.productQuantity} Pcs</span>
                                                        //                 </span>
                                                        //                     <Tag value={order.productQuantity}
                                                        //                        ></Tag>
                                                        //                 </div>
                                                        //             </div>
                                                        //             <div
                                                        //                 className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                                        //                 <span
                                                        //                     className="text-2xl font-semibold">{order.totalPrice} Dh</span>
                                                        //                 <Button icon="pi pi-shopping-cart"
                                                        //                         className="p-button-rounded"
                                                        //                         ></Button>
                                                        //             </div>
                                                        //         </div>
                                                        //     </div>
                                                        // </div>


                                                        <div key={order.id} className="col-12 card xl:flex xl:justify-content-center">
                                                        <div className="flex flex-wrap p-1 align-items-center gap-2">
                                                            <img className="w-4rem shadow-2 flex-shrink-0 border-round"
                                                                 src={order.produit.photo}
                                                                 alt={order.produit.nom}
                                                            />
                                                            <div className="flex-1 flex flex-column gap-2 xl:mr-8">
                                                                <div className="flex align-items-start ">
                                                                    <Tag style={{fontSize:"10px",background: 'linear-gradient(90deg, rgba(0,36,24,0.9759709547881653) 0%, rgba(9,121,84,1) 35%, rgba(0,255,200,1) 100%)'}} value={"Product Name :"}></Tag>
                                                                    <Tag className="ml-1" value={order.produit.nom} style={{backgroundColor:"transparent", color:"black" ,fontSize:"10px"}}/>

                                                                    {/*<span className="font-bold">Product :{order.produit.nom}</span>*/}
                                                                </div>
                                                                <div className="flex align-items-start ">
                                                                    <Tag style={{fontSize:"10px",background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'}} value={'Restaurant :'} icon={<RestaurantIcon style={{fontSize:"14px"}}/>}></Tag>
                                                                    <Tag className="ml-1" value={order.produit.restaurant.nom} style={{backgroundColor:"transparent",color:"black" ,fontSize:"10px"}}/>
                                                                </div>
                                                                <div className="flex align-items-start ">
                                                                    <span>{order.productQuantity} (Pcs) x {" "} {order.produit.prix} (Dh) </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                                                        <span className="text-2xl font-semibold">Total Price :{order.totalPrice} Dh</span>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    ))}
                                                    <Divider component="" className="m-2"/>

                                                    <div className="d-flex justify-content-center align-items-center">

                                                        {/*<div className="m-1">*/}
                                                        {/*    {group.orders[0].status && (*/}
                                                        {/*        <div>*/}

                                                        {/*            <Tag*/}
                                                        {/*                severity={group.orders[0].status === 'Delivered' ? 'success' : group.orders[0].status === 'Cancelled' ? 'danger' : group.orders[0].status === 'Shipped' ? 'info' : 'warning'}*/}
                                                        {/*                rounded>*/}
                                                        {/*                {group.orders[0].status === 'Delivered' &&*/}
                                                        {/*                    <CheckCircleOutlineIcon className="mx-1"/>}*/}
                                                        {/*                {group.orders[0].status === 'Cancelled' &&*/}
                                                        {/*                    <RailwayAlertRoundedIcon className="mx-1"/>}*/}
                                                        {/*                {group.orders[0].status === 'Shipped' &&*/}
                                                        {/*                    <LocalShippingIcon className="mx-1"/>}*/}
                                                        {/*                {group.orders[0].status === 'Pending' &&*/}
                                                        {/*                    <PendingRoundedIcon className="mx-1"/>}*/}
                                                        {/*                {group.orders[0].status}*/}
                                                        {/*            </Tag>*/}

                                                        {/*        </div>*/}
                                                        {/*    )}*/}

                                                        {/*</div>*/}

                                                        <Box sx={{width: 500}}>
                                                            {/*<BottomNavigation*/}
                                                            {/*    showLabels*/}
                                                            {/*   // value={value}*/}

                                                            {/*>*/}
                                                            <div className="flex">
                                                                <div>
                                                                    {group.orders[0].status && (
                                                                        <Tag
                                                                            severity={group.orders[0].status === 'Delivered' ? 'success' : group.orders[0].status === 'Cancelled' ? 'danger' : group.orders[0].status === 'Shipped' ? 'info' : 'warning'}
                                                                            rounded>
                                                                            {group.orders[0].status === 'Delivered' &&
                                                                                <CheckCircleOutlineIcon
                                                                                    className="mx-1"/>}
                                                                            {group.orders[0].status === 'Cancelled' &&
                                                                                <RailwayAlertRoundedIcon
                                                                                    className="mx-1"/>}
                                                                            {group.orders[0].status === 'Shipped' &&
                                                                                <LocalShippingIcon className="mx-1"/>}
                                                                            {group.orders[0].status === 'Pending' &&
                                                                                <PendingRoundedIcon className="mx-1"/>}
                                                                            {group.orders[0].status}
                                                                        </Tag>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <Tag severity="secondary" className=" p-2" rounded>
                                                                        <strong className="m-2">Order Amount
                                                                            :</strong>{group.orders.reduce((total, order) => total + order.totalPrice, 0)} Dh
                                                                    </Tag>

                                                                </div>
                                                                <div>
                                                                    <Tag severity="secondary" className=" p-2" rounded>
                                                                        {group.orders.reduce((total, order) => total + order.totalPrice, 0) < 100 ? (
                                                                            <p className="mb-0">
                                                                                <strong className="mt-2 mx-2">Shipping
                                                                                    fee:</strong> {shippingfee} Dh<br/>
                                                                            </p>
                                                                        ) : (
                                                                            <p className="mb-0">
                                                                                <strong className="mt-2 mx-2">Shipping
                                                                                    fee:</strong> 0 Dh<br/>
                                                                            </p>
                                                                        )}
                                                                    </Tag>
                                                                </div>

                                                                <div>
                                                                    {group.orders[0].status === 'Pending' ? (
                                                                        <div>
                                                                            {groupOrdersByCreatedDate().some((group) =>
                                                                                group.orders.some((order) => order.status === 'Pending')
                                                                            ) && (
                                                                                <Button
                                                                                    className="p-1 mx-1"
                                                                                    label="cancel"
                                                                                    severity="danger"
                                                                                    onClick={() => {
                                                                                        updateStatus(group);
                                                                                    }}
                                                                                />
                                                                            )}
                                                                        </div>
                                                                    ) : (group.orders[0].status === 'Delivered' ? (<div>
                                                                        {groupOrdersByCreatedDate().some((group) =>
                                                                            group.orders.some((order) => order.status === 'Delivered')
                                                                        ) && (
                                                                            <Button
                                                                                className="p-1 mx-1"
                                                                                label="feedback"
                                                                                severity="info"
                                                                                onClick={() => openFeedbackDialog(group.orders)}


                                                                            />
                                                                        )}
                                                                    </div>) : (""))}
                                                                </div>
                                                                {/*</BottomNavigation>*/}
                                                            </div>
                                                        </Box>
                                                        {/*<div>*/}
                                                        {/*    <Tag severity="secondary" className=" p-2" rounded>*/}
                                                        {/*        <strong className="m-2">Order Amount*/}
                                                        {/*            :</strong>{group.orders.reduce((total, order) => total + order.totalPrice, 0)} Dh*/}
                                                        {/*    </Tag>*/}
                                                        {/*    <Tag severity="secondary" className=" p-2" rounded>*/}
                                                        {/*        {group.orders.reduce((total, order) => total + order.totalPrice, 0) < 100 ? (*/}
                                                        {/*            <p className="mb-0">*/}
                                                        {/*                <strong className="mt-2 mx-2">Shipping*/}
                                                        {/*                    fee:</strong> {shippingfee} Dh<br/>*/}
                                                        {/*            </p>*/}
                                                        {/*        ) : (*/}
                                                        {/*            <p className="mb-0">*/}
                                                        {/*                <strong className="mt-2 mx-2">Shipping*/}
                                                        {/*                    fee:</strong> 0 Dh<br/>*/}
                                                        {/*            </p>*/}
                                                        {/*        )}*/}
                                                        {/*    </Tag>*/}
                                                        {/*</div>*/}
                                                        {/*{group.orders[0].status === 'Pending' ? (*/}
                                                        {/*    <div>*/}
                                                        {/*        {groupOrdersByCreatedDate().some((group) =>*/}
                                                        {/*            group.orders.some((order) => order.status === 'Pending')*/}
                                                        {/*        ) && (*/}
                                                        {/*            <Button*/}
                                                        {/*                className="p-1 mx-1"*/}
                                                        {/*                label="cancel"*/}
                                                        {/*                severity="danger"*/}
                                                        {/*                onClick={() => {*/}
                                                        {/*                    updateStatus(group);*/}
                                                        {/*                }}*/}
                                                        {/*            />*/}
                                                        {/*        )}*/}
                                                        {/*    </div>*/}
                                                        {/*):(group.orders[0].status === 'Delivered' ?(<div>*/}
                                                        {/*    {groupOrdersByCreatedDate().some((group) =>*/}
                                                        {/*        group.orders.some((order) => order.status === 'Delivered')*/}
                                                        {/*    ) && (*/}
                                                        {/*        <Button*/}
                                                        {/*            className="p-1 mx-1"*/}
                                                        {/*            label="feedback"*/}
                                                        {/*            severity="info"*/}
                                                        {/*            onClick={() => openFeedbackDialog(group.orders)}*/}


                                                        {/*        />*/}
                                                        {/*    )}*/}
                                                        {/*</div>):(""))}*/}
                                                    </div>

                                                </Fieldset>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="order-group">
                                        <div className="content mt-5">
                                            <Fieldset legend="No  Orders">
                                                <Alert severity="error">
                                                    <AlertTitle>Info</AlertTitle>
                                                    <strong>oops!</strong> — There is No Orders —
                                                </Alert>
                                            </Fieldset>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {value === 1 && (
                            <div>
                                {groupOrdersByCreatedDate().some((group) => group.orders.some((order) => order.status === 'Pending')) ? (
                                    groupOrdersByCreatedDate().map((group) =>
                                        renderOrderDetails(group, 'Pending', updateStatus)
                                    )
                                ) : (
                                    <div className="order-group">
                                        <div className="content mt-5">
                                            <Fieldset legend="No Pending Orders">
                                                <Alert severity="warning">
                                                    <AlertTitle>Info</AlertTitle>
                                                    <strong>oops!</strong> — There is No Pending Orders —
                                                </Alert>
                                            </Fieldset>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {value === 2 && (
                            <div>
                                {groupOrdersByCreatedDate().some((group) => group.orders.some((order) => order.status === 'Cancelled')) ? (
                                    groupOrdersByCreatedDate().map((group) => renderOrderDetails(group, 'Cancelled', updateStatus))
                                ) : (

                                    <div className="order-group">
                                        <div className="content mt-5">
                                            <Fieldset legend="No Cancelled Orders">
                                                <Alert severity="error">
                                                    <AlertTitle>Info</AlertTitle>
                                                    <strong>oops!</strong> — There is No Cancelled Orders —
                                                </Alert>
                                            </Fieldset>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {value === 3 && (
                            <div>
                                {groupOrdersByCreatedDate().some((group) => group.orders.some((order) => order.status === 'Shipped')) ? (
                                    groupOrdersByCreatedDate().map((group) => renderOrderDetails(group, 'Shipped', updateStatus))
                                ) : (
                                    <div className="order-group">
                                        <div className="content mt-5">
                                            <Fieldset legend="No Shipped Orders">
                                                <Alert severity="info">
                                                    <AlertTitle>Info</AlertTitle>
                                                    <strong>oops!</strong> — There is No Shipped Orders —
                                                </Alert>
                                            </Fieldset>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                        {value === 4 && (
                            <div>
                                {groupOrdersByCreatedDate().some((group) => group.orders.some((order) => order.status === 'Delivered')) ? (
                                    groupOrdersByCreatedDate().map((group) => renderOrderDetails(group, 'Delivered', updateStatus))
                                ) : (
                                    <div className="order-group">
                                        <div className="content mt-5">
                                            <Fieldset legend="No Delivered Orders">
                                                <Alert severity="success">
                                                    <AlertTitle>Info</AlertTitle>
                                                    <strong>oops!</strong> — There is No Delivered Orders —
                                                </Alert>
                                            </Fieldset>
                                        </div>
                                    </div>

                                )}
                            </div>
                        )}
                    </div>
                </Card>
            </div>
            <Dialog
                visible={commentDialog}
                style={{width: '40rem'}}
                breakpoints={{'960px': '75vw', '641px': '90vw'}}
                header={<small>Your Feedback Matters</small>}
                modal
                maximizable
                className="p-fluid"
                footer={commentDialogFooter}
                onHide={hideDialog}
            >
                {renderFeedbackForm()}
            </Dialog>
        </>
    );
}
