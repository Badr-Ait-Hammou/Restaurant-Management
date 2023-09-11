
import React, {useState, useRef, useEffect} from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Grid} from "@mui/material";
import {Box} from "@mui/system";
import { FileUpload } from 'primereact/fileupload';
import EmptyImg from "../images/empty.png";
import axios from '../service/callerService';
import MainCard from "../ui-component/MainCard";
import SkeletonPr from "../skeleton/ProfileSkeleton"





export default function Specialities() {

    const [specialityDialog, setSpecialityDialog] = useState(false);
    const [editspecialityDialog, seteditSerieDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [selectedSerie, setSelectedSerie] = useState(null);
    const [nom, setNom] = useState('');
    const [photo, setPhoto] = useState('');
    const [sepeciality, setSepecialities] =  useState([]);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);



    const handleDataTableLoad = () => {
        setDataTableLoaded(true);
    };


    useEffect(() => {
        fetchData();
        handleDataTableLoad();
    }, []);

    const fetchData = async () => {
        try {
            const Response = await axios.get('/api/controller/specialites/');
            setSepecialities(Response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    /********************************************Save image *************************/


    const handleSubmit = (event) => {
        event?.preventDefault();

        if (nom.trim() === '' || !photo ) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
            return;
        }
        axios.post("/api/controller/specialites/save", {
            nom,
            photo,
        }).then((response) => {
            console.log(response.data);
            console.log(photo);
            setNom("");
            setPhoto("");
            hideDialog();
            loadSpecialities();
            showusave();
        }).catch((error) => {
            console.error("Error while saving image:", error);
        });
    };

    const handlePhotoChange = (event) => {
        const files = event.files;

        if (files && files.length > 0) {
            const file = files[0];

            if (!file.type.startsWith('image/')) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setPhoto(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };




    /********************************************Load image *************************/
    const loadSpecialities=async ()=>{
        const res=await axios.get(`/api/controller/specialites/`);
        setSepecialities(res.data);
    }

    /******************************************** Delete *************************/

    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`/api/controller/specialites/${id}`)
                .then(() => {
                    setSepecialities(sepeciality.filter((rowData) => rowData.id !== id));
                    toast.current.show({severity:'success', summary: 'Done', detail:'Image deleted successfully', life: 3000});
                })
                .catch((error) => {
                    console.error('Error deleting project:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'failed to delete Image', life: 3000});
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
    };



    /******************************************** Dialogues *************************/

    const openNew = () => {
        setSepecialities(sepeciality);
        setSubmitted(false);
        setNom("");
        setPhoto("");
        setSpecialityDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setSpecialityDialog(false);
        seteditSerieDialog(false);
    };
    const hideeditDialog = () => {
        seteditSerieDialog(false);
    };

    /***********************Update **************/

    const handleupdate = (rowData) => {
        setSelectedSerie(rowData);
        setNom(rowData.nom);
        setPhoto(rowData.photo);
        seteditSerieDialog(true);
    };

    const handleEdit = async (sepecialityToUpdate) => {
        try {
            if (nom.trim() === '' || !photo ) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
                return;
            }
            const response = await axios.put(`/api/controller/specialites/${sepecialityToUpdate.id}`, {
                nom:nom,
                photo:photo,

            });

            const updatedProject = [...sepeciality];
            const updatedProjectIndex = updatedProject.findIndex((sepeciality) => sepeciality.id === sepecialityToUpdate.id);
            updatedProject[updatedProjectIndex] = response.data;

            hideeditDialog();
            loadSpecialities();
            showupdate()
        } catch (error) {
            console.error(error);
        }
    };

    /********************************************Toasts *************************/

    const showusave = () => {
        toast.current.show({severity:'success', summary: 'success', detail:'item added successfully', life: 3000});
    }

    const showupdate = () => {
        toast.current.show({severity:'info', summary: 'success', detail:'item updated successfully', life: 3000});
    }





    const exportCSV = () => {
        dt.current.exportCSV();
    };

    /******************************************** components *************************/


    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button   label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />;
    };
    const centerToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 font-bold">Manage Specialities</h4>
        </div>;
    };




    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined style={{marginRight:"4px"}} onClick={() => handleupdate(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => handleDelete(rowData.id)} />
            </React.Fragment>
        );
    };
    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
    <span className="p-input-icon-left">
      <i className="pi pi-search" />
      <InputText
          type="search"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
      />
    </span>
        </div>
    );

    const specialityDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button  label="save"
                     severity="success"
                     raised onClick={(e) => handleSubmit(e)}/>
        </React.Fragment>
    );

    const editimageDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideeditDialog} />
            <Button label="Update" severity="info"  raised onClick={() => handleEdit(selectedSerie)} />
        </React.Fragment>
    );

    const photoBodyTemplate = (rowData) => {
        if (rowData.photo) {
            return (
                <img
                    src={rowData.photo}
                    alt={rowData.photo}
                    className="enlarge-on-hover"
                    style={{
                        width: '10%',
                        height: '10%',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                        transform: "scale(1.3)",

                    }}
                    onError={() => console.error(`Failed to load image for row with ID: ${rowData.id}`)}
                />
            );
        }
        return <img src={EmptyImg} alt="No" style={{ width: '50px', height: 'auto' }} />;
    };










    return (
        <>

            <MainCard sx={{ margin: '20px' }}>
                <Toast ref={toast} />
                <ConfirmDialog />

                <div className="card">
                    <Toolbar className="mb-4" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                    {dataTableLoaded ? (
                        <DataTable ref={dt} value={sepeciality}
                                   dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Specialities" globalFilter={globalFilter} header={header}>
                            <Column field="id"  header="ID" sortable style={{ minWidth: '10rem' }}></Column>
                            <Column field="nom"   filter filterPlaceholder="Search Name ..." header="Name" sortable style={{ minWidth: '18rem' }}></Column>
                            <Column field="photo" header="Photo" body={photoBodyTemplate} sortable style={{ minWidth: '18rem' }}></Column>
                            <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                        </DataTable>
                    ):(
                        <SkeletonPr/>
                    )}
                </div>
            </MainCard>

            <Dialog visible={specialityDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Speciality" modal className="p-fluid" footer={specialityDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Box className="field">
                            <label htmlFor="nom" className="font-bold">
                                Name
                            </label>
                            <InputText style={{marginTop:"5px"}} id="nom" value={nom} onChange={(event) => setNom(event.target.value)} required autoFocus />
                            {submitted && !sepeciality.nom && <small className="p-error">Name is required.</small>}
                        </Box>
                    </Grid>
                </Grid>



                <Grid item xs={12} >
                    <Box className="field mt-2">
                        <label htmlFor="image" className="font-bold">
                            Photo
                        </label>
                        <FileUpload
                            className="mt-2"
                            nom="photo"
                            url={'/api/upload'}
                            accept="image/*"
                            maxFileSize={1000000}
                            emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                            chooseLabel="Select Image"
                            uploadLabel="Upload"
                            cancelLabel="Cancel"
                            onSelect={(e) => handlePhotoChange(e)}
                        />

                    </Box>
                </Grid>

            </Dialog>

            <Dialog visible={editspecialityDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Edit Speciality" modal className="p-fluid" footer={editimageDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Box className="field">
                            <label htmlFor="nom" className="font-bold">
                                Name
                            </label>
                            <InputText style={{marginTop:"5px"}} id="nom" value={nom} onChange={(event) => setNom(event.target.value)} required autoFocus />
                            {submitted && !sepeciality.nom && <small className="p-error">Name is required.</small>}
                        </Box>
                    </Grid>
                </Grid>



                <Grid item xs={12} >
                    <Box className="field mt-2">
                        <label htmlFor="quantity" className="font-bold">
                            Photo
                        </label>
                        <FileUpload
                            className="mt-2"
                            nom="photo"
                            url={'/api/upload'}
                            accept="image/*"
                            maxFileSize={1000000}
                            emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                            chooseLabel="Select Image"
                            uploadLabel="Upload"
                            cancelLabel="Cancel"
                            onSelect={(e) => handlePhotoChange(e)}
                        />
                    </Box>
                </Grid>
            </Dialog>



        </>
    );
}
