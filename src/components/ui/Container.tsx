import React from 'react';

export const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`max-w-[1100px] mx-auto px-5 md:px-8 w-full min-w-0 ${className}`}>
            {children}
        </div>
    );
};
