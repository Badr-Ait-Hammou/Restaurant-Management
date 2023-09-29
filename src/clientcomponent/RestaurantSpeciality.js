import axios from '../service/callerService';
import React, {useState, useEffect} from "react";
import {Dropdown} from 'primereact/dropdown';
import {Tag} from "primereact/tag";
import {DataView, DataViewLayoutOptions} from "primereact/dataview";
import {Rating} from "@mui/material";
import DataviewSkeleton from "../skeleton/DataviewSkeleton"
import Typography from "@mui/material/Typography";
import RestaurantMenuRoundedIcon from "@mui/icons-material/RestaurantMenuRounded";
import {Link, useParams} from 'react-router-dom';
import Box from "@mui/material/Box";
import {useDarkMode} from "../components/DarkModeContext";

export default function ClientRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');
    const [loading, setLoading] = useState(true);
    const {id} = useParams();
    const { isDarkMode } = useDarkMode();



    const sortOptions = [
        {label: 'Top Rated', value: '!rating'},
        {label: 'poorly-rated', value: 'rating'}
    ];



    useEffect(() => {
        axios.get(`/api/controller/restaurants/specialite/${id}`).then((response) => {
            setRestaurants(response.data);
            setLoading(false);
            console.log(response.data);
        });
    }, [id]);


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


    if (loading) {
        return (<DataviewSkeleton/>)
    }


    const gridItem = (restaurant) => {
        return (
            <Box sx={{height:"380px"}} className={`col-12 sm:col-6 lg:col-4 xl:col-3   ${isDarkMode ? 'bg-black text-white  p-2  px-1' : 'bg-white mb-2 p-1'}`}>
                <div className={`p-1 border-2 border-teal-400  border-round ${isDarkMode ? 'bg-black text-white' : 'bg-white'}`}>

                    <div className="flex flex-column align-items-center gap-2 py-1">
                        <Link to={`${restaurant.id}`}>
                            <div style={{position: 'relative'}}>
                                <img className=" w-20 sm:w-20rem xl:w-20rem border-2  shadow-2 block xl:block mx-auto border-round"
                                     src={restaurant.photo}
                                     alt={restaurant.nom}
                                     style={{
                                         backgroundColor:"white",
                                         width: '400px',
                                         height: '180px',
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
                                {restaurant.dateOuverture && restaurant.dateFermeture ? (
                                    isRestaurantOpen(restaurant.dateOuverture, restaurant.dateFermeture) ? (
                                        <Tag severity="info" className="animate-pulse" icon="pi pi-check" value={"Open"}  style={{
                                            fontSize: "10px",
                                            position: 'absolute',
                                            top: '3px',
                                            left: '5px',
                                        }}

                                        />

                                    ) : (
                                        <Tag severity="danger" icon="pi pi-moon" value={"Closed"}  style={{
                                            fontSize: "10px",
                                            position: 'absolute',
                                            top: '3px',
                                            left: '5px',
                                        }}

                                        />
                                    )
                                ) : (
                                    "N/A"
                                )}
                            </div>
                        </Link>
                        <div className="text-xl font-monospace">{restaurant.nom}</div>
                        <Typography sx={{height:"40px",fontSize:"15px",color: isDarkMode ? "white" : "grey"}}  >
                            {restaurant.adresse}
                        </Typography>

                    </div>
                    <div className="content-info">
                        <div className="flex align-items-center justify-content-between py-2 px-2 gap-1">
                            <div className="flex align-items-center gap-1">
                                <Rating value={getAverageRating(restaurant)} readOnly  precision={0.5} style={{fontSize:"16px"}}></Rating>
                            </div>
                            <div className="flex align-items-center gap-1">
                                <Typography
                                    className="font-monospace ">({getReviews(restaurant)})review{getReviews(restaurant) !== 1 ? 's' : ''}
                                </Typography>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-between py-2 px-2 gap-1">
                            <div className="flex align-items-center gap-1">
                                <Tag value={restaurant.specialite && restaurant.specialite.nom}
                                     style={{backgroundColor: "rgb(23,113,122)"}}>
                                </Tag>
                            </div>
                            <div className="flex align-items-center gap-1">
                                <Tag value={`${restaurant.dateOuverture} / ${restaurant.dateFermeture}`}  className="  border border-teal-400" style={{backgroundColor:"transparent",fontSize:"11px",color: isDarkMode ? "white" : "black"}} icon={"pi pi-clock"}/>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        );
    };


    const listItem = (restaurant) => {
        return (
            <div className={`col-12    ${isDarkMode ? 'bg-black text-white  p-2  px-1 border-teal-400' : 'bg-white mb-2 p-1'}`}>
                <div className="flex flex-column xl:flex-row xl:align-items-start   p-2 gap-4">
                    <Link to={`${restaurant.id}`}>
                        <div style={{position: 'relative'}}>
                            <img
                                className="w-20 sm:w-20rem xl:w-20rem shadow-2 border-2 border-teal-400 block xl:block mx-auto border-round"
                                src={restaurant.photo}
                                alt={restaurant.nom}
                                style={{
                                    backgroundColor:"white",
                                    width: '400px',
                                    height: '200px',
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
                            <div className="text-xl font-monospace">{restaurant.nom}</div>
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
                                <Typography sx={{height:"40px",fontSize:"20px"}}   color="text.secondary">
                                    {restaurant.adresse}
                                </Typography>
                            </div>
                        </div>
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <Rating value={getAverageRating(restaurant)} readOnly
                                    precision={0.5}></Rating>
                            <Typography
                                className="font-monospace align-items-center">({getReviews(restaurant)})review{getReviews(restaurant) !== 1 ? 's' : ''}</Typography>


                            <span className="card-text-value ">
                            <Tag value={`${restaurant.dateOuverture} / ${restaurant.dateFermeture}`}  className=" mx-1 border border-teal-400" style={{backgroundColor:"transparent",fontSize:"11px",color: isDarkMode ? "white" : "black"}} icon={"pi pi-clock"}/>

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
            <div  className={`flex justify-between  items-center ${isDarkMode ? 'bg-black text-white p-3 -m-4' : ' '}`}>
                <div>
                    <Dropdown
                        options={sortOptions}
                        value={sortKey}
                        optionLabel="label"
                        placeholder="Sort By Rating"
                        onChange={onSortChange}
                        className={`w-full sm:w-14rem ${isDarkMode ? 'bg-black text-white border-2  border-teal-400' : ' '}`}
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

            <div className={`card mx-2 mt-5 ${isDarkMode ? 'bg-black text-white' : 'bg-white'}`}>
                {layout === 'list' && (
                    <div>
                        <DataView value={restaurants} itemTemplate={listItem} layout={layout} header={header()} paginatorClassName={`${isDarkMode ? "bg-black border-teal-400" :""}`}
                                  sortField={sortField} sortOrder={sortOrder} paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={6}/>
                    </div>
                )}

                {layout === 'grid' && (
                    <div>
                        <DataView value={restaurants} itemTemplate={gridItem} layout={layout} paginatorClassName={`${isDarkMode ? "bg-black border-teal-400" :""}`}
                                  header={header()} sortField={sortField} sortOrder={sortOrder} paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={12}/>
                    </div>
                )}
            </div>


        </>
    );
}
