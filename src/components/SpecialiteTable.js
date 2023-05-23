import React,{useState,useEffect,useRef} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import axios from  '../service/callerService';
import Modal from "react-modal";
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import ReactPaginate from "react-paginate";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";




export default function VilleTable(){
    const [specialites, setSpecialite] = useState([]);
    const [villeNom, setVilleNom] = useState('');
    const [selectedSpecialite, setSelectedSpecialite] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 4;
    const offset = pageNumber * itemsPerPage;
    const currentPageItems = specialites.slice(offset, offset + itemsPerPage);
    const toast = useRef(null);




    useEffect(() => {
        const getSpecialites = async () => {
            const res = await axios.get('/api/controller/specialites/');
            // const getdata = await res.json();
            setSpecialite(res.data);
            loadSpecialites();
        }
        getSpecialites();
    }, []);



    const loadSpecialites=async ()=>{
        const res=await axios.get("/api/controller/specialites/");
        setSpecialite(res.data);
    }



    const handleDelete = (specialiteId) => {
        const confirmDelete = () => {
            axios.delete(`/api/controller/specialites/${specialiteId}`).then(() => {
                setSpecialite(specialites.filter((specialite) => specialite.id !== specialiteId));
                toast.current.show({severity:'danger', summary: 'Done', detail:'Speciality deleted successfully', life: 3000});
            });
        };

        confirmDialog({
            message: 'Are you sure you want to Delete this Speciality ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
        loadSpecialites();
    };








    const handleOpenModal = (specialite) => {
        setSelectedSpecialite(specialite);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false)
    };




    const handleEditVille = async (id) => {
        try {
            const response = await axios.put(`/api/controller/specialites/${id}`, {
                nom: villeNom,

            })
            const updatedSpecialite = specialites.map((specialite) => {
                if (specialite.id === id) {
                    return response.data;
                }else{
                    return specialite;
                }
            });
            setSpecialite(updatedSpecialite);
            setModalIsOpen(false);
            loadSpecialites();
        } catch (error) {
            console.error(error);
        }
    };



    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <div className="table-responsive">
                <table className="table mt-5 text-center">
                    <thead>
                    <tr>
                        <th scope="col">id</th>
                        <th scope="col">City</th>
                        <th scope="col">Actions</th>

                    </tr>
                    </thead>
                    <tbody>
                    {currentPageItems.map((specialite,index)=>(
                        <tr key={index}>
                            <th scope="row">{specialite.id}</th>
                            <td>{specialite.nom}</td>
                            <td>
                                <Toast ref={toast} position="top-center" />
                                <Button  label="Edit" severity="help" raised  className="mx-1"   onClick={() => handleOpenModal(specialite)} />


                                <Button label="Delete" severity="danger"  className="mx-1" text raised   onClick={() => handleDelete(specialite.id)}/>

                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>
                <div className="pagination-container">
                    <ReactPaginate
                        previousLabel={<button className="pagination-button">&lt;</button>}
                        nextLabel={<button className="pagination-button">&gt;</button>}
                        pageCount={Math.ceil(specialites.length / itemsPerPage)}
                        onPageChange={({ selected }) => setPageNumber(selected)}
                        containerClassName={"pagination"}
                        previousLinkClassName={"pagination__link"}
                        nextLinkClassName={"pagination__link"}
                        disabledClassName={"pagination__link--disabled"}
                        activeClassName={"pagination__link--active"}
                    />
                </div>
            </div>

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
                                <label htmlFor="user-nom" className="form-label">Zone:</label>
                                <input type="text" className="form-control" id="user-nom" value={villeNom} onChange={(e) => setVilleNom(e.target.value)} />
                            </div>

                        </form>
                        <div className="d-flex justify-content-center mt-3">
                            <Button  label="Cancel" severity="warning" raised  className="mx-1" onClick={handleCloseModal}/>

                            <Button  label="Save" severity="success" raised  className="mx-1" sx={{ ml:1 }} onClick={() => handleEditVille(selectedSpecialite.id)}/>

                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );


}
