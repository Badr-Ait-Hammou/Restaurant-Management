import axios from '../service/callerService';
import {useEffect, useState} from "react";
import { Rating} from "@mui/material";
import React from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.min.css";
import Typography from "@mui/material/Typography";


export default function RestaurantRating({restaurantId} ) {
    const [products, setProducts] = useState([]);


    useEffect(() => {
        if (restaurantId !== undefined) {
            axios.get(`/api/controller/produits/restaurant/${restaurantId}`)
                .then((response) => {
                    setProducts(response.data);
                    //console.log(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching restaurant products:', error);
                });
        } else {

        }
    }, [restaurantId]);



    const getAverageRating = (product) => {
        const ratings = product.avisList.map((avis) => avis.rating);
        if (ratings.length > 0) {
            const totalRating = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return totalRating / ratings.length;
        } else {
            return 0;
        }
    };

    const getRestaurantRating = (products) => {
        const averageRatings = products.map((product) => getAverageRating(product));
        const sumOfAverageRatings = averageRatings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const numberOfProducts = products.length;
        return  sumOfAverageRatings / numberOfProducts;
    };

    const restaurantRating = getRestaurantRating(products);

    return (
        <>
                <Typography variant="body1" gutterBottom style={{marginTop:"-8px"}}>
                    <div style={{float:"left"}}>
                        <Rating value={restaurantRating} style={{float:"left"}} readOnly cancel={false} precision={0.5}></Rating>
                        <Typography style={{float:"left"}} className="font-monospace ">({products.length})review{products.length !== 1 ? 's' : ''}</Typography>
                    </div>
                </Typography>
        </>
    );
}


