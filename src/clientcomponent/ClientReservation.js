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




export default function ClientReservation() {
    const [Restaurants, setRestaurants] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [restaurantid, setRestaurantid] = useState("");
    const [reservationDate, setreservationDate] = useState("");
    const [userId, setUserId] = useState("");
    const [alertMessage] = useState("Once you make a reservation one of our agents will contact you asap");

    const [type, settype] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
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
            axios.delete(`/api/controller/reservations/${reservationId}`).then(() => {
                setReservations(reservations.filter((reservation) => reservation.id !== reservationId));
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
        axios.get(`/api/controller/reservations/user/${userId}`).then((response) => {
            setReservations(response.data);
        });
    }, [userId]);

    useEffect(() => {
        axios.get("/api/controller/restaurants/").then((response) => {
            setRestaurants(response.data);
        });
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();

        // Get the current date and time
        const currentDate = new Date();

        // Convert the reservation date to a Date object
        const reservationDateObj = new Date(reservationDate);

        // Set the start and end times for the restricted period (11:00 PM to 9:00 AM)
        const restrictedStartTime = new Date();
        restrictedStartTime.setHours(23, 0, 0, 0); // Set to 11:00 PM
        const restrictedEndTime = new Date();
        restrictedEndTime.setHours(9, 0, 0, 0); // Set to 09:00 AM

        // Check if the reservation date and time fall within the restricted period
        if (
            currentDate > reservationDateObj ||
            (reservationDateObj >= restrictedStartTime && reservationDateObj <= restrictedEndTime)
        ) {
            // Display an error pop-up or handle the error in any other way
            alert("Reservation date cannot be in the past or between 11:00 PM and 9:00 AM");
            return; // Stop further execution
        }

        axios
            .post("/api/controller/reservations/", {
                type,
                reservationDate,
                restaurant: {
                    id: restaurantid,
                },
                user: {
                    id: userId,
                },
            })
            .then((response) => {
                setreservationDate("");
                settype("");
                setRestaurantid("");
                setModalIsOpen(false);
                showSuccess();
                loadReservations();

                const newReservation = response.data;
                setReservations((prevReservations) => [...prevReservations, newReservation]);
            });
    };



    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'item added successfully', life: 1000});
    }

    const loadReservations=async ()=>{
        const res=await  axios.get(`/api/controller/reservations/user/${userId}`);
        setReservations(res.data);
    }




    const handleOpenModal = () => {
        setModalIsOpen(true);
        //setSelectedRestaurant(restaurant);
        // setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false)
    };
    return (



        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="alert" style={{backgroundColor:"yellow",padding: "10px",fontFamily:"serif"
                }}>
                {alertMessage}
            </div>
            <Card className="mx-3 mt-3 p-3">
                <CardContent >
                    <div style={{ alignItems: "center" }}>
                        <h3 >RESERVATION</h3>
                    </div>
                    <div >
                        <Toast ref={toast} position="top-center" />

                        <Button
                            label="Add"
                            style={{backgroundColor:"lightseagreen"}}
                            raised
                            className="mx-2"
                            onClick={() => handleOpenModal()}

                        />

                    </div>


                </CardContent>
                {/*<ProduitTable key={tableKey} />*/}
                <div className="mt-5">
                    {reservations.map((reservation) => (
                        <div  key={reservation.id}>

                            <div className="content" >
                                <Fieldset legend="Reservation Details"  toggleable>
                                    <p>
                                        <strong className="mt-2 ">You made a reservation on :</strong> {moment(reservation.dateCreated).format("YYYY-MM-DD  / HH:mm")}<br />
                                        <strong className="mt-2 ">Reservation Date:</strong> {moment(reservation.reservationDate).format("YYYY-MM-DD  / HH:mm")}<br />
                                        <strong className="mt-2 ">Type:</strong> {reservation.type}<br />
                                        <strong className="mt-2 ">Restaurant</strong> {reservation.restaurant && reservation.restaurant.nom}
                                    </p>
                                    <Button label="CANCEL" severity="danger"  className="mx-1"  raised  onClick={() => handleDelete(reservation.id)}/>

                                </Fieldset>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

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
                    <div className="card-body" >
                        <h5 className="card-title" id="modal-modal-title">MAKE A RESERVATION</h5>
                        <form>


                            <div className="row mb-3">


                                <div className="mb-3">
                                    <label htmlFor="produit-reservationDate" className="form-label">Reservation Date:</label>
                                    <input type="datetime-local" className="form-control" id="user-password"  value={reservationDate}
                                           onChange={(event) => setreservationDate(event.target.value)} />
                                </div>




                                {/*   <div className="mb-3">
                                    <label htmlFor="produit-type" className="form-label">Price:</label>
                                    <input type="text" className="form-control" id="user-password" value={type}
                                           onChange={(event) => settype(event.target.value)} />
                                </div>
*/}
                                <div className="mb-3">
                                    <label htmlFor="produit-type" className="form-label">Reservation Type:</label>
                                    <select
                                        className="form-control"
                                        id="user-type"
                                        value={type}
                                        onChange={(event) => settype(event.target.value)}
                                    >
                                        <option value="">Select a reservation type</option>
                                        <option value="Table for 2">Table for 2</option>
                                        <option value="Table for 4+">Table for 4+</option>
                                        <option value="Private Dining Room">Private Dining Room</option>
                                        <option value="Outdoor Seating">Outdoor Seating</option>

                                        {/* Add more options for reservation types */}
                                    </select>
                                </div>


                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="produit-restaurant" className="form-label">Restaurant:</label>
                                        <select
                                            className="form-control"
                                            id="cityId"
                                            value={restaurantid}
                                            onChange={(event) => setRestaurantid(event.target.value)}
                                            style={{
                                                backgroundColor: "#f2f2f2",
                                                border: "none",
                                                borderRadius: "4px",
                                                color: "#555",
                                                fontSize: "16px",
                                                padding: "8px 12px",
                                                width: "100%",
                                                marginBottom: "12px"
                                            }}
                                        >   <option value="">Select a restaurant </option>
                                            {Restaurants && Restaurants.map((restaurant) => (
                                                <option key={restaurant.id} value={restaurant.id}>
                                                    {restaurant.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </form>
                        <div className="d-flex justify-content-center mt-3">
                            <Button  label="Cancel"
                                     severity="warning"
                                     raised
                                     className="mx-2"
                                     onClick={handleCloseModal}/>

                            <Button  label="Save"
                                     severity="success"
                                     raised

                                     onClick={(e) => handleSubmit(e)}/>
                        </div>
                    </div>
                </div>

            </Modal>
        </div>



    );
}