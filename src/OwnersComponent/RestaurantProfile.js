import React from "react"
import {Button} from "primereact/button"
import Image1 from "../images/deliver.jpg"
// import Avatar from '@mui/material/Avatar';
import {Avatar} from 'primereact/avatar';
import {Divider} from 'primereact/divider';
import {Badge} from 'primereact/badge';
import ordersImage from "../images/flowers.jpg";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import {Box, Grid} from "@mui/material";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";

export default function RestaurantProfile() {
    return (

        <>

            <div className=" relative shadow-2  p-1 border-50 w-full sm:h-64 h-44 bg-cover bg-center"
                 style={{backgroundImage: `url(${ordersImage})`}}>
                <div
                    className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm  border-spacing-1 shadow-2 p-0.5 border-50 border-round"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 sm:-bottom-1/3 -bottom-1/2">
                    <Avatar image={Image1} style={{width: "160px", height: "160px"}} shape="circle"
                            className=" shadow-4 shadow-indigo-400 mb-3 "/>
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-1/2 text-white text-2xl">
                    John Doe
                </div>
            </div>

            <div className=" mx-2 p-1 card  mt-8 ">
                <div className="flex flex-2  sm:justify-content-between   ">
                    <Chip
                        avatar={<Avatar alt={"restaurantName"} style={{width: "60px", height: "60px"}} image={Image1}
                                        shape="circle" className=" shadow-4 shadow-indigo-400  "/>}
                        label={<Typography className="font-monospace mx-2"><span className="font-bold">Owner :</span>
                        </Typography>}
                        variant="filled"
                        size="medium"
                        sx={{width: 200, height: 70, backgroundColor: "transparent"}}
                    />
                    <Button label="Update" severity="info"></Button>
                </div>
                <Divider/>


                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} className="p-fluid grid">
                    <Grid item xs={12} sm={6} md={3} >
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="firstname" name="firstname"/>
                                <label htmlFor="firstname">FirstName*</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="firstname" name="firstname"/>
                                <label htmlFor="firstname">FirstName*</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                            <span className="p-float-label">
                                <InputText id="firstname" name="firstname"/>
                                <label htmlFor="firstname">FirstName*</label>
                            </span>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Box className="field col-12 md:col-12">
                             <span className="p-float-label">
                                 <InputText id="firstname" name="firstname"/>
                                 <label htmlFor="firstname">FirstName*</label>
                             </span>
                        </Box>
                    </Grid>
                </Grid>

            </div>


        </>

    )
}
