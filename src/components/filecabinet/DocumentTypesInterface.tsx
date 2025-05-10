import React, { useState } from 'react';
import { Plus, Copy, Trash2, ArrowRight, Search, Filter } from 'lucide-react';

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

const DocumentTypesInterface: React.FC<{ onBack: () => void; vendorName: string }> = ({ onBack, vendorName }) => {
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
    },
    {
      id: '2',
      type: 'Service',
      actionId: 'ACT-002',
      orderId: 'ORD-5893',
      modId: 'MOD-33',
      state: 'NY',
      status: 'In Progress',
      receipt: false,
      goals: 'Maintenance'
    },
    {
      id: '3',
      type: 'Replace',
      actionId: 'ACT-003',
      orderId: 'ORD-5894',
      modId: 'MOD-12',
      state: 'TX',
      status: 'Pending',
      receipt: true,
      goals: 'Upgrade'
    },
    {
      id: '4',
      type: 'Installation',
      actionId: 'ACT-004',
      orderId: 'ORD-5895',
      modId: 'MOD-47',
      state: 'WA',
      status: 'Scheduled',
      receipt: false,
      goals: 'Expansion'
    },
    {
      id: '5',
      type: 'Consultation',
      actionId: 'ACT-005',
      orderId: 'ORD-5896',
      modId: 'MOD-08',
      state: 'FL',
      status: 'Completed',
      receipt: true,
      goals: 'Optimization'
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
        <h1 className="text-lg font-semibold">File Cabinet | {vendorName} | Document Types</h1>
      </div>

      {/* Actions Bar */}
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
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Trash2 size={16} />
              Delete
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <ArrowRight size={16} />
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

      {/* Table */}
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