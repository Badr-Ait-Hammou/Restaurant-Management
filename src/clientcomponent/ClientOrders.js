import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import "../styles/clientreservation.css";
import axios from '../service/callerService';
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from '@mui/material';
import { accountService } from "../service/accountService";
import moment from "moment";
import { confirmDialog } from 'primereact/confirmdialog';

export default function ClientOrders() {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState("");
    const [alertMessage] = useState("Once you make an order one of our agents will contact you asap");

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
                // Filter out the deleted orders
                const updatedOrders = orders.filter((order) => !reservationIds.includes(order.id));
                setOrders(updatedOrders);
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Reservations canceled successfully',
                    life: 3000
                });
            });
        };

        confirmDialog({
            message: 'Are you sure you want to Cancel these Reservations?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
    };

    useEffect(() => {
        axios.get(`/api/controller/orders/userorder/${userId}`).then((response) => {
            setOrders(response.data);
        });
    }, [userId]);

    const loadReservations = async () => {
        const res = await axios.get(`/api/controller/orders/user/${userId}`);
        setOrders(res.data);
    }

    const groupOrdersByCreatedDate = () => {
        const grouped = [];
        let currentGroup = null;
        for (const order of orders) {
            const createdDate = moment(order.dateCreated);
            if (!currentGroup || createdDate.diff(moment(currentGroup.createdDate), 'seconds') > 60) {
                currentGroup = { createdDate: createdDate.format("YYYY-MM-DD HH:mm"), orders: [] };
                grouped.push(currentGroup);
            }
            currentGroup.orders.push(order);
        }
        return grouped;
    };

    return (
        <div>
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
                        <div key={index}>
                            <div className="content mt-5">
                                <Fieldset legend={`Order Details (${group.createdDate})`} toggleable>
                                    {group.orders.map((order) => (
                                        <div key={order.id} className="d-flex"
                                             style={{ alignItems: "center", justifyContent: "center" }}>
                                            <img src={order.produit.photo} alt={order.produit.nom} style={{
                                                width: '100px',
                                                height: '100px',
                                                marginRight: '30px',
                                                marginTop: "2px"
                                            }} />
                                            <p>
                                                <strong className="mt-2 mx-2 ">Total amount
                                                    :</strong>{order.totalPrice}<br />
                                                <strong
                                                    className="mt-2 mx-2 ">Quantity:</strong> {order.productQuantity}<br />
                                            </p>
                                        </div>
                                    ))}
                                    <div className="d-flex justify-content-center">
                                        <Button label="CANCEL" severity="danger" className="mx-1"
                                                raised onClick={() => handleDelete(group.orders.map(order => order.id))} />
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
