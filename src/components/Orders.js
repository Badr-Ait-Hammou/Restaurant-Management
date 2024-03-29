import axios from  '../service/callerService';
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'primereact/button';
import Tooltip from '@mui/material/Tooltip';
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import MainCard from "../ui-component/MainCard";
import moment from "moment";
import { Tag } from 'primereact/tag';
import { SpeedDial } from 'primereact/speeddial';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RailwayAlertRoundedIcon from '@mui/icons-material/RailwayAlertRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingRoundedIcon from '@mui/icons-material/PendingRounded';
import IconButton from "@mui/material/IconButton";
import {Fade} from "@mui/material";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DatatableSkeleton from "../skeleton/DatatableSkeleton";




export default function Orders( )  {
    const [orders, setOrders] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [loading, setLoading] = useState(true);


    const items = [
        {
            label: 'Delivered',
            icon: <CheckCircleOutlineIcon />,
            command: (event) => {
                const rowData = event.data;
                updateStatus('Delivered', rowData);
            },
        },
        {
            label: 'Cancelled',
            icon: <RailwayAlertRoundedIcon />,
            command: (event) => {
                const rowData = event.data;
                updateStatus('Cancelled', rowData);
            },
        },

        {
            label: 'Shipped',
            icon: <LocalShippingIcon />,
            command: (event) => {
                const rowData = event.data;
                updateStatus('Shipped', rowData);
            },
        },
        {
            label: 'Pending',
            icon: <PendingRoundedIcon />,
            command: (event) => {
                const rowData = event.data;
                updateStatus('Pending', rowData);
            },
        },
    ];



    useEffect(() => {
       loadOrders();
    }, []);


    const loadOrders = () => {
        axios.get(`/api/controller/orders/`).then((response) => {
            setOrders(response.data);
            setLoading(false);
        });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );



    const updateStatus = (action, rowData) => {

        const validOrders = rowData.orders.filter(order => order.status !== null);
        if (validOrders.length === 0) {
            console.error("No valid orders to update.");
            return;
        }
        console.log("updateStatus called with action:", action);
        console.log("rowData:", rowData);

        const updatePromises = validOrders.map((order) => {
            return axios.put(`/api/controller/orders/status/${order.id}`, {
                status: action,
            });
        });

        Promise.all(updatePromises)
            .then(() => {
                loadOrders();
                toast.current.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Status updated successfully',
                    life: 3000,
                });
            })
            .catch((error) => {
                console.error('Error updating status:', error);
            });
    };

    const actionBodyTemplate = (rowData) => {
        const currentStatus = rowData.orders[0].status;

        const filteredItems = items.filter((item) => item.label !== currentStatus);

        return (
            <React.Fragment>
                <div style={{ position: 'relative', height: '90px' }}>
                    <Toast ref={toast} />
                    <SpeedDial
                        model={filteredItems.map((item) => ({
                            ...item,
                            command: () => {
                                if (item.command) {
                                    item.command({ data: rowData });
                                }
                            },
                        }))}
                        radius={70}
                        type="semi-circle"
                        direction="up"
                        style={{ left: 'calc(50% - 2rem)', bottom: 6, transform: 'scale(0.7)' }}
                    />

                </div>
                <div style={{ display: 'flex', justifyContent: 'center',alignItems:"center", marginTop: '10px' }}>
                    <Button severity="danger" label={<DeleteRoundedIcon/>} onClick={()=>{handleDelete(rowData)}}  />
                </div>
            </React.Fragment>
        );
    };




    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New" icon="pi pi-plus" severity="success" />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px', justifyContent: 'center' }}>

                {rowData.orders.map((order, index) => (
                    <div key={`${order.produit.id}_${index}`}>
                         <Tooltip   TransitionComponent={Fade}
                                    TransitionProps={{ timeout: 600 }}
                                    placement="top"
                                    title={<div style={{ display: 'flex', alignItems: 'center' ,gap:5 }}>
                                        <img
                                    src={order.produit.photo}
                                    alt={order.produit.nom}
                                    className="shadow-cyan-200 border-round"
                                    style={{ width: '40px', borderRadius: '8px' }}
                                        />
                                        <div>
                                <p className="mt-2">{order.produit.nom}</p>
                                <p>{order.produit.prix} Dh x {order.productQuantity} Pcs : {order.totalPrice} Dh</p>
                                 </div>
                            </div>
                        }>
                            <img
                                src={order.produit.photo}
                                alt={order.produit.nom}
                                className="shadow-cyan-200 border-round"
                                style={{ width: '60px', borderRadius: '8px' }}
                            />
                        </Tooltip>

                    </div>
                ))}
            </div>
        );
    };


    const handleDelete = (rowData) => {
        const confirmDelete = () => {
            const orderIdsToDelete = rowData.orders.map((order) => order.id);

            const promises = orderIdsToDelete.map((orderId) => {
                return axios.delete(`/api/controller/orders/${orderId}`);
            });

            Promise.all(promises)
                .then(() => {
                    const updatedOrders = orders.filter(
                        (order) => !orderIdsToDelete.includes(order.id)
                    );
                    setOrders(updatedOrders);
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Orders canceled successfully',
                        life: 3000,
                    });
                })
                .catch((error) => {
                    console.error('Error deleting orders:', error);
                });
        };

        confirmDialog({
            message: 'Are you sure you want to delete these orders?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete,
        });
    };


    const groupOrdersByUserAndTime = () => {
        const grouped = [];
        let currentGroup = null;

        for (const order of orders) {
            const createdDate = moment(order.dateCreated);
            if (!currentGroup || createdDate.diff(moment(currentGroup.createdDate), 'seconds') > 2) {
                currentGroup = { createdDate: createdDate.format("YYYY-MM-DD HH:mm:ss"), orders: [] };
                grouped.push(currentGroup);
            }
            currentGroup.orders.push(order);
        }

        return grouped;
    };


    if(loading || orders.length=== 0){
        return(
            <DatatableSkeleton/>
        )
    }


    return (
        <MainCard sx={{ margin: '20px' }}>
            <Toast ref={toast}/>
            <ConfirmDialog/>
            <div>
                <Toast ref={toast} />
                <div className="card">
                    <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={groupOrdersByUserAndTime()}
                        dataKey="createdDate"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                        globalFilter={globalFilter}
                        header={header}
                    >
                        <Column field="createdDate" header="Created Date" sortable style={{ minWidth: '12rem' }}></Column>
                        <Column field="orders[0].user.email" header="Client" body={(rowData) => rowData.orders[0].user.email}></Column>
                        <Column
                            field="orders[0].status"
                            header="Status"
                            style={{ minWidth: '12rem' }}
                            body={(rowData) => (
                                <div >
                                    {rowData.orders[0].status === "Pending" && (
                                        <div>
                                            <IconButton color="warning" className="mt-2">
                                                <PendingRoundedIcon/>
                                            </IconButton>
                                            <Tag severity="warning" rounded >
                                                {rowData.orders[0].status}
                                            </Tag>
                                        </div>
                                    )}
                                    {rowData.orders[0].status === "Cancelled" && (
                                        <div>
                                            <IconButton color="error" className="mt-2">
                                                <RailwayAlertRoundedIcon/>
                                            </IconButton>
                                            <Tag severity="danger" rounded>
                                                {rowData.orders[0].status}
                                            </Tag>
                                        </div>
                                    )}
                                    {rowData.orders[0].status === "Shipped" && (
                                        <div>
                                            <IconButton color="info" className="mt-2">
                                                <LocalShippingIcon />
                                            </IconButton>
                                            <Tag severity="info" rounded>
                                                {rowData.orders[0].status}
                                            </Tag>
                                        </div>
                                    )}
                                    {rowData.orders[0].status === "Delivered" && (
                                        <div>
                                            <IconButton color="success" className="mt-2">
                                                <CheckCircleOutlineIcon/>
                                            </IconButton>
                                            <Tag severity="success" rounded>
                                                {rowData.orders[0].status}
                                            </Tag>
                                        </div>
                                    )}
                                </div>
                            )}
                        />
                        <Column field="orders.totalPrice" header="Total Amount"  body={(rowData) => <div className="mt-2"><Tag severity="info" rounded>
                            {rowData.orders.reduce((total, order) => total + order.totalPrice, 0).toFixed(2)} Dh</Tag></div>} style={{ minWidth: '8rem' }}></Column>

                        <Column field="orders" header="Products" style={{ minWidth: '18rem' }} body={imageBodyTemplate}> </Column>
                        <Column header="Order Status" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </MainCard>
    );
}