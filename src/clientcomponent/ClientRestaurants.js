import axios from '../service/callerService';
import React, {useState, useEffect} from "react";
import {Link} from 'react-router-dom';
import {Dropdown} from 'primereact/dropdown';
import {Tag} from "primereact/tag";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Rating} from "@mui/material";
import DataviewSkeleton from "../skeleton/DataviewSkeleton"
import Typography from "@mui/material/Typography";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";

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
        {label: 'Top Rated', value: '!rating'},
        {label: 'poorly-rated', value: 'rating'}
    ];

    useEffect(() => {
        fetchData();
        handleDataTableLoad();
    }, );

    const fetchData = async () => {
            const response = await axios.get("/api/controller/specialites/");
            setSpecialites(response.data);
            const resp = await axios.get("/api/controller/villes/");
            setCities(resp.data);
            const res = await axios.get("/api/controller/restaurants/");
            setRestaurants(res.data);

    }

    const handleDataTableLoad = () => {
        setLoading(false);
    };

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
            return totalRating / reviewCount;
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


    if (loading || restaurants.length ===0) {
        return (<DataviewSkeleton/>)
    }



    const gridItem = (restaurant) => {
        return (
            <div className="col-12 sm:col-6 lg:col-4 xl:col-3 p-2 ">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <Tag severity="success" icon="pi pi-clock">
                                {restaurant.dateOuverture} / {restaurant.dateFermeture}
                            </Tag>
                        </div>
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
                    <div className="flex flex-column align-items-center gap-2 py-2">
                        <Link to={`${restaurant.id}`}>
                            <div style={{position: 'relative'}}>
                                <img
                                    className=" w-16 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                                    src={restaurant.photo}
                                    alt={restaurant.nom}
                                    style={{
                                        width: '100%',
                                        height: '140px',
                                        borderRadius: '8px'
                                    }}/>

                                <Tag
                                    severity="warning"
                                    value={restaurant.serie && restaurant.serie.nom}
                                    style={{
                                        fontSize: "10px",
                                        position: 'absolute',
                                        top: '3px',
                                        right: '5px',
                                    }}
                                />
                            </div>
                        </Link>
                        <div className="text-2xl font-bold">{restaurant.nom}</div>
                        <Typography variant="body2" className="ml-1"
                                    color="text.secondary">{restaurant.adresse}
                        </Typography>
                        <Tag value={restaurant.specialite && restaurant.specialite.nom}
                             style={{backgroundColor: "rgb(23,113,122)"}}>

                        </Tag>
                        <Rating value={getAverageRating(restaurant)} readOnly  precision={0.5}></Rating>
                        <Typography
                            className="font-monospace ">({getReviews(restaurant)})review{getReviews(restaurant) !== 1 ? 's' : ''}
                        </Typography>
                    </div>
                    <div className=" flex align-items-center justify-content-between">

                    </div>
                </div>
            </div>
        );
    };


    const listItem = (restaurant) => {
        return (
            <div className="col-12  ">
                <div className="flex flex-column xl:flex-row xl:align-items-start   p-3 gap-4">
                    <Link to={`${restaurant.id}`}>
                        <div style={{position: 'relative'}}>
                            <img
                                className="w-10 sm:w-10rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                                src={restaurant.photo}
                                alt={restaurant.nom}
                                style={{
                                    width: '180px',
                                    height: '140px',
                                    borderRadius: '18px'
                                }}
                            />
                            <Tag

                                severity="warning"
                                value={restaurant.serie && restaurant.serie.nom}
                                style={{
                                    fontSize: "10px",
                                    position: 'absolute',
                                    top: '3px',
                                    right: '11px',
                                }}
                            />
                        </div>
                    </Link>
                    <div
                        className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-2">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{restaurant.nom}</div>
                            <div className="flex align-items-center gap-3">
                                <Tag value={restaurant.specialite && restaurant.specialite.nom} severity="danger"
                                     icon="pi pi-tag"/>
                                <span className="flex align-items-center gap-2">
                                     <Tag
                                         style={{background: 'linear-gradient(-225deg,#AC32E4 0%,#7918F2 48%,#4801FF 100%)'}}
                                         icon={<RestaurantMenuRoundedIcon
                                             style={{fontSize: '16px'}}/>}> {restaurant.ville && restaurant.ville.nom} --{restaurant.zone && restaurant.zone.nom}
                                     </Tag>
                                </span>

                            </div>
                            <div>
                                <Typography variant="body2" className="ml-1"
                                            color="text.secondary">{restaurant.adresse}</Typography>
                            </div>
                        </div>
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <Rating value={getAverageRating(restaurant)} readOnly
                                    precision={0.5}></Rating>
                            <Typography
                                className="font-monospace align-items-center">({getReviews(restaurant)})review{getReviews(restaurant) !== 1 ? 's' : ''}</Typography>


                            <span className="card-text-value ">
                                   <Tag severity="success" icon="pi pi-clock" className="mx-1" >
                                        {restaurant.dateOuverture} / {restaurant.dateFermeture}
                                    </Tag>
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
            setRestaurants([...restaurants].sort((a, b) => getAverageRating(b) - getAverageRating(a)));
        } else {
            setSortOrder(1);
            setSortField(value);
            setSortKey(value);
            setRestaurants([...restaurants].sort((a, b) => getAverageRating(a) - getAverageRating(b)));
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
                        placeholder="Sort By Rating"
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
                    <div>
                        <DataView value={restaurants} itemTemplate={listItem} layout={layout} header={header()}
                                  sortField={sortField} sortOrder={sortOrder} paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={6}/>
                    </div>
                )}

                {layout === 'grid' && (
                    <div>
                        <DataView value={restaurants} itemTemplate={gridItem} layout={layout}
                                  header={header()} sortField={sortField} sortOrder={sortOrder} paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={12}/>
                    </div>
                )}
            </div>


        </>
    );
}
