import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import {Toolbar} from "primereact/toolbar";


export default function RestaurantProfileSkeleton() {

    return (
        <>
        <div className=" relative shadow-2  p-1 border-50 w-full sm:h-64 h-64 bg-cover bg-center">
                <Skeleton width="100%" height="16rem" borderRadius={"0px"}  />
            <div className=" w-full h-full p-2  justify-content-between  backdrop-blur-sm  border-spacing-1 shadow-2 p-0.5 border-50 border-round"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2  -bottom-1/3" style={{bottom:"-70px"}}>
                    <Skeleton shape="circle"  className="w-9rem h-9rem" />
                </div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-1/2 text-white text-2xl text-uppercase">
                    <Skeleton width="8rem" height="2rem" className="mx-2" />
                </div>
            </div>
            <div className=" mx-2 p-1 card  mt-8 ">
                <Toolbar className="mb-2 p-1"
                         start={<Skeleton width="4rem" height="2rem" className="mx-2" />}
                         end={<Skeleton width="4rem" height="2rem" className="mx-2" />  }
                >
                </Toolbar>
                <Skeleton width="100%" height="400px" className="mb-1" />

            </div>


        </>
    );
}
