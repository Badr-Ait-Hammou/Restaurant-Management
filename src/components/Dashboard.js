import React, {useEffect, useState} from "react"
import { Chart } from 'primereact/chart';
import axios from  '../service/callerService';
import RadarChart from '../chart/RadarChart'
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import { Tag } from 'primereact/tag';



export default function Dashboard(){
    const [chartData, setChartData] = useState({});
    const [userCount, setUserCount] = useState(0);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [deliveredtot, setDeliveredtot] = useState(0);
    const [shippedtot, setShippedtot] = useState(0);
    const [shippedcount, setShippedCount] = useState(0);
    const [deliveredcount, setDeliveredCount] = useState(0);

    useEffect(() => {
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

    useEffect(() => {
            axios.get('/api/controller/orders/shippedtot').then((response) => {
            setShippedtot(response.data)
            });

            axios.get('/api/controller/orders/deliveredtot').then((response) => {
            setDeliveredtot(response.data)
            });
            axios.get('/api/controller/orders/shippedcount').then((response) => {
            setShippedCount(response.data)
            });
            axios.get('/api/controller/orders/deliveredcount').then((response) => {
            setDeliveredCount(response.data)
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
        axios.get('/api/controller/orders/')
            .then(response => {
                const ordersData = response.data;

                const orderCounts = calculateOrderCounts(ordersData);
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
                                <div className="text-900 font-medium text-xl">{deliveredcount}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{shippedcount} </span>
                        <span className="text-500">are undelivered yet</span>
                    </div>
                </div>
                <div className="col-12 md:col-6 lg:col-3">
                    <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Revenue</span>
                                <div className="text-900 font-medium text-xl">{deliveredtot} Dh</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-money-bill text-orange-500 text-xl"></i>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium"> {shippedtot || '0'} Dh + </span>
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
                        <span className="text-green-500 font-medium"> Verified  </span>
                        <span className="text-500">Accounts</span>
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
                        <span className="text-green-500 font-medium">Verified </span>
                        <span className="text-500">Accounts</span>
                    </div>
                </div>
            </div>
        </div>





            <Box sx={{mt:5}} className="card mx-2 justify-content-center">

                <Grid item container  columns={12} className="justify-content-center" >
                    <Grid item xs={12} md={6} >
                        <Tag severity="success" value={"orders stats"}/>

                        <Chart
                            type="polarArea"
                            data={chartData}
                            options={lightOptions}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}  className="template justify-content-center">
                        <Tag  className="facebook  " >
                            <span className="px-2">products count</span>
                        </Tag>


                        <RadarChart/>
                    </Grid>
                </Grid>
            </Box>

            </>
    );
}