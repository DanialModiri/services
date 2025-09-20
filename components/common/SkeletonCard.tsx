import React from 'react';
import SkeletonPlaceholder from './SkeletonPlaceholder';

const SkeletonCard: React.FC = () => {
    return (
        <div className="bg-white/80 backdrop-blur-xl border border-gray-200/80 shadow-lg rounded-3xl p-5">
            <div className="flex items-start justify-between space-x-4 space-x-reverse">
                <div className="flex items-start space-x-4 space-x-reverse flex-grow min-w-0">
                    <SkeletonPlaceholder className="flex-shrink-0 w-16 h-16 rounded-2xl" />
                    <div className="flex-grow min-w-0 pt-1 space-y-2">
                        <SkeletonPlaceholder className="h-7 w-3/4" />
                        <SkeletonPlaceholder className="h-5 w-1/2" />
                    </div>
                </div>
            </div>
            <div className="mt-4 border-t border-gray-200/80 pt-4 space-y-3">
                <SkeletonPlaceholder className="h-5 w-full" />
                <SkeletonPlaceholder className="h-5 w-5/6" />
                <SkeletonPlaceholder className="h-5 w-full" />
            </div>
        </div>
    );
};

export default SkeletonCard;