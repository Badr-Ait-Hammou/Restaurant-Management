import axios from '../service/callerService';
import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import {Dropdown} from 'primereact/dropdown';
import {Tag} from "primereact/tag";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import AlertTitle from "@mui/material/AlertTitle";
import Alert from "@mui/material/Alert";

export default function ClientRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedSpecialite, setSelectedSpecialite] = useState(null);
    const [specialites, setSpecialites] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [layout, setLayout] = useState('list');


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
            console.log(response.data);
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


    function isRestaurantOpen(openingTime, closingTime) {
        const now = new Date();
        const openTime = parseTimeString(openingTime);
        const closeTime = parseTimeString(closingTime);

        return now >= openTime && now <= closeTime;
    }

    function parseTimeString(timeString) {
        const [hours, minutes] = timeString.split(':');
        const now = new Date();
        now.setHours(parseInt(hours, 10));
        now.setMinutes(parseInt(minutes, 10));
        return now;
    }


    const listItem = (restaurant) => {
        return (
            <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">

                {noResults ? (
                    <div className="col mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <Alert severity="info">
                                    <AlertTitle>Info</AlertTitle>
                                    <strong>oops...!</strong> — No Restaurant Found
                                </Alert>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={restaurant.id} className="col mb-4 card h-100">
                        <div className="row  row-cols-1  row-cols-sm-4 row-cols-md-4 row-cols-lg-4 g-4 ">
                            <Link to={`restaurants/${restaurant.id}`}>
                                <img
                                    className="card-img-top mx-auto mt-2 "
                                    src={restaurant.photo}
                                    alt={restaurant.nom}
                                    style={{
                                        width: '180px',
                                        height: '140px',
                                        borderRadius: '8px'
                                    }}/>
                            </Link>
                            <div className="card-body">
                                <h6 className="card-title">{restaurant.nom}</h6>
                                <Tag severity="success" icon="pi pi-clock">
                                    {restaurant.dateOuverture} / {restaurant.dateFermeture}
                                </Tag>
                                <span className="card-text-value mx-2">
                                    {restaurant.dateOuverture && restaurant.dateFermeture ? (
                                        isRestaurantOpen(restaurant.dateOuverture, restaurant.dateFermeture) ? (
                                            <Tag severity="info" icon="pi pi-check">
                                                Open
                                            </Tag>
                                        ) : (
                                            <Tag severity="danger" icon="pi pi-moon">
                                                Closed
                                            </Tag>
                                        )
                                    ) : (
                                        "N/A"
                                    )}
                                </span>
                                <div className="mt-1">
                                    <strong className="card-text ">Address: </strong> {restaurant.adresse}
                                </div>
                                <div>
                                    <strong
                                        className="card-text mt-1 ">City: </strong>{restaurant.zone.ville.nom}--{restaurant.zone.nom}
                                </div>
                                <div>
                                    <strong className="card-text">Speciality:</strong> {restaurant.specialite.nom}
                                </div>

                            </div>
                        </div>
                    </div>

                )}
            </div>
        );
    };

    const gridItem = (restaurant) => {
        return (
            <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">

                {noResults ? (
                    <div className="col mb-4">
                        <div className="card h-100">
                            <div className="card-body">
                                <Alert severity="info">
                                    <AlertTitle>Info</AlertTitle>
                                    <strong>oops...!</strong> — No Restaurant Found
                                </Alert>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div key={restaurant.id} className="col mb-4 card h-100">
                        <div className="card p-2">
                            <Link to={`restaurants/${restaurant.id}`}>
                                <img
                                    className="card-img-top mx-auto mt-2 "
                                    src={restaurant.photo}
                                    alt={restaurant.nom}
                                    style={{
                                        width: '180px',
                                        height: '140px',
                                        borderRadius: '8px',
                                    }}
                                />
                            </Link>
                            <div className="card-body">
                                <h6 className="card-title">{restaurant.nom}</h6>
                                <Tag severity="success" icon="pi pi-clock">

                                    {restaurant.dateOuverture} / {restaurant.dateFermeture}
                                </Tag>
                                <span className="card-text-value mx-2">
                                    {restaurant.dateOuverture && restaurant.dateFermeture ? (
                                        isRestaurantOpen(restaurant.dateOuverture, restaurant.dateFermeture) ? (
                                            <Tag severity="info" icon="pi pi-check">
                                                Open
                                            </Tag>
                                        ) : (
                                            <Tag severity="danger" icon="pi pi-moon">
                                                Closed
                                            </Tag>
                                        )
                                    ) : (
                                        "N/A"
                                    )}
                                </span>
                                <div className="mt-1">
                                    <strong className="card-text ">Address: </strong> {restaurant.adresse}
                                </div>
                                <div>
                                    <strong
                                        className="card-text mt-1 ">City: </strong>{restaurant.zone.ville.nom}--{restaurant.zone.nom}
                                </div>
                                <div>
                                    <strong className="card-text">Speciality:</strong> {restaurant.specialite.nom}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const itemTemplate = (restaurant, layout) => {
        if (!restaurant) {
            return;
        }

        if (layout === 'list') return listItem(restaurant);
        else if (layout === 'grid') return gridItem(restaurant);
    };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)}/>
            </div>
        );
    };


    return (
        <>
            <div className="col-md-12   mb-3 mt-5">
                <Dropdown
                    className="mr-2"
                    value={selectedCity}
                    options={cities.map((ville) => ({label: ville.nom, value: ville.nom}))}
                    onChange={handleCityChange}
                    placeholder="Select a city"
                />
                {selectedCity && (
                    <Dropdown
                        value={selectedZone}
                        options={zones.map((zone) => ({label: zone.nom, value: zone.nom}))}
                        onChange={handleZoneChange}
                        placeholder="Select a zone"
                    />
                )}

                <Dropdown
                    className="ml-2"
                    value={selectedSpecialite}
                    options={specialites.map((specialite) => ({label: specialite.nom, value: specialite.nom}))}
                    onChange={handleSpecialiteChange}
                    placeholder="Select a specialite"
                />
            </div>
            <div className="card mx-2">
                <DataView value={restaurants} itemTemplate={itemTemplate} layout={layout} header={header()}/>
            </div>
        </>
    );
}
