import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: React.ReactNode;
  iconBg?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent';
  trendPositive?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  trend,
  icon,
  iconBg = 'primary',
  trendPositive
}) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className={`card-icon ${iconBg} mb-2`}>
        {icon}
      </div>
      
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-xl font-bold text-gray-900 mb-1">{value}</div>
      
      {trend && (
        <p className={`text-xs ${trendPositive ? 'positive-trend' : 'negative-trend'}`}>
          {trendPositive && '+'}{trend}
        </p>
      )}
    </div>
  );
};

export default MetricCard;