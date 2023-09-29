import React, { useState } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Skeleton } from 'primereact/skeleton';
import {Dropdown} from "primereact/dropdown";
import {useDarkMode} from "../components/DarkModeContext";

export default function DataviewSkeleton() {
    const [layout, setLayout] = useState('grid');
    const { isDarkMode } = useDarkMode();


    const products = [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },

    ];

    const listItem = () => {
        return (
            <div className="col-12">
                <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
                    <Skeleton className="w-9 sm:w-16rem xl:w-10rem shadow-2 h-6rem block xl:block mx-auto border-round" />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <Skeleton className="w-8rem border-round h-2rem" />
                            <Skeleton className="w-6rem border-round h-1rem" />
                            <div className="flex align-items-center gap-3">
                                <Skeleton className="w-6rem border-round h-1rem" />
                                <Skeleton className="w-3rem border-round h-1rem" />
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <Skeleton className="w-4rem border-round h-2rem" />
                            <Skeleton shape="circle" className="w-3rem h-3rem" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const gridItem = () => {
        return (
            <div className={`container col-12 sm:col-6 lg:col-4 xl:col-3  p-1  ${isDarkMode ? 'bg-black text-white   px-1' : 'bg-white '}`} >
                <div className={`p-1 border-2 border-teal-400  border-round ${isDarkMode ? 'bg-black text-white' : 'bg-white'}`}>
                    <div   className={`flex flex-column align-items-center gap-1 py-1 ${isDarkMode ? "bg-gray-900" :""}`}>
                        <Skeleton   className={`w-12 shadow-2 border-round h-12rem ${isDarkMode ? "bg-gray-900" :""}`}/>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <Skeleton  className={`w-10rem border-round h-2rem ${isDarkMode ? "bg-gray-900" :""}`} />
                        <Skeleton className={`w-6rem border-round h-1rem ${isDarkMode ? "bg-gray-900" :""}`} />
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <Skeleton   className={`w-5rem border-round h-3rem ${isDarkMode ? "bg-gray-900" :""}`}/>
                        <Skeleton shape="rectangle"   className={` w-5rem h-3rem ${isDarkMode ? "bg-gray-900" :""}`} />
                    </div>
                </div>
            </div>
        );
    };

    const itemTemplate = (product) => {
        if (!product) {
            return;
        }

        if (layout === 'list') return listItem(product);
        else if (layout === 'grid') return gridItem(product);
    };

    const header = () => {
        return (
            <div  className={`flex justify-between  items-center ${isDarkMode ? 'bg-black text-white p-3 -m-4' : ' '}`}>
                <div>
                    <Dropdown
                        optionLabel="label"
                        placeholder="Sort By Price"
                        className={`w-full sm:w-14rem ${isDarkMode ? 'bg-black text-white border-2  border-teal-400' : ' '}`}
                    />
                </div>
                <div>
                    <DataViewLayoutOptions
                        layout={layout}
                        onChange={(e) => setLayout(e.value)}
                    />
                </div>
            </div>
        );
    };

    return (
        <div    className={`card mx-2 mt-5 ${isDarkMode ? 'bg-black text-white' : 'bg-white'}`}>
            <DataView value={products} itemTemplate={itemTemplate} layout={layout} header={header()} />
        </div>
    );
}
