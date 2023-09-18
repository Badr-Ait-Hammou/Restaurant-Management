
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
import { Grid} from "@mui/material";
import {Box} from "@mui/system";
import { Dropdown } from 'primereact/dropdown';
import axios from '../service/callerService';
import SkeletonPr from "../skeleton/ProfileSkeleton"





export default function Zones() {
    const [productDialog, setZonesDialog] = useState(false);
    const [editproductDialog, seteditZonesDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [selectedZone, setSelectedZone] = useState(null);
    const [nom, setNom] = useState('');
    const [zone, setZones] =  useState([]);
    const [city, setCities] =  useState([]);
    const [dataTableLoaded, setDataTableLoaded] = useState(false);
    const [cityId, setCityId] = useState("");


    const handleCityChange = (e) => {
        setCityId(e.value);
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
            const Response = await axios.get('/api/controller/zones/');
            setZones(Response.data);

            const res= await axios.get("/api/controller/villes/");
                setCities(res.data);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    /********************************************Save image *************************/


    const handleSubmit = (event) => {
        event?.preventDefault();

        if (nom.trim() === ''|| !cityId ) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
            return;
        }
        axios.post("/api/controller/zones/save", {
            nom,
            ville: {
                id: cityId
            }
        }).then((response) => {
            console.log(response.data);
            setNom("");
            setCityId("");
            hideDialog();
            loadZones();
            showusave();
        }).catch((error) => {
            console.error("Error while saving image:", error);
        });
    };





    /********************************************Load image *************************/

    const loadZones=async ()=>{
        const res=await axios.get(`/api/controller/zones/`);
        setZones(res.data);
        const resp=await axios.get(`/api/controller/villes/`);
        setCities(resp.data);
    }

    /******************************************** Delete *************************/

    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`/api/controller/zones/${id}`)
                .then(() => {
                    setZones(zone.filter((rowData) => rowData.id !== id));
                    toast.current.show({severity:'success', summary: 'Done', detail:'zone deleted successfully', life: 3000});
                })
                .catch((error) => {
                    console.error('Error deleting project:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'failed to delete zone', life: 3000});
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
        setZones(zone);
        setNom("");
        setZonesDialog(true);
    };

    const hideDialog = () => {
        setZonesDialog(false);
        seteditZonesDialog(false);
    };
    const hideeditDialog = () => {
        seteditZonesDialog(false);
    };

    /***********************Update **************/

    const handleupdate = (rowData) => {
        setSelectedZone(rowData);
        setNom(rowData.nom);
        setCityId(rowData.ville.id);
        seteditZonesDialog(true);
    };

    const handleEdit = async (zonesToUpdate) => {
        try {
            if (nom.trim() === '' || !cityId ) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
                return;
            }
            const response = await axios.put(`/api/controller/zones/${zonesToUpdate.id}`, {
                nom:nom,
                ville:{
                    id:cityId,
                },

            });

            const updatedProject = [...zone];
            const updatedProjectIndex = updatedProject.findIndex((zone) => zone.id === zonesToUpdate.id);
            updatedProject[updatedProjectIndex] = response.data;

            hideeditDialog();
            loadZones();
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
                <Button className="add p-0"   onClick={openNew}>
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
            <h4 className="m-0 font-monospace">Manage Zones</h4>
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
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
    <span className="p-input-icon-left">
      <i className="pi pi-search" />
      <InputText
          type="search"
          value={globalFilter ||''}
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
            <Button className="edit p-0" aria-label="Slack" onClick={() => handleEdit(selectedZone)}>
                <i className="pi pi-pencil px-2"></i>
                <span className="px-3">Update</span>
            </Button>
        </div>
    </React.Fragment>
    );









    return (
        <>
            <div className="card p-1 mt-5 mx-2">
                <Toast ref={toast} />
                <ConfirmDialog />

                <div className="card">
                    <Toolbar className="mb-2 p-1" start={leftToolbarTemplate} center={centerToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                    {dataTableLoaded ? (
                        <DataTable ref={dt} value={zone} size="small"
                                   dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                   currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Series" globalFilter={globalFilter} header={header}>
                            <Column field="id"  header="ID" sortable style={{ minWidth: '10rem' }}></Column>
                            <Column field="nom"   filter filterPlaceholder="Search Name ..." header="Name" sortable style={{ minWidth: '18rem' }}></Column>
                            <Column field="ville.nom"   filter filterPlaceholder="Search Name ..." header="City" sortable style={{ minWidth: '18rem' }}></Column>
                            <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '10rem' }}></Column>
                        </DataTable>
                    ):(
                        <SkeletonPr/>
                    )}
                </div>
            </div>

            <Dialog visible={productDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Zone" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Box className="field">
                            <label htmlFor="nom" className="font-bold">
                                Name
                            </label>
                            <InputText style={{marginTop:"5px"}} id="nom" value={nom ||''} onChange={(event) => setNom(event.target.value)} required autoFocus />
                        </Box>
                    </Grid>
                </Grid>



                <Grid item xs={12} >
                    <Box className="field">
                        <label htmlFor="nom" className="font-bold">
                            City
                        </label>
                        <Dropdown
                            value={cityId}
                            onChange={handleCityChange}
                            options={city.map((ville) => ({ label: ville.nom, value: ville.id }))}
                            placeholder="Select a City"
                            className="w-full "
                        />
                    </Box>
                </Grid>
            </Dialog>

            <Dialog visible={editproductDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Edit Zone" modal className="p-fluid" footer={editimageDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Box className="field">
                            <label htmlFor="nom" className="font-bold">
                                Name
                            </label>
                            <InputText style={{marginTop:"5px"}} id="nom" value={nom ||''} onChange={(event) => setNom(event.target.value)} required autoFocus />
                        </Box>
                    </Grid>
                </Grid>



                <Grid item xs={12} >
                    <Box>
                        <Dropdown

                            value={cityId}
                            onChange={handleCityChange}
                            options={city.map((ville) => ({ label: ville.nom, value: ville.id }))}
                            placeholder="Select a City"
                            className="w-full "
                        />
                    </Box>

                </Grid>
            </Dialog>



        </>
    );
}
