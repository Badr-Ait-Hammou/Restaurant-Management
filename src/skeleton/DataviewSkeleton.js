import React, { useState } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Skeleton } from 'primereact/skeleton';
import {Dropdown} from "primereact/dropdown";

export default function BasicDemo() {
    const [layout, setLayout] = useState('grid');

    const products = [
        { id: 1 },
        { id: 2 },

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

    const itemTemplate = (product) => {
        if (!product) {
            return;
        }

        if (layout === 'list') return listItem(product);
        else if (layout === 'grid') return gridItem(product);
    };

    const header = () => {
        return (
            <div className="flex justify-between items-center">
                <div>
                    <Dropdown
                        optionLabel="label"
                        placeholder="Sort By Price"
                        className="w-full sm:w-14rem"
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
        <div className="card mx-2 mt-5">
            <DataView value={products} itemTemplate={itemTemplate} layout={layout} header={header()} />
        </div>
    );
}
