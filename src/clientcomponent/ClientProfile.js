import axios from '../service/callerService';
import {accountService} from "../service/accountService";
import { Button } from 'primereact/button';
import {Toast} from "primereact/toast";
import Addphoto from "../images/add photo.png"
import MainCard from "../ui-component/MainCard";
import React, {useState,useEffect,useRef} from "react";
import {Box} from "@mui/system";
import {styled} from "@mui/material/styles";
import Badge from "@mui/material/Badge";
import Avatar from "@mui/material/Avatar";
import {TextField, Grid} from "@mui/material";
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { Skeleton } from 'primereact/skeleton';


export default function ClientProfile() {
    const [userId, setUserId] = useState("");
    const [user, setUser] = useState([]);
    const [email, setemail] = useState("");
    const toast = useRef(null);
    const [photo, setPhotos] = useState("");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [adresse, setAdresse] = useState('');
    const [telephone, setTelephone] = useState('');
    const [area, setArea] = useState('');
    const [postcode, setpostcode] = useState('');



    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: 22,
        height: 22,
        padding:2,
        border: `2px solid ${theme.palette.background.paper}`,
    }));


    useEffect(() => {
        const fetchUserData = async () => {
            const tokenInfo = accountService.getTokenInfo();
            if (tokenInfo) {
                try {
                    const user = await accountService.getUserByEmail(tokenInfo.sub);
                    setUserId(user.id);
                    console.log('user',user.id);
                } catch (error) {
                    console.log('Error retrieving user:', error);
                }
            }
        };
        fetchUserData();
        loadUser();
    }, []);

    useEffect(() => {
        axios.get(`/api/controller/users/${userId}`).then((response) => {
            setUser(response.data);
            loadUser();
        });

    }, [userId]);


    const handleUpdate = (event) => {
        event.preventDefault();

        const requestData = {
            id:user.id,
            firstName  :firstName || user.firstName,
            lastName : lastName || user.lastName,
            adresse : adresse || user.adresse,
            email:user.email,
            telephone :telephone || user.telephone,
            postcode :postcode || user.postcode,
            photo:photo || user.photo,
            area :area || user.area,
            role:user.role,
            password:user.password,
        };

        axios.put(`/api/controller/users/${userId}`, requestData)
            .then((response) => {
                console.log("API Response:", response.data);

                loadUser();
                showupdate();
            })
            .catch((error) => {
                console.error("Error while saving project:", error);
            });
    };



    const loadUser = async () => {
        axios.get(`/api/controller/users/${userId}`).then((response) => {
            const userData= response.data;
            setUser(userData);

            if (!firstName && userData) setFirstName(userData.firstName);
            if (!lastName && userData) setLastName(userData.lastName);
            if (!email && userData) setemail(userData.email);
            if (!adresse && userData) setAdresse(userData.adresse);
            if (!area && userData) setArea(userData.area);
            if (!photo && userData) setPhotos(userData.photo);
            if (!telephone && userData) setTelephone(userData.telephone);
            if (!postcode && userData) setpostcode(userData.postcode);
        });
    };

    const showupdate = () => {
        toast.current.show({severity:'info', summary: 'success', detail:'profile updated successfully', life: 3000});
    }







    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotos(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };


    return (
        <MainCard sx={{ margin: '20px' }} title={<div style={{display:"flex",justifyContent:"center", alignItems:"center"}}><PersonPinIcon /> {user.username}'s Profile </div>} >
            <Toast ref={toast} />

            <Grid container justifyContent="center">
                <Grid item xs={12} textAlign="center">
                    <label htmlFor="uploadImage">
                        <Box
                            style={{
                                alignItems: "center",
                                justifyContent: "center",
                                display: "flex",
                                marginBottom: "8px",
                            }}
                        >
                            {user && user.photo ? (
                                <Badge

                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    badgeContent={
                                        <SmallAvatar  alt="Remy Sharp" src={Addphoto}  />
                                    }
                                >
                                    <Avatar alt="AH" src={user.photo} style={{ width: '150px',height:'145px', cursor: 'pointer',padding:"30px",alignItems:"center",justifyContent:"center",        backgroundColor:'rgb(127,222,225)',
                                    }}  />
                                </Badge>
                            ) : (
                                <Skeleton shape="circle" size="9rem"  className="mr-2"></Skeleton>

                            )}
                        </Box>
                    </label>
                    <input
                        type="file"
                        id="uploadImage"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />

                    <h3 className="text-muted mb-1 mt-3">
                        <i className="mx-2 pi pi-user  "></i>
                        <strong>{user ? user.firstName || "firstName" : "FirstName"}</strong>
                    </h3>

                    <h3 className="text-muted mb-1 mt-3">
                        <i className="mx-2 pi pi-phone  "></i>
                        {user ? user.telephone || "phone" : "Phone"}
                    </h3>
                    <p className="text-muted mb-4 mt-2">
                        <i className="mx-2 pi pi-inbox "></i>
                        {user ? user.email || "Email" : "Email"}
                    </p>

                    <Button label="Update" severity="info" raised onClick={handleUpdate} />
                </Grid>
            </Grid>

            <Grid container spacing={3} mt={3}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="firstName"
                        value={firstName}
                        placeholder={user ? user.firstName || "firstName" : "firstName"}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="lastName"
                        value={lastName}
                        placeholder={user ? user.lastName || "lastName" : "lastName"}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} mt={3}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Address"
                        value={adresse}
                        onChange={(e) => setAdresse(e.target.value)}
                        placeholder={user ? user.adresse || "Address" : "Address"}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Post Code"
                        value={postcode}
                        onChange={(e) => setpostcode(e.target.value)}
                        placeholder={user ? user.postcode || "Post Code" : "Post Code"}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} mt={3}>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Area"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder={user ? user.area || "Area" : "Area"}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Telephone"
                        value={telephone}
                        onChange={(e) => setTelephone(e.target.value)}
                        placeholder={user ? user.telephone || "phone" : "PHONE"}
                    />
                </Grid>
            </Grid>


        </MainCard>
    );
}







