import axios from  '../service/callerService';
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'primereact/button';
import"../styles/login.css"
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import MainCard from "../ui-component/MainCard";
import moment from "moment";
import { Tag } from 'primereact/tag';




export default function Orders( )  {
    const [orders, setOrders] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);








    useEffect(() => {
        const fetchorders = async () => {
            const result = await axios(`/api/controller/orders/all`);
            setOrders(result.data);
        };
        fetchorders();
    }, []);

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



    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2"  />
                <Button icon="pi pi-trash" rounded outlined severity="danger"  />
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', justifyContent: 'center' }}>
                {rowData.orders.map((order) => (
                    <img
                        key={order.produit.id}
                        src={order.produit.photo}
                        alt={order.produit.nom}
                        className="shadow-cyan-200 border-round"
                        style={{ width: '60px',borderRadius:"8px" }}
                    />
                ))}
            </div>
        );
    };

    const groupOrdersByUserAndTime = () => {
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
        <MainCard sx={{ margin: '20px' }}>
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
                        <Column field="email" header="Client" body={(rowData) => rowData.orders[0].user.email}></Column>
                        <Column
                            field="status"
                            header="Status"
                            body={(rowData) => (
                                <div>
                                    <Tag
                                        severity={
                                            rowData.orders[0].status === "Pending"
                                                ? "warning"
                                                : rowData.orders[0].status === "Cancelled"
                                                    ? "error"
                                                    : rowData.orders[0].status === "Confirmed"
                                                        ? "info"
                                                        : rowData.orders[0].status === "Delivered"
                                                            ? "success"
                                                            : "info" // Default to "info" if none of the above conditions match
                                        }
                                        rounded
                                    >
                                        {rowData.orders[0].status}
                                    </Tag>
                                </div>
                            )}
                        />
                        <Column field="totalPrice" header="Total Amount"  body={(rowData) => <div><Tag severity="info" rounded>
                            {rowData.orders.reduce((total, order) => total + order.totalPrice, 0).toFixed(2)} Dh</Tag></div>} style={{ minWidth: '8rem' }}></Column>

                        <Column field="orders" header="Products" body={imageBodyTemplate}></Column>
                        <Column header="Actions" body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                    </DataTable>
                </div>
            </div>
        </MainCard>
    );
}