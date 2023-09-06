import React from 'react';
import { Skeleton } from 'primereact/skeleton';

export default function ProfileSkeleton() {
    return (
        <div className="card">
            <div className="border-round border-1 surface-border p-4 surface-card">
                <div className="flex mb-3">
                    <div
                        style={{
                            width: '4rem',
                            height: '4rem',
                            marginRight: '1rem',
                            borderRadius: '50%',
                            overflow: 'hidden',
                        }}
                    >
                        <Skeleton shape="circle" size="100%" />
                    </div>
                    <div>
                        <Skeleton width="10rem" height=".75rem" className="mb-2" />
                        <Skeleton width="5rem" height=".75rem" className="mb-2" />
                        <Skeleton height=".5rem" width="8rem" />
                    </div>
                </div>
                <Skeleton width="100%" height="150px" className="mb-3" />
                <div className="flex justify-content-between">
                    <Skeleton width="4rem" height="2rem" />
                    <Skeleton width="4rem" height="2rem" />
                </div>
            </div>
        </div>
    );
}
