import React, {useEffect, useState} from "react"
import { Chart } from 'primereact/chart';
import axios from  '../service/callerService';
import RadarChart from '../chart/RadarChart'
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";



export default function Dashboard(){
    const [chartData, setChartData] = useState({});
    function calculateOrderCounts(orders) {
        const orderCounts = {};

        orders.forEach(order => {
            const restaurantName = order.produit.restaurant.nom;
            if (!orderCounts[restaurantName]) {
                orderCounts[restaurantName] = 1;
            } else {
                orderCounts[restaurantName]++;
            }
        });

        return orderCounts;
    }

    useEffect(() => {
        // Fetch data from the API
        axios.get('/api/controller/orders/all')
            .then(response => {
                const ordersData = response.data;

                const orderCounts = calculateOrderCounts(ordersData);
                const restaurantNames = Object.keys(orderCounts);
                const orderCountsArray = Object.values(orderCounts);

                const chartData = {
                    datasets: [
                        {
                            data: orderCountsArray,
                        },
                    ],
                    labels: restaurantNames,
                };

                setChartData(chartData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const lightOptions = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057',
                },
            },
        },
    };
    return(
        <>
        <div className="card mt-5 p-1 m-2">

            <div className="grid">
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Orders</span>
                                <div className="text-900 font-medium text-xl">152</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">24 new </span>
                        <span className="text-500">since last visit</span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Revenue</span>
                                <div className="text-900 font-medium text-xl">$2.100</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-map-marker text-orange-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">%52+ </span>
                        <span className="text-500">since last week</span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Customers</span>
                                <div className="text-900 font-medium text-xl">28441</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-inbox text-cyan-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">520  </span>
                        <span className="text-500">newly registered</span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Comments</span>
                                <div className="text-900 font-medium text-xl">152 Unread</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-comment text-purple-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">85 </span>
                        <span className="text-500">responded</span>
                    </div>
                </div>
            </div>
        </div>





            <Box sx={{mx:1,mt:3}}>
                <Grid item container spacing={1} columns={12}>
                    <Grid item xs={12} md={6}>
                        <Chart
                            type="polarArea"
                            data={chartData}
                            options={lightOptions}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <RadarChart/>
                    </Grid>
                </Grid>
            </Box>

            </>
    );
}