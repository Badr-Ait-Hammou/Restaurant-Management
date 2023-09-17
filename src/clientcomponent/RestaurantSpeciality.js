// import axios from '../service/callerService';
// import React, {useState, useEffect} from "react";
// import {Link, useParams} from 'react-router-dom';
// import {Dropdown} from 'primereact/dropdown';
// import {Tag} from "primereact/tag";
// import {DataView, DataViewLayoutOptions} from "primereact/dataview";
// import {Rating} from "@mui/material";
// import Skeleton from "../skeleton/ProfileSkeleton"
// import DataviewSkeleton from "../skeleton/DataviewSkeleton"
//
// export default function ClientRestaurants() {
//     const [restaurants, setRestaurants] = useState([]);
//     const [layout, setLayout] = useState('grid');
//     const [sortKey, setSortKey] = useState('');
//     const [sortOrder, setSortOrder] = useState(0);
//     const [sortField, setSortField] = useState('');
//     const [loading, setLoading] = useState(true);
//     const {id} = useParams();
//
//
//     const sortOptions = [
//         { label: 'Id High to Low', value: '!id' },
//         { label: 'Id Low to High', value: 'id' }
//     ];
//
//
//
//
//
//     useEffect(() => {
//         axios.get(`/api/controller/restaurants/specialite/${id}`).then((response) => {
//             setRestaurants(response.data);
//             setLoading(false);
//             console.log(response.data);
//         });
//     }, [id]);
//
//
//
//
//
//
//
//     function isRestaurantOpen(openingTime, closingTime) {
//         const now = new Date();
//         const openTime = parseTimeString(openingTime);
//         const closeTime = parseTimeString(closingTime);
//
//         return now >= openTime && now <= closeTime;
//     }
//
//     function parseTimeString(timeString) {
//         const [hours, minutes] = timeString.split(':');
//         const now = new Date();
//         now.setHours(parseInt(hours, 10));
//         now.setMinutes(parseInt(minutes, 10));
//         return now;
//     }
//
//
//     const listItem = (restaurant) => {
//         return (
//             <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
//                 <div key={restaurant.id} className="col mb-4 card h-100">
//                     <div className="row  row-cols-1  row-cols-sm-4 row-cols-md-4 row-cols-lg-4 g-4 ">
//                         <Link to={`/admin/home/restaurants/${restaurant.id}`}>
//                             <img
//                                 className="card-img-top mx-auto mt-3 "
//                                 src={restaurant.photo}
//                                 alt={restaurant.nom}
//                                 style={{
//                                     width: '180px',
//                                     height: '140px',
//                                     borderRadius: '8px'
//                                 }}/>
//                         </Link>
//                         <div className="card-body">
//                             <h6 className="card-title">{restaurant.nom}</h6>
//                             <Tag severity="success" icon="pi pi-clock">
//                                 {restaurant.dateOuverture} / {restaurant.dateFermeture}
//                             </Tag>
//                             <span className="card-text-value mx-2">
//                                     {restaurant.dateOuverture && restaurant.dateFermeture ? (
//                                         isRestaurantOpen(restaurant.dateOuverture, restaurant.dateFermeture) ? (
//                                             <Tag severity="info" icon="pi pi-check">
//                                                 Open
//                                             </Tag>
//                                         ) : (
//                                             <Tag severity="danger" icon="pi pi-moon">
//                                                 Closed
//                                             </Tag>
//                                         )
//                                     ) : (
//                                         "N/A"
//                                     )}
//                                 <Tag
//                                     severity="warning"
//                                     value={restaurant.serie.nom}
//                                     style={{
//                                         fontSize:"8px",
//                                         position: 'absolute',
//                                         top: '3px',
//                                         right: '11px',
//                                     }}
//                                 />
//                                 </span>
//                             <div className="mt-1">
//                                 <strong className="card-text ">Address: </strong> {restaurant.adresse}
//                             </div>
//                             <div>
//                                 <strong
//                                     className="card-text mt-1 ">City: </strong>{restaurant.zone.ville.nom}--{restaurant.zone.nom}
//                             </div>
//                             <div>
//                                 <strong className="card-text">Speciality:</strong> {restaurant.specialite.nom}
//                             </div>
//
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };
//
//     if(loading || !restaurants){
//         return(<DataviewSkeleton/>)
//     }
//
//
//     const gridItem = (restaurant) => {
//         return (
//             <div key={restaurant.id} className="mb-3">
//                 <div className="card h-100 mb-2">
//                     <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
//                         <Link to={`/admin/home/restaurants/${restaurant.id}`}>
//                             <div style={{position: 'relative'}}>
//                                 <img className="w-90 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
//                                      src={restaurant.photo}
//                                      alt={restaurant.nom}
//                                      style={{
//                                          width: '180px',
//                                          height: '140px',
//                                          borderRadius: '8px'
//                                      }}/>
//
//                                 <Tag
//                                     severity="warning"
//                                     value={restaurant.serie.nom}
//                                     style={{
//                                         fontSize:"10px",
//                                         position: 'absolute',
//                                         top: '3px',
//                                         right: '11px',
//                                     }}
//                                 />
//                             </div>
//                         </Link>
//                         <div
//                             className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
//                             <div className="flex flex-column align-items-center sm:align-items-start gap-3">
//                                 <div className="text-xl font-bold ">{restaurant.nom}</div>
//                                 <Rating value={restaurant.id} readOnly cancel={false}></Rating>
//                                 <div className="flex align-items-center ">
//                                     <Tag severity="success" icon="pi pi-clock">
//                                         {restaurant.dateOuverture} / {restaurant.dateFermeture}
//                                     </Tag>
//                                     <span className="card-text-value mx-2">
//                                     {restaurant.dateOuverture && restaurant.dateFermeture ? (
//                                         isRestaurantOpen(restaurant.dateOuverture, restaurant.dateFermeture) ? (
//                                             <Tag severity="info" icon="pi pi-check">
//                                                 Open
//                                             </Tag>
//                                         ) : (
//                                             <Tag severity="danger" icon="pi pi-moon">
//                                                 Closed
//                                             </Tag>
//                                         )
//                                     ) : (
//                                         "N/A"
//                                     )}
//                                 </span>
//                                 </div>
//                             </div>
//                             <div className="d-flex justify-content-lg-between gap-1 align-items-center mt-3">
//                                 <strong className="card-text mt-1 ">City: </strong>{restaurant.zone.ville.nom}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };
//
//
//
//
//     const itemTemplate = (group) => {
//         if (!group || group.length === 0) {
//             return <Skeleton/>;
//         }
//
//         return (
//             <div className="container mt-2">
//                 <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
//                     {group.map((product) => gridItem(product))}
//                 </div>
//             </div>
//         );
//     };
//
//     const onSortChange = (event) => {
//         const value = event.value;
//
//         if (value.indexOf('!') === 0) {
//             setSortOrder(-1);
//             setSortField(value.substring(1, value.length));
//             setSortKey(value);
//         } else {
//             setSortOrder(1);
//             setSortField(value);
//             setSortKey(value);
//         }
//     };
//
//
//     const header = () => {
//         return (
//             <div className="flex justify-between items-center">
//                 <div>
//                     <Dropdown
//                         options={sortOptions}
//                         value={sortKey}
//                         optionLabel="label"
//                         placeholder="Sort By Price"
//                         onChange={onSortChange}
//                         className="w-full sm:w-14rem"
//                     />
//                 </div>
//                 <div>
//                     <DataViewLayoutOptions
//                         layout={layout}
//                         onChange={(e) => setLayout(e.value)}
//                     />
//                 </div>
//             </div>
//         );
//     };
//     const header2 = () => {
//         return (
//             <div className="flex justify-content-end">
//                 <DataViewLayoutOptions
//                     layout={layout}
//                     onChange={(e) => setLayout(e.value)}
//                 />
//             </div>
//         );
//     };
//
//
//
//     const groupedRestaurants = [];
//     for (let i = 0; i < restaurants.length; i += 4) {
//         groupedRestaurants.push(restaurants.slice(i, i + 4));
//     }
//
//     return (
//         <>
//             <div className="card mx-2 mt-5">
//                 {layout === 'list' && (
//                     <div >
//                         <DataView value={restaurants} itemTemplate={listItem} layout={layout} header={header()} sortField={sortField} sortOrder={sortOrder}/>
//                     </div>
//                 )}
//
//                 {layout === 'grid' && (
//                     <div >
//                         <DataView value={groupedRestaurants} itemTemplate={itemTemplate} layout={layout} header={header2()} sortField={sortField} sortOrder={sortOrder}/>
//                     </div>
//                 )}
//             </div>
//
//
//
//
//         </>
//     );
// }
//



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

export default function ClientRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [layout, setLayout] = useState('grid');
    const [sortKey, setSortKey] = useState('');
    const [sortOrder, setSortOrder] = useState(0);
    const [sortField, setSortField] = useState('');
    const [loading, setLoading] = useState(true);
    const {id} = useParams();


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
                        <Rating value={getAverageRating(restaurant)} readOnly cancel={false} precision={0.5}></Rating>
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
                            <Rating value={getAverageRating(restaurant)} readOnly cancel={false}
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

            <div className="card mx-2 mt-5">
                {layout === 'list' && (
                    <div>
                        <DataView value={restaurants} itemTemplate={listItem} layout={layout} header={header()}
                                  sortField={sortField} sortOrder={sortOrder}/>
                    </div>
                )}

                {layout === 'grid' && (
                    <div>
                        <DataView value={restaurants} itemTemplate={gridItem} layout={layout}
                                  header={header()} sortField={sortField} sortOrder={sortOrder}/>
                    </div>
                )}
            </div>


        </>
    );
}
