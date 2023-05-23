import React,{useState,useEffect,useRef} from "react";
import 'bootstrap/dist/css/bootstrap.css';
import { Button } from 'primereact/button';
import axios from '../service/callerService';
import Modal from "react-modal";
import ReactPaginate from "react-paginate";
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Toast} from "primereact/toast";




export default function SerieTable(){
    const [series, setSeries] = useState([]);
    const [serieNom, setSerieNom] = useState('');
    const [selectedSerie, setSelectedSerie] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(0);
    const itemsPerPage = 4;
    const offset = pageNumber * itemsPerPage;
    const currentPageItems = series.slice(offset, offset + itemsPerPage);
    const toast = useRef(null);



    useEffect(() => {
        const getserie = async () => {
            const res = await axios.get('/api/controller/series/');
            const getdata = res.data;
            setSeries(getdata);
            loadSeries();
        }
        getserie();
    }, []);



    const loadSeries=async ()=>{
        const res=await axios.get("/api/controller/series/");
        setSeries(res.data);
    }




    const handleDelete = (serieid) => {
        const confirmDelete = () => {
            axios.delete(`/api/controller/series/${serieid}`).then(() => {
                setSeries(series.filter((serie) => serie.id !== serieid));
                toast.current.show({severity:'success', summary: 'Error', detail:'Serie deleted successfully', life: 3000});
            });
        };

        confirmDialog({
            message: 'Are you sure you want to Delete this Serie ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Yes',
            rejectLabel: 'No',
            acceptClassName: 'p-button-danger',
            accept: confirmDelete
        });
        loadSeries();
    };






    const handleOpenModal = (serie) => {
        setSelectedSerie(serie);
        setModalIsOpen(true);
    };

    const handleCloseModal = () => {
        setModalIsOpen(false)
    };



    const handleEditVille = async (id) => {
        try {
            const response = await axios.put(`/api/controller/series/${id}`, {
                nom: serieNom,

            })
            const updatedSeries = series.map((serie) => {
                if (serie.id === id) {
                    return response.data;
                }else{
                    return serie;
                }
            });
            setSeries(updatedSeries);
            setModalIsOpen(false);
            loadSeries();
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
                        <th scope="col">serie</th>
                        <th scope="col">Actions</th>

                    </tr>
                    </thead>
                    <tbody>
                    {currentPageItems.map((serie,index)=>(
                        <tr key={index}>
                            <th scope="row">{serie.id}</th>
                            <td>{serie.nom}</td>
                            <td>

                                <Button  label="Edit" severity="help" raised  className="mx-1"   onClick={() => handleOpenModal(serie)} />


                                <Button label="Delete" severity="danger"  className="mx-1" text raised   onClick={() => handleDelete(serie.id)}/>

                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>
                <div className="pagination-container">
                    <ReactPaginate
                        previousLabel={<button className="pagination-button">&lt;</button>}
                        nextLabel={<button className="pagination-button">&gt;</button>}
                        pageCount={Math.ceil(series.length / itemsPerPage)}
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
                        height:'250px'
                    }
                }}
            >
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title" id="modal-modal-title">Update Serie</h5>
                        <form>
                            <div className="mb-3">
                                <label htmlFor="user-nom" className="form-label">Serie:</label>
                                <input type="text" className="form-control" id="user-nom" value={serieNom} onChange={(e) => setSerieNom(e.target.value)} />
                            </div>

                        </form>
                        <div className="d-flex justify-content-center mt-3">
                            <Button severity="warning" label="Cancel" className="mx-2" onClick={handleCloseModal}/>
                            <Button severity="success" label="Update" className="mx-2" onClick={() => handleEditVille(selectedSerie.id)}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );


}
