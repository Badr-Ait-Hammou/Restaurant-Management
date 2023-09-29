import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/RestaurantSlick.css";
import axios from "../service/callerService";
import { Avatar } from "@mui/material";
import {Link} from 'react-router-dom';
import {Skeleton} from "primereact/skeleton";
import {useDarkMode} from "../components/DarkModeContext";


function SpecialitySlick() {
    const [specialities, setSpecialities] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useDarkMode();



    useEffect(() => {
        axios.get("/api/controller/specialites/").then((response) => {
            setSpecialities(response.data);
            setLoading(false);
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

    if(loading){
        return ( <div className="mainContainer">
            <p className="font-monospace  ">Specialities</p>
            <Skeleton width="100%" height="100px"  />

        </div>);
    }

    return (
        <div className="mainContainer">
            <p  className={` font-monospace ${isDarkMode ? "text-white" :"text-black"}`}>Specialities</p>

            <Slider {...settings}>
                {specialities.map((specialite) => (
                    <div className="container" key={specialite.id}>
                        <Link to={`restaurants_speciality/${specialite.id}`}>
                        <Avatar src={specialite.photo} alt={specialite.nom}   sx={{ width: 80, height: 80,borderRadius:6,backgroundColor:"rgb(94,180,163)" }} style={{
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto",
                            textAlign: "center"}} />
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default SpecialitySlick;
