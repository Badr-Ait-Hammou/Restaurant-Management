
import React, {useState, useRef, useEffect} from 'react';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import 'primeicons/primeicons.css';
import {ConfirmDialog, confirmDialog} from "primereact/confirmdialog";
import {Avatar, Grid,FormControlLabel,Switch,Box} from "@mui/material";
import axios from '../service/callerService';
import {FileUpload} from "primereact/fileupload";
import EmptyImg from "../images/empty.png";
import DatatableSkeleton from "../skeleton/DatatableSkeleton";
import {accountService} from "../service/accountService";







export default function Products() {
    const [ProductsDialog, setProductsDialog] = useState(false);
    const [editProductsDialog, seteditProductsDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const [nom, setNom] = useState('');
    const [photo, setPhotos] = useState("");
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [promotion, setpromotion] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setproducts] = useState([]);
    const [prix, setprix] = useState("");
    const [loading, setLoading] = useState(true);
    const [userRestaurantid, setUserRestaurantId] = useState([]);





    useEffect(() => {
        handleDataTableLoad();
        fetchUserData();
    }, [userRestaurantid]);


    const handleDataTableLoad = () => {
        setLoading(false);
    };



    const fetchUserData = async () => {
        const tokenInfo = accountService.getTokenInfo();
        if (tokenInfo) {
            try {
                const user = await accountService.getUserByEmail(tokenInfo.sub);
                const restaurantId = user.restaurantList[0]?.id;
                setUserRestaurantId(restaurantId);
                console.log(restaurantId);
                const response = await axios.get(`/api/controller/produits/restaurant/${restaurantId}`);
                setproducts(response.data);
            } catch (error) {
                console.log('Error retrieving user:', error);
            }
        }
    };





    /********************************************Save image *************************/


    const handleSubmit = (event) => {
        event?.preventDefault();

        if (nom.trim() === ''|| !prix ) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
            return;
        }
        axios.post("/api/controller/produits/save", {
            nom,
            description,
            photo,
            stock,
            // promotion: promotion,
            promotion: !!promotion,
            prix,
            restaurant: {
                id: userRestaurantid
            },
        }).then((response) => {
            setNom("");
            setDescription("");
            setPhotos("");
            setStock("");
            setpromotion("");
            setprix("");
            hideDialog();
            loadProducts();
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




    const loadProducts=async ()=>{
        const resp= await axios.get(`/api/controller/produits/restaurant/${userRestaurantid}`);
        setproducts(resp.data);
    }

    /******************************************** Delete *************************/

    const handleDelete = (id) => {
        const confirmDelete = () => {
            axios.delete(`/api/controller/produits/${id}`)
                .then(() => {
                    setproducts(products.filter((rowData) => rowData.id !== id));
                    toast.current.show({severity:'success', summary: 'Done', detail:'product deleted successfully', life: 3000});
                })
                .catch((error) => {
                    console.error('Error deleting product:', error);
                    toast.current.show({severity:'error', summary: 'Error', detail:'failed to delete product', life: 3000});
                });
        };

        confirmDialog({
            message: 'Are you sure you want to Delete this Product ?',
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
        setproducts(products);
        setNom("");
        setDescription("");
        setprix("");
        setStock("");
        setpromotion("");
        setPhotos("");
        setProductsDialog(true);
    };

    const hideDialog = () => {
        setProductsDialog(false);
        seteditProductsDialog(false);
    };
    const hideeditDialog = () => {
        seteditProductsDialog(false);
    };

    /***********************Update **************/

    const handleupdate = (rowData) => {
        setSelectedProduct(rowData);
        setNom(rowData.nom);
        setDescription(rowData.description);
        setPhotos(rowData.photo);
        setprix(rowData.prix);
        setStock(rowData.stock);
        setpromotion(rowData.promotion);
        seteditProductsDialog(true);
    };

    const handleEdit = async (productsToUpdate) => {
        try {
            if (nom.trim() === '' || !prix ) {
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Fields cannot be empty', life: 3000 });
                return;
            }
            const response = await axios.put(`/api/controller/produits/${productsToUpdate.id}`, {
                nom:nom,
                description:description,
                prix:prix,
                stock:stock,
                promotion:promotion,
                photo:photo,
                restaurant: {
                    id: userRestaurantid
                },

            });

            const updatedProject = [...products];
            const updatedProjectIndex = updatedProject.findIndex((product) => product.id === productsToUpdate.id);
            updatedProject[updatedProjectIndex] = response.data;

            hideeditDialog();
            loadProducts();
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
            <h4 className="m-0 font-monospace">Manage Products</h4>
        </div>;
    };




    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <div className="template flex justify-content-end ">
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

    const ProductsDialogFooter = (
        <React.Fragment>
            <div className="template flex justify-content-end mt-1">
                <Button className="cancel p-0 " aria-label="Slack" onClick={hideDialog}>
                    <i className="pi pi-times px-2"></i>
                    <span className="px-3">Cancel</span>
                </Button>
                <Button className="edit p-0 " aria-label="Slack" onClick={(e) => handleSubmit(e)}>
                    <i className="pi pi-check px-2"></i>
                    <span className="px-3">Create</span>
                </Button>
            </div>
        </React.Fragment>
    );

    const editimageDialogFooter = (
        <React.Fragment>
            <div className="template flex justify-content-end mt-1">
                <Button className="cancel p-0" aria-label="Slack" onClick={hideeditDialog}>
                    <i className="pi pi-times px-2"></i>
                    <span className="px-3">Cancel</span>
                </Button>
                <Button className="edit p-0" aria-label="Slack" onClick={() => handleEdit(selectedProduct)}>
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

    if(loading || products.length=== 0){
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
                    <DataTable ref={dt} value={products}
                               dataKey="id"  paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                               paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                               currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Products" globalFilter={globalFilter} header={header}>
                        <Column field="id"  header="ID" sortable style={{ minWidth: '5rem' }}></Column>
                        <Column field="nom" className="font-bold"  filter filterPlaceholder="Search Name ..." header="Name" sortable style={{ minWidth: '10rem' }}></Column>
                        <Column field="photo" header="Photo" body={photoBodyTemplate} exportable={false} style={{ minWidth: '6rem' }}></Column>
                        <Column field="description"   filter filterPlaceholder="Search Name ..." header="Description" sortable style={{ minWidth: '14rem' }}></Column>
                        <Column field="prix"   filter filterPlaceholder="Search Name ..." header="Price" sortable style={{ minWidth: '8rem' }} body={(rowData) => (<div><Tag style={{backgroundColor:"rgba(238,233,233,0.91)",color:"black"}} value={`${rowData.prix} Dh`}/></div>)}></Column>
                        <Column field="stock"   filter filterPlaceholder="Search Name ..." header="Stock" sortable style={{ minWidth: '8rem' }} body={(rowData) => (
                            <div>
                                {rowData.stock ===0 ? (
                                    <Tag severity="warning" value={"Out Of Stock"}/>
                                ) : (
                                    <Tag style={{backgroundColor:"rgba(45,154,141,0.82)"}} value={`${rowData.stock}  pcs`}/>
                                )}
                            </div>
                        )}></Column>
                        <Column field="promotion" body={(rowData) => (
                            <div>
                                {rowData.promotion ? (
                                    <Tag style={{backgroundColor:"rgba(255,0,0,0.82)"}} value={"On Sale"}/>
                                ) : (
                                    <Tag style={{backgroundColor:"rgba(45,154,141,0.82)"}} value={"Not On Sale"}/>
                                )}
                            </div>
                        )}  filter filterPlaceholder="Search Name ..." header="Status" sortable style={{ minWidth: '6rem' }}></Column>
                        <Column header="Action" body={actionBodyTemplate} exportable={false} style={{ minWidth: '16rem' }}></Column>
                    </DataTable>
                </div>
            </div>

            <Dialog visible={ProductsDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Product" modal className="p-fluid" footer={ProductsDialogFooter} onHide={hideDialog}>
                <Grid item xs={12}  >
                    <Box className="field" >
                        <FileUpload
                            nom="photo"
                            url={'/api/upload'}
                            accept="image/*"
                            maxFileSize={1000000}
                            emptyTemplate={<p className="m-0">Drag and drop Image here to upload.</p>}
                            chooseLabel="Select Product Image"
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
                            <InputText  id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                            <label htmlFor="nom">Name</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-2" >
                        <Box className="field">
                                <span className="p-float-label">
                            <InputText  id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            <label htmlFor="description">Description</label>
                             </span>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                            <InputText keyfilter="num"  id="prix" value={prix} onChange={(e) => setprix(e.target.value)} />
                            <label htmlFor="prix">Price Dh</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <InputText keyfilter="num"  id="stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                                <label htmlFor="stock">Stock Pcs</label>
                            </span>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={4} md={4} className="-mt-5" >
                        <Box className="field ml-2">
                            <FormControlLabel
                                label={`On Sale: ${promotion ? "Yes" : "No"}`}
                                control={
                                    <Switch
                                        // checked={promotion}
                                        checked={Boolean(promotion)}
                                        onChange={(event) => setpromotion(event.target.checked)}
                                        name="promotion"
                                        color="primary"
                                    />
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Dialog>

            <Dialog visible={editProductsDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Edit Product" modal className="p-fluid" footer={editimageDialogFooter} onHide={hideDialog}>
                <Grid item xs={12}  >
                    <Box className="field" >
                        <FileUpload
                            nom="photo"
                            url={'/api/upload'}
                            accept="image/*"
                            maxFileSize={1000000}
                            emptyTemplate={<p className="m-0">Drag and drop Image here to upload.</p>}
                            chooseLabel="Select Product Image"
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
                            <InputText  id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                            <label htmlFor="nom">Name</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-2" >
                        <Box className="field">
                                <span className="p-float-label">
                            <InputText  id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                            <label htmlFor="description">Description</label>
                             </span>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                            <InputText keyfilter="num"  id="prix" value={prix} onChange={(e) => setprix(e.target.value)} />
                            <label htmlFor="prix">Price Dh</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <InputText keyfilter="num"  id="stock" value={stock} onChange={(e) => setStock(e.target.value)} />
                                <label htmlFor="stock">Stock Pcs</label>
                            </span>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={4} md={4} className="-mt-5" >
                        <Box className="field ml-2">
                            <FormControlLabel
                                label={`On Sale: ${promotion ? "Yes" : "No"}`}
                                control={
                                    <Switch
                                        // checked={promotion}
                                        checked={Boolean(promotion)}
                                        onChange={(event) => setpromotion(event.target.checked)}
                                        name="promotion"
                                        color="primary"
                                    />
                                }
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Dialog>



        </>
    );
}
