import axios from '../service/callerService';
import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import {Dropdown} from 'primereact/dropdown';
import {Tag} from "primereact/tag";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Rating} from "@mui/material";
import Skeleton from "../skeleton/ProfileSkeleton"
import DataviewSkeleton from "../skeleton/DataviewSkeleton"
import Typography from "@mui/material/Typography";

export default function ClientRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [cities, setCities] = useState([]);
    const [zones, setZones] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [selectedSpecialite, setSelectedSpecialite] = useState(null);
    const [specialites, setSpecialites] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');
    const [loading, setLoading] = useState(true); // Track loading state

    const sortOptions = [
        { label: 'Top Rated', value: '!id' },
        { label: 'poorly-rated', value: 'id' }
    ];


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
            setLoading(false);
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
            });
        } else {

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

    const getAverageRating = (restaurant) => {
        const ratings = restaurant.produitList.map((product) => product.avisList.reduce((accumulator, currentValue) => accumulator + currentValue.rating, 0));
        if (ratings.length > 0) {
            const totalRating = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            const ratingsreview = restaurant.produitList.map((product) => product.avisList.length);
            const reviewCount = ratingsreview.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return totalRating /reviewCount;
        } else {
            return 0;
        }
    };

    const getReviews = (restaurant) => {
        const ratings = restaurant.produitList.map((product) => product.avisList.length);
        const reviewCount = restaurant.produitList.length;

        if (ratings.length > 0) {
            return reviewCount;
        } else {
            return 0;
        }
    };




    const listItem = (restaurant) => {
        return (
            <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
                <div key={restaurant.id} className="col mb-4 card h-100">
                    <div className="row  row-cols-1  row-cols-sm-4 row-cols-md-4 row-cols-lg-4 g-4 ">
                        <Link to={`${restaurant.id}`}>
                            <img
                                className="card-img-top mx-auto mt-3 "
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
                                <Tag
                                    severity="warning"
                                    value={restaurant.serie.nom}
                                    style={{
                                        fontSize:"8px",
                                        position: 'absolute',
                                        top: '3px',
                                        right: '11px',
                                    }}
                                />
                                </span>

                            <div className="mt-2">
                                <Rating value={getAverageRating(restaurant)} readOnly cancel={false} ></Rating>
                                <Typography className="font-monospace ">({getReviews(restaurant)})review</Typography>                            </div>
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
            </div>
        );
    };

    if(loading){
        return(<DataviewSkeleton/>)
    }


    const gridItem = (restaurant) => {
        return (
            <div key={restaurant.id} className="mb-3">
                <div className="card h-100 mb-2">
                    <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
                        <Link to={`${restaurant.id}`}>
                            <div style={{position: 'relative'}}>
                                <img className="w-90 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                                     src={restaurant.photo}
                                     alt={restaurant.nom}
                                     style={{
                                         width: '180px',
                                         height: '140px',
                                         borderRadius: '8px'
                                     }}/>

                                <Tag
                                    severity="warning"
                                    value={restaurant.serie.nom}
                                    style={{
                                        fontSize:"10px",
                                        position: 'absolute',
                                        top: '3px',
                                        right: '11px',
                                    }}
                                />
                            </div>
                        </Link>
                        <div
                            className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                <div className="text-xl font-bold ">{restaurant.nom}</div>
                                <Rating value={getAverageRating(restaurant)} readOnly cancel={false} ></Rating>
                                <Typography className="font-monospace ">({getReviews(restaurant)})review</Typography>
                                <div className="flex align-items-center ">
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
                                </div>
                            </div>
                            <div className="d-flex justify-content-lg-between gap-1 align-items-center mt-3">
                                <strong className="card-text mt-1 ">City: </strong>{restaurant.zone.ville.nom}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };




    const itemTemplate = (group) => {
        if (!group || group.length === 0) {
            return <Skeleton/>;
        }

        return (
            <div className="container mt-2">
                <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {group.map((product) => gridItem(product))}
                </div>
            </div>
        );
    };

    const onSortChange = (event) => {
        const value = event.value;

        if (value.indexOf('!') === 0) {
            setSortOrder(-1);
            setSortField(value.substring(1, value.length));
            setSortKey(value);
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
        }
    };


    const header = () => {
        return (
            <div className="flex justify-between items-center">
                <div>
                    <Dropdown
                        options={sortOptions}
                        value={sortKey}
                        optionLabel="label"
                        placeholder="Sort By Price"
                        onChange={onSortChange}
                        className="w-full sm:w-14rem"
                    />
                </div>
                <div>
                    <DataViewLayoutOptions
                        layout={layout}
                        onChange={(e) => setLayout(e.value)}
                    />
                </div>
            </div>
        );
    };
    const header2 = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions
                    layout={layout}
                    onChange={(e) => setLayout(e.value)}
                />
            </div>
        );
    };



    const groupedRestaurants = [];
    for (let i = 0; i < restaurants.length; i += 4) {
        groupedRestaurants.push(restaurants.slice(i, i + 4));
    }

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
                {layout === 'list' && (
                    <div >
                        <DataView value={restaurants} itemTemplate={listItem} layout={layout} header={header()} sortField={sortField} sortOrder={sortOrder}/>
                    </div>
                )}

                {layout === 'grid' && (
                    <div >
                        <DataView value={groupedRestaurants} itemTemplate={itemTemplate} layout={layout} header={header2()} sortField={sortField} sortOrder={sortOrder}/>
                    </div>
                )}
            </div>




        </>
    );
}
