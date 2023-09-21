import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "../images/restaurant.jpg";
import Image1 from "../images/deliver.jpg";
import Image2 from "../images/food.jpg";
import "../styles/HomeImgSlick.css";

function RestaurantSlick() {
    const images = [
        { src: Image, alt: "Image 1" },
        { src: Image1, alt: "Image 2" },
        { src: Image2, alt: "Image 3" },
    ];

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 3000,
        autoplaySpeed: 6000,
        cssEase: "linear",
        pauseOnHover: true,
        fade: true,
    };

    return (
        <div className="carousel-container">
            <Slider {...settings}>
                {images.map((image) => (
                    <div key={image.alt} className="slide ">
                        <img
                            src={image.src}
                            alt={image.alt}
                            className="slide-image "
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default RestaurantSlick;
