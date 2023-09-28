import React from "react"
import {Button} from "primereact/button"
import Image1 from "../images/deliver.jpg"
import {Avatar} from 'primereact/avatar';
import {Divider} from 'primereact/divider';
import ordersImage from "../images/flowers.jpg";
import blackImage from "../images/blackbackground.jpg";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import {Box, Grid, Rating} from "@mui/material";
import {InputText} from "primereact/inputtext";
import {useState} from "react";
import {Dropdown} from "primereact/dropdown";
import axios from "../service/callerService";
import {useEffect} from "react";
import {Toolbar} from "primereact/toolbar";
import {accountService} from "../service/accountService";
import {Dialog} from 'primereact/dialog';
import {useRef} from "react";
import {Toast} from "primereact/toast";
import {Tag} from "primereact/tag";
import ShareLocationIcon from '@mui/icons-material/ShareLocation';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import LinkIcon from '@mui/icons-material/Link';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import {DataView} from "primereact/dataview";
import saleIcon from "../images/onsaleIcon.gif";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import RestaurantIcon from "@mui/icons-material/Restaurant";


export default function RestaurantProfile() {
    const [nom, setNom] = useState('');
    const [RestaurantDialog, setRestaurantDialog] = useState(false);
    const [zone, setZones] = useState([]);
    const [userRestaurantid, setUserRestaurantId] = useState([]);
    const [restaurantid, setRestaurantId] = useState([]);
    const [userid, setUserId] = useState("");
    const [series, setSeries] = useState([]);
    const [specialites, setSpecialites] = useState([]);
    const [zoneid, setZoneid] = useState("");
    const [serieid, setSerieid] = useState("");
    const [specialiteid, setSpecialiteid] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [dateOuverture, setdateopen] = useState("");
    const [dateFermeture, setdateclose] = useState("");
    const [adresse, setAdresse] = useState("");
    const [photo, setPhotos] = useState("");
    const [products, setProducts] = useState([]);


    const [loading, setLoading] = useState(true);
    const toast = useRef(null);


    const handleZoneChange = (e) => {
        setZoneid(e.value);
    };
    const handleSerieChange = (e) => {
        setSerieid(e.value);
    };
    const handleSpecialityChange = (e) => {
        setSpecialiteid(e.value);
    };
    const handleDataTableLoad = () => {
        setLoading(false);
    };

    useEffect(() => {
        fetchUserData();
        handleDataTableLoad();
    }, [restaurantid]);


    const fetchUserData = async () => {
        const tokenInfo = accountService.getTokenInfo();
        if (tokenInfo) {
            try {
                const user = await accountService.getUserByEmail(tokenInfo.sub);
                setUserId(user.id);
                const restaurantId = user.restaurantList[0]?.id;
                const restaurant = user.restaurantList[0];
                setRestaurantId(restaurantId);
                setUserRestaurantId(restaurant);
                console.log(restaurantId);
                const response = await axios.get(`/api/controller/produits/restaurant/${restaurantId}`);
                setProducts(response.data);
                const Response = await axios.get('/api/controller/series/');
                setSeries(Response.data);

                const res = await axios.get("/api/controller/zones/");
                setZones(res.data);

                const resp = await axios.get("/api/controller/specialites/");
                setSpecialites(resp.data);
            } catch (error) {
                console.log('Error retrieving user:', error);
            }
        }
    };


    useEffect(() => {
        const iframeData = document.getElementById("iframeId");
        if (iframeData) {
            const zoomLevel = 16;
            iframeData.src = `https://maps.google.com/maps?q=${userRestaurantid.latitude},${userRestaurantid.longitude}&hl=es;z=${zoomLevel}&output=embed`;
        }
    }, [userRestaurantid.latitude, userRestaurantid.longitude]);



    // const apiKey = 'AIzaSyDzmu1dHaje4yWHlQkP4cGC6lwWBRuwaUA';
    // const zoomLevel = 15;
    //
    // useEffect(() => {
    //     const iframeData = document.getElementById("iframeId");
    //     if (iframeData) {
    //         iframeData.src = `https://maps.google.com/maps?q=${userRestaurantid.latitude},${userRestaurantid.longitude}&hl=es&z=${zoomLevel}&output=embed&key=${apiKey}`;
    //     }
    // }, [userRestaurantid.latitude, userRestaurantid.longitude, apiKey]);

    const loadRestaurant = async () => {
        const respo = await axios.get(`/api/controller/restaurants/${restaurantid}`);
        setUserRestaurantId(respo.data);
    }

    const openNew = () => {
        setUserRestaurantId(userRestaurantid);
        setNom(userRestaurantid.nom);
        setdateopen(userRestaurantid.dateOuverture);
        setdateclose(userRestaurantid.dateFermeture);
        setAdresse(userRestaurantid.adresse);
        setLatitude(userRestaurantid.latitude);
        setLongitude(userRestaurantid.longitude);
        setSpecialiteid(userRestaurantid.specialite && userRestaurantid.specialite.id);
        setZoneid(userRestaurantid.zone && userRestaurantid.zone.id);
        setPhotos(userRestaurantid.photo);
        setSerieid(userRestaurantid.serie && userRestaurantid.serie.id);
        setRestaurantDialog(true);
    };


    const hideDialog = () => {
        setRestaurantDialog(false);
    };

    const RestaurantDialogFooter = (
        <React.Fragment>
            <div className="template flex justify-content-end mt-1">
                <Button className="cancel p-0" aria-label="Slack" onClick={hideDialog}>
                    <i className="pi pi-times px-2"></i>
                    <span className="px-3">Cancel</span>
                </Button>
                <Button className="edit p-0" aria-label="Slack" onClick={() => handleEdit(userRestaurantid)}>
                    <i className="pi pi-check px-2"></i>
                    <span className="px-3">Update</span>
                </Button>
            </div>
        </React.Fragment>
    );

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotos(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };


    const handleEdit = async (restaurantToUpdate) => {
        try {
            if (nom.trim() === '' || !zoneid || !serieid || !specialiteid) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Fields cannot be empty',
                    life: 3000,
                });
                return;
            }
            const updatedRestaurant = {
                ...restaurantToUpdate,
                nom: nom,
                longitude: longitude,
                latitude: latitude,
                dateOuverture: dateOuverture,
                dateFermeture: dateFermeture,
                adresse: adresse,
                photo: photo,
                zone: {
                    id: zoneid,
                },
                serie: {
                    id: serieid,
                },
                specialite: {
                    id: specialiteid,
                },
                user: {
                    id: userid,
                },
            };
            await axios.put(`/api/controller/restaurants/${restaurantToUpdate.id}`, updatedRestaurant);
            hideDialog();
            loadRestaurant();
            showupdate();
        } catch (error) {
            console.error(error);
        }
    };

    const showupdate = () => {
        toast.current.show({severity: 'info', summary: 'success', detail: 'item updated successfully', life: 3000});
    }


    const itemTemplate = (product) => {
        if (!product) {
            return;
        }
        return (
            <Box sx={{height:"380px"}} className="col-12 sm:col-6 lg:col-4 xl:col-3 p-1 mt-2 mb-1">
                <div className="p-1 border-1 surface-border surface-card border-round">
                    <div className="flex flex-column align-items-center gap-1">
                            <div style={{position: 'relative'}} className="hover:ease-out ">
                                <img className=" w-20 sm:w-20rem xl:w-20rem  shadow-2 block xl:block mx-auto border-round"
                                     src={product && product.photo}
                                     alt={product.nom}
                                     style={{
                                         width: '400px',
                                         height: '200px',
                                         borderRadius: '8px'
                                     }}/>
                                {product.stock <= 0 ? (
                                    <Tag
                                        className="animate-pulse"
                                        severity="danger"
                                        value="Out of Stock"
                                        style={{
                                            fontSize: '8px',
                                            position: 'absolute',
                                            top: '3px',
                                            right: '11px',
                                        }}
                                    />
                                ) : product.stock < 20 ? (
                                    <Tag
                                        severity="warning"
                                        value={` Low Stock :${product.stock} Pcs`}
                                        style={{
                                            fontSize: '8px',
                                            position: 'absolute',
                                            top: '3px',
                                            right: '11px',
                                        }}
                                    />
                                ) : (
                                    <Tag
                                        value={` In Stock :${product.stock} Pcs`}
                                        style={{
                                            fontSize: '8px',
                                            position: 'absolute',
                                            top: '3px',
                                            right: '11px',
                                            backgroundColor:"rgb(1,169,164)",

                                        }}

                                    />
                                )}

                                {product.promotion === true ?(
                                    <Tag value={"On sale"}
                                         severity="danger"
                                         style={{
                                             fontSize: '8px',
                                             position: 'absolute',
                                             top: '3px',
                                             left: '11px',
                                         }}
                                         icon={<img src={saleIcon} alt="saleicon" width={"12px"} />}
                                    />
                                ):(
                                    <Tag value={"New"}
                                         severity="info"
                                         style={{
                                             fontSize: '8px',
                                             position: 'absolute',
                                             top: '3px',
                                             left: '11px',
                                         }}
                                    />
                                )}

                            </div>
                        <div className="text-2xl font-monospace">{product.nom}</div>
                        <Typography sx={{height:"40px",fontSize:"10px"}}   color="text.secondary">
                            {product.description}
                        </Typography>
                    </div>


                    <div className="content-info">
                        <div className="flex align-items-center justify-content-between py-2 px-3 gap-2">
                            <div className="flex align-items-center gap-2">
                                <Rating value={getAverageRating(product)} readOnly  precision={0.5} style={{fontSize:"16px"}}></Rating>
                            </div>
                            <div className="flex align-items-center gap-2">
                                <Typography
                                    className="font-monospace ">({getReviews(product)})review{getReviews(product) !== 1 ? 's' : ''}
                                </Typography>
                            </div>
                        </div>
                        <div className="flex align-items-center justify-content-between py-2 px-1 ">
                            {product.prix >= 100 ?(
                                <div
                                    className="flex align-items-center justify-content-center   surface-border ">
                                    <Tag value={"Free Shipping"} className="border border-teal-400" style={{backgroundColor:"transparent",color:"black"}} icon={<DeliveryDiningIcon style={{fontSize:"20px",marginRight:"5px",color:"rgb(34,129,104)"}}/>}/>
                                </div>
                            ):(
                                <div
                                    className="flex align-items-center justify-content-center   surface-border ">
                                    <Tag value={"Shipping fee : 30 DH"} className="border border-teal-400" style={{backgroundColor:"transparent",color:"black",fontSize:"10px"}} icon={<DeliveryDiningIcon style={{fontSize:"20px",marginRight:"5px",color:"rgb(34,129,104)"}}/>}/>

                                </div>
                            )}
                            <div
                                className="flex align-items-center gap-1 justify-content-center   surface-border px-1">
                                <Tag  value={product.restaurant && product.restaurant.specialite.nom} className="border border-teal-400" style={{backgroundColor:"transparent",color:"black",fontSize:"10px"}} icon={<RestaurantIcon style={{fontSize:"17px",marginRight:"5px",color:"rgb(34,129,104)"}}/>}/>
                            </div>
                        </div>
                    </div>

                </div>
            </Box>
        );
    };

    const getAverageRating = (product) => {
        const ratings = product.avisList.map((avis) => avis.rating);
        if (ratings.length > 0) {
            const totalRating = ratings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return totalRating / ratings.length;
        } else {
            return 0;
        }
    };

    const getReviews = (product) => {
        return   product.avisList.length;
    };

    const getRestaurantRating = (products) => {
        const productsWithReviews = products.filter((product) => product.avisList.length > 0);

        if (productsWithReviews.length > 0) {
            const averageRatings = productsWithReviews.map((product) => getAverageRating(product));
            const sumOfAverageRatings = averageRatings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            return sumOfAverageRatings / productsWithReviews.length;
        } else {
            return 0;
        }
    };

    const restaurantRating = getRestaurantRating(products);

    return (

        <>
            <Toast ref={toast}/>

            <div className=" relative shadow-2  p-1 border-50 w-full sm:h-64 h-64 bg-cover bg-center"
                 style={{backgroundImage: `url(${blackImage})`}}>
                <div className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm  border-spacing-1 shadow-2 p-0.5 border-50 border-round"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 sm:-bottom-1/3 -bottom-1/3">
                    <Avatar image={userRestaurantid.photo || Image1} style={{width: "160px", height: "160px"}}
                            shape="circle"
                            className=" shadow-4 shadow-indigo-400 mb-3 "/>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-1/2 text-white text-2xl text-uppercase">
                    {userRestaurantid.nom || "Restaurant Name"} Restaurant<br/>
                    <Rating value={restaurantRating}  readOnly  precision={0.5} />
                </div>
            </div>

            <div className=" mx-2 p-1 card  mt-8 ">
                <Toolbar className="mb-2 p-1"
                         start={<Chip
                             avatar={<Avatar alt={"restaurantName"} style={{width: "30px", height: "30px"}}
                                             image={Image1}
                                             shape="circle" className=" shadow-4 shadow-indigo-400  "/>}
                             label={<Typography className="font-monospace mx-2"><span
                                 className="font-bold">Owner : {userRestaurantid.user && userRestaurantid.user.username} </span>
                             </Typography>}
                             variant="filled"
                             size="medium"
                             // sx={{width: 300, height: 70, backgroundColor: "transparent"}}
                         />}
                         end={<div className="template"><Button className="pay" label="Update"  onClick={openNew}/></div>}>
                </Toolbar>
                <div
                    className="font-monospace text-3xl text-black mb-5 mt-2  ">About {userRestaurantid.nom}
                </div>
                <div className="surface-section w-full h-full border-1 shadow-2 bg-cover bg-center border-round" style={{backgroundImage: `url(${blackImage})`}}>


                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Address"}
                                     style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}}
                                     icon={<ShareLocationIcon
                                         style={{fontSize: "20px", marginRight: "8px", color: "rgb(23,113,122)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6  ">
                                <Tag value={userRestaurantid.adresse}  style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Open at :"}
                                     style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}}
                                     icon={<AccessTimeFilledIcon
                                         style={{fontSize: "20px", marginRight: "8px", color: "rgb(38,243,95)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6  ">
                                <Tag  value={userRestaurantid.dateOuverture} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"Close at :"}
                                     style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}}
                                     icon={<NightsStayIcon
                                         style={{fontSize: "20px", marginRight: "8px", color: "rgb(239,90,90)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6  ">
                                <Tag  value={userRestaurantid.dateFermeture} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                                <Tag value={"City  :"} style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}} icon={<LocationCityIcon style={{fontSize: "20px", marginRight: "8px", color: "rgb(90,150,239)"}}/>}/>
                            </div>
                            <div className="text-900 w-6 md:w-6 text-uppercase ">
                                <Tag value={`${userRestaurantid.zone && userRestaurantid.zone.ville.nom} -- ${userRestaurantid.zone && userRestaurantid.zone.nom}`} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                            <Tag value={"Serie  :"} style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}} icon={<LinkIcon style={{fontSize: "20px", marginRight: "8px", color: "rgb(49,141,141)"}}/>}/>
                            </div>
                                <div className="text-900 w-6 md:w-6 text-uppercase ">
                                <Tag  value={userRestaurantid.serie && userRestaurantid.serie.nom} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <div className="text-500 w-6 md:w-6 font-medium">
                            <Tag value={"Speciality  :"} style={{backgroundColor: "rgba(248,246,245,0.93)", color: "black",width:"110px"}} icon={<SmartButtonIcon style={{fontSize: "20px", marginRight: "8px", color: "rgb(191,20,238)"}}/>}/>
                            </div>
                                <div className="text-900 w-6 md:w-6 text-uppercase ">
                                <Tag  value={userRestaurantid.specialite && userRestaurantid.specialite.nom} style={{backgroundColor: "rgb(23,113,122)"}}/>
                            </div>
                        </div>
                    </div>
                    <div className=" my-1 px-5">
                        <div
                            className="flex flex-row  justify-content-between py-3   border-1 border-black  backdrop-blur-sm  border-round hover:transform hover:scale-105 transition-transform ">
                            <iframe id="iframeId" height="250px" width="100%" title="test"
                                    style={{borderRadius: "10px"}}></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <Divider/>
            <div
                className="font-monospace text-3xl text-black mb-5 mt-2  ">{userRestaurantid.nom}'s Products
            </div>
            <Divider/>

            <div className=" mx-2 p-1 card   ">
                <DataView value={products} itemTemplate={itemTemplate}
                          paginator paginatorTemplate={'PrevPageLink CurrentPageReport NextPageLink'} rows={8}/>
            </div>



            <Dialog visible={RestaurantDialog} style={{width: '50rem'}} breakpoints={{'960px': '75vw', '641px': '90vw'}}
                    header="Edit Restaurant" modal className="p-fluid" footer={RestaurantDialogFooter}
                    onHide={hideDialog}>
                <div className=" relative shadow-2  p-1 border-50 w-full sm:h-40 h-44 bg-cover bg-center"
                     style={{backgroundImage: `url(${ordersImage})`}}>
                    <div
                        className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm  border-spacing-1 shadow-2 p-0.5 border-50 border-round"></div>
                    <label htmlFor="uploadImage">
                        <div className="absolute left-1/2 transform -translate-x-1/2 sm:-bottom-1/2 -bottom-1/2">
                            <InputText
                                type="file"
                                id="uploadImage"
                                style={{cursor: "grab", display: "none"}}
                                onChange={handlePhotoChange}
                            />
                            <Avatar image={userRestaurantid.photo} style={{width: "120px", height: "120px"}}
                                    shape="circle"
                                    className=" shadow-4 shadow-indigo-400 mb-3 "
                            />
                        </div>
                    </label>
                    <div
                        className="absolute left-1/2 transform -translate-x-1/2 bottom-1/2 text-white text-sm   text-uppercase">
                        {userRestaurantid.nom || "Restaurant Name"}
                    </div>
                </div>
                <Grid container rowSpacing={1} className="p-fluid grid mt-8">
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="firstname" name="firstname" value={nom}
                                           onChange={(e) => setNom(e.target.value)}/>
                                <label htmlFor="firstname">Name</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="address" name="address" value={adresse}
                                           onChange={(e) => setAdresse(e.target.value)}/>
                                <label htmlFor="adresse">Address</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="longitude" name="longitude" value={longitude}
                                           onChange={(e) => setLongitude(e.target.value)}/>
                                <label htmlFor="longitude">Longitude</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                             <span className="p-float-label">
                                <InputText id="latitude" name="latitude" value={latitude}
                                           onChange={(e) => setLatitude(e.target.value)}/>
                                 <label htmlFor="latitude">Latitude</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText type={"time"} id="dateOuverture" name="dateOuverture" value={dateOuverture}
                                           onChange={(e) => setdateopen(e.target.value)}/>
                                <label htmlFor="dateOuverture">Open at :</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText type={"time"} id="dateFermeture" name="dateFermeture" value={dateFermeture}
                                           onChange={(e) => setdateclose(e.target.value)}/>
                                <label htmlFor="dateFermeture">Close at :</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <Dropdown inputId="zoneid" value={zoneid}
                                          options={zone.map((zone) => ({label: zone.nom, value: zone.id}))}
                                          onChange={handleZoneChange}/>
                            <label htmlFor="zoneid">Zone</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                               <Dropdown inputId="specialiteid" value={specialiteid}
                                         options={specialites.map((sp) => ({label: sp.nom, value: sp.id}))}
                                         onChange={handleSpecialityChange}/>
                            <label htmlFor="specialiteid">Speciality</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                             <span className="p-float-label">
                               <Dropdown inputId="serieid" value={serieid}
                                         options={series.map((serie) => ({label: serie.nom, value: serie.id}))}
                                         onChange={handleSerieChange}/>
                            <label htmlFor="serieid">Serie</label>
                             </span>
                        </Box>
                    </Grid>
                </Grid>
            </Dialog>
        </>

    )
}


