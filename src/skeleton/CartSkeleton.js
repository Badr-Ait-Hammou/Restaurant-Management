import React from "react"
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";
import {DataView} from "primereact/dataview";
import {Skeleton} from "primereact/skeleton";
export default function CartSkeleton(){

    const cartProducts = [
        { id: 1 },
        { id: 2 },

    ];




    const itemTemplate = (product) => {
        return (
            <div key={product.id} className="flex col-12 flex-wrap p-2 align-items-center gap-3">
                <Skeleton width="100%" height="60%"/>
                <div className="flex-1 flex flex-column gap-1 xl:mr-1">
                    <div className="flex justify-content-between">
                            <Skeleton width="100%" height="10px" className="mb-1" />
                    </div>
                    <div className="flex align-items-center sm:col-12  md:col-12 xl:col-12 justify-content-sm-center justify-content-between ">
                        <div>
                            <Skeleton width="20%" height="10px" className="mb-1" />
                            <Skeleton width="20%" height="10px" className="mb-1" />
                        </div>
                    </div>

                </div>
            </div>
        );
    };

    return(
        <>
            <Box sx={{mx:3,mt:3}}>
                <Grid item container spacing={1}  columns={12} >
                    <Grid item xs={12} md={7}  >
                        <div className="card">
                            <DataView value={cartProducts} itemTemplate={itemTemplate}   header="Cart" />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={5}   >
                        <div className="card ">

                            <Skeleton width="100%" height="233px"  />

                        </div>
                    </Grid>
                </Grid>
            </Box>
            </>
            );
}