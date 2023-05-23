
import axios from '../service/callerService';
import React,{useState,useEffect} from "react";
import RestaurantDetails from "./RestaurantDetails";
import { Link, useParams } from 'react-router-dom';
import moment from "moment";
import { AiOutlineFieldTime } from "react-icons/ai";





export default function ClientRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const { id } = useParams();
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);


    useEffect(() => {
        axios.get("/api/controller/restaurants/").then((response) => {
            setRestaurants(response.data);
        });
    }, []);


    useEffect(() => {
        axios.get("/api/controller/villes/").then((response) => {
            setCities(response.data);
        });
    }, []);

    // Fetch zones for the selected city
    useEffect(() => {
        if (selectedCity) {
            axios
                .get(`/api/controller/zones/${selectedCity}`)
                .then((response) => {
                    setZones(response.data);
                });
        }
    }, [selectedCity]);

    // Fetch restaurants for the selected city and zone
    useEffect(() => {
        if (selectedCity && selectedZone) {
            axios
                .get(
                    `/api/controller/restaurants/${selectedCity}/${selectedZone}`
                )
                .then((response) => {
                    setRestaurants(response.data);
                });
        }
    }, [selectedCity, selectedZone]);

    // Handle city select
    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
        setSelectedZone("");
    };

    const handleZoneChange = (event) => {
        setSelectedZone(event.target.value);
    };


    return (
        <div className="container mt-5">

            <div className="col-md-6 d-flex">
                <select className="form-select mb-3 me-3" value={selectedCity} onChange={handleCityChange}>
                    <option value="">Select a city</option>
                    {cities.map((ville) => (
                        <option key={ville.id} value={ville.nom}>{ville.nom}</option>
                    ))}
                </select>
                {selectedCity ? (
                    <select className="form-select mb-3" value={selectedZone} onChange={handleZoneChange}>
                        <option value="">Select a zone</option>
                        {zones.map((zone) => (
                            <option key={zone.id} value={zone.nom}>{zone.nom}</option>
                        ))}
                    </select>
                ) : (
                    <select className="form-select mb-3" disabled>
                        <option value="">No zone</option>
                    </select>
                )}
            </div>




            <div className="row row-cols-2 row-cols-md-2 row-cols-lg-4 g-4">
                {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="col mb-4">
                        <div className="card h-100">
                            <Link to={`restaurants/${restaurant.id}`}>
                                <img
                                    src={restaurant.photo}
                                    className="card-img-top"
                                    alt="Restaurant"
                                    style={{ objectFit: "cover", height: "auto" }}
                                />
                            </Link>
                            <div className="card-body">
                                <h6 className="card-title">{restaurant.nom}</h6>
                                <h6 className="card-title " ><AiOutlineFieldTime style={{ color: 'lightseagreen', fontSize: '20px' }} />
                                    {restaurant.dateOuverture} / {restaurant.dateFermeture}</h6>
                                <h6 className="card-text">Address: {restaurant.adresse}</h6>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {id && <RestaurantDetails id={id} />}
        </div>

    );
}

