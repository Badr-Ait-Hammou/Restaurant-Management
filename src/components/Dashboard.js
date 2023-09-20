import React, {useEffect, useState} from "react"
import {Chart} from 'primereact/chart';
import axios from '../service/callerService';
import RadarChart from '../chart/RadarChart'
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import {Tag} from 'primereact/tag';


export default function Dashboard() {
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
                            label: "orders count :",
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
    return (
        <>
            {/*style={{background:"linear-gradient(to left, var(--yellow-400) 50%, var(--yellow-500) 50%)",transition:"background-position 0.5s ease-out;",backgroundSize:"200% 100%",backgroundPosition:"right bottom",borderColor:"var(--yellow-500)"}}*/}
            <div className="card mt-5 p-1 m-2">

                <div className="grid">
                    <div className="col-12 md:col-6 lg:col-3">
                        {/*<div className=" shadow-2 p-3 border-1 border-50 border-round " style={{ backgroundImage: "url(https://www.primefaces.org/cdn/primeflex/images/landing/style-cards/fancy.jpg)", backdropFilter: "blur(4px)" }}>*/}
                        <div
                            className="shadow-2  border-1 p-1 border-50 border-round w-full h-full bg-[url('https://img.freepik.com/free-photo/people-taking-photos-food_23-2149303524.jpg?size=626&ext=jpg&ga=GA1.2.1906554086.1668974677&semt=ais')] bg-cover bg-center">
                            {/*<div className="shadow-2  border-1 p-0.5 border-50 border-round w-full h-full bg-[url('https://img.freepik.com/free-photo/revenue-income-money-profit-costs-budget-banking-concept_53876-134047.jpg?w=1060&t=st=1695246684~exp=1695247284~hmac=3b29564f1fb13edefe52b07061fca879f261f6719ea933653b992e1b704c923e')] bg-cover bg-center">*/}
                            {/*<div className="shadow-2 border-1 p-0.5 border-50 rounded w-full h-full" style={{ backgroundImage:"", backgroundSize: 'cover', backgroundPosition: 'center' }}>*/}

                            <div className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm">
                                <div className=" w-full h-full flex justify-content-between mb-1 ">
                                    <div>
                                        <span className="block text-white  font-bold mb-3">Orders</span>
                                        <div className="text-white  font-bold text-xl">{deliveredcount}</div>
                                    </div>
                                    <div
                                        className="flex align-items-center justify-content-center bg-blue-100 border-round"
                                        style={{width: '2.5rem', height: '2.5rem'}}>
                                        <i className="pi pi-shopping-cart text-blue-500 text-xl"></i>
                                    </div>
                                </div>
                                <div className="-mt-5">
                                    <span className="text-green-500  font-bold">{shippedcount} </span>
                                    <span className="text-white"> are undelivered yet</span>
                                </div>

                            </div>

                        </div>
                    </div>

                    <div className="col-12 md:col-6 lg:col-3">
                        <div
                            className="shadow-2  border-1 p-1 border-50 border-round w-full h-full bg-[url('https://img.freepik.com/free-photo/revenue-income-money-profit-costs-budget-banking-concept_53876-134047.jpg?w=1060&t=st=1695246684~exp=1695247284~hmac=3b29564f1fb13edefe52b07061fca879f261f6719ea933653b992e1b704c923e')] bg-cover bg-center">
                            <div className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm">
                                <div className=" w-full h-full flex justify-content-between mb-1 ">
                                    <div>
                                        <span className="block text-white font-bold mb-3">Revenue</span>
                                        <div className="text-white font-bold text-xl">{deliveredtot} Dh</div>
                                    </div>
                                    <div
                                        className="flex align-items-center justify-content-center bg-orange-100 border-round"
                                        style={{width: '2.5rem', height: '2.5rem'}}>
                                        <i className="pi pi-money-bill text-orange-500 text-xl"></i>
                                    </div>
                                </div>
                                <div className="-mt-5">
                                    <span className="text-green-500  font-bold">{shippedtot || 0} Dh +</span>
                                    <span className="text-white"> on Hold</span>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <div
                            className="shadow-2  border-1 p-0.5 border-50 border-round w-full h-full bg-[url('https://img.freepik.com/free-photo/blue-teal-sand-paper_53876-92791.jpg?w=900&t=st=1695245835~exp=1695246435~hmac=01b44ddf63db6d8f99ac4ce1aa66f569db34415f56464e6bd3fe1f9fea9289ee')] bg-cover bg-center">
                            <div className=" w-full h-full p-2  justify-content-between  backdrop-blur-md">
                                <div className=" w-full h-full flex justify-content-between mb-1 ">
                                    <div>
                                        <span className="block text-white font-bold mb-3">Customers</span>
                                        <div className="text-white font-bold text-xl">{userCount}</div>
                                    </div>
                                    <div
                                        className="flex align-items-center justify-content-center bg-cyan-100 border-round"
                                        style={{width: '2.5rem', height: '2.5rem'}}>
                                        <i className="pi pi-users text-cyan-500 text-xl"></i>
                                    </div>
                                </div>
                                <div className="-mt-5">
                                    <span className="text-green-500 font-bold"> Verified  </span>
                                    <span className="text-white">Accounts</span>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="col-12 md:col-6 lg:col-3">
                        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
                            <div className="flex justify-content-between mb-3">
                                <div>
                                    <span className="block text-500 font-medium mb-3">Owners</span>
                                    <div className="text-900 font-medium text-xl">{employeeCount} </div>
                                </div>
                                <div
                                    className="flex align-items-center justify-content-center bg-purple-100 border-round"
                                    style={{width: '2.5rem', height: '2.5rem'}}>
                                    <i className="pi pi-user text-purple-500 text-xl"></i>
                                </div>
                            </div>
                            <span className="text-green-500 font-medium">Verified </span>
                            <span className="text-500">Accounts</span>
                        </div>
                    </div>
                </div>
            </div>


            <Box sx={{mt: 5}} className="card mx-2 justify-content-center">

                <Grid item container columns={12} className="justify-content-center">
                    <Grid item xs={12} md={6}>
                        <Tag severity="success" value={"orders stats"}/>

                        <Chart
                            type="polarArea"
                            data={chartData}
                            options={lightOptions}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className="template justify-content-center">
                        <Tag className="facebook  ">
                            <span className="px-2">products count</span>
                        </Tag>


                        <RadarChart/>
                    </Grid>
                </Grid>
            </Box>

        </>
    );
}


