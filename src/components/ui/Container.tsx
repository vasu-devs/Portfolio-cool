import React from 'react';

export const Container = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className={`max-w-[1400px] mx-auto px-6 md:px-12 w-full ${className}`}>
            {children}
        </div>
    );
};
