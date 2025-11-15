import React from 'react';

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-gray-900 border border-gray-700 shadow-lg rounded-lg p-6 relative ${className}`}>
      <h3 className="text-xl font-semibold mb-4 text-sky-300">{title}</h3>
      {children}
    </div>
  );
};

export default ChartContainer;
