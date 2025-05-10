import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface DocumentTypeFoldersProps {
  vendorId: string;
  onBack: () => void;
}

const DocumentTypeFolders: React.FC<DocumentTypeFoldersProps> = ({ vendorId, onBack }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <div className="bg-[#1c1f26] text-white px-4 py-3 flex items-center rounded-t-lg">
        <button
          onClick={onBack}
          className="mr-3 hover:bg-[#2a2f3a] p-1 rounded transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">File Cabinet | Document Types</h1>
      </div>
      
      <div className="p-4">
        <p>Document types for vendor {vendorId}</p>
      </div>
    </div>
  );
};

export default DocumentTypeFolders;