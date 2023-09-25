import React from "react"
import {Button} from "primereact/button"
import Image1 from "../images/deliver.jpg"
import {Avatar} from 'primereact/avatar';
import {Divider} from 'primereact/divider';
import ordersImage from "../images/flowers.jpg";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import {Box, Grid} from "@mui/material";
import {InputText} from "primereact/inputtext";
import {useState} from "react";
import {Dropdown} from "primereact/dropdown";
import axios from "../service/callerService";
import {useEffect} from "react";
import {Toolbar} from "primereact/toolbar";
import {accountService} from "../service/accountService";
import { Dialog } from 'primereact/dialog';
import {useRef} from "react";
import {Toast} from "primereact/toast";



export default function RestaurantProfile() {
    const [nom, setNom] = useState('');
    const [RestaurantDialog, setRestaurantDialog] = useState(false);

    const [zone, setZones] =  useState([]);
    const [userRestaurantid, setUserRestaurantId] =  useState([]);
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
        fetchData();
        handleDataTableLoad();
    }, []);


        const fetchUserData = async () => {
            const tokenInfo = accountService.getTokenInfo();
            if (tokenInfo) {
                try {
                    const user = await accountService.getUserByEmail(tokenInfo.sub);
                    setUserId(user.id);
                    console.log('user', user.id);
                    setUserRestaurantId(user.restaurantList[0] );
                    console.log('user rest', user.restaurantList[0] );
                } catch (error) {
                    console.log('Error retrieving user:', error);
                }
            }
        };


    const fetchData = async () => {
        try {
            const Response = await axios.get('/api/controller/series/');
            setSeries(Response.data);

            const res= await axios.get("/api/controller/zones/");
            setZones(res.data);

            const resp= await axios.get("/api/controller/specialites/");
            setSpecialites(resp.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };




    const loadRestaurant=async ()=>{
        const respo= await axios.get(`/api/controller/restaurants/${userRestaurantid.id}`);
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
        setSpecialiteid(userRestaurantid.specialites && userRestaurantid.specialites.id);
        setZoneid(userRestaurantid.zone && userRestaurantid.zone.id);
        setPhotos(userRestaurantid.photo);
        setSerieid(userRestaurantid.series && userRestaurantid.series.id);
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
                    <span className="px-3">Create</span>
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

            const response = await axios.put(
                `/api/controller/restaurants/${restaurantToUpdate.id}`,
                {
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
                }
            );

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

            hideDialog();
            loadRestaurant();
            showupdate();
        } catch (error) {
            console.error(error);
        }
    };

    const showupdate = () => {
        toast.current.show({severity:'info', summary: 'success', detail:'item updated successfully', life: 3000});
    }

    return (

        <>
            <Toast ref={toast} />

            <div className=" relative shadow-2  p-1 border-50 w-full sm:h-64 h-44 bg-cover bg-center"
                 style={{backgroundImage: `url(${ordersImage})`}}>
                <div
                    className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm  border-spacing-1 shadow-2 p-0.5 border-50 border-round"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 sm:-bottom-1/3 -bottom-1/2">
                    <Avatar image={userRestaurantid.photo || Image1} style={{width: "160px", height: "160px"}} shape="circle"
                            className=" shadow-4 shadow-indigo-400 mb-3 "/>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-1/2 text-white text-2xl text-uppercase">
                    {userRestaurantid.nom ||"Restaurant Name"} Restaurant
                </div>
            </div>

            <div className=" mx-2 p-1 card  mt-8 ">

                <Toolbar className="mb-2 p-1"
                         start={ <Chip
                             avatar={<Avatar alt={"restaurantName"} style={{width: "60px", height: "60px"}} image={Image1}
                                             shape="circle" className=" shadow-4 shadow-indigo-400  "/>}
                             label={<Typography className="font-monospace mx-2"><span className="font-bold">Owner : {userRestaurantid.user && userRestaurantid.user.username} </span>
                         </Typography>}
                             variant="filled"
                             size="medium"
                             sx={{width: 300, height: 70, backgroundColor: "transparent"}}
                         />}
                         end={<Button label="Update" severity="info" onClick={openNew}/>}>
                </Toolbar>

                <Divider/>
            </div>

            <Dialog visible={RestaurantDialog} style={{ width: '50rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Edit Restaurant" modal className="p-fluid" footer={RestaurantDialogFooter} onHide={hideDialog}>

                <div className=" relative shadow-2  p-1 border-50 w-full sm:h-64 h-44 bg-cover bg-center"
                     style={{backgroundImage: `url(${ordersImage})`}}>
                    <div className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm  border-spacing-1 shadow-2 p-0.5 border-50 border-round"></div>
                    <label htmlFor="uploadImage">
                    <div className="absolute left-1/2 transform -translate-x-1/2 sm:-bottom-1/3 -bottom-1/2"  >
                        <InputText
                            type="file"
                            id="uploadImage"
                            style={{cursor:"grab",display:"none" }}
                            onChange={handlePhotoChange}
                        />
                        <Avatar image={userRestaurantid.photo } style={{width: "160px", height: "160px"}} shape="circle"
                                className=" shadow-4 shadow-indigo-400 mb-3 "
                        />
                    </div>
                    </label>
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-1/2 text-white text-2xl text-uppercase">
                        {userRestaurantid.nom ||"Restaurant Name"} Restaurant
                    </div>
                </div>
                <Grid container rowSpacing={1}  className="p-fluid grid mt-8">
                    <Grid item xs={12} sm={6} md={3}  >
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="firstname" name="firstname" value={nom} onChange={(e) => setNom(e.target.value)}/>
                                <label htmlFor="firstname">Name</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="address" name="address" value={adresse} onChange={(e) => setAdresse(e.target.value)}/>
                                <label htmlFor="adresse">Address</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="longitude" name="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)}/>
                                <label htmlFor="longitude">Longitude</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                             <span className="p-float-label">
                                <InputText id="latitude" name="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)}/>
                                 <label htmlFor="latitude">Latitude</label>
                             </span>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3} >
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText type={"time"} id="dateOuverture" name="dateOuverture" value={dateOuverture} onChange={(e) => setdateopen(e.target.value)}/>
                                <label htmlFor="dateOuverture">Open at :</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} >
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText type={"time"} id="dateFermeture" name="dateFermeture" value={dateFermeture} onChange={(e) => setdateclose(e.target.value)}/>
                                <label htmlFor="dateFermeture">Close at :</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <Dropdown inputId="dropdown" value={zoneid}  options={zone.map((zone) => ({ label: zone.nom, value: zone.id }))}
                                          onChange={handleZoneChange} />
                            <label htmlFor="zoneid">Zone</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                               <Dropdown inputId="dropdown" value={specialiteid}   options={specialites.map((sp) => ({ label: sp.nom, value: sp.id }))}
                                         onChange={handleSpecialityChange} />
                            <label htmlFor="specialiteid">Speciality</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                             <span className="p-float-label">
                               <Dropdown inputId="dropdown" value={serieid}
                                         options={series.map((serie) => ({ label: serie.nom, value: serie.id }))}
                                         onChange={handleSerieChange}  />
                            <label htmlFor="serieid">Serie</label>
                             </span>
                        </Box>
                    </Grid>

                </Grid>



            </Dialog>
            </>

    )
}


