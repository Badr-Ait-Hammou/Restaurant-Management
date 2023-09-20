import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import axios from '../service/callerService';

const RadarChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Average Restaurant Rating',
                backgroundColor: 'rgba(179,181,198,0.2)',
                borderColor: 'rgba(179,181,198,1)',
                pointBackgroundColor: 'rgba(179,181,198,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(179,181,198,1)',
                data: [],
            },
            {
                label: 'Product Count',
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
                pointBackgroundColor: 'rgba(255,99,132,1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(255,99,132,1)',
                data: [],
            },
        ],
    });

    useEffect(() => {
        axios
            .get('/api/controller/restaurants/')
            .then((response) => {
                const restaurantsData = response.data;

                // const restaurantNames = restaurantsData.map((restaurant) => `${restaurant.nom} (${restaurant.id})`);
                // const productCounts = restaurantsData.map((restaurant) => restaurant.produitList.length);
                //
                //
                // // Use the getAverageRating method here to calculate ratings for each restaurant
                // const restaurantRatings = restaurantsData.map((restaurant) => getAverageRating(restaurant.produitList));

                const restaurantNames = restaurantsData.map((restaurant) => `${restaurant.nom} (${restaurant.id})`);
                const productCounts = restaurantsData.map((restaurant) => restaurant.produitList.length);
                const restaurantRatings = restaurantsData.map((restaurant) => {
                    const averageRating = calculateAverageRating(restaurant.produitList);
                    return averageRating;
                });
                setChartData({
                    labels: restaurantNames,
                    datasets: [
                        {
                            label: 'Average Restaurant Rating',
                            backgroundColor: 'rgba(34,169,182,0.52)',
                            borderColor: 'rgba(20,115,128,0.85)',
                            pointBackgroundColor: 'rgba(179,181,198,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(179,181,198,1)',
                            data: restaurantRatings,
                        },
                        {
                            label: 'Product Count ',
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            borderColor: 'rgba(255,99,132,1)',
                            pointBackgroundColor: 'rgba(255,99,132,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(255,99,132,1)',
                            data: productCounts,
                        },
                    ],
                });
            })
            .catch((error) => {
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
        scales: {
            r: {
                pointLabels: {
                    color: '#495057',
                },
                grid: {
                    color: '#ebedef',
                },
                angleLines: {
                    color: '#ebedef',
                },
            },
        },
    };

    const calculateAverageRating = (products) => {
        if (products.length === 0) {
            return 0;
        }

        let totalRating = 0;
        let totalRatings = 0;

        products.forEach((product) => {
            const avisList = product.avisList;
            if (avisList.length > 0) {
                const productRating = avisList.reduce((acc, avis) => acc + avis.rating, 0);
                totalRating += productRating;
                totalRatings += avisList.length;
            }
        });

        return totalRating / (totalRatings );
    };


    return (
        <Chart
            type="radar"
            data={chartData}
            options={lightOptions}
        />
    );
};

export default RadarChart;

//
// import React, { useState, useEffect } from 'react';
// import { Chart } from 'primereact/chart';
// import axios from '../service/callerService';
//
// const RadarChart = () => {
//     const [chartData, setChartData] = useState({
//         labels: [],
//         datasets: [
//             {
//                 label: 'Average Restaurant Rating',
//                 backgroundColor: 'rgba(179,181,198,0.2)',
//                 borderColor: 'rgba(179,181,198,1)',
//                 pointBackgroundColor: 'rgba(179,181,198,1)',
//                 pointBorderColor: '#fff',
//                 pointHoverBackgroundColor: '#fff',
//                 pointHoverBorderColor: 'rgba(179,181,198,1)',
//                 data: [],
//             },
//             {
//                 label: 'Product Count',
//                 backgroundColor: 'rgba(255,99,132,0.2)',
//                 borderColor: 'rgba(255,99,132,1)',
//                 pointBackgroundColor: 'rgba(255,99,132,1)',
//                 pointBorderColor: '#fff',
//                 pointHoverBackgroundColor: '#fff',
//                 pointHoverBorderColor: 'rgba(255,99,132,1)',
//                 data: [],
//             },
//         ],
//     });
//
//     useEffect(() => {
//         axios
//             .get('/api/controller/restaurants/')
//             .then((response) => {
//                 const restaurantsData = response.data;
//
//                 // Create an object to store restaurant data, grouped by product count
//                 const restaurantDataByProductCount = {};
//
//                 // Populate the object
//                 restaurantsData.forEach((restaurant) => {
//                     const productCount = restaurant.produitList.length;
//
//                     if (!restaurantDataByProductCount[productCount]) {
//                         restaurantDataByProductCount[productCount] = [];
//                     }
//
//                     restaurantDataByProductCount[productCount].push({
//                         name: `${restaurant.nom} (${restaurant.id})`,
//                         productCount,
//                     });
//                 });
//
//                 // Extract labels and data for the chart
//                 const chartLabels = [];
//                 const chartProductCounts = [];
//
//                 for (const productCount in restaurantDataByProductCount) {
//                     if (Object.hasOwnProperty.call(restaurantDataByProductCount, productCount)) {
//                         const restaurants = restaurantDataByProductCount[productCount];
//                         const label = restaurants.map((r) => r.name).join(', '); // Join names
//                         chartLabels.push(label);
//                         chartProductCounts.push(Number(productCount)); // Convert product count to number
//                     }
//                 }
//
//                 axios
//                     .get('/api/controller/orders/')
//                     .then((response) => {
//                         const ordersData = response.data;
//
//                         const restaurantRatings = {};
//
//                         ordersData.forEach((order) => {
//                             const restaurantName = order.produit.restaurant.nom;
//                             const avisList = order.produit.avisList;
//                             const totalRating = avisList.reduce((acc, avis) => acc + avis.rating, 0);
//                             // const averageRating = avisList.length > 0 ? totalRating / avisList.length : 0;
//
//                             if (!restaurantRatings[restaurantName]) {
//                                 restaurantRatings[restaurantName] = {
//                                     totalRating,
//                                     count: avisList.length,
//                                 };
//                             } else {
//                                 restaurantRatings[restaurantName].totalRating += totalRating;
//                                 restaurantRatings[restaurantName].count += avisList.length;
//                             }
//                         });
//
//                         const averageRatings = Object.values(restaurantRatings).map(
//                             (restaurantRating) => restaurantRating.totalRating / restaurantRating.count
//                         );

//                         setChartData({
//                             labels: chartLabels,
//                             datasets: [
//                                 {
//                                     label: 'Average Restaurant Rating',
//                                     backgroundColor: 'rgba(34,169,182,0.52)',
//                                     borderColor: 'rgba(20,115,128,0.85)',
//                                     pointBackgroundColor: 'rgba(179,181,198,1)',
//                                     pointBorderColor: '#fff',
//                                     pointHoverBackgroundColor: '#fff',
//                                     pointHoverBorderColor: 'rgba(179,181,198,1)',
//                                     data: averageRatings,
//                                 },
//                                 {
//                                     label: 'Product Count ',
//                                     backgroundColor: 'rgba(255,99,132,0.2)',
//                                     borderColor: 'rgba(255,99,132,1)',
//                                     pointBackgroundColor: 'rgba(255,99,132,1)',
//                                     pointBorderColor: '#fff',
//                                     pointHoverBackgroundColor: '#fff',
//                                     pointHoverBorderColor: 'rgba(255,99,132,1)',
//                                     data: chartProductCounts,
//                                 },
//                             ],
//                         });
//                     })
//                     .catch((error) => {
//                         console.error('Error fetching data:', error);
//                     });
//             })
//             .catch((error) => {
//                 console.error('Error fetching data:', error);
//             });
//     }, []);
//
//     const lightOptions = {
//         plugins: {
//             legend: {
//                 labels: {
//                     color: '#495057',
//                 },
//             },
//         },
//         scales: {
//             r: {
//                 pointLabels: {
//                     color: '#495057',
//                 },
//                 grid: {
//                     color: '#ebedef',
//                 },
//                 angleLines: {
//                     color: '#ebedef',
//                 },
//             },
//         },
//     };
//
//     return (
//         <Chart
//             type="radar"
//             data={chartData}
//             options={lightOptions}
//         />
//     );
// };
//
// export default RadarChart;
