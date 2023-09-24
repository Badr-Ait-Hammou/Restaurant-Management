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

export default function RestaurantProfile() {
    const [nom, setNom] = useState('');
    const [RestaurantDialog, setRestaurantDialog] = useState(false);

    const [zone, setZones] =  useState([]);
    const [user, setUser] =  useState([]);
    const [userid, setUserId] = useState("");
    const [series, setSeries] = useState([]);
    const [specialites, setSpecialites] = useState([]);
    const [restaurant, setRestaurant] = useState([]);
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
        const fetchUserData = async () => {
            const tokenInfo = accountService.getTokenInfo();
            if (tokenInfo) {
                try {
                    const user = await accountService.getUserByEmail(tokenInfo.sub);
                    setUserId(user.id);
                    console.log('user', user.id);
                } catch (error) {
                    console.log('Error retrieving user:', error);
                }
            }
        };
        fetchUserData();
    }, []);



    const fetchData = async () => {
        try {
            // const restaurantId = user.restaurantList  && user.restaurantList[0].id ;
            // console.log("restaurant id", restaurantId);
            const Response = await axios.get('/api/controller/series/');
            setSeries(Response.data);

            const res= await axios.get("/api/controller/zones/");
            setZones(res.data);

            const resp= await axios.get("/api/controller/specialites/");
            setSpecialites(resp.data);

            const respon= await axios.get(`/api/controller/users/${userid}`);
            setUser(respon.data);
            console.log("userid data", respon.data);

            // const respo= await axios.get(`/api/controller/restaurants/${restaurantId}`);
            // setRestaurant(respo.data);
            // console.log("restaurant id",restaurantId);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
        handleDataTableLoad();
    }, []);


    const loadRestaurant=async ()=>{
        const respo= await axios.get("/api/controller/restaurants/");
        setRestaurant(respo.data);
    }

    const openNew = () => {
        setRestaurant(restaurant);
        setNom(nom);
        setdateopen(dateOuverture);
        setdateclose(dateFermeture);
        setAdresse(adresse);
        setLatitude(latitude);
        setLongitude(longitude);
        setSpecialiteid(specialites.id);
        setZoneid(zone.id);
        setPhotos(photo);
        setSerieid(series.id);
        setRestaurantDialog(true);
    };


    return (

        <>

            <div className=" relative shadow-2  p-1 border-50 w-full sm:h-64 h-44 bg-cover bg-center"
                 style={{backgroundImage: `url(${ordersImage})`}}>
                <div
                    className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm  border-spacing-1 shadow-2 p-0.5 border-50 border-round"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 sm:-bottom-1/3 -bottom-1/2">
                    <Avatar image={Image1} style={{width: "160px", height: "160px"}} shape="circle"
                            className=" shadow-4 shadow-indigo-400 mb-3 "/>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-1/2 text-white text-2xl">
                    John Doe
                </div>
            </div>

            <div className=" mx-2 p-1 card  mt-8 ">

                <Toolbar className="mb-2 p-1"
                         start={ <Chip
                             avatar={<Avatar alt={"restaurantName"} style={{width: "60px", height: "60px"}} image={Image1}
                                             shape="circle" className=" shadow-4 shadow-indigo-400  "/>}
                             label={<Typography className="font-monospace mx-2"><span className="font-bold">Owner :</span>
                         </Typography>}
                             variant="filled"
                             size="medium"
                             sx={{width: 200, height: 70, backgroundColor: "transparent"}}
                         />}
                         end={<Button label="Update" severity="info"></Button>}>
                </Toolbar>

                <Divider/>


                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="p-fluid grid">
                    <Grid item xs={12} sm={6} md={3} >
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


                    <Divider/>

                    <Grid item xs={12} sm={6} md={3} >
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="dateOuverture" name="dateOuverture" value={dateOuverture} onChange={(e) => setdateopen(e.target.value)}/>
                                <label htmlFor="dateOuverture">Open at :</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3} >
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="dateFermeture" name="dateFermeture" value={dateFermeture} onChange={(e) => setdateclose(e.target.value)}/>
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



            </div>


        </>

    )
}
