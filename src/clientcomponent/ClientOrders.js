import {Button} from 'primereact/button';
import {Fieldset} from 'primereact/fieldset';
import "../styles/clientreservation.css";
import axios from '../service/callerService';
import React, {useState, useEffect, useRef} from "react";
import {Card, CardContent} from '@mui/material';
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
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";


export default function ClientOrders() {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState("");
    const [alertMessage] = useState("Once you make an order one of our agents will contact you asap");
    const toast = useRef(null);
    const [value, setValue] = React.useState(0);




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

    const handleDelete = (reservationIds) => {
        const confirmDelete = () => {
            const promises = reservationIds.map((reservationId) => {
                return axios.delete(`/api/controller/orders/${reservationId}`);
            });

            Promise.all(promises).then(() => {
                const updatedOrders = orders.filter((order) => !reservationIds.includes(order.id));
                setOrders(updatedOrders);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Order canceled successfully',
                    life: 3000
                });
            });
        };

        confirmDialog({
            message: 'Are you sure you want to Cancel this Order?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
    };

    useEffect(() => {
        loadOrders();
    }, [userId]);

    const loadOrders = () => {
        axios.get(`/api/controller/orders/userorder/${userId}`).then((response) => {
            setOrders(response.data);
        });
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
        return grouped;
    };


    const updateStatus = (group) => {
        const validOrders = group.orders.filter(order => order.status !== null);

        if (validOrders.length === 0) {
            console.error("No valid orders to update.");
            return;
        }

        const updatePromises = validOrders.map(order => {
            return axios.put(`/api/controller/orders/status/${order.id}`, {
                status: 'Cancelled'
            });
        });

        Promise.all(updatePromises)
            .then(() => {
                loadOrders();
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Status updated successfully',
                    life: 3000
                });
            })
            .catch((error) => {
                console.error('Error updating status:', error);
            });
    };




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
                                {orderIndex > 0 && <Divider component="" className="m-2" />}
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
                                            <strong className="mt-2 mx-2">Product :</strong> {order.produit.nom}<br />
                                            <strong className="mt-2 mx-2">Restaurant :</strong> {order.produit.restaurant.nom} <br />
                                            <strong className="mt-2 mx-2">Price :</strong> {order.produit.prix} Dh<br />
                                        </p>
                                    </Grid>
                                    <Grid item xs={4} className="right">
                                        <p>
                                            <strong className="mt-2 mx-2">Total amount:</strong> {order.totalPrice} Dh<br />
                                            <strong className="mt-2 mx-2">Quantity:</strong> {order.productQuantity} Pcs<br />
                                        </p>
                                    </Grid>
                                </Grid>
                            </div>
                        ))}
                        <Divider component="" className="m-2" />

                        <div className="d-flex justify-content-center align-items-center ">
                            <div className="m-1">
                                {filteredOrders[0].status === statusFilter && (
                                    <div>

                                        <Tag  severity={statusFilter === 'Delivered' ? 'success' : statusFilter === 'Cancelled' ? 'danger' : statusFilter === 'Shipped' ? 'info' : 'warning'} rounded>
                                            {statusFilter === 'Delivered' && <CheckCircleOutlineIcon className="mx-1" />}
                                            {statusFilter === 'Cancelled' && <RailwayAlertRoundedIcon className="mx-1" />}
                                            {statusFilter === 'Shipped' && <LocalShippingIcon  className="mx-1"/>}
                                            {statusFilter === 'Pending' && <PendingRoundedIcon className="mx-1" />}
                                            {filteredOrders[0].status}
                                        </Tag>

                                    </div>
                                )}

                            </div>
                            <div >
                                <Tag className=" p-2" rounded>
                                    <strong className="m-2">Order Amount :</strong> {filteredOrders.reduce((total, order) => total + order.totalPrice, 0)} Dh
                                </Tag>
                            </div>
                            {statusFilter === 'Pending' && (
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
                            )}
                        </div>

                    </Fieldset>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="alert" style={{ backgroundColor: "yellow", padding: "10px", fontFamily: "serif" }}>
                {alertMessage}
            </div>
            <Card className="mx-3 mt-3 p-3">
                <CardContent>
                    <div style={{ alignItems: "center" }}>
                        <h3>ORDERS</h3>
                    </div>
                </CardContent>

                <div className="mt-5">

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tabs
                            value={value}
                            onChange={(event, newValue) => setValue(newValue)}
                            variant="scrollable"
                            scrollButtons
                            aria-label="visible arrows tabs example"
                            sx={{
                                [`& .${tabsClasses.scrollButtons}`]: {
                                    '&.Mui-disabled': { opacity: 0.3 },
                                },
                                overflowX: 'auto',
                            }}
                        >
                            <Tab label="All" />
                            <Tab label="Pending" />
                            <Tab label="Cancelled" />
                            <Tab label="Shipped" />
                            <Tab label="Delivered" />
                        </Tabs>
                    </Box>

                    {value === 0 && (
                        <div>
                            {/* Display all orders */}
                            {groupOrdersByCreatedDate().map((group, index) => (
                                <div key={index} className="order-group">
                                    <div className="content mt-5">
                                        <Fieldset legend={`Order Details (${group.createdDate})`} toggleable>
                                            {group.orders.map((order, orderIndex) => (
                                                <div key={order.id} className="order-item ">
                                                    {orderIndex > 0 && <Divider component="" className="m-2" />}
                                                    <Grid container alignItems="center">
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
                                                                <strong className="mt-2 mx-2">Product :</strong> {order.produit.nom}<br />
                                                                <strong className="mt-2 mx-2">Restaurant :</strong> {order.produit.restaurant.nom} <br />
                                                                <strong className="mt-2 mx-2">Price :</strong> {order.produit.prix} Dh<br />
                                                            </p>
                                                        </Grid>
                                                        <Grid item xs={4} className="right">
                                                            <p>
                                                                <strong className="mt-2 mx-2">Total amount:</strong> {order.totalPrice} Dh<br />
                                                                <strong className="mt-2 mx-2">Quantity:</strong> {order.productQuantity} Pcs<br />
                                                            </p>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            ))}
                                            <div className="d-flex justify-content-end align-items-center">
                                                <div className="mx-2 ">
                                                    {group.orders[0].status && (
                                                        <div>
                                                            {group.orders[0].status === 'Pending' && (
                                                                <div>
                                                                    <IconButton color="warning" className="mt-2 ">
                                                                        <PendingRoundedIcon />
                                                                    </IconButton>
                                                                    <Tag severity="warning"  className="p-2" rounded>
                                                                        {group.orders[0].status}
                                                                    </Tag>
                                                                </div>
                                                            )}
                                                            {group.orders[0].status === 'Cancelled' && (
                                                                <div>
                                                                    <IconButton color="error" className="mt-2">
                                                                        <RailwayAlertRoundedIcon />
                                                                    </IconButton>
                                                                    <Tag severity="danger" className="p-2" rounded>
                                                                        {group.orders[0].status}
                                                                    </Tag>
                                                                </div>
                                                            )}
                                                            {group.orders[0].status === 'Shipped' && (
                                                                <div>
                                                                    <IconButton color="info" className="mt-2">
                                                                        <LocalShippingIcon />
                                                                    </IconButton>
                                                                    <Tag severity="info" className="p-2" rounded>
                                                                        {group.orders[0].status}
                                                                    </Tag>
                                                                </div>
                                                            )}
                                                            {group.orders[0].status === 'Delivered' && (
                                                                <div>
                                                                    <IconButton color="success" className="mt-2">
                                                                        <CheckCircleOutlineIcon />
                                                                    </IconButton>
                                                                    <Tag severity="success" className="p-2" rounded>
                                                                        {group.orders[0].status}
                                                                    </Tag>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div >
                                                    <Tag severity="danger" className="mt-1 p-2" rounded>
                                                        <strong className="m-2">Order Amount :</strong>{group.orders.reduce((total, order) => total + order.totalPrice, 0)} Dh
                                                    </Tag>
                                                </div>
                                                {group.orders[0].status === 'Pending' && (
                                                    <div>
                                                        {groupOrdersByCreatedDate().some((group) =>
                                                            group.orders.some((order) => order.status === 'Pending')
                                                        ) && (
                                                            <Button
                                                                 raised severity="danger"
                                                                className="mx-1 p-1"
                                                                label="Cancel"

                                                                onClick={() => {
                                                                    updateStatus(group);
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                        </Fieldset>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {value === 1 && (
                        <div>
                            {/* Display pending orders */}
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
                            {/* Display cancelled orders */}
                            {groupOrdersByCreatedDate().some((group) => group.orders.some((order) => order.status === 'Cancelled'))? (
                            groupOrdersByCreatedDate().map((group) => renderOrderDetails(group, 'Cancelled', updateStatus))
                                ):(

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
                            {/* Display shipped orders */}
                            {groupOrdersByCreatedDate().some((group) => group.orders.some((order) => order.status === 'Shipped'))? (
                                groupOrdersByCreatedDate().map((group) => renderOrderDetails(group, 'Shipped', updateStatus))
                            ):(
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
                            {/* Display delivered orders */}
                            {groupOrdersByCreatedDate().some((group) => group.orders.some((order) => order.status === 'Delivered')) ? (
                                groupOrdersByCreatedDate().map((group) => renderOrderDetails(group, 'Delivered', updateStatus))
                            ):(
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
    );
}
