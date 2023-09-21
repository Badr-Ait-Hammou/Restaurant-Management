import React, {useState} from "react"
import {Grid, Rating, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import { OrderList } from 'primereact/orderlist';
import {format, formatDistanceToNow} from "date-fns";
import {useEffect} from "react";
import {accountService} from "../service/accountService";
import axios from "../service/callerService";
import {DataView} from "primereact/dataview";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {Tag} from "primereact/tag";


export default function Reservations(){
    const [reservations, setReservations] = useState([]);
    const [userId, setUserId] = useState("");






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

    useEffect(() => {
        axios.get(`/api/controller/reservations/user/${userId}`).then((response) => {
            setReservations(response.data);
        });
    }, [userId]);

    function formatCommentDate(commentDate) {
        const now = new Date();
        const dateCreatedTime = new Date(commentDate);
        const timeDifference = now - dateCreatedTime;

        if (timeDifference < 3600000) {
            return formatDistanceToNow(dateCreatedTime, { addSuffix: true });
        } else {
            return format(dateCreatedTime, 'EEEE, dd-MM-yyyy HH:mm');
        }
    }

    const reservationTemplate = (reservation) => {
        return (
            <div className="col-12">
                <div className="flex flex-wrap  align-items-center gap-2 -m-3">
                <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={reservation.restaurant && reservation.restaurant.photo} alt={reservation.restaurant.nom }/>
                    <div className="flex-1 flex flex-column gap-1 xl:mr-8  ">
                        <div className="flex justify-content-between">
                            <Tag style={{float:"left",backgroundColor:"rgba(245,241,241,0.89)",color:"black"}} icon={<RestaurantIcon style={{fontSize:"12px",marginRight:'3px'}}/>}  >{reservation.restaurant && reservation.restaurant.nom}</Tag>
                            <div className="flex align-items-center ">
                                {reservation.status === "Cancelled"?(
                                    <Tag  value={reservation.status} severity="danger" icon="pi pi-exclamation-circle"  />
                                ):(
                                    <Tag  value={reservation.status} severity="success" icon="pi pi-check-square"  />
                                )}
                            </div>
                        </div>
                        <Typography variant="body1" gutterBottom >
                            <div style={{float:"left"}}>
                                <Tag icon={"pi pi-clock"} className="font-monospace mb-1" style={{float:"left",fontSize:"10px",backgroundColor:"rgba(245,241,241,0.89)",color:"black"}}  >{formatCommentDate(reservation.dateCreated)} </Tag>
                                <Tag icon={"pi pi-calendar-plus"}  className="font-monospace" style={{float:"left",fontSize:"10px",backgroundColor:"rgba(245,241,241,0.89)",color:"black"}}  >{formatCommentDate(reservation.reservationDate)} </Tag>
                            </div>
                        </Typography>
                        <div className="flex align-items-center ">
                            <Tag  value={reservation.type} style={{backgroundColor:"rgba(56,141,152,0.93)"}} icon="pi pi-home"  />
                        </div>

                    </div>
            </div>
            </div>
        );
    };

    return(
        <div className=" mt-5 mx-2  card">
            <Box sx={{mx:1,mt:2 ,mb:3}} >
                <Grid reservation container  columns={14} className="flex justify-content-between">
                    <Grid item reservation sm={14} lg={6} xs={14} md={6}  className="justify-content-start" >
                        <div >
                            <OrderList value={reservations} onChange={(e) => setReservations(e.value)} itemTemplate={reservationTemplate} header="Reservations" filter filterBy="restaurant.nom"  ></OrderList>
                        </div>
                    </Grid>
                    <Grid item sm={14} lg={7} xs={14} md={7}  className="justify-content-end">
                        <div className="card ">
                            <DataView value={reservations} onChange={(e) => setReservations(e.value)} itemTemplate={reservationTemplate} header="Reservations" ></DataView>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}