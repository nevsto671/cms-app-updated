import React from 'react';

interface StatBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatBox: React.FC<StatBoxProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center p-2 bg-gray-50 rounded-lg">
      <div className="mr-3">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{label}</h3>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

export default StatBox;