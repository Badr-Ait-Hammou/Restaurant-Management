import React, {useState} from "react"
import {Grid, Rating, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import { OrderList } from 'primereact/orderlist';
import {format, formatDistanceToNow} from "date-fns";
import {useEffect} from "react";
import {accountService} from "../service/accountService";
import axios from "../service/callerService";
import {DataView} from "primereact/dataview";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
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
                <div className="flex flex-wrap p-1 align-items-center gap-2">
                <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={reservation.restaurant && reservation.restaurant.photo} alt={reservation.restaurant.nom }/>
                    <div className="flex-1 flex flex-column gap-1 xl:mr-8  ">
                        <span className="font-bold text-left" >{reservation.restaurant && reservation.restaurant.nom}</span>
                        <Typography variant="body1" gutterBottom >
                            <div style={{float:"left"}}>
                                <Typography  className="font-monospace" style={{float:"left",fontSize:"12px"}}  >{formatCommentDate(reservation.dateCreated)} <ThumbUpOffAltIcon style={{fontSize:"15px"}}/></Typography>
                                <Typography  className="font-monospace" style={{float:"left",fontSize:"12px"}}  >{formatCommentDate(reservation.reservationDate)} <ThumbUpOffAltIcon style={{fontSize:"15px"}}/></Typography>
                            </div>
                        </Typography>
                        <div className="flex align-items-center ">
                                <Tag   value={reservation.type} severity="danger" icon="pi pi-tag"  />
                        </div>
                    </div>
            </div>
            </div>
        );
    };

    return(
        <div className=" mt-5 mx-2  card">
            <Box sx={{mx:1,mt:3 ,mb:3}} >
                <Grid reservation container  columns={14} className="flex justify-content-between">
                    <Grid reservation xs={12} md={6} >
                        <div >
                            <OrderList value={reservations} onChange={(e) => setReservations(e.value)} itemTemplate={reservationTemplate} header="Reservations" filter filterBy="restaurant.nom" ></OrderList>
                        </div>                    </Grid>
                    <Grid reservation xs={12} md={7}>
                        <div className="card ">
                            <DataView value={reservations} onChange={(e) => setReservations(e.value)} itemTemplate={reservationTemplate} header="Reservations" ></DataView>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>
    )
}