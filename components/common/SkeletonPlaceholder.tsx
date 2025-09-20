import React from 'react';

const SkeletonPlaceholder: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`relative overflow-hidden bg-gray-200 rounded-md ${className}`}>
            <div className="absolute inset-0 transform -translate-x-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_2s_infinite]" />
        </div>
    );
};

export default SkeletonPlaceholder;