import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import"../styles/login.css"
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { InputText } from 'primereact/inputtext';
import axios from '../service/callerService';
import React,{useState,useEffect,useReducer} from "react";
import ProduitTable from "../components/ProduitTable";
import { Card, CardContent } from '@mui/material';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Modal from "react-modal";
import {useRef} from "react";
import RestaurantTable from "./RestaurantTable";




export default function Produit() {
    const [Restaurants, setRestaurants] = useState([]);
    const [restaurantid, setRestaurantid] = useState("");
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [photo, setPhotos] = useState("");
    const [stock, setStock] = useState("");
   // const [promotion, setpromotion] = useState("");
    const [promotion, setpromotion] = useState(false);

    const [prix, setprix] = useState("");
    const [upTB, forceUpdate] = useReducer((x) => x + 1, 0);
    const [tableKey, setTableKey] = useState(Date.now());
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const toast = useRef(null);



    useEffect(() => {
        axios.get("/api/controller/restaurants/").then((response) => {
            setRestaurants(response.data);
        });
    }, [upTB]);


    const handleSubmit = (event) => {
        console.log("jsjkjksjkjkqsdjks",photo);

        event.preventDefault();
        axios.post("/api/controller/produits/save", {
            nom,
            description,
            photo,
            stock,
           // promotion,
            promotion: promotion ? true : false,
            prix,
            restaurant: {
                id: restaurantid
            },
        }).then((response) => {
            setNom("");
            setDescription("");
            setPhotos("");
            setStock("");
            setpromotion("");
            setprix("");
            setRestaurantid("");
            forceUpdate();
            setTableKey(Date.now());
            setModalIsOpen(false);
            showSuccess();

        });
    };

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'item added successfully', life: 1000});
    }

    const handlePhotoChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotos(e.target.result);
        };
        reader.readAsDataURL(file);
    };

    const handleOpenModal = () => {
        setModalIsOpen(true);
        //setSelectedRestaurant(restaurant);
        // setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false)
    };
    return (



        <div>
            <Card className="mx-3 mt-3 p-3">
                <CardContent >
                        <div style={{ alignItems: "center" }}>
                            <h3 >PRODUCTS</h3>
                        </div>
                        <div >
                            <Toast ref={toast} position="top-center" />

                            <Button
                                label="Add"
                                style={{backgroundColor:"lightseagreen"}}
                                raised
                                className="mx-2"
                                onClick={() => handleOpenModal()}

                            />

                        </div>


                    </CardContent>
                    <ProduitTable key={tableKey} />
                </Card>

                <Modal
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
                    <div>
                        <div className="card-body">
                            <h5 className="card-title" id="modal-modal-title">ADD PRODUCT</h5>
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="produit-nom" className="form-label">Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="user-nom"
                                        value={nom}
                                        onChange={(event) => setNom(event.target.value)}
                                        required
                                    />
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="produit-description" className="form-label">Description:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="user-prenom"
                                            value={description}
                                            onChange={(event) => setDescription(event.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="restaurant-adresse" className="form-label">Pic:</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="user-password"
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="produit-stock" className="form-label">In Stock:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="user-password"
                                            value={stock}
                                            onChange={(event) => setStock(event.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="produit-prix" className="form-label">Price:</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="user-password"
                                            value={prix}
                                            onChange={(event) => setprix(event.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-6">
                                        <label htmlFor="produit-restaurant" className="form-label">Restaurant:</label>
                                        <select
                                            className="form-control"
                                            id="cityId"
                                            value={restaurantid}
                                            onChange={(event) => setRestaurantid(event.target.value)}
                                            style={{
                                                backgroundColor: "#f2f2f2",
                                                border: "none",
                                                borderRadius: "4px",
                                                color: "#555",
                                                fontSize: "16px",
                                                padding: "8px 12px",
                                                width: "100%",
                                                marginBottom: "12px"
                                            }}
                                            required
                                        >
                                            <option value="">Select a restaurant</option>
                                            {Restaurants && Restaurants.map((restaurant) => (
                                                <option key={restaurant.id} value={restaurant.id}>
                                                    {restaurant.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-2 mx-1">
                                    <label htmlFor="produit-promotion" className="form-label">Promotion:</label>
                                    <InputText
                                        type="checkbox"
                                        className="form-check-input"
                                        id="produit-promotion"
                                        checked={promotion}
                                        onChange={(event) => setpromotion(event.target.checked)}
                                    />
                                </div>
                            </form>
                            <div className="d-flex justify-content-center mt-3">
                                <Button  label="Cancel"
                                         severity="warning"
                                         raised
                                         className="mx-2"
                                         onClick={handleCloseModal}/>

                                <Button  label="Save"
                                         severity="success"
                                         raised

                                         onClick={(e) => handleSubmit(e)}/>
                            </div>
                            </div>
                        </div>

                </Modal>
            </div>



    );
}