import React, { useState, useEffect, useReducer,useRef } from "react";
import axios from '../service/callerService';
import"../styles/login.css"
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import SpecialiteTable from "../components/SpecialiteTable";
import {Card, CardContent} from "@mui/material";
import Modal from "react-modal";


export default function Specialite() {

    const [specialite, setSpecialite] = useState([]);
    const [nom, setNom] = useState("");
    const [upTB, forceUpdate] = useReducer((x) => x + 1, 0);
    const [tableKey, setTableKey] = useState(Date.now());

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const toast = useRef(null);


    const handleOpenModal = (specialite) => {
        setSpecialite(specialite);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false)
    };

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'item added successfully', life: 1000});
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nom) {
            alert("Please enter a specialite name");
        } else {
            await axios.post("api/controller/specialites/save", { nom });
            setNom("");
            forceUpdate();
            setTableKey(Date.now());
            setModalIsOpen(false); // update state variable using setModalIsOpen function
            showSuccess();

        }
    };
    useEffect(() => {
        getSeries();
    }, [upTB]); // add upTB to the dependency array

    const getSeries = async () => {
        const res = await axios.get(`/api/controller/specialites/`);
        setSpecialite(res.data);
    }

    return (
        <div>
            <Card className="mx-3 mt-3 p-3">
                <CardContent >
                    <div style={{ alignItems: "center" }}>
                        <h3 >SPECIALITY</h3>
                    </div>
                    <div >
                        <Toast ref={toast} position="top-center" />

                        <Button
                            label="Add"
                            style={{backgroundColor:"lightseagreen"}}
                            raised
                            className="mx-2"
                            onClick={() => handleOpenModal(specialite)}

                        />
                        {/*
                        <InputText placeholder="Search"  />
                        */}
                    </div>


                </CardContent>
                <SpecialiteTable key={tableKey}/>
            </Card>




            <Modal
                isOpen={modalIsOpen}
                onRequestClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 1000
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
                        width:'350px',
                        height:'300px'
                    }
                }}
            >
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title" id="modal-modal-title">Update Speciality</h5>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="user-nom" className="form-label">Speciality Name:</label>
                                <input type="text" className="form-control" id="user-nom" value={nom} onChange={(e) => setNom(e.target.value)} />
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