//
//
//
// <div className="p-2 border-round-xl" style={{background: "var(--style-cards-fancy-bg)", border: "1px solid rgba(255, 255, 255, 0.1)", backgroundBlendMode: "normal", width: "300px"}}>
//     <div className="content border-round-sm">
//         <div className="content-image bg-cover bg-no-repeat bg-center relative" style={{height: "244px", backgroundImage: "url(https://www.primefaces.org/cdn/primeflex/images/landing/style-cards/fancy.jpg)"}}>
//             <div className="rating mt-2 border-round-sm absolute ml-2 p-2 flex align-items-center gap-2 bg-black-alpha-20 w-8rem border-1" style={{backdropFilter:"blur(27px)"}}>
//                 <i className="pi pi-star-fill text-white"></i>
//                 <i className="pi pi-star-fill text-white"></i>
//                 <i className="pi pi-star-fill text-white"></i>
//                 <i className="pi pi-star-fill text-gray-600"></i>
//                 <i className="pi pi-star-fill text-gray-600"></i>
//             </div>
//         </div>
//         <div className="content-info mt-2 border-round-sm bg-white-alpha-10 shadow-1 py-1" style={{backdropFilter:"blur(27px)"}}>
//             <div className="flex align-items-center justify-content-between py-2 px-3">
//                 <span className="font-medium text-white">Prime Coffee Shop</span>
//                 <i className="pi pi-verified text-white"></i>
//             </div>
//             <div className="flex align-items-center justify-content-between py-2 px-3 gap-2">
//                 <div className="flex align-items-center gap-2">
//                     <i className="pi pi-star-fill text-white"></i>
//                     <span className="font-small text-white white-space-nowrap">Cold Brew</span>
//                 </div>
//                 <div className="flex align-items-center gap-2">
//                     <i className="pi pi-star-fill text-white"></i>
//                     <span className="font-small text-white white-space-nowrap">10:00 - 17:00</span>
//                 </div>
//             </div>
//             <div className="flex align-items-center justify-content-between py-2 px-3 gap-2">
//                 <div className="flex align-items-center justify-content-center gap-1 border-right-1 surface-border pr-2">
//                     <i className="pi pi-bolt text-white"></i>
//                     <span className="font-small text-white white-space-nowrap">Charge</span>
//                 </div>
//                 <div className="flex align-items-center gap-1 justify-content-center gap-1 border-right-1 surface-border px-2">
//                     <i className="pi pi-wifi text-white"></i>
//                     <span className="font-small text-white white-space-nowrap">Wifi</span>
//                 </div>
//                 <div className="flex align-items-center gap-1 justify-content-center gap-1 pl-2">
//                     <i className="pi pi-book text-white"></i>
//                     <span className="font-small text-white white-space-nowrap">Library</span>
//                 </div>
//             </div>
//         </div>
//         <div className="flex align-items-center justify-content-center pt-2 gap-2">
//             <button className="p-3 flex align-items-center justify-content-center w-7 gap-2 border-round-sm bg-white-alpha-10 shadow-1 border-none cursor-pointer hover:bg-white-alpha-20 transition-duration-200 bg-black" >
//                 <span className="font-medium text-white white-space-nowrap">Contact</span>
//                 <i className="pi pi-send text-white"></i>
//             </button>
//             <button className="p-3 flex align-items-center justify-content-center w-5 gap-2 bg-blue-500 shadow-1 border-round-sm border-none cursor-pointer hover:bg-blue-600 transition-duration-200">
//                 <span className="font-medium text-white white-space-nowrap">Rate</span>
//                 <i className="pi pi-thumbs-up-fill text-white"></i>
//             </button>
//         </div>
//     </div>
// </div>
//

