import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Copy, Trash2, MoveRight, Search, Filter, ChevronRight } from 'lucide-react';
import { useFileCabinet } from '../../hooks/useFileCabinet';

interface ActionType {
  id: string;
  type: string;
  actionId: string;
  orderId: string;
  modId: string;
  state: string;
  status: string;
  receipt: boolean;
  goals: string;
}

interface DocumentTypesInterfaceProps {
  onBack: () => void;
  vendorName: string;
  folderId: string;
}

const DocumentTypesInterface: React.FC<DocumentTypesInterfaceProps> = ({ 
  onBack, 
  vendorName,
  folderId 
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const actions: ActionType[] = [
    {
      id: '1',
      type: 'Purchase',
      actionId: 'ACT-001',
      orderId: 'ORD-5892',
      modId: 'MOD-21',
      state: 'CA',
      status: 'Completed',
      receipt: true,
      goals: 'Cost reduction'
    }
  ];

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === actions.length ? [] : actions.map(action => action.id)
    );
  };

  return (
    <div className="h-full bg-white rounded-lg shadow-sm">
      <div className="bg-[#1c1f26] text-white px-4 py-3 flex items-center rounded-t-lg">
        <button
          onClick={onBack}
          className="mr-3 hover:bg-[#2a2f3a] p-1 rounded transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center text-lg font-semibold">
          <button 
            onClick={onBack} 
            className="hover:text-blue-300 transition-colors"
          >
            File Cabinet
          </button>
          <ChevronRight size={16} className="mx-2" />
          <button 
            onClick={onBack}
            className="hover:text-blue-300 transition-colors"
          >
            {vendorName}
          </button>
          <ChevronRight size={16} className="mx-2" />
          <span>Document Types</span>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Plus size={16} />
              New
            </button>
            <button
              disabled={selectedItems.length === 0}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              <Copy size={16} />
              Replicate
            </button>
            <button
              disabled={selectedItems.length === 0}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              disabled={selectedItems.length === 0}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
            >
              <MoveRight size={16} />
              Move
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search actions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 border border-gray-200 rounded-lg hover:bg-gray-50 ${
                showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
              }`}
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 p-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === actions.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Action Type</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Action ID</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Order #</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Mod #</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">State</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Receipt</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Goals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {actions.map((action) => (
              <tr
                key={action.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedItems.includes(action.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectItem(action.id)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(action.id)}
                    onChange={() => handleSelectItem(action.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">{action.type}</td>
                <td className="p-4 font-mono">{action.actionId}</td>
                <td className="p-4 font-mono">{action.orderId}</td>
                <td className="p-4 font-mono">{action.modId}</td>
                <td className="p-4">{action.state}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    action.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    action.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    action.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {action.status}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    action.receipt ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {action.receipt ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-4">{action.goals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTypesInterface;