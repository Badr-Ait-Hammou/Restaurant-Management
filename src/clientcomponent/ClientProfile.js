import axios from '../service/callerService';
import { useEffect, useState,useRef } from "react";
import React from "react";
import {accountService} from "../service/accountService";
import Modal from "react-modal";
import { Button } from 'primereact/button';
import {Toast} from "primereact/toast";
import "../styles/profile.css"
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.min.css";
import TextField from "@mui/material/TextField";


export default function ClientProfile() {
    const [userId, setUserId] = useState("");
    const [fullname, setFullname] = useState("");
    const [firstadd, setfirstadd] = useState("");
    const [secondadd, setsecondadd] = useState("");
    const [ares, setarea] = useState("");
    const [phone, setPhone] = useState("");
    const [postcode, setpostcode] = useState("");
    const [email, setemail] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [profile, setProfile] = useState([]);
    const toast = useRef(null);
    const [photo, setPhotos] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);






    useEffect(() => {
        const fetchUserData = async () => {
            const tokenInfo = accountService.getTokenInfo();
            if (tokenInfo) {
                try {
                    const user = await accountService.getUserByEmail(tokenInfo.sub);
                    setUserId(user.id);
                    console.log('user',user.id);
                   // console.log(getProfile());
                } catch (error) {
                    console.log('Error retrieving user:', error);
                }
            }
        };
        fetchUserData();
        loadProfile();
    }, []);
    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotos(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleEditProfile = async () => {
        try {
            const response = await axios.put(`/api/controller/profiles/${userId}`, {
                fullName: fullname,
                firstAdresse: firstadd,
                secondAdresse: secondadd,
                phoneNumber: phone,
                postCode: postcode,
                area: ares,
                photo: photo,
                email: email,
                user: {
                    id: userId,
                },
            });

            if (Array.isArray(profile)) {
                const updatedProfile = profile.map((prof) => {
                    if (prof.user.userId === userId) {
                        return response.data;
                    } else {
                        return prof;
                    }
                });
                setProfile(updatedProfile);
            }

            setModalIsOpen(false);
            loadProfile();

        } catch (error) {
            console.error(error);
        }
    };




    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'item added successfully', life: 1000});
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post("/api/controller/profiles/", {
            fullName: fullname,
            firstAdresse: firstadd,
            secondAdresse: secondadd,
            phoneNumber: phone,
            postCode: postcode,
            area:ares ,
            photo :photo,
            email:email ,
            user: {
                id: userId,
            }

        }).then((response) => {
            setModalIsOpen(false);
            showSuccess();
            loadProfile();

        });
    };


    useEffect(() => {
        axios.get(`/api/controller/profiles/user/${userId}`)
            .then((response) => {
                setProfile(response.data);
                console.log(profile);
            })
            .catch((error) => {
                console.log('Error retrieving user profile:', error);
            });
        loadProfile();
    }, [userId]);



    const handleOpenModal = (profile) => {
        setModalIsOpen(true);
        setIsSubmitted(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false)
    };

    const loadProfile=async ()=>{
        const res=await  axios.get(`/api/controller/profiles/user/${userId}`);
        setProfile(res.data);
    }

    return (
        <div className="container rounded  mt-3 mb-5" style={{backgroundColor:"whitesmoke"}}>
            <Button
                label="Add"
                style={{backgroundColor:"lightseagreen"}}
                raised
                className="mx-2 mt-3"
                onClick={() => handleOpenModal(profile)}
                disabled={isSubmitted}

            />
            <Button
                label="Edit"
                style={{backgroundColor:"lightskyblue"}}
                raised
                className="mx-2 mt-3"
                onClick={() => handleOpenModal(profile)}


            />
            <div className="row">
                <div className="col-md-12 border-right">
                    <div className="d-flex flex-column align-items-center text-center ">
                        <img
                            className="rounded-circle mt-2"
                            width="150px"
                            src={profile.photo}
                        />
                        <span className="font-weight-bold">{profile.fullName}</span>
                        <span className="text-black-50">{profile.email}</span>
                        <span> </span>
                    </div>
                    <Toast ref={toast} position="top-center" />

                </div>
                <div className="col-md-12 border-right">
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-center align-items-center mb-3">
                           <strong className="text-center">Profile Settings</strong>
                        </div>
                        <div className="row mt-2">
                            <div className="col-md-6">
                                <label className="labels">FULL NAME</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="first name"
                                    value={profile.fullName}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="labels">EMAIL</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={profile.email}
                                    placeholder="surname"
                                />
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-12">
                                <label className="labels">Mobile Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="enter phone number"
                                    value={profile.phoneNumber}
                                />
                            </div>
                            <div className="col-md-12">
                                <label className="labels">Address Line 1</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="enter address line 1"
                                    value={profile.firstAdresse}                                />
                            </div>
                            <div className="col-md-12">
                                <label className="labels">Address Line 2</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="enter address line 2"
                                    value={profile.secondAdresse}                                  />
                            </div>
                            <div className="col-md-12">
                                <label className="labels">Postcode</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="enter address line 2"
                                    value={profile.postCode}                                  />
                            </div>

                            <div className="col-md-12">
                                <label className="labels">Area</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="enter address line 2"
                                    value={profile.area}                                  />
                            </div>


                        </div>


                    </div>
                </div>


            </div>
            <>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"

                    isOpen={modalIsOpen}
                    onRequestClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    style={{
                        overlay: {
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            zIndex: 999
                        },
                        content: {
                            top: '50%',
                            left: '50%',
                            right: 'auto',
                            bottom: 'auto',
                            marginRight: '-50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: '#fff',
                            borderRadius: '10px',
                            boxShadow: '20px 30px 25px rgba(0, 0, 0, 0.2)',
                            padding: '20px',
                            width: '100%',
                            maxWidth: '700px',
                            height: 'auto',
                            maxHeight: '90%',
                            overflow: 'auto'
                        }
                    }}
                >
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title" id="modal-modal-title">Update Speciality</h5>
                            <form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="user-nom" className="form-label">Full Name:</label>
                                        <input type="text" className="form-control" id="user-nom" value={fullname}
                                               onChange={(e) => setFullname(e.target.value)}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="user-address" className="form-label">First Address:</label>
                                        <input type="text" className="form-control" id="user-address" value={firstadd}
                                               onChange={(e) => setfirstadd(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="user-nom" className="form-label">Second Address:</label>
                                        <input type="text" className="form-control" id="user-nom" value={secondadd}
                                               onChange={(e) => setsecondadd(e.target.value)}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="user-address" className="form-label">Phone:</label>
                                        <input type="number" className="form-control" id="user-address" value={phone}
                                               onChange={(e) => setPhone(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="user-nom" className="form-label">Postal Code:</label>
                                        <input type="text" className="form-control" id="user-nom" value={postcode}
                                               onChange={(e) => setpostcode(e.target.value)}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="user-address" className="form-label">Area:</label>
                                        <input type="text" className="form-control" id="user-address" value={ares}
                                               onChange={(e) => setarea(e.target.value)}/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="user-nom" className="form-label">Email:</label>
                                        <input type="text" className="form-control" id="user-nom" value={email}
                                               onChange={(e) => setemail(e.target.value)}/>
                                    </div>
                                    <div className="col-md-6">
                                        <TextField
                                            required
                                            fullWidth
                                            type="file" accept="image/*" onChange={handlePhotoChange}
                                        />
                                    </div>

                                </div>
                            </form>
                            <div className="d-flex justify-content-center mt-3">
                                <Button
                                    label="Update"
                                    severity="help"
                                    raised
                                    className="mx-2"
                                    onClick={() => handleEditProfile(profile)}
                                />


                                <Button  label="Save"
                                         severity="success"
                                         raised

                                         onClick={(e) => handleSubmit(e)}/>
                            </div>
                        </div>
                    </div>
                </Modal>
            </>
        </div>
    );
}
