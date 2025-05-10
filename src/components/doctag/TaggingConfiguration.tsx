import React, { useState } from 'react';
import { Tag, Plus, Edit2, Trash2, Search, Filter, AlertCircle, Settings, RefreshCw } from 'lucide-react';

interface TagType {
  id: string;
  symbol: string;
  type: string;
  description: string;
  prefix: string;
  nextNumber: number;
  totalUsed: number;
  lastUsed: string;
}

const TaggingConfiguration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('types');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const mockTagTypes: TagType[] = [
    {
      id: '1',
      symbol: '⭐',
      type: 'S',
      description: 'Solicitation Documents',
      prefix: 'S',
      nextNumber: 15,
      totalUsed: 14,
      lastUsed: '2025-05-10'
    },
    {
      id: '2',
      symbol: '📦',
      type: 'P',
      description: 'Procurement Documents',
      prefix: 'P',
      nextNumber: 8,
      totalUsed: 7,
      lastUsed: '2025-05-09'
    },
    {
      id: '3',
      symbol: '📝',
      type: 'C',
      description: 'Contract Documents',
      prefix: 'C',
      nextNumber: 12,
      totalUsed: 11,
      lastUsed: '2025-05-08'
    }
  ];

  const handleSelectTag = (id: string) => {
    setSelectedTags(prev =>
      prev.includes(id) ? prev.filter(tagId => tagId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {[
            { id: 'types', label: 'Tag Types', icon: Tag },
            { id: 'numbering', label: 'Numbering Schemes', icon: Settings },
            { id: 'validation', label: 'Validation Rules', icon: AlertCircle },
            { id: 'batch', label: 'Batch Updates', icon: RefreshCw },
            { id: 'analytics', label: 'Analytics', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 text-sm font-medium border-b-2 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tag Type Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mockTagTypes.map(tag => (
          <div key={tag.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{tag.symbol}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                Type {tag.type}
              </span>
            </div>
            <h3 className="font-medium text-gray-900">{tag.description}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <div>Next Number: {tag.nextNumber}</div>
              <div>Total Used: {tag.totalUsed}</div>
              <div>Last Used: {tag.lastUsed}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Add Tag Type
          </button>
          <button
            disabled={selectedTags.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            disabled={selectedTags.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Tag List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 p-4">
                  <input
                    type="checkbox"
                    checked={selectedTags.length === mockTagTypes.length}
                    onChange={() => {
                      if (selectedTags.length === mockTagTypes.length) {
                        setSelectedTags([]);
                      } else {
                        setSelectedTags(mockTagTypes.map(t => t.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Symbol</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Type</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Description</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Next Number</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Total Used</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Last Used</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockTagTypes.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleSelectTag(tag.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4 text-2xl">{tag.symbol}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      Type {tag.type}
                    </span>
                  </td>
                  <td className="p-4">{tag.description}</td>
                  <td className="p-4">{tag.nextNumber}</td>
                  <td className="p-4">{tag.totalUsed}</td>
                  <td className="p-4">{tag.lastUsed}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Trash2 size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tag Type Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Tag Type</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <AlertCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="Enter tag symbol (e.g., ⭐)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="Enter tag type (e.g., S)"
                  maxLength={1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="Enter tag description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starting Number</label>
                <input
                  type="number"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="Enter starting number"
                  min={1}
                  max={20}
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Add Tag Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaggingConfiguration;