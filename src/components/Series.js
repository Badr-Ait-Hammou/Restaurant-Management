import React  from 'react';
import {useState, useRef, useEffect} from 'react';
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
import {Avatar, Grid} from "@mui/material";
import {Box} from "@mui/system";
import { FileUpload } from 'primereact/fileupload';
import EmptyImg from "../images/empty.png";
import axios from '../service/callerService';
import "../styles/ButtonDemo.css"
import DatatableSkeleton from "../skeleton/DatatableSkeleton";






export default function Series()  {

    const [productDialog, setSerieDialog] = useState(false);
    const [editproductDialog, seteditSerieDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [selectedSerie, setSelectedSerie] = useState(null);
    const [nom, setNom] = useState('');
    const [photo, setPhoto] = useState('');
    const [serie, setSeries] =  useState([]);
    const [loading, setLoading] = useState(true);




    const handleDataTableLoad = () => {
        setLoading(false);
    };


    useEffect(() => {
        fetchData();
        handleDataTableLoad();
    }, []);

    const fetchData = async () => {
        try {
            const Response = await axios.get('/api/controller/series/');
            setSeries(Response.data);
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
        axios.post("/api/controller/series/save", {
            nom,
            photo,
        }).then((response) => {
            console.log(response.data);
            console.log(photo);
            setNom("");
            setPhoto("");
            hideDialog();
            loadSeries();
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
    const loadSeries=async ()=>{
        const res=await axios.get(`/api/controller/series/`);
        setSeries(res.data);
    }

    /******************************************** Delete *************************/

    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`/api/controller/series/${id}`)
                .then(() => {
                    setSeries(serie.filter((rowData) => rowData.id !== id));
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
        setSeries(serie);
        setNom("");
        setPhoto("");
        setSerieDialog(true);
    };

    const hideDialog = () => {
        setSerieDialog(false);
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

    const handleEdit = async (serieToUpdate) => {
        try {
            if (nom.trim() === '' || !photo ) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
                return;
            }
            const response = await axios.put(`/api/controller/series/${serieToUpdate.id}`, {
                nom:nom,
                photo:photo,

            });

            const updatedProject = [...serie];
            const updatedProjectIndex = updatedProject.findIndex((serie) => serie.id === serieToUpdate.id);
            updatedProject[updatedProjectIndex] = response.data;

            hideeditDialog();
            loadSeries();
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
            <div className="template flex flex-wrap gap-2">
                <Button className="pay p-0"   onClick={openNew}>
                    <i className="pi pi-plus px-2"></i>
                    <span className="px-3  font-bold text-white">Add</span>
                </Button>
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return(
            <div className="template ">
                <Button className="export p-0"   onClick={exportCSV}>
                    <i className="pi pi-upload px-2"></i>
                    <span className="px-3  font-bold text-white">Export</span>
                </Button>
            </div>
        );
    };
    const centerToolbarTemplate = () => {
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0 font-monospace">Manage Series</h4>
        </div>;
    };
    
   


    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <div className="template">
                    <Button className="cancel p-0" aria-label="Slack" onClick={() => handleDelete(rowData.id)}>
                        <i className="pi pi-trash px-2"></i>
                        <span className="px-1">Delete</span>
                    </Button>
                    <Button className="edit p-0" aria-label="Slack" onClick={() => handleupdate(rowData)}>
                        <i className="pi pi-pencil px-2"></i>
                        <span className="px-1">Update</span>
                    </Button>
                </div>
            </React.Fragment>
        );
    };
    const header = (
        <div className="flex flex-wrap  align-items-center justify-content-between -m-3" >
    <span className="p-input-icon-left p-1 "  >
      <i className="pi pi-search " />
      <InputText
          style={{width:"100%",height:"0px"}}


          type="search"
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
      />
    </span>
        </div>
    );

    const productDialogFooter = (
        <React.Fragment>
            <div className="template">
                <Button className="cancel p-0" aria-label="Slack" onClick={hideDialog}>
                    <i className="pi pi-times px-2"></i>
                    <span className="px-3">Cancel</span>
                </Button>
                <Button className="edit p-0" aria-label="Slack" onClick={(e) => handleSubmit(e)}>
                    <i className="pi pi-check px-2"></i>
                    <span className="px-3">Create</span>
                </Button>
            </div>
        </React.Fragment>
    );
    
    const editimageDialogFooter = (
        <React.Fragment>
            <div className="template">
            <Button className="cancel p-0" aria-label="Slack" onClick={hideeditDialog}>
                <i className="pi pi-times px-2"></i>
                <span className="px-3">Cancel</span>
            </Button>
                <Button className="edit p-0" aria-label="Slack" onClick={() => handleEdit(selectedSerie)}>
                <i className="pi pi-pencil px-2"></i>
                <span className="px-3">Update</span>
            </Button>
            </div>
        </React.Fragment>
    );

    const photoBodyTemplate = (rowData) => {
        if (rowData.photo) {
            return (
                <Avatar
                    src={rowData.photo}
                    alt={rowData.photo}
                    variant="square"
                    sx={{width:55,height:55,borderRadius:2}}
                    onError={() => console.error(`Failed to load image for row with ID: ${rowData.id}`)}
                />
            );
        }
        return <Avatar src={EmptyImg} alt="No"  variant="square" sx={{width:55,height:55,borderRadius:2}}
        />;
    };

    if(loading || serie.length=== 0){
        return(
            <DatatableSkeleton/>
        )
    }

    return (
        <>

            <div className="card p-1 mt-5 mx-2">
                <Toast ref={toast} />
                <ConfirmDialog />

                <div className="card">
                    <Toolbar className="mb-2 p-1" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                        <DataTable ref={dt} value={serie}
                                   dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Zones" globalFilter={globalFilter} header={header}>
                            <Column field="id"  header="ID" sortable style={{ minWidth: '10rem' }}></Column>
                            <Column field="nom"   filter filterPlaceholder="Search Name ..." header="Name" sortable style={{ minWidth: '18rem' }}></Column>
                            <Column field="photo" header="Photo" body={photoBodyTemplate} sortable style={{ minWidth: '18rem' }}></Column>
                            <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                        </DataTable>
                </div>
            </div>

            <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Serie" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Box className="field">
                            <label htmlFor="nom" className="font-bold">
                                Name
                            </label>
                            <InputText  keyfilter="alpha" style={{marginTop:"5px"}} id="nom" value={nom} onChange={(event) => setNom(event.target.value)} required autoFocus />
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

            <Dialog visible={editproductDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Edit Serie" modal className="p-fluid" footer={editimageDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Box className="field">
                            <label htmlFor="nom" className="font-bold">
                                Name
                            </label>
                            <InputText  keyfilter="alpha" style={{marginTop:"5px"}} id="nom" value={nom} onChange={(event) => setNom(event.target.value)} required autoFocus />
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
