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
            <div  className={`border-1 surface-border border-round m-2 text-center py-5 px-3  ${isDarkMode ? 'bg-black text-white   px-1' : 'bg-white '}`}>
                    <div className={`flex flex-column align-items-center gap-3 -mt-4 ${isDarkMode ? "bg-black" :""}`}>
                        <Skeleton  className={`w-12 shadow-2 border-round h-12rem ${isDarkMode ? "bg-gray-900" :""}`} />
                        <Skeleton  className={`w-8rem border-round h-2rem ${isDarkMode ? "bg-gray-900" :""}`}/>
                        <Skeleton  className={`w-6rem border-round h-1rem ${isDarkMode ? "bg-gray-900" :""}`}/>
                    </div>
                    <div  className={`flex align-items-center justify-content-between ${isDarkMode ? "bg-black" :""}`}>
                        <Skeleton  className={`w-4rem border-round h-2rem ${isDarkMode ? "bg-gray-900" :""}`} />
                        <Skeleton  className={`w-4rem border-round h-2rem ${isDarkMode ? "bg-gray-900" :""}`} />
                    </div>
                </div>
        );
    };







    return (
        <>
            <div className={` ${isDarkMode ? "bg-black" :""}`}>
                <div   className={`card  ${isDarkMode ? "bg-black" :""}`}>
                    <Skeleton width="100%" height="2rem" borderRadius={"0px"}  className={`mb-0.5 ${isDarkMode ? "bg-gray-900" :""}`} />
                    <Skeleton width="100%" height="400px"  className={`mb-1 ${isDarkMode ? "bg-gray-900" :""}`} />
                    <Skeleton width="100%" height="150px"  className={`  ${isDarkMode ? 'bg-gray-900   px-1' : ' '}`}/>
                    <Skeleton width="100%" height="150px"  className={`mt-3 ${isDarkMode ? "bg-gray-900" :""}`} />
                    <div  className={`flex justify-content-center mt-1  ${isDarkMode ? 'bg-black   px-1' : ''}`}>
                        <Skeleton width="4rem" height="2rem"  className={` mx-2 ${isDarkMode ? "bg-gray-900" :""}`}/>
                        <Skeleton width="4rem" height="2rem" className={` ${isDarkMode ? "bg-gray-900" :""}`} />
                        <Skeleton width="4rem" height="2rem"  className={`mx-2 ${isDarkMode ? "bg-gray-900" :""}`} />
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
                showIndicators={false}
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
                showIndicators={false}
            />
        </div>
        </>
    );
}
