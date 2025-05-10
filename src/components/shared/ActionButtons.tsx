import React from 'react';
import { Download, Upload, RefreshCw, Plus } from 'lucide-react';

interface ActionButtonsProps {
  onImport: () => void;
  onExport: () => void;
  onSync: () => void;
  onAdd: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onImport, onExport, onSync, onAdd }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={onImport}
        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
      >
        <Upload size={16} />
        Import
      </button>
      
      <button
        onClick={onExport}
        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
      >
        <Download size={16} />
        Export
      </button>
      
      <button
        onClick={onSync}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center gap-2"
      >
        <RefreshCw size={16} />
        Sync from API
      </button>
      
      <button
        onClick={onAdd}
        className="px-4 py-2 text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 flex items-center gap-2"
      >
        <Plus size={16} />
        Add Code
      </button>
    </div>
  );
};

export default ActionButtons;