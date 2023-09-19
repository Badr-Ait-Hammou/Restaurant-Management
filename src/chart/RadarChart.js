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
                    data: [], // Average ratings
                },
                {
                    label: 'Product Count',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    pointBackgroundColor: 'rgba(255,99,132,1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255,99,132,1)',
                    data: [], // Product counts
                },
            ],
        });

        useEffect(() => {
        // Fetch data from the API
        axios
            .get('/api/controller/orders/all')
            .then((response) => {
                const ordersData = response.data;

                // Calculate average ratings and product counts for each restaurant
                const restaurantRatings = {};
                const restaurantProductCounts = {};

                ordersData.forEach((order) => {
                    const restaurantName = order.produit.restaurant.nom;
                    const avisList = order.produit.avisList;
                    const totalRating = avisList.reduce((acc, avis) => acc + avis.rating, 0);
                    // const averageRating = avisList.length > 0 ? totalRating / avisList.length : 0;

                    if (!restaurantRatings[restaurantName]) {
                        restaurantRatings[restaurantName] = {
                            totalRating,
                            count: avisList.length,
                        };
                    } else {
                        restaurantRatings[restaurantName].totalRating += totalRating;
                        restaurantRatings[restaurantName].count += avisList.length;
                    }

                    // Count products
                    if (!restaurantProductCounts[restaurantName]) {
                        restaurantProductCounts[restaurantName] = 1;
                    } else {
                        restaurantProductCounts[restaurantName]++;
                    }
                });

                const restaurantNames = Object.keys(restaurantRatings);
                const averageRatings = restaurantNames.map(
                    (restaurantName) =>
                        restaurantRatings[restaurantName].totalRating /
                        restaurantRatings[restaurantName].count
                );
                const productCounts = restaurantNames.map((restaurantName) => restaurantProductCounts[restaurantName]);

                setChartData({
                    labels: restaurantNames,
                    datasets: [
                        {
                            label: 'Average Restaurant Rating',
                            backgroundColor: 'rgba(179,181,198,0.2)',
                            borderColor: 'rgba(179,181,198,1)',
                            pointBackgroundColor: 'rgba(179,181,198,1)',
                            pointBorderColor: '#fff',
                            pointHoverBackgroundColor: '#fff',
                            pointHoverBorderColor: 'rgba(179,181,198,1)',
                            data: averageRatings,
                        },
                        {
                            label: 'Product Count',
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

    return (
            <Chart
                type="radar"
                data={chartData}
                options={lightOptions}
            />
    );
};

    export default RadarChart;
