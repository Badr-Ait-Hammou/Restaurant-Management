import React, {useState, useEffect, useRef} from "react"
import {Box, Grid} from "@mui/material";
import {Dialog} from 'primereact/dialog';
import {Button} from 'primereact/button';
import axios from  '../service/callerService';
import {Toast} from "primereact/toast";
import {Toolbar} from 'primereact/toolbar';
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {InputText} from "primereact/inputtext";
import {ConfirmDialog} from "primereact/confirmdialog";
import { Password } from 'primereact/password';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';



export default function Owners() {
    const [showMessage, setShowMessage] = useState(false);
    const [users, setUsers] = useState([]);
    const [userDialog, setUserDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);



    useEffect(() => {
        axios.get("/api/controller/users/userrole/EMPLOYEE").then((response) => {
            setUsers(response.data);
        });
    }, []);

    const loadClients = async () => {
        const res = await axios.get(`/api/controller/users/userrole/EMPLOYEE`);
        setUsers(res.data);
    }

    /************************************************** Validator ******************************************************/


    const validate = (values) => {
        const errors = {};

        if (!values.firstname) {
            errors.firstname = 'First name is required.';
        }

        if (!values.lastname) {
            errors.lastname = 'Last name is required.';
        }

        if (!values.adresse) {
            errors.adresse = 'Address is required.';
        }

        if (!values.telephone) {
            errors.telephone = 'Phone is required.';
        } else if (!/^\d{10,}$/.test(values.telephone)) {
            errors.telephone = 'Phone should contain at least 10 digits.';
        }

        if (!values.email) {
            errors.email = 'Email is required.';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid email address. E.g. example@email.com';
        }

        if (!values.username) {
            errors.username = 'Username is required.';
        }

        if (!values.password) {
            errors.password = 'Password is required.';
        } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(values.password)) {
            errors.password = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.';
        }

        return errors;
    };

    /*************************************************** Save *************************************************/


    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            adresse: '',
            telephone: '',
            email: '',
            username: '',
            password: '',
        },
        validate,
        onSubmit: async (values) => {
            try {
                if (values.username.trim() === '' || values.firstname.trim() === '' || values.lastname.trim() === '' || values.email.trim() === '') {
                    toast.current.show({
                        severity: 'error',
                        summary: 'Warning',
                        detail: 'One of the fields is empty',
                        life: 3000
                    });
                } else {
                    const response = await axios.post('/api/auth/register', {
                        username: values.username,
                        password: values.password,
                        firstname: values.firstname,
                        lastname: values.lastname,
                        telephone: values.telephone,
                        adresse: values.adresse,
                        role: 'EMPLOYEE',
                        email: values.email
                    });

                    console.log("API Response:", response.data);
                    formik.resetForm();
                    setUserDialog(false);
                    loadClients();
                    setShowMessage(true);
                }
            } catch (error) {
                console.error("Error while saving project:", error);
                toast.current.show({
                    severity: 'error',
                    summary: 'Email Already Used',
                    detail: 'The email address is already registered.',
                    life: 3000
                });
            }
        },
    });


    /************************************ Dialog open/close *****************************/

    const openNew = () => {
        formik.resetForm();
        setUserDialog(true);
    };
    const hideDialog = () => {
        setUserDialog(false);

    };

    /************************************ Datatable  components *****************************/


    const exportCSV = () => {
        dt.current.exportCSV();
    };

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




    const userDialogFooter = (
        <React.Fragment>
            <div className="template flex justify-content-end mt-1">
                <Button className="cancel p-0" aria-label="Slack" onClick={hideDialog}>
                    <i className="pi pi-times px-2"></i>
                    <span className="px-3">Cancel</span>
                </Button>
                {/*<Button className="edit p-0" aria-label="Slack" onClick={(e) => handleSubmit(e)}>*/}
                {/*    <i className="pi pi-check px-2"></i>*/}
                {/*    <span className="px-3">Create</span>*/}
                {/*</Button>*/}
                <form onSubmit={formik.handleSubmit}>
                    <Button type="submit" className="edit p-0" aria-label="Slack">
                        <i className="pi pi-check px-2"></i>
                        <span className="px-3">Create</span>
                    </Button>
                </form>
            </div>
        </React.Fragment>
    );
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <div className="template">
                    <Button className="cancel p-0" aria-label="Slack" >
                        <i className="pi pi-trash px-2"></i>
                        <span className="px-1">Delete</span>
                    </Button>
                    <Button className="edit p-0" aria-label="Slack" >
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

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;

    return (
        <>
            <div className="card p-1 mt-5 mx-2">
            <ConfirmDialog />
            <Toast ref={toast}/>
            <div>
                <Toolbar className="mb-2 p-1" start={leftToolbarTemplate} center={centerToolbarTemplate}
                         end={rightToolbarTemplate}></Toolbar>

                <DataTable ref={dt} value={users}
                           dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                           paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                           currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Clients"
                           globalFilter={globalFilter} header={header}>
                    <Column field="id" header="ID" sortable style={{minWidth: '7rem'}}></Column>
                    <Column field="email" className="font-bold" header="Email" sortable style={{minWidth: '10em'}}></Column>
                    <Column field="firstName" header="FirstName" filter filterPlaceholder="Search FirstName ..." sortable style={{minWidth: '10rem'}}></Column>
                    <Column field="lastName" header="LastName" filter filterPlaceholder="Search LastName ..." sortable style={{minWidth: '10rem'}}></Column>
                    <Column field="username" header="UserName" sortable style={{minWidth: '10em'}}></Column>
                    <Column field="telephone" header="Phone" sortable sortField="dateCreation" style={{minWidth: "10rem"}}></Column>

                    <Column header="Action" body={actionBodyTemplate} exportable={false} style={{minWidth: '12rem'}}></Column>
                </DataTable>
            </div>
            </div>

            <Dialog visible={userDialog} style={{ width: '40rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Add Owner Account" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                <Grid container spacing={2} columns={12} mt={1} >
                    <Grid item xs={6} className="-mt-1" >
                        <Box className="field">
                             <span className="p-float-label">
                                 <InputText
                                     id="firstname"
                                     name="firstname"
                                     value={formik.values.firstname}
                                     onChange={formik.handleChange}
                                     onBlur={formik.handleBlur}
                                     className={classNames({ 'p-invalid': formik.touched.firstname && formik.errors.firstname })}
                                 />
                                 {formik.touched.firstname && <small className="p-error">{formik.errors.firstname}</small>}
                                 <label htmlFor="firstname">FirstName*</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-1" >
                        <Box className="field">
                                <span className="p-float-label">
                                    <InputText
                                        id="lastname"
                                        name="lastname"
                                        value={formik.values.lastname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={classNames({ 'p-invalid': formik.touched.lastname && formik.errors.lastname })}
                                    />
                                    {formik.touched.lastname && <small className="p-error">{formik.errors.lastname}</small>}

                                    <label htmlFor="lastname">LastName</label>
                             </span>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <InputText
                                    id="adresse"
                                    name="adresse"
                                    value={formik.values.adresse}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={classNames({ 'p-invalid': formik.touched.adresse && formik.errors.adresse })}
                                />
                                {formik.touched.adresse && <small className="p-error">{formik.errors.adresse}</small>}

                                <label htmlFor="adresse">Address</label>
                             </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                {/*<InputText keyfilter="num"  id="inputtext" value={telephone} onChange={(e) => settel(e.target.value)} />*/}
                                <InputText
                                    id="telephone"
                                    name="telephone"
                                    value={formik.values.telephone}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={classNames({ 'p-invalid': formik.touched.telephone && formik.errors.telephone })}
                                />
                                {formik.touched.telephone && <small className="p-error">{formik.errors.telephone}</small>}
                                <label htmlFor="telephone">Phone</label>
                            </span>
                        </Box>
                    </Grid>
                </Grid>

                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label p-input-icon-right">
                                <i className="pi pi-envelope" />
                                <InputText
                                    id="email"
                                    name="email"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={classNames({ 'p-invalid': formik.touched.email && formik.errors.email })}
                                />
                                {formik.touched.email && <small className="p-error">{formik.errors.email}</small>}

                                <label htmlFor="email">Email </label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={6} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <InputText
                                    id="username"
                                    name="username"
                                    value={formik.values.username}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={classNames({ 'p-invalid': formik.touched.username && formik.errors.username })}
                                />
                                {formik.touched.username && <small className="p-error">{formik.errors.username}</small>}

                                <label htmlFor="username">UserName:</label>
                            </span>
                        </Box>
                    </Grid>
                </Grid>


                <Grid container spacing={2} columns={12} mt={1}>
                    <Grid item xs={12} className="-mt-3" >
                        <Box className="field">
                            <span className="p-float-label">
                                <Password
                                    id="password"
                                    name="password"
                                    toggleMask
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={classNames({ 'p-invalid': formik.touched.password && formik.errors.password })}
                                />
                                {formik.touched.password && <small className="p-error">{formik.errors.password}</small>}

                                <label htmlFor="password">Password</label>
                        </span>
                        </Box>
                    </Grid>
                </Grid>
            </Dialog>

            <Dialog
                visible={showMessage}
                onHide={() => setShowMessage(false)}
                position="top"
                footer={dialogFooter}
                showHeader={false}
                breakpoints={{ '960px': '80vw' }}
                style={{ width: '40vw' }}
            >
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Registration Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your have added the owner's account successfully, account is registered under : <b>{formik.values.email}</b>, it'll be valid and activated immediately.
                    </p>
                </div>
            </Dialog>
        </>

    );
};
