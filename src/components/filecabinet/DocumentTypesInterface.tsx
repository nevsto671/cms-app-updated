import React, { useState } from 'react';
import { ChevronLeft, Plus, Copy, Trash2, MoveRight, Search, Filter } from 'lucide-react';

interface Action {
  actionType: string;
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
}

const DocumentTypesInterface: React.FC<DocumentTypesInterfaceProps> = ({ onBack, vendorName }) => {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const actions: Action[] = [
    {
      actionType: 'Purchase',
      actionId: 'ACT-001',
      orderId: 'ORD-5892',
      modId: 'MOD-21',
      state: 'CA',
      status: 'Completed',
      receipt: true,
      goals: 'Cost reduction'
    },
    {
      actionType: 'Service',
      actionId: 'ACT-002',
      orderId: 'ORD-5893',
      modId: 'MOD-33',
      state: 'NY',
      status: 'In Progress',
      receipt: false,
      goals: 'Maintenance'
    },
    {
      actionType: 'Replace',
      actionId: 'ACT-003',
      orderId: 'ORD-5894',
      modId: 'MOD-12',
      state: 'TX',
      status: 'Pending',
      receipt: true,
      goals: 'Upgrade'
    },
    {
      actionType: 'Installation',
      actionId: 'ACT-004',
      orderId: 'ORD-5895',
      modId: 'MOD-47',
      state: 'WA',
      status: 'Scheduled',
      receipt: false,
      goals: 'Expansion'
    },
    {
      actionType: 'Consultation',
      actionId: 'ACT-005',
      orderId: 'ORD-5896',
      modId: 'MOD-08',
      state: 'FL',
      status: 'Completed',
      receipt: true,
      goals: 'Optimization'
    }
  ];

  const handleSelectAction = (actionId: string) => {
    setSelectedActions(prev =>
      prev.includes(actionId)
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const handleSelectAll = () => {
    setSelectedActions(
      selectedActions.length === actions.length
        ? []
        : actions.map(action => action.actionId)
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
        <h1 className="text-lg font-semibold">File Cabinet | {vendorName} | Document Types</h1>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Plus size={16} />
              New
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Copy size={16} />
              Replicate
            </button>
            <button 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              disabled={selectedActions.length === 0}
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button 
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              disabled={selectedActions.length === 0}
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
                  checked={selectedActions.length === actions.length}
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
                key={action.actionId}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedActions.includes(action.actionId) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectAction(action.actionId)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedActions.includes(action.actionId)}
                    onChange={() => handleSelectAction(action.actionId)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">{action.actionType}</td>
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