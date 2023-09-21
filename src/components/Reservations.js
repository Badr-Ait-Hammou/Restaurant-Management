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
import {Toolbar} from "primereact/toolbar";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Tag} from "primereact/tag";
import SkeletonPr from "../skeleton/ProfileSkeleton";
import {InputText} from "primereact/inputtext";




export default function Orders( )  {
    const [reservations, setReservations] = useState([]);
    const toast = useRef(null);
    const dt = useRef(null);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);





    const handleDataTableLoad = () => {
        setDataTableLoaded(true);
    };


    const fetchData = async () => {
        try {
            const result = await axios(`/api/controller/reservations/`);
            setReservations(result.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
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
                <div className="template">
                    <Button className="cancel p-0" aria-label="Slack" onClick={() => handleDelete(rowData.id)}>
                        <i className="pi pi-trash px-2"></i>
                        <span className="px-1">Delete</span>
                    </Button>
                    {/*<Button className="edit p-0" aria-label="Slack" onClick={() => handleupdate(rowData)}>*/}
                    <Button className="edit p-0" aria-label="Slack" >
                        <i className="pi pi-pencil px-2"></i>
                        <span className="px-1">Update</span>
                    </Button>
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









    return (
        <div className="card p-1 mt-5 mx-2">
            <Toast ref={toast} />
            <ConfirmDialog />

            <div className="card">
                <Toolbar className="mb-2 p-1" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                {dataTableLoaded ? (
                    <DataTable ref={dt} value={reservations}
                               dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Products" globalFilter={globalFilter} header={header}>
                        <Column field="id"  header="ID" sortable style={{ minWidth: '5rem' }}></Column>
                        <Column field="user.email"   filter filterPlaceholder="Search Name ..." header="Client" sortable style={{ minWidth: '14rem' }} body={(rowData) => (<div><Tag icon={"pi pi-inbox"} style={{backgroundColor:"rgba(70,175,172,0.91)"}} value={`${rowData.user && rowData.user.email} `}/></div>)}></Column>
                        <Column field="user.telephone"   filter filterPlaceholder="Search Name ..." header="Client Phone" sortable style={{ minWidth: '14rem' }} body={(rowData) => (<div><Tag icon={"pi pi-phone"} style={{backgroundColor:"rgba(235,241,241,0.91)",color:"black"}} value={`${rowData.user && rowData.user.telephone} `}/></div>)}></Column>
                        <Column field="dateCreated" className="font-bold"  filter filterPlaceholder="Search Name ..." header="Submitted at" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="reservationDate" className="font-bold"  filter filterPlaceholder="Search Name ..." header="Reservation Date " sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="restaurant.nom"   filter filterPlaceholder="Search Name ..." header="Restaurant" sortable style={{ minWidth: '14rem' }} body={(rowData) => (<div><Tag style={{backgroundColor:"rgba(70,175,153,0.91)"}} value={`${rowData.restaurant && rowData.restaurant.nom} `}/></div>)}></Column>
                        <Column field="type"   filter filterPlaceholder="Search Name ..." header="Type " sortable style={{ minWidth: '10rem' }}></Column>
                        <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '16rem' }}></Column>
                    </DataTable>
                ):(
                    <SkeletonPr/>
                )}
            </div>
        </div>
    );
};

