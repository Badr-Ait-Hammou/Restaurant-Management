
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
import {Avatar, Grid} from "@mui/material";
import {Box} from "@mui/system";
import { Dropdown } from 'primereact/dropdown';
import axios from '../service/callerService';
import SkeletonPr from "../skeleton/ProfileSkeleton"
import {FileUpload} from "primereact/fileupload";
import EmptyImg from "../images/empty.png";





export default function Restaurants() {
    const [RestaurantDialog, setRestaurantDialog] = useState(false);
    const [editRestaurantDialog, seteditRestaurantDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [nom, setNom] = useState('');
    const [zone, setZones] =  useState([]);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);
    const [series, setSeries] = useState([]);
    const [specialites, setSpecialites] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [zoneid, setZoneid] = useState("");
    const [serieid, setSerieid] = useState("");
    const [specialiteid, setSpecialiteid] = useState("");
    const [longitude, setLongitude] = useState("");
    const [latitude, setLatitude] = useState("");
    const [dateOuverture, setdateopen] = useState("");
    const [dateFermeture, setdateclose] = useState("");
    const [adresse, setAdresse] = useState("");
    const [photo, setPhotos] = useState("");
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);



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
        setDataTableLoaded(true);
    };


    useEffect(() => {
        fetchData();
        handleDataTableLoad();
    }, []);

    const fetchData = async () => {
        try {
            const Response = await axios.get('/api/controller/series/');
            setSeries(Response.data);

            const res= await axios.get("/api/controller/zones/");
            setZones(res.data);

            const resp= await axios.get("/api/controller/specialites/");
            setSpecialites(resp.data);

            const respo= await axios.get("/api/controller/restaurants/");
            setRestaurants(respo.data);


        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    /********************************************Save image *************************/


    const handleSubmit = (event) => {
        event?.preventDefault();

        if (nom.trim() === ''|| !adresse ) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
            return;
        }
        axios.post("/api/controller/restaurants/save", {
            nom,
            longitude,
            latitude,
            dateOuverture,
            dateFermeture,
            adresse,
            photo,
            zone: {
                id: zoneid
            },
            serie: {
                id: serieid
            },
            specialite: {
                id: specialiteid
            }
        }).then((response) => {
            setNom("");
            setLatitude("");
            setLongitude("");
            setAdresse("");
            setdateclose("");
            setdateopen("");
            setPhotos("");
            setZoneid("");
            setSerieid("");
            setSpecialiteid("");
            hideDialog();
            loadRestaurants();
            showusave();
        }).catch((error) => {
            console.error("Error while saving image:", error);
        });
    };





    /********************************************Load image *************************/


    const handlePhotoChange = (event) => {
        const files = event.files;

        if (files && files.length > 0) {
            const file = files[0];

            if (!file.type.startsWith('image/')) {
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotos(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };




    const loadRestaurants=async ()=>{
        const Response = await axios.get('/api/controller/series/');
        setSeries(Response.data);

        const res= await axios.get("/api/controller/zones/");
        setZones(res.data);

        const resp= await axios.get("/api/controller/specialites/");
        setSpecialites(resp.data);

        const respo= await axios.get("/api/controller/restaurants/");
        setRestaurants(respo.data);

    }

    /******************************************** Delete *************************/

    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`/api/controller/restaurants/${id}`)
                .then(() => {
                    setRestaurants(restaurants.filter((rowData) => rowData.id !== id));
                    toast.current.show({severity:'success', summary: 'Done', detail:'Restaurant deleted successfully', life: 3000});
                })
                .catch((error) => {
                    console.error('Error deleting Restaurant:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'failed to delete restaurant', life: 3000});
                });
        };

        confirmDialog({
            message: 'Are you sure you want to Delete this Restaurant ?',
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
        setRestaurants(restaurants);
        setNom("");
        setdateopen("");
        setdateclose("");
        setAdresse("");
        setLatitude("");
        setLongitude("");
        setSpecialiteid("");
        setZoneid("");
        setPhotos("");
        setSerieid("");
        setRestaurantDialog(true);
    };

    const hideDialog = () => {
        setRestaurantDialog(false);
        seteditRestaurantDialog(false);
    };
    const hideeditDialog = () => {
        seteditRestaurantDialog(false);
    };

    /***********************Update **************/

    const handleupdate = (rowData) => {
        setSelectedRestaurant(rowData);
        setNom(rowData.nom);
        setdateopen(rowData.dateOuverture);
        setdateclose(rowData.dateFermeture);
        setAdresse(rowData.adresse);
        setLatitude(rowData.latitude);
        setLongitude(rowData.longitude);
        setSpecialiteid(rowData.specialite.id);
        setZoneid(rowData.zone.id);
        setPhotos(rowData.photo);
        setSerieid(rowData.serie.id);
        seteditRestaurantDialog(true);
    };

    const handleEdit = async (restaurantsToUpdate) => {
        try {
            if (nom.trim() === '' || !zoneid ) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
                return;
            }
            const response = await axios.put(`/api/controller/restaurants/${restaurantsToUpdate.id}`, {
                nom:nom,
                longitude:longitude,
                latitude:latitude,
                dateOuverture:dateOuverture,
                dateFermeture:dateFermeture,
                adresse:adresse,
                photo:photo,
                zone: {
                    id: zoneid
                },
                serie: {
                    id: serieid
                },
                specialite: {
                    id: specialiteid
                }

            });

            const updatedProject = [...restaurants];
            const updatedProjectIndex = updatedProject.findIndex((restaurant) => restaurant.id === restaurantsToUpdate.id);
            updatedProject[updatedProjectIndex] = response.data;

            hideeditDialog();
            loadRestaurants();
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
        return <div className="flex flex-wrap gap-2 align-items-center justify-content-between ">
            <h4 className="m-0 font-monospace">Manage Restaurants</h4>
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

    const RestaurantDialogFooter = (
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
        // <React.Fragment>
        //     <Button label="Cancel" icon="pi pi-times" outlined onClick={hideeditDialog} />
        //     <Button label="Update" severity="info"  raised onClick={() => handleEdit(selectedZone)} />
        // </React.Fragment>
        <React.Fragment>
            <div className="template">
                <Button className="cancel p-0" aria-label="Slack" onClick={hideeditDialog}>
                    <i className="pi pi-times px-2"></i>
                    <span className="px-3">Cancel</span>
                </Button>
                <Button className="edit p-0" aria-label="Slack" onClick={() => handleEdit(selectedRestaurant)}>
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


    return (
        <>
            <div className="card p-1 mt-5 mx-2">
                <Toast ref={toast} />
                <ConfirmDialog />

                <div className="card">
                    <Toolbar className="mb-2 p-1" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                    {dataTableLoaded ? (
                        <DataTable ref={dt} value={restaurants}
                                   dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Restaurants" globalFilter={globalFilter} header={header}>
                            <Column field="id"  header="ID" sortable style={{ minWidth: '5rem' }}></Column>
                            <Column field="nom" className="font-bold"  filter filterPlaceholder="Search Name ..." header="Name" sortable style={{ minWidth: '10rem' }}></Column>
                            <Column field="photo" header="Photo" body={photoBodyTemplate} exportable={false} style={{ minWidth: '6rem' }}></Column>
                            <Column field="adresse"   filter filterPlaceholder="Search Name ..." header="Address" sortable style={{ minWidth: '14rem' }}></Column>
                            <Column field="serie.nom"   filter filterPlaceholder="Search Name ..." header="Serie" sortable style={{ minWidth: '14rem' }}></Column>
                            <Column field="specialite.nom"   filter filterPlaceholder="Search Name ..." header="Specialite" sortable style={{ minWidth: '14rem' }}></Column>
                            <Column field="longitude"   filter filterPlaceholder="Search Name ..." header="langitude" sortable style={{ minWidth: '8rem' }}></Column>
                            <Column field="latitude"   filter filterPlaceholder="Search Name ..." header="latitude" sortable style={{ minWidth: '8rem' }}></Column>
                            <Column field="dateOuverture"    header="Open" sortable style={{ minWidth: '8rem' }}></Column>
                            <Column field="dateFermeture"    header="Close" sortable style={{ minWidth: '8rem' }}></Column>
                            <Column   field={(rowData) => `${rowData.zone.ville.nom} -- ${rowData.zone.nom} `} header="Zone" sortable style={{ minWidth: '12rem' }}></Column>
                            <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '16rem' }}></Column>
                        </DataTable>
                    ):(
                        <SkeletonPr/>
                    )}
                </div>
            </div>

            <Dialog visible={RestaurantDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Restaurant" modal className="p-fluid" footer={RestaurantDialogFooter} onHide={hideDialog}>
                <Grid item xs={12}  >
                    <Box className="field" >
                        <FileUpload
                            className="mt-2"
                            nom="photo"
                            url={'/api/upload'}
                            accept="image/*"
                            maxFileSize={1000000}
                            emptyTemplate={<p className="m-0">Drag and drop Image here to upload.</p>}
                            chooseLabel="Select Restaurant Image"
                            uploadLabel="Upload"
                            cancelLabel="Cancel"
                            onSelect={(e) => handlePhotoChange(e)}
                        />
                    </Box>
                </Grid>
                <Grid container spacing={2} columns={12} mt={1} >
                    <Grid item xs={6} className="-mt-2" >
                        <Box className="field">
                             <span className="p-float-label">
                            <InputText  id="inputtext" value={nom} onChange={(e) => setNom(e.target.value)} />
                            <label htmlFor="nom">Name</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-2" >
                            <Box className="field">
                                <span className="p-float-label">
                            <InputText  id="inputtext" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                            <label htmlFor="adresse">Address</label>
                             </span>
                            </Box>
                        </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                            <InputText keyfilter="num"  id="inputtext" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                            <label htmlFor="longitude">Longitude</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <InputText keyfilter="num"  id="inputtext" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                                <label htmlFor="latitude">Latitude</label>
                            </span>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <InputText type={"time"} id="inputtext" value={dateOuverture} onChange={(e) => setdateopen(e.target.value)} />
                                <label htmlFor="dateOuverture">Open at :</label>
                            </span>


                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <InputText type={"time"} id="inputtext" value={dateFermeture} onChange={(e) => setdateclose(e.target.value)} />
                                <label htmlFor="dateFermeture">Close at :</label>
                            </span>
                        </Box>
                    </Grid>
                </Grid>


                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={4} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                            <Dropdown inputId="dropdown" value={zoneid}  options={zone.map((zone) => ({ label: zone.nom, value: zone.id }))}
                                      onChange={handleZoneChange} />
                            <label htmlFor="zoneid">Zone</label>
                        </span>
                        </Box>
                    </Grid>
                    <Grid item xs={4} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                            <Dropdown inputId="dropdown" value={specialiteid}   options={specialites.map((sp) => ({ label: sp.nom, value: sp.id }))}
                                      onChange={handleSpecialityChange} />
                            <label htmlFor="specialiteid">Speciality</label>
                            </span>
                        </Box>
                    </Grid>

                    <Grid item xs={4} className="-mt-3" >
                        <Box className="field">
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

            <Dialog visible={editRestaurantDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Edit Restaurant" modal className="p-fluid" footer={editimageDialogFooter} onHide={hideDialog}>
                <Grid item xs={12}  >
                    <Box className="field" >
                        <FileUpload
                            className="mt-2"
                            nom="photo"
                            url={'/api/upload'}
                            accept="image/*"
                            maxFileSize={1000000}
                            emptyTemplate={<p className="m-0">Drag and drop Image here to upload.</p>}
                            chooseLabel="Select Restaurant Image"
                            uploadLabel="Upload"
                            cancelLabel="Cancel"
                            onSelect={(e) => handlePhotoChange(e)}
                        />
                    </Box>
                </Grid>
                <Grid container spacing={2} columns={12} mt={1} >
                    <Grid item xs={6} className="-mt-2" >
                        <Box className="field">
                             <span className="p-float-label">
                            <InputText  id="inputtext" value={nom} onChange={(e) => setNom(e.target.value)} />
                            <label htmlFor="nom">Name</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-2" >
                        <Box className="field">
                                <span className="p-float-label">
                            <InputText  id="inputtext" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                            <label htmlFor="adresse">Address</label>
                             </span>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                            <InputText keyfilter="num"  id="inputtext" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                            <label htmlFor="longitude">Longitude</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <InputText keyfilter="num"  id="inputtext" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                                <label htmlFor="latitude">Latitude</label>
                            </span>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <InputText type={"time"} id="inputtext" value={dateOuverture} onChange={(e) => setdateopen(e.target.value)} />
                                <label htmlFor="dateOuverture">Open at :</label>
                            </span>


                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <InputText type={"time"} id="inputtext" value={dateFermeture} onChange={(e) => setdateclose(e.target.value)} />
                                <label htmlFor="dateFermeture">Close at :</label>
                            </span>
                        </Box>
                    </Grid>
                </Grid>


                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={4} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                            <Dropdown inputId="dropdown" value={zoneid}  options={zone.map((zone) => ({ label: zone.nom, value: zone.id }))}
                                      onChange={handleZoneChange} />
                            <label htmlFor="zoneid">Zone</label>
                        </span>
                        </Box>
                    </Grid>
                    <Grid item xs={4} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                            <Dropdown inputId="dropdown" value={specialiteid}   options={specialites.map((sp) => ({ label: sp.nom, value: sp.id }))}
                                      onChange={handleSpecialityChange} />
                            <label htmlFor="specialiteid">Speciality</label>
                            </span>
                        </Box>
                    </Grid>

                    <Grid item xs={4} className="-mt-3" >
                        <Box className="field">
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
    );
}
