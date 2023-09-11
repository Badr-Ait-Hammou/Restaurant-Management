import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/RestaurantSlick.css";
import axios from "../service/callerService";
import { Avatar } from "@mui/material";

function SpecialitySlick() {
    const [specialities, setSpecialities] = useState([]);

    useEffect(() => {
        axios.get("/api/controller/specialites/").then((response) => {
            setSpecialities(response.data);
        });
    }, []);

    const settings = {
        dots: false,
        infinite: true,
        slidesToShow: 5,
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
                {specialities.map((specialite) => (
                    <div className="container" key={specialite.id}>
                        <Avatar src={specialite.photo} alt={specialite.nom}   sx={{ width: 80, height: 80 }} style={{
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

export default SpecialitySlick;
