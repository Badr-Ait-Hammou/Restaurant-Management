import axios from  '../service/callerService';
import React, { useState, useEffect } from "react";
import { Button } from 'primereact/button';
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import { Toast } from 'primereact/toast';
import {useRef} from "react";
import {Toolbar} from "primereact/toolbar";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Tag} from "primereact/tag";
import {InputText} from "primereact/inputtext";
import {format, formatDistanceToNow} from "date-fns";
import DatatableSkeleton from "../skeleton/DatatableSkeleton";







export default function Orders( )  {
    const [reservations, setReservations] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCancelled, setIsCancelled] = useState(false);







    const handleDataTableLoad = () => {
        setLoading(false);
    };


    const loadReservations=async ()=>{
        const result = await axios(`/api/controller/reservations/`);
        setReservations(result.data);

    }










    useEffect(() => {
        loadReservations();
        handleDataTableLoad();
    }, []);


    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`/api/controller/reservations/${id}`)
                .then(() => {
                    setReservations(reservations.filter((rowData) => rowData.id !== id));
                    toast.current.show({severity:'success', summary: 'Done', detail:'Reservation deleted successfully', life: 3000});
                })
                .catch((error) => {
                    console.error('Error deleting Restaurant:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'failed to delete Reservation', life: 3000});
                });
        };

        confirmDialog({
            message: 'Are you sure you want to Delete this Reservation ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const handleUpdatestatus = async (reservationToUpdate) => {
        try {
            const newStatus = reservationToUpdate.status === "Cancelled" ? "Confirmed" : "Cancelled";
            // const response = await axios.put(`/api/controller/reservations/status/${reservationToUpdate.id}`, {
             await axios.put(`/api/controller/reservations/status/${reservationToUpdate.id}`, {
                status: newStatus,
            });

            const updatedReservation = reservations.map((reservation) =>
                reservation.id === reservationToUpdate.id ? { ...reservation, status: newStatus } : reservation
            );

            setReservations(updatedReservation);
            showupdateStatus();
        } catch (error) {
            console.error(error);
        }
    };



    const showupdateStatus = () => {
        toast.current.show({severity:'info', summary: 'success', detail:'reservation status updated ', life: 3000});
    }



    const leftToolbarTemplate = () => {
        return (
            <div className="template flex flex-wrap gap-2">
                <Button className="pay p-0"  >
                    <i className="pi pi-plus px-2"></i>
                    <span className="px-3  font-bold text-white">Add</span>
                </Button>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return(
            <div className="template ">
                <Button className="export p-0"   onClick={exportCSV}>
                    <i className="pi pi-upload px-2"></i>
                    <span className="px-3  font-bold text-white">Export</span>
                </Button>
            </div>
        );
    };
    const centerToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between ">
            <h4 className="m-0 font-monospace">Manage Reservations</h4>
        </div>;
    };


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <div className="template flex justify-content-end">
                    <Button className="cancel p-0" aria-label="Slack" onClick={() => handleDelete(rowData.id)}>
                        <i className="pi pi-trash px-2"></i>
                        <span className="px-1">Delete</span>
                    </Button>
                    {rowData.status ==="Cancelled" ? (
                        <Button className="add p-0" aria-label="Slack" onClick={() => handleUpdatestatus(rowData)}>
                            <i className="pi pi-undo px-2"></i>
                            <span className="px-1">Confirm</span>
                        </Button>
                    ) : (
                        <Button className="edit p-0" aria-label="Slack" onClick={() => handleUpdatestatus(rowData)}>
                            <i className="pi pi-times px-2"></i>
                            <span className="px-2">Cancel</span>
                        </Button>
                    )}
                </div>
            </React.Fragment>
        );
    };

    const header = (
        <div className="flex flex-wrap  align-items-center justify-content-between -m-3" >
    <span className="p-input-icon-left p-1 "  >
      <i className="pi pi-search " />
      <InputText
          style={{width:"100%",height:"0px"}}

          type="search"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
      />
    </span>
        </div>
    );



    function formatReservationDate(dateCreated) {
        const now = new Date();
        const dateCreatedTime = new Date(dateCreated);
        const timeDifference = now - dateCreatedTime;

        if (timeDifference < 3600000) {
            return formatDistanceToNow(dateCreatedTime, { addSuffix: true });
        } else {
            return format(dateCreatedTime, 'EEEE, dd-MM-yyyy HH:mm');
        }
    }


    if(loading ||reservations.length ===0){
        return(

            <DatatableSkeleton/>

        )
    }

    return (
        <>
        <div className="card p-1 mt-5 mx-2">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">
                <Toolbar className="mb-2 p-1" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                    <DataTable ref={dt} value={reservations}
                               dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Reservations" globalFilter={globalFilter} header={header}>
                        <Column field="id"  header="ID" sortable style={{ minWidth: '5rem' }}></Column>
                        <Column field="user.email"   filter filterPlaceholder="Search Name ..." header="Client" sortable style={{ minWidth: '14rem' }} body={(rowData) => (<div><Tag icon={"pi pi-inbox"} style={{backgroundColor:"rgba(70,175,172,0.91)"}} value={`${rowData.user && rowData.user.email} `}/></div>)}></Column>
                        <Column field="user.telephone"   filter filterPlaceholder="Search Name ..." header="Client Phone" sortable style={{ minWidth: '14rem' }} body={(rowData) => (<div><Tag icon={"pi pi-phone"} style={{backgroundColor:"rgba(235,241,241,0.91)",color:"black"}} value={`${rowData.user && rowData.user.telephone} `}/></div>)}></Column>
                        <Column field="dateCreated" className="font-bold"  filter filterPlaceholder="Search Name ..." header="Submitted at" sortable style={{ minWidth: '15rem' }} body={(rowData) => (<div><Tag icon={"pi pi-inbox"} style={{backgroundColor:"rgba(235,241,241,0.91)",color:"black"}}>{formatReservationDate(rowData.dateCreated)}</Tag></div>)}></Column>
                        <Column field="reservationDate" className="font-bold"  filter filterPlaceholder="Search Name ..." header="Reservation Date" sortable style={{ minWidth: '15rem' }} body={(rowData) => (<div><Tag icon={"pi pi-inbox"} style={{backgroundColor:"rgba(235,241,241,0.91)",color:"black"}}>{formatReservationDate(rowData.reservationDate)}</Tag></div>)}></Column>
                        <Column field="restaurant.nom"   filter filterPlaceholder="Search Name ..." header="Restaurant" sortable style={{ minWidth: '14rem' }} body={(rowData) => (<div><Tag style={{backgroundColor:"rgba(235,241,241,0.91)",color:"black"}} value={`${rowData.restaurant && rowData.restaurant.nom} `}/></div>)}></Column>
                        <Column field="type"   filter filterPlaceholder="Search Name ..." header="Type " sortable style={{ minWidth: '10rem' }} body={(rowData) => (<div><Tag style={{backgroundColor:"rgba(235,241,241,0.91)",color:"black"}} value={rowData.type}/></div>)}></Column>
                        <Column field="status"   filter filterPlaceholder="Search Name ..." header="status " sortable style={{ minWidth: '10rem' }} body={(rowData) => (
                            <div>
                                {rowData.status ==="Cancelled" ? (
                                    <Tag style={{backgroundColor:"rgba(255,0,0,0.82)"}} value={rowData.status}/>
                                ) : (
                                    <Tag style={{backgroundColor:"rgba(45,154,141,0.82)"}} value={rowData.status}/>
                                )}
                            </div>
                        )}></Column>
                        <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '16rem' }}></Column>
                    </DataTable>
            </div>
        </div>
            </>
    );
};

