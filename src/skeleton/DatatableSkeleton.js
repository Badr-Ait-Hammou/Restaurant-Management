import React from "react"
import {Skeleton} from "primereact/skeleton";
import {Toolbar} from "primereact/toolbar";
import {Divider} from "primereact/divider";
import Grid from "@mui/material/Grid";

export default function DatatableSkeleton(){
    return(

        <div className="card p-1 mt-5 mx-2">

            <div className="card">
                <Toolbar className="mb-2 p-1" start={<Skeleton width="6rem" height="2.5rem"></Skeleton>} center={<Skeleton width="18rem" height="2rem"></Skeleton>} end={<Skeleton width="6rem" height="2.5rem"></Skeleton>} />
                <div>
                    <Skeleton width="100%" height="2rem" borderRadius={"0"}></Skeleton>
                    <Divider className=" m-0" color="black" />
                    <Skeleton width="100%" height="5rem" borderRadius={"0"}></Skeleton>
                    <Grid item container  columns={12} p={1} >
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Divider className=" mx-2 mt-0 mb-0" color="black" />

                    </Grid>
                    <Grid item container  columns={12} p={1} >
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Divider className=" mx-2 mt-0 mb-0" color="black" />

                    </Grid>
                    <Grid item container  columns={12} p={1} >
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Divider className=" mx-2 mt-0 mb-0" color="black" />

                    </Grid>
                    <Grid item container  columns={12} p={1} >
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Divider className=" mx-2 mt-0 mb-0" color="black" />

                    </Grid>
                    <Grid item container  columns={12} p={1} >
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Divider className=" mx-2 mt-0 mb-0" color="black" />

                    </Grid>
                    <Grid item container  columns={12} p={1} >
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Grid item sm={3} >
                            <Skeleton width="14rem" height="1rem" className="m-3"></Skeleton>
                        </Grid>
                        <Divider className=" mx-2 mt-0 mb-0" color="black" />

                    </Grid>

                </div>
            </div>

        </div>



    );
}