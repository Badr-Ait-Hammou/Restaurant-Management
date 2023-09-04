import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import "../styles/clientreservation.css";
import axios from '../service/callerService';
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from '@mui/material';
import { accountService } from "../service/accountService";
import moment from "moment";
import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog';
import {Toast} from "primereact/toast";
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import {Tag} from "primereact/tag";


export default function ClientOrders() {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState("");
    const [alertMessage] = useState("Once you make an order one of our agents will contact you asap");
    const [updatedStatus, setUpdatedStatus] = useState(""); // Added state for updated status


    const toast = useRef(null);

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
                status: 'Delivered'
            });
        });

        Promise.all(updatePromises)
            .then(() => {
                setUpdatedStatus('Delivered');
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
                    {groupOrdersByCreatedDate().map((group, index) => (
                        <div key={index} className="order-group">
                            <div className="content mt-5">
                                <Fieldset legend={`Order Details (${group.createdDate})`} toggleable>
                                    {group.orders.map((order, orderIndex) => (
                                        <div key={order.id} className="order-item ">
                                            {orderIndex > 0 &&  <Divider  component="" className="m-2" />}
                                            <Grid container alignItems="center ">
                                                <Grid item xs={4} className="left">
                                                    <img src={order.produit.photo} alt={order.produit.nom} style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        borderRadius: '8px'
                                                    }} />
                                                </Grid>
                                                <Grid item xs={4} className="right">
                                                    <p>
                                                        <strong className="mt-2 mx-2">Product :</strong> {order.produit.nom}<br />
                                                        <strong className="mt-2 mx-2">Restaurant :</strong> {order.produit.restaurant.nom} <br />
                                                        <strong className="mt-2 mx-2">Price :</strong> {order.produit.prix} Dh<br />
                                                    </p>
                                                </Grid> <Grid item xs={4} className="right">
                                                <p>
                                                    <strong className="mt-2 mx-2">Total amount:</strong> {order.totalPrice} Dh<br />
                                                    <strong className="mt-2 mx-2">Quantity:</strong> {order.productQuantity} Pcs<br />
                                                </p>
                                            </Grid>
                                            </Grid>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-end">
                                        <div>
                                            <Tag className="m-3"
                                                 severity={
                                                     group.orders[0].status === "Pending"
                                                         ? "warning"
                                                         : group.orders[0].status === "Cancelled"
                                                             ? "error"
                                                             : group.orders[0].status === "Confirmed"
                                                                 ? "info"
                                                                 : group.orders[0].status === "Delivered"
                                                                     ? "success"
                                                                     : "secondary" // Default to "info" if none of the above conditions match
                                                 }
                                                 rounded
                                            >
                                                {group.orders[0].status}
                                            </Tag>
                                        </div>
                                        <div className="mt-3">
                                            <strong>Order Amount :</strong>{" "}
                                            {group.orders.reduce((total, order) => total + order.totalPrice, 0)} Dh
                                        </div>
                                        <Button
                                            label="CANCEL"
                                            severity="danger"
                                            className="mx-3"
                                            raised
                                            onClick={() => handleDelete(group.orders.map(order => order.id))}
                                        />
                                        <Button
                                            label="UPDATE"
                                            severity="info"
                                            className="mx-3"
                                            onClick={() => {
                                                console.log('Calling updateStatus with groups:', group.orders);
                                                updateStatus(group);
                                            }}
                                        />
                                    </div>
                                </Fieldset>
                            </div>

                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}