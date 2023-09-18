import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/HomeImgSlick.css";
import Typography from "@mui/material/Typography";
import {Tag} from "primereact/tag";

function ContactSlick() {
    const textItems = [
        { id: 1, text: "Text 1" },
        { id: 2, text: "+212 0666995588",icon:"pi pi-phone" },
        { id: 3, text: "Text 3" },
        { id: 4, text: "Text 4" },
    ];

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 4,
        autoplay: true,
        speed: 30000,
        autoplaySpeed: 0,
        cssEase: "linear",
        pauseOnHover: false,
    };

    return (
        <div className="carousel-container">
            <Slider {...settings} >
                {textItems.map((item) => (
                    <div key={item.id} className="slide bg-black text-white" >
                        {/*<Tag icon={item.icon}/>*/}
                        <Typography>{item.text}</Typography>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default ContactSlick;
