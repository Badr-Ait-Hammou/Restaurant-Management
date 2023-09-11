import {Card, CardContent} from "@mui/material";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {Fieldset} from 'primereact/fieldset';
import React from "react";
import {Skeleton} from "primereact/skeleton";

export default function ClientOrdersSkeleton() {
    return (

        <div>


            <Card className="mx-3 p-2 mt-1">
                <CardContent>
                    <div style={{alignItems: "center"}}>
                        <h2>ORDERS</h2>
                    </div>
                </CardContent>

                <div>
                    <Box sx={{display: 'flex', justifyContent: 'center',marginBottom:2}}>
                            <Skeleton width="5rem" height="2rem" className="mx-2"/>
                            <Skeleton width="5rem" height="2rem" className="mx-2"/>
                            <Skeleton width="5rem" height="2rem" className="mx-2"/>
                            <Skeleton width="5rem" height="2rem" className="mx-2"/>
                            <Skeleton width="5rem" height="2rem" className="mx-2"/>
                    </Box>
                </div>
                <Fieldset toggleable legend="Loading ...">
                    <Grid container alignItems="center ">
                        <Grid item xs={12} className="left">
                            <Skeleton width="100%" height="100px"/>
                            <Skeleton width="100%" height="100px" className="mt-1"/>


                        </Grid>
                    </Grid>
                    <div className="flex justify-content-center mt-1 mb-1">
                        <Skeleton width="6rem" height="2rem" className="mx-2"/>
                        <Skeleton width="6rem" height="2rem" className="mx-2"/>
                        <Skeleton width="6rem" height="2rem" className="mx-2"/>
                    </div>
                </Fieldset>
                <Fieldset toggleable legend="Loading ..." className="mt-5">
                    <Grid container alignItems="center ">
                        <Grid item xs={12} className="left">
                            <Skeleton width="100%" height="100px"/>
                            <Skeleton width="100%" height="100px" className="mt-1"/>


                        </Grid>
                    </Grid>
                    <div className="flex justify-content-center mt-1 mb-1">
                        <Skeleton width="6rem" height="2rem" className="mx-2"/>
                        <Skeleton width="6rem" height="2rem" className="mx-2"/>
                        <Skeleton width="6rem" height="2rem" className="mx-2"/>
                    </div>
                </Fieldset>
            </Card>
        </div>

    );
}
