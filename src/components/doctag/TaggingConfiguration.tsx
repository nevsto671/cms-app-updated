import React, { useState } from 'react';
import { Plus, Copy, Trash2, ArrowRight, Search, Filter } from 'lucide-react';
import { Card } from '../ui/card';

interface DocumentType {
  id: string;
  type: string;
  name: string;
  prefix: string;
  description: string;
  status: 'active' | 'inactive';
  lastModified: string;
}

const TaggingConfiguration: React.FC = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const documentTypes: DocumentType[] = [
    {
      id: 'S',
      type: 'Solicitation',
      name: 'Solicitation Documents',
      prefix: 'S-',
      description: 'For solicitation and procurement request documents',
      status: 'active',
      lastModified: '2025-05-10'
    },
    {
      id: 'P',
      type: 'Procurement',
      name: 'Procurement Documents',
      prefix: 'P-',
      description: 'For procurement and purchasing documents',
      status: 'active',
      lastModified: '2025-05-09'
    },
    {
      id: 'C',
      type: 'Contract',
      name: 'Contract Documents',
      prefix: 'C-',
      description: 'For contract and agreement documents',
      status: 'active',
      lastModified: '2025-05-08'
    }
  ];

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === documentTypes.length ? [] : documentTypes.map(type => type.id)
    );
  };

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Plus size={16} />
            New Type
          </button>
          <button
            disabled={selectedItems.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Copy size={16} />
            Duplicate
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
            <ArrowRight size={16} />
            Move
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search document types..."
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

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full border border-gray-200 rounded-lg p-2">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select className="w-full border border-gray-200 rounded-lg p-2">
              <option>All Categories</option>
              <option>Solicitation</option>
              <option>Procurement</option>
              <option>Contract</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Modified</label>
            <select className="w-full border border-gray-200 rounded-lg p-2">
              <option>Any time</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
        </div>
      )}

      {/* Document Types Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 p-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === documentTypes.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Type</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Name</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Prefix</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Description</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Last Modified</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documentTypes.map((type) => (
                <tr
                  key={type.id}
                  className={`hover:bg-gray-50 cursor-pointer ${
                    selectedItems.includes(type.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleSelectItem(type.id)}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(type.id)}
                      onChange={() => handleSelectItem(type.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">{type.type}</td>
                  <td className="p-4">{type.name}</td>
                  <td className="p-4 font-mono">{type.prefix}</td>
                  <td className="p-4">{type.description}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      type.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {type.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{type.lastModified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaggingConfiguration;