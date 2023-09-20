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

                const restaurantNames = restaurantsData.map((restaurant) => `${restaurant.nom} (${restaurant.id})`);
                const productCounts = restaurantsData.map((restaurant) => restaurant.produitList.length);

                axios
                    .get('/api/controller/orders/')
                    .then((response) => {
                        const ordersData = response.data;

                        const restaurantRatings = {};

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
                        });

                        const averageRatings = Object.values(restaurantRatings).map(
                            (restaurantRating) => restaurantRating.totalRating / restaurantRating.count
                        );

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
                                    data: averageRatings,
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
