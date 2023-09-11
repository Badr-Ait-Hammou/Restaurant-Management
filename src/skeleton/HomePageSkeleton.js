import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import {Carousel} from "primereact/carousel";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";

export default function HomePageSkeleton() {

    const products = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },

    ];


    const carouselItemTemplate = () => {

        return (

            <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4 mt-5">
                <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {Array.from({length: 4}).map((_, index) => (
                        <div key={index} className={`col mb-4 out-of-stock`}>
                            <div className="card h-100">
                                <div className="flex flex-column xl:flex-row xl:align-items-start p-2 gap-4">
                                    <div style={{position: 'relative'}}>
                                        <Skeleton
                                            className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"/>
                                    </div>
                                    <div
                                        className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                        <div
                                            className="flex flex-column align-items-center sm:align-items-start gap-3">
                                            <Skeleton className="w-8rem border-round h-2rem"/>
                                            <Skeleton className="w-6rem border-round h-1rem"/>
                                            <div className="flex align-items-center gap-3">
                                                <Skeleton className="w-6rem border-round h-1rem"/>
                                                <Skeleton className="w-3rem border-round h-1rem"/>
                                            </div>
                                        </div>
                                        <div
                                            className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm-gap-2">
                                            <Skeleton className="w-4rem border-round h-2rem"/>
                                            <Skeleton shape="circle" className="w-3rem h-3rem"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };






    return (
        <>
            <div >
                <div className=" p-1 surface-card ">

                    <div className="flex justify-content-between mt-1 mb-1">
                        <Skeleton width="4rem" height="2rem" className="mx-2" />
                        <Skeleton width="4rem" height="2rem" className="mx-2" />
                    </div>
                    <Skeleton width="100%" height="400px" className="mb-1" />
                    <Skeleton width="100%" height="100px"  />
                    <Skeleton width="100%" height="100px" className="mt-3"  />
                    <div className="flex justify-content-center mt-1">
                        <Skeleton width="4rem" height="2rem" className="mx-2" />
                        <Skeleton width="4rem" height="2rem" />
                        <Skeleton width="4rem" height="2rem" className="mx-2" />
                    </div>
                </div>
            </div>



        <div className="container mt-5">
            <Carousel
                prevIcon={<SkipPreviousRoundedIcon/>}
                nextIcon={<SkipNextRoundedIcon/>}
                value={products}
                numVisible={1}
                numScroll={1}
                circular
                autoplayInterval={3000}
                itemTemplate={carouselItemTemplate}
            />
        </div>
        </>
    );
}
