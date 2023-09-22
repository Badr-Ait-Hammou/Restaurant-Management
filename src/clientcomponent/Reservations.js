import React, {useState} from "react"
import {Grid, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import { OrderList } from 'primereact/orderlist';
import {format, formatDistanceToNow} from "date-fns";
import {useEffect} from "react";
import {accountService} from "../service/accountService";
import axios from "../service/callerService";
import {DataView} from "primereact/dataview";
import RestaurantIcon from '@mui/icons-material/Restaurant';
import {Tag} from "primereact/tag";
import { Dropdown } from 'primereact/dropdown';
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {useRef} from "react";
import {Dialog} from "primereact/dialog";
import {InputText} from "primereact/inputtext";
import {Link} from "react-router-dom";



export default function Reservations(){
    const [reservations, setReservations] = useState([]);
    const [cancelledeservations, setCancelledReservations] = useState([]);
    const [confirmedreservations, setConfirmedReservations] = useState([]);
    const [reservationsDialog, setReservationsDialog] = useState(false);
    const [userId, setUserId] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [restaurantid, setRestaurantid] = useState("");
    const [reservationDate, setreservationDate] = useState("");
    const [type, settype] = useState("");
    const toast = useRef(null);
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');


    const sortOptions = [
        { label: 'Finished', value: '!status' },
        { label: 'confirmed', value: 'status' }
    ];
    const types = [
        {  id: 1,nom: 'Table for 2' },
        {  id: 2 ,nom: 'Table for 4'},
        {  id: 3 ,nom: 'Table for 6+'},
        {  id: 4 ,nom: 'Private Dining Room'},
        {  id: 6 ,nom: 'Outdoor Seating'},
    ];





    const handleRestaurantChange = (e) => {
        setRestaurantid(e.value);
    };
    const handleTypeChange = (e) => {
        settype(e.value);
    };

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
       loadReservations();
    }, [userId]);


    const loadReservations=async ()=>{
        axios.get(`/api/controller/reservations/user/${userId}`).then((response) => {
            setReservations(response.data);
            const  cancelledRes = response.data.filter((reservation) => reservation.status === 'Cancelled');
            setCancelledReservations(cancelledRes);
            const  confirmedRes = response.data.filter((reservation) => reservation.status === 'Confirmed' || reservation.status=== 'Finished');
            setConfirmedReservations(confirmedRes);

        });

    }

    useEffect(() => {
        axios.get("/api/controller/restaurants/").then((response) => {
            setRestaurants(response.data);
        });
    }, []);

    const Updatestatus = async (reservationToUpdate) => {
        try {
            const newStatus = reservationToUpdate.status === "Cancelled" ? "Confirmed" : "Cancelled";
            await axios.put(`/api/controller/reservations/status/${reservationToUpdate.id}`, {
                status: newStatus,
            });

            const updatedReservation = reservations.map((reservation) =>
                reservation.id === reservationToUpdate.id ? { ...reservation, status: newStatus } : reservation
            );

            setReservations(updatedReservation);
            showupdateStatus();
            loadReservations();
        } catch (error) {
            console.error(error);
        }
    };


    const showupdateStatus = () => {
        toast.current.show({severity:'info', summary: 'done', detail:'reservation status updated ', life: 3000});
    }
    const showSave = () => {
        toast.current.show({severity:'success', summary: 'done', detail:'reservation submitted successfully ', life: 3000});
    }


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

    const handleSubmit = (event) => {
        event?.preventDefault();

        if (!restaurantid || !type || reservationDate.trim() === "") {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
            return;
        }
        const allowedStartTime = new Date();
        allowedStartTime.setHours(9, 0, 0, 0);
        const allowedEndTime = new Date();
        allowedEndTime.setHours(20, 59, 59, 999);
        const selectedReservationDate = new Date(reservationDate);
        const minAdvanceReservationTime = new Date();
        minAdvanceReservationTime.setHours(minAdvanceReservationTime.getHours() + 4);
        if (
            selectedReservationDate < allowedStartTime ||
            selectedReservationDate > allowedEndTime
        ) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Reservations are only allowed between 9:00 AM and 8:59 PM',
                life: 3000,
            });
            return;
        }
        if (selectedReservationDate <= minAdvanceReservationTime) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Reservations must be made at least 4 hours in advance',
                life: 3000,
            });
            return;
        }

        axios
            .post("/api/controller/reservations/", {
                type,
                status: "Confirmed",
                reservationDate,
                restaurant: {
                    id: restaurantid,
                },
                user: {
                    id: userId,
                },
            })
            .then((response) => {
                loadReservations();
                hideDialog();
                showSave();
            })
            .catch((error) => {
                console.error("Error while saving image:", error);
            });
    };

    const updateStatusAutomatically = async (reservation) => {
        if (new Date(reservation.reservationDate) < new Date()) {
            try {
                const newStatus = "Finished"; // Set the desired status
                await axios.put(`/api/controller/reservations/status/${reservation.id}`, {
                    status: newStatus,
                });

                const updatedReservations = confirmedreservations.map((r) =>
                    r.id === reservation.id ? { ...r, status: newStatus } : r
                );
                setConfirmedReservations(updatedReservations);
            } catch (error) {
                console.error("Error updating reservation status:", error);
            }
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            confirmedreservations.forEach((reservation) => {
                updateStatusAutomatically(reservation);
                loadReservations();
            });
        }, 70000);
        return () => {
            clearInterval(intervalId);
        };
    }, [confirmedreservations]);




    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };

    const hideDialog = () => {
        setReservationsDialog(false);
    };


    const openNew = () => {
        setReservations(reservations);
        setRestaurantid("");
        setreservationDate("");
        setReservationsDialog(true);
    };

    const header = () => {
        return (
            <div className="template flex  justify-content-between ">
                <Button className="pay p-0" onClick={openNew} >
                    <i className="pi pi-plus p-1"></i>
                    <span className="px-3  font-bold text-white">Make a reservation</span>
                </Button>
                <Dropdown options={sortOptions} value={sortKey} optionLabel="label" placeholder="Sort By Status" onChange={onSortChange}  />

            </div>
        );
    };


    const ReservationsDialogFooter = (
        <React.Fragment>
            <div className="template flex justify-content-end mt-1">
                <Button className="cancel p-0 " aria-label="Slack" onClick={hideDialog}>
                    <i className="pi pi-times px-2"></i>
                    <span className="px-3">Cancel</span>
                </Button>
                <Button className="edit p-0 " aria-label="Slack" onClick={(e) => handleSubmit(e)} >
                    <i className="pi pi-check px-2"></i>
                    <span className="px-3">Submit</span>
                </Button>
            </div>
        </React.Fragment>
    );

    const confirmedResTemplate = (reservation) => {
        return (
            <div className="col-12">
                <div className="flex flex-row  align-items-center gap-2 p-2 ">
                 <Link to={`/ifoulki_meals/restaurants/${reservation.restaurant && reservation.restaurant.id}`}>
                <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={reservation.restaurant && reservation.restaurant.photo} alt={reservation.restaurant.nom }/>
                 </Link>
                    <div className="flex-1 flex flex-column gap-1  ">
                        <div className="flex justify-content-between">
                            <Tag style={{float:"left",backgroundColor:"rgba(245,241,241,0.89)",color:"black"}} icon={<RestaurantIcon style={{fontSize:"12px",marginRight:'3px'}}/>}  >{reservation.restaurant && reservation.restaurant.nom}</Tag>
                            <div className="flex align-items-center mr-2 ">
                                {reservation.status === "Finished" ? (
                                    <Tag value={reservation.status} severity="warning" className="justify-content-end px-3" icon="pi pi-exclamation-triangle" />
                                ) : (
                                    <Tag value={reservation.status} style={{backgroundColor:"rgb(200,61,129)"}} className="justify-content-end px-2"  icon="pi pi-check-square" />
                                )}
                            </div>
                        </div>
                        <Typography variant="body1" gutterBottom >
                            <div style={{float:"left"}}>
                                <Tag icon={"pi pi-clock"} className="font-monospace mb-1" style={{float:"left",fontSize:"10px",backgroundColor:"rgba(245,241,241,0.89)",color:"black"}}  >Reservation submitted on: {formatCommentDate(reservation.dateCreated)} </Tag><br/>
                                <Tag icon={"pi pi-calendar-plus"}  className="font-monospace" style={{float:"left",fontSize:"10px",backgroundColor:"rgba(245,241,241,0.89)",color:"black"}}  >Reservation date: {formatCommentDate(reservation.reservationDate)} </Tag>
                            </div>
                        </Typography>

                        <div className=" template flex justify-content-between">
                            <Tag value={`Type :${reservation.type}`} style={{backgroundColor:"rgba(245,241,241,0.89)",color:"black"}} icon="pi pi-home" className="-mt-2 "   />
                            <div>
                                {reservation.status ==="Confirmed" ?(
                                    <Button className="export p-0 " aria-label="Slack" onClick={() => Updatestatus(reservation)} >
                                        <i className="pi pi-times px-2"></i>
                                        <span className="px-2">Cancel</span>
                                    </Button>
                                ):(
                                  ""
                                )}

                            </div>
                        </div>


                    </div>
                </div>
            </div>
        );
    };


    const reservationTemplate = (reservation) => {
        return (
            <div className="col-12">
                <div className="flex flex-row  align-items-center gap-2 -m-3 ">
                    <Link to={`/ifoulki_meals/restaurants/${reservation.restaurant && reservation.restaurant.id}`}>
                    <img className="w-4rem shadow-2 flex-shrink-0 border-round" src={reservation.restaurant && reservation.restaurant.photo} alt={reservation.restaurant.nom }/>
                    </Link>
                        <div className="flex-1 flex flex-column gap-1  ">
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
                            <Tag  value={reservation.type} style={{backgroundColor:"rgba(245,241,241,0.89)",color:"black"}} icon="pi pi-home"  />
                        </div>

                    </div>
            </div>
            </div>
        );
    };

    return(
        <>
        <div className=" mt-5 mx-2  card">
            <Toast ref={toast} />

            <Box sx={{mx:1,mt:2 ,mb:3}} >
                <Grid reservation container spacing={2} columns={14} className="flex justify-content-between">
                    <Grid item reservation sm={14} lg={5} xs={14} md={6}  className="justify-content-start" >
                        <div >
                            <OrderList
                                value={cancelledeservations}
                                onChange={(e) => setReservations(e.value)}
                                itemTemplate={reservationTemplate}
                                header="Cancelled Reservations"
                                filter
                                filterIcon={"pi pi-search"}
                                filterBy="restaurant.nom"
                                filterPlaceholder={"Enter a filter..."}
                            />
                        </div>
                    </Grid>
                    <Grid item sm={14} lg={9} xs={14} md={8}  className="justify-content-end ">
                        <div className="card">
                            <DataView
                                value={confirmedreservations}
                                itemTemplate={confirmedResTemplate}
                                header={header()}
                                sortField={sortField}
                                sortOrder={sortOrder}
                                paginator
                                rows={3}
                            />
                        </div>
                    </Grid>
                </Grid>
            </Box>
        </div>



            <Dialog visible={reservationsDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Make a reservation" modal className="p-fluid" footer={ReservationsDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2} columns={12} mt={1} >
                    <Grid item xs={6} className="-mt-2" >
                        <Box className="field">
                            <label htmlFor="reservationDate">Reservation Day :</label>
                                <InputText type={"datetime-local"}  value={reservationDate} onChange={(e) => setreservationDate(e.target.value)}  />

                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-2" >
                        <Box className="field">
                            <span className="p-float-label">
                            <Dropdown inputId="dropdown" value={restaurantid}  options={restaurants.map((restaurant) => ({ label: restaurant.nom, value: restaurant.id }))}
                                      onChange={handleRestaurantChange} />
                            <label htmlFor="restaurantid">Restaurant</label>
                        </span>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={12} className="-mt-3">
                        <Box className="field">
                            <span className="p-float-label">
                            <Dropdown inputId="dropdown" value={type}  options={types.map((type) => ({ label: type.nom, value: type.nom }))}
                                      onChange={handleTypeChange} />
                            <label htmlFor="type">Type</label>
                        </span>
                        </Box>
                    </Grid>


                </Grid>


            </Dialog>

        </>
    )
}