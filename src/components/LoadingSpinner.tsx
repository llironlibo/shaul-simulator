
import React from 'react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "טוען..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      <p className="mt-4 text-lg font-semibold text-slate-700">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
