import React, {useEffect, useState} from "react"
import { Chart } from 'primereact/chart';
import axios from  '../service/callerService';
import RadarChart from '../chart/RadarChart'
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import { Divider } from 'primereact/divider';



export default function Dashboard(){
    const [chartData, setChartData] = useState({});
    const [userCount, setUserCount] = useState(0);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [undeliveredordersCount, setUndeliveredOrdersCount] = useState(0);
    const [deliveredTotalPrice, setDeliveredTotalPrice] = useState(0);
    const [pendingTotalPrice, setPendingTotalPrice] = useState(0);
    useEffect(() => {
        // Fetch data for user and employee counts
        axios
            .get('/api/controller/users/')
            .then((response) => {
                const usersData = response.data;
                const userCount = usersData.filter((user) => user.role === 'USER').length;
                const employeeCount = usersData.filter((user) => user.role === 'EMPLOYEE').length;

                setUserCount(userCount);
                setEmployeeCount(employeeCount);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, []);


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
        axios.get('/api/controller/orders/all')
            .then(response => {
                const ordersData = response.data;

                const orderCounts = calculateOrderCounts(ordersData);
                const undeliveredorders = ordersData.filter((orders) => orders.status !== 'Delivered').length;
                setUndeliveredOrdersCount(undeliveredorders);

                // const total = ordersData.reduce((acc, order) => acc + order.totalPrice, 0);
                // setTotalPrice(total);
                const deliveredOrders = ordersData.filter((order) => order.status === 'Delivered');
                const pendingOrders = ordersData.filter((order) => order.status === 'Shipped');

                const deliveredTotal = deliveredOrders.reduce((acc, order) => acc + order.totalPrice, 0);
                const pendingTotal = pendingOrders.reduce((acc, order) => acc + order.totalPrice, 0);

                setDeliveredTotalPrice(deliveredTotal);
                setPendingTotalPrice(pendingTotal);

                const orders = ordersData.length;
                setOrdersCount(orders)
                const restaurantNames = Object.keys(orderCounts);
                const orderCountsArray = Object.values(orderCounts);

                const chartData = {
                    datasets: [
                        {
                            data: orderCountsArray,
                            label:"orders count :",
                        },
                    ],
                    labels: restaurantNames ,
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
                                <div className="text-900 font-medium text-xl">{ordersCount}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{undeliveredordersCount} </span>
                        <span className="text-500">are undelivered</span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Revenue</span>
                                <div className="text-900 font-medium text-xl">{deliveredTotalPrice} Dh</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-money-bill text-orange-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium"> {pendingTotalPrice} Dh + </span>
                        <span className="text-500">On hold</span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Customers</span>
                                <div className="text-900 font-medium text-xl">{userCount}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-users text-cyan-500 text-xl"></i>
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
                                <span className="block text-500 font-medium mb-3">Owners</span>
                                <div className="text-900 font-medium text-xl">{employeeCount} </div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-user text-purple-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">85 </span>
                        <span className="text-500">responded</span>
                    </div>
                </div>
            </div>
        </div>





            <Box sx={{mt:3}} className="card mt-1 mx-2">
                <Grid item container  columns={12}  >
                    <Grid item xs={12} md={6} >
                        <Chart
                            type="polarArea"
                            data={chartData}
                            options={lightOptions}
                        />
                    </Grid>

                    <Grid item xs={12} md={6} >
                        <RadarChart/>
                    </Grid>
                </Grid>
            </Box>

            </>
    );
}