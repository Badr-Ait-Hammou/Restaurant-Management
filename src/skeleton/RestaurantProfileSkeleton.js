import React from 'react';
import { Skeleton } from 'primereact/skeleton';

export default function RestaurantProfileSkeleton() {






    //
    // const carouselItemTemplate = () => {
    //
    //
    //
    //     return (
    //         // <div className="col-12 sm:col-12 lg:col-4 xl:col-3 p-2">
    //         //     <div className="p-4 border-1 surface-border surface-card border-round mx-1">
    //         <div  className="border-1 surface-border border-round m-2 text-center py-5 px-3">
    //
    //             <div className="flex flex-wrap align-items-center justify-content-between gap-2">
    //                 <Skeleton className="w-6rem border-round h-1rem" />
    //                 <Skeleton className="w-3rem border-round h-1rem" />
    //             </div>
    //             <div className="flex flex-column align-items-center gap-3 py-5">
    //                 <Skeleton className="w-9 shadow-2 border-round h-10rem" />
    //                 <Skeleton className="w-8rem border-round h-2rem" />
    //                 <Skeleton className="w-6rem border-round h-1rem" />
    //             </div>
    //             <div className="flex align-items-center justify-content-between">
    //                 <Skeleton className="w-4rem border-round h-2rem" />
    //                 <Skeleton shape="circle" className="w-3rem h-3rem" />
    //             </div>
    //         </div>
    //         // </div>
    //     );
    // };







    return (
        <>
            {/*<div >*/}
            {/*    <div className="  surface-card ">*/}

            {/*<Skeleton width="100%" height="15.5rem" borderRadius={"0px"} className="mb-0.5" />*/}
            {/*        <Skeleton width="100%" height="400px" className="mb-1" />*/}
            {/*        <Skeleton width="100%" height="100px"  />*/}
            {/*        <Skeleton width="100%" height="100px" className="mt-3"  />*/}
            {/*        <div className="flex justify-content-center mt-1">*/}
            {/*            <Skeleton width="4rem" height="2rem" className="mx-2" />*/}
            {/*            <Skeleton width="4rem" height="2rem" />*/}
            {/*            <Skeleton width="4rem" height="2rem" className="mx-2" />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div className=" relative shadow-2    w-full sm:h-64 h-64 bg-cover bg-center">
                <Skeleton width="100%" height="16rem" borderRadius={"0px"} className="mb-0.5" />
                <div className=" w-full h-full  justify-content-between    shadow-2  border-50 border-round"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 sm:-bottom-1/3 -bottom-1/3">
                    {/*<Avatar image={ Image1} style={{width: "160px", height: "160px"}}*/}
                    {/*        shape="circle"*/}
                    {/*        className=" shadow-4 shadow-indigo-400 mb-3 "/>*/}
                    <Skeleton shape="circle"  className="w-11rem h-11rem" />
                </div>
                {/*<div*/}
                {/*    className="absolute left-1/2 transform -translate-x-1/2 bottom-1/2 text-white text-2xl text-uppercase">*/}
                {/*    {restaurant.nom || "Restaurant Name"} Restaurant<br/>*/}
                {/*    <Rating value={restaurantRating} readOnly precision={0.5}/>*/}
                {/*</div>*/}
            </div>

        </>
    );
}
