import React from 'react';
import SkeletonPlaceholder from './SkeletonPlaceholder';

const SkeletonForm: React.FC = () => {
    return (
        <div className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5"><SkeletonPlaceholder className="h-6 w-1/4" /><SkeletonPlaceholder className="h-11 w-full" /></div>
                <div className="space-y-1.5"><SkeletonPlaceholder className="h-6 w-1/4" /><SkeletonPlaceholder className="h-11 w-full" /></div>
            </div>
            <div className="space-y-1.5"><SkeletonPlaceholder className="h-6 w-1/4" /><SkeletonPlaceholder className="h-11 w-full" /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5"><SkeletonPlaceholder className="h-6 w-1/4" /><SkeletonPlaceholder className="h-11 w-full" /></div>
                <div className="space-y-1.5"><SkeletonPlaceholder className="h-6 w-1/4" /><SkeletonPlaceholder className="h-11 w-full" /></div>
            </div>
             <div className="space-y-1.5"><SkeletonPlaceholder className="h-6 w-1/4" /><SkeletonPlaceholder className="h-11 w-full" /></div>
             <div className="border-t pt-5 mt-5 space-y-5">
                <div className="space-y-1.5"><SkeletonPlaceholder className="h-6 w-1/4" /><SkeletonPlaceholder className="h-11 w-full" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5"><SkeletonPlaceholder className="h-6 w-1/4" /><SkeletonPlaceholder className="h-11 w-full" /></div>
                    <div className="space-y-1.5"><SkeletonPlaceholder className="h-6 w-1/4" /><SkeletonPlaceholder className="h-11 w-full" /></div>
                </div>
             </div>
        </div>
    );
};

export default SkeletonForm;