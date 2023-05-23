import axios from  '../service/callerService';
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'primereact/button';
import ReactPaginate from "react-paginate";
import"../styles/login.css"
import { Card, CardContent } from '@mui/material';
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import { Toast } from 'primereact/toast';
import {useRef} from "react";




export default function Orders( )  {
    const [reservations, setReservations] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);

    const itemsPerPage = 4;
    const offset = pageNumber * itemsPerPage;
    const currentPageItems = reservations.slice(offset, offset + itemsPerPage);
    const toast = useRef(null);





    useEffect(() => {
        const fetchreservations = async () => {
            const result = await axios(`/api/controller/reservations/`);
            setReservations(result.data);
        };
        fetchreservations();
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
    };












    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Card className="mx-3 mt-3 p-3">
                <CardContent >
                    <div style={{ alignItems: "center" }}>
                        <h3 >RESERVATIONS</h3>
                    </div>
                    <div>
                        <div className="table-responsive">
                            <table className="table mt-5 text-center">
                                <thead>
                                <tr>
                                    <th>RESERVATION ID</th>
                                    <th>DATE CREATED</th>
                                    <th>RESERVATION DATE</th>
                                    <th>RESTAURANT</th>
                                    <th>TYPE</th>
                                    <th>USER</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {currentPageItems.map((reservation) => (
                                    <tr key={reservation.id}>
                                        <td>{reservation.id}</td>
                                        <td>{reservation.dateCreated}</td>
                                        <td>{reservation.reservationDate}</td>
                                        <td>{reservation.restaurant && reservation.restaurant.nom}</td>
                                        <td>{reservation.type} DH</td>
                                        <td>{reservation.user && reservation.user.email}</td>
                                        <td>
                                            <Button label="CANCEL" severity="danger"  className="mx-1"  text raised onClick={() => handleDelete(reservation.id)}/>

                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <div className="pagination-container">
                                <ReactPaginate
                                    previousLabel={<button className="pagination-button">&lt;</button>}
                                    nextLabel={<button className="pagination-button">&gt;</button>}
                                    pageCount={Math.ceil(reservations.length / itemsPerPage)}
                                    onPageChange={({ selected }) => setPageNumber(selected)}
                                    containerClassName={"pagination"}
                                    previousLinkClassName={"pagination__link"}
                                    nextLinkClassName={"pagination__link"}
                                    disabledClassName={"pagination__link--disabled"}
                                    activeClassName={"pagination__link--active"}
                                />
                            </div>

                        </div>

                    </div>
                </CardContent></Card></div>
    );
};

