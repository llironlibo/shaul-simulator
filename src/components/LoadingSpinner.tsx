
import React from 'react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-brand-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-brand-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-5 text-base font-medium text-slate-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
