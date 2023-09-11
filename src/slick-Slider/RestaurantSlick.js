import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/RestaurantSlick.css";
import axios from "../service/callerService";
import { Avatar } from "@mui/material";

function RestaurantSlick() {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        axios.get("/api/controller/restaurants/").then((response) => {
            setRestaurants(response.data);
        });
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        speed: 1000,
        autoplaySpeed: 2000,
        cssEase: "linear",
        pauseOnHover: true,

    };

    return (
        <div className="mainContainer">
            <Slider {...settings}>
                {restaurants.map((restaurant) => (
                    <div className="container" key={restaurant.id}>
                        <Avatar src={restaurant.photo} alt={restaurant.nom}   sx={{ width: 70, height: 70,borderRadius:6,backgroundColor:"rgba(94,180,163,0.18)" }} style={{
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            textAlign: "center"}} />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default RestaurantSlick;
