import React from 'react';

interface QuickActionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'accent';
}

const QuickAction: React.FC<QuickActionProps> = ({
  icon,
  title,
  description,
  variant = 'primary'
}) => {
  const getColorClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-emerald-100 bg-emerald-50 hover:bg-emerald-100 text-emerald-700';
      case 'warning':
        return 'border-amber-100 bg-amber-50 hover:bg-amber-100 text-amber-700';
      case 'danger':
        return 'border-red-100 bg-red-50 hover:bg-red-100 text-red-700';
      case 'accent':
        return 'border-purple-100 bg-purple-50 hover:bg-purple-100 text-purple-700';
      default:
        return 'border-blue-100 bg-blue-50 hover:bg-blue-100 text-blue-700';
    }
  };

  return (
    <button className={`flex items-center p-2 rounded-lg border transition-colors ${getColorClasses()}`}>
      <div className="mr-3 shrink-0">{icon}</div>
      <div className="text-left">
        <h3 className="text-sm font-medium">{title}</h3>
        <p className="text-xs opacity-80">{description}</p>
      </div>
    </button>
  );
};

export default QuickAction;