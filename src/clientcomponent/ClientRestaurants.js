import axios from '../service/callerService';
import React, { useState, useEffect } from "react";
import RestaurantDetails from "./RestaurantDetails";
import { Link, useParams } from 'react-router-dom';
import { AiOutlineFieldTime } from "react-icons/ai";
import { Dropdown } from 'primereact/dropdown';
import Button from "@mui/material/Button";

export default function ClientRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const { id } = useParams();
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedSpecialite, setSelectedSpecialite] = useState(null);
    const [specialites, setSpecialites] = useState([]);
    const [noResults, setNoResults] = useState(false); // State for no results message

    useEffect(() => {
        axios.get("/api/controller/specialites/").then((response) => {
            setSpecialites(response.data);
        });
        axios.get("/api/controller/villes/").then((response) => {
            setCities(response.data);
        });
        loadRestaurants();

    }, []);

    const loadRestaurants = () => {
        axios.get("/api/controller/restaurants/").then((response) => {
            setRestaurants(response.data);
        });
    };

    useEffect(() => {
        if (selectedCity) {
            axios.get(`/api/controller/zones/${selectedCity}`).then((response) => {
                setZones(response.data);
            });
        }
    }, [selectedCity]);

    useEffect(() => {
        if (selectedCity && selectedZone && selectedSpecialite) {
            axios.get(
                `/api/controller/restaurants/${selectedCity}/${selectedZone}/${selectedSpecialite}`
            ).then((response) => {
                setRestaurants(response.data);
                setNoResults(response.data.length === 0);
            });
        } else {
            setNoResults(false);
        }
    }, [selectedCity, selectedZone, selectedSpecialite]);

    const handleCityChange = (event) => {
        setSelectedCity(event.value);
        loadRestaurants();
        setSelectedZone(null);
        setSelectedSpecialite(null);
    };


    const handleZoneChange = (event) => {
        setSelectedZone(event.value);
    };

    const handleSpecialiteChange = (event) => {
        setSelectedSpecialite(event.value);
    };



    return (
        <div className="container mt-5 ">
            <div className="col-md-12   mb-3">
                <Dropdown
                    className="mr-2"
                    value={selectedCity}
                    options={cities.map((ville) => ({ label: ville.nom, value: ville.nom }))}
                    onChange={handleCityChange}
                    placeholder="Select a city"
                />

                {selectedCity && (
                    <Dropdown
                        value={selectedZone}
                        options={zones.map((zone) => ({ label: zone.nom, value: zone.nom }))}
                        onChange={handleZoneChange}
                        placeholder="Select a zone"
                    />
                )}

                <Dropdown
                    className="ml-2"
                    value={selectedSpecialite}
                    options={specialites.map((specialite) => ({ label: specialite.nom, value: specialite.nom }))}
                    onChange={handleSpecialiteChange}
                    placeholder="Select a specialite"
                />
            </div>

            <div className="row row-cols-2 row-cols-md-2 row-cols-lg-4 g-4">
                {noResults ? (
                    <div className="col mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <h6 className="card-title">No results found</h6>
                            </div>
                        </div>
                    </div>
                ) : (
                    restaurants.map((restaurant) => (
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
                                    <h6 className="card-title">
                                        <AiOutlineFieldTime style={{ color: 'lightseagreen', fontSize: '20px' }} />
                                        {restaurant.dateOuverture} / {restaurant.dateFermeture}
                                    </h6>
                                    <h6 className="card-text">Address: {restaurant.adresse}</h6>
                                    <h6 className="card-text">specialite: {restaurant.specialite.nom}</h6>
                                    <h6 className="card-text">zone: {restaurant.zone.nom}</h6>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {id && <RestaurantDetails id={id} />}
        </div>
    );
}
