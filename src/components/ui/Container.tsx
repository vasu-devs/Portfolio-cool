import React from 'react';

export const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`max-w-[1600px] mx-auto px-4 md:px-8 lg:px-12 w-full min-w-0 ${className}`}>
            {children}
        </div>
    );
};
