import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Fieldset } from 'primereact/fieldset';
import "../styles/clientreservation.css"
import axios from '../service/callerService';
import React,{useState,useEffect,useReducer} from "react";
import { Card, CardContent } from '@mui/material';
import Modal from "react-modal";
import {useRef} from "react";
import {accountService} from "../service/accountService";
import moment from "moment";
import {confirmDialog, ConfirmDialog} from 'primereact/confirmdialog';




export default function ClientOrders() {
    const [orders, setOrders] = useState([]);
    const [userId, setUserId] = useState("");
    const [alertMessage] = useState("Once you make an order one of our agents will contact you asap");
    const [type, settype] = useState("");
    const toast = useRef(null);

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


    const handleDelete = (reservationId) => {
        const confirmDelete = () => {
            axios.delete(`/api/controller/orders/${reservationId}`).then(() => {
                setOrders(orders.filter((reservation) => reservation.id !== reservationId));
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Reservation canceled successfully', life: 3000 });
            });
        };

        confirmDialog({
            message: 'Are you sure you want to Cancel this Reservation?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
        loadReservations();
    };

    useEffect(() => {
        axios.get(`/api/controller/orders/userorder/${userId}`).then((response) => {
            setOrders(response.data);
        });
    }, [userId]);






    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'item added successfully', life: 1000});
    }

    const loadReservations=async ()=>{
        const res=await  axios.get(`/api/controller/orders/user/${userId}`);
        setOrders(res.data);
    }


    return (



        <div>

            <div className="alert" style={{backgroundColor:"yellow",padding: "10px",fontFamily:"serif"
            }}>
                {alertMessage}
            </div>
            <Card className="mx-3 mt-3 p-3">
                <CardContent >
                    <div style={{ alignItems: "center" }}>
                        <h3 >ORDERS</h3>
                    </div>

                </CardContent>
                <div className="mt-5">
                    {orders.map((orders) => (
                        <div  key={orders.id}>

                            <div className="content" >
                                <Fieldset legend="Order Details"  toggleable>
                                    <p>
                                        <strong className="mt-2 ">You placed an order on :</strong> {moment(orders.dateCreated).format("YYYY-MM-DD  / HH:mm")}<br />
                                        <strong className="mt-2 ">Total amount :</strong>{orders.totalPrice}<br />
                                        <strong className="mt-2 ">Quantity:</strong> {orders.productQuantity}<br />
                                        <strong className="mt-2 ">Your email</strong> {orders.user && orders.user.email}
                                    </p>
                                    <Button label="CANCEL" severity="danger"  className="mx-1"  raised  />

                                </Fieldset>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>


        </div>



    );
}