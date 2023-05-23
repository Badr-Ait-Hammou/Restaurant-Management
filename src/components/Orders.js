import axios from  '../service/callerService';
import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'primereact/button';
import ReactPaginate from "react-paginate";
import"../styles/login.css"
import { Card, CardContent } from '@mui/material';





export default function Orders( )  {
    const [orders, setOrders] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);

    const itemsPerPage = 4;
    const offset = pageNumber * itemsPerPage;
    const currentPageItems = orders.slice(offset, offset + itemsPerPage);





    useEffect(() => {
        const fetchorders = async () => {
            const result = await axios(`/api/controller/orders/all`);
            setOrders(result.data);
        };
        fetchorders();
    }, []);














    return (
        <div>
            <Card className="mx-3 mt-3 p-3">
                <CardContent >
                    <div style={{ alignItems: "center" }}>
                        <h3 >ORDERS</h3>
                    </div>
        <div>
            <div className="table-responsive">
                <table className="table mt-5 text-center">
                    <thead>
                    <tr>
                        <th>ORDER ID</th>
                        <th>DATE</th>
                        <th>PRODUCTS</th>
                        <th>TOTAL AMOUNT</th>
                        <th>USER</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentPageItems.map((orders) => (
                        <tr key={orders.id}>
                            <td>{orders.id}</td>
                            <td>{orders.dateCreated}</td>
                            <td>
                                {orders.orderItem.map((item) => (
                                    <div key={item.id}>
                                        <img src={item.produit.photo} alt="Produit Photo" style={{ height: "20px" ,margin:"5px" }} />
                                        <span>{item.produit.nom}</span>
                                    </div>
                                ))}
                            </td>
                            <td>{orders.totalPrice} DH</td>

                            <td>{orders.user && orders.user.telephone}</td>
                            <td>
                                <Button  label="CONFIRM" severity="help" raised  className="mx-1"  />
                                <Button  label="CANCEL" severity="danger" text raised  className="mx-1"  />

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="pagination-container">
                    <ReactPaginate
                        previousLabel={<button className="pagination-button">&lt;</button>}
                        nextLabel={<button className="pagination-button">&gt;</button>}
                        pageCount={Math.ceil(orders.length / itemsPerPage)}
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

