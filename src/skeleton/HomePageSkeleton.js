import React from 'react';
import { Skeleton } from 'primereact/skeleton';
import {Carousel} from "primereact/carousel";
import SkipPreviousRoundedIcon from "@mui/icons-material/SkipPreviousRounded";
import SkipNextRoundedIcon from "@mui/icons-material/SkipNextRounded";
import {useDarkMode} from "../components/DarkModeContext";

export default function HomePageSkeleton() {
    const { isDarkMode } = useDarkMode();


    const products = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },

    ];


    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];


    const carouselItemTemplate = () => {



        return (
            <div  className="border-1 surface-border border-round m-2 text-center py-5 px-3">

            <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <Skeleton  className={`w-6rem border-round h-1rem  ${isDarkMode ? "bg-black" :""}`} />
                        <Skeleton  className={`w-3rem border-round h-1rem  ${isDarkMode ? "bg-black" :""}`} />
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <Skeleton  className={`w-9 shadow-2 border-round h-10rem${isDarkMode ? "bg-black" :""}`} />
                        <Skeleton  className={`w-8rem border-round h-2rem${isDarkMode ? "bg-black" :""}`}/>
                        <Skeleton  className={`w-6rem border-round h-1rem ${isDarkMode ? "bg-black" :""}`}/>
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <Skeleton  className={`w-4rem border-round h-2rem ${isDarkMode ? "bg-black" :""}`} />
                        <Skeleton shape="circle"  className={`w-3rem h-3rem ${isDarkMode ? "bg-black" :""}`} />
                    </div>
                </div>
            // </div>
        );
    };







    return (
        <>
            <div >
                <div className="  surface-card ">

                    <Skeleton width="100%" height="2rem" borderRadius={"0px"}  className={`mb-0.5 ${isDarkMode ? "bg-black" :""}`} />
                    <Skeleton width="100%" height="400px"  className={`mb-1 ${isDarkMode ? "bg-black" :""}`} />
                    <Skeleton width="100%" height="100px"  />
                    <Skeleton width="100%" height="100px"  className={`mt-3 ${isDarkMode ? "bg-black" :""}`} />
                    <div className="flex justify-content-center mt-1">
                        <Skeleton width="4rem" height="2rem"  className={` mx-2 ${isDarkMode ? "bg-black" :""}`}/>
                        <Skeleton width="4rem" height="2rem" className={` ${isDarkMode ? "bg-black" :""}`} />
                        <Skeleton width="4rem" height="2rem"  className={`mx-2 ${isDarkMode ? "bg-black" :""}`} />
                    </div>
                </div>
            </div>



        <div className="container mt-5">
            <Carousel
                prevIcon={<SkipPreviousRoundedIcon/>}
                nextIcon={<SkipNextRoundedIcon/>}
                value={products}
                numVisible={3}
                numScroll={1}
                responsiveOptions={responsiveOptions}
                circular
                autoplayInterval={3000}
                itemTemplate={carouselItemTemplate}
            />
        </div>

            <div className="container mt-5">
            <Carousel
                prevIcon={<SkipPreviousRoundedIcon/>}
                nextIcon={<SkipNextRoundedIcon/>}
                value={products}
                numVisible={3}
                numScroll={1}
                responsiveOptions={responsiveOptions}
                circular
                autoplayInterval={3000}
                itemTemplate={carouselItemTemplate}
            />
        </div>
        </>
    );
}
