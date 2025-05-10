import React, { useState } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Upload, X, Settings } from 'lucide-react';
import TagImport from './TagImport';

interface TagType {
  id: string;
  type: string;
  number: number;
  description: string;
  nextNumber: number;
  totalUsed: number;
  lastUsed: string;
}

const TaggingConfiguration: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [tags, setTags] = useState<TagType[]>([
    {
      id: '1',
      type: 'S',
      number: 1,
      description: 'Solicitation Documents',
      nextNumber: 15,
      totalUsed: 14,
      lastUsed: '2025-05-10'
    },
    {
      id: '2',
      type: 'P',
      number: 1,
      description: 'Procurement Documents',
      nextNumber: 8,
      totalUsed: 7,
      lastUsed: '2025-05-09'
    },
    {
      id: '3',
      type: 'C',
      number: 1,
      description: 'Contract Documents',
      nextNumber: 12,
      totalUsed: 11,
      lastUsed: '2025-05-08'
    }
  ]);
  const [newTag, setNewTag] = useState({
    type: '',
    description: '',
    startingNumber: ''
  });

  const handleAddTag = () => {
    if (newTag.type && newTag.description) {
      const newTagItem: TagType = {
        id: `${Date.now()}`,
        type: newTag.type.toUpperCase(),
        number: parseInt(newTag.startingNumber) || 1,
        description: newTag.description,
        nextNumber: parseInt(newTag.startingNumber) || 1,
        totalUsed: 0,
        lastUsed: new Date().toISOString().split('T')[0]
      };
      setTags([...tags, newTagItem]);
      setShowAddModal(false);
      setNewTag({ type: '', description: '', startingNumber: '' });
    }
  };

  const handleEditTag = (tag: TagType) => {
    setSelectedTag(tag);
    setShowEditModal(true);
  };

  const handleDeleteTag = (tag: TagType) => {
    setSelectedTag(tag);
    setShowDeleteModal(true);
  };

  const handleConfirmEdit = () => {
    if (selectedTag) {
      setTags(tags.map(tag => 
        tag.id === selectedTag.id ? selectedTag : tag
      ));
    }
    setShowEditModal(false);
    setSelectedTag(null);
  };

  const handleConfirmDelete = () => {
    if (selectedTag) {
      setTags(tags.filter(tag => tag.id !== selectedTag.id));
      setSelectedTags(selectedTags.filter(id => id !== selectedTag.id));
    }
    setShowDeleteModal(false);
    setSelectedTag(null);
  };

  const formatTagNumber = (tag: TagType) => `${tag.type}${tag.number}`;

  const filteredTags = tags.filter(tag => {
    const matchesSearch = searchTerm === '' || 
      formatTagNumber(tag).toLowerCase().includes(searchTerm.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || tag.type === filterType;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tag Type Configuration</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              <Upload size={16} />
              Import Data
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} />
              Add Tag Type
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2">
              <Trash2 size={16} />
              Manage Database
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by tag number or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {showFilters && (
          <div className="mt-4 grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tag No.</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2"
              >
                <option value="all">All Tag Numbers</option>
                <option value="S">S Series</option>
                <option value="P">P Series</option>
                <option value="C">C Series</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Tag Types Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 p-4">
                  <input
                    type="checkbox"
                    checked={selectedTags.length === filteredTags.length && filteredTags.length > 0}
                    onChange={() => {
                      setSelectedTags(
                        selectedTags.length === filteredTags.length ? [] : filteredTags.map(t => t.id)
                      );
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Tag No.</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Description</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Next Number</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Total Used</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Last Used</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => {
                        setSelectedTags(prev =>
                          prev.includes(tag.id)
                            ? prev.filter(id => id !== tag.id)
                            : [...prev, tag.id]
                        );
                      }}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {formatTagNumber(tag)}
                    </span>
                  </td>
                  <td className="p-4">{tag.description}</td>
                  <td className="p-4">{tag.nextNumber}</td>
                  <td className="p-4">{tag.totalUsed}</td>
                  <td className="p-4">{tag.lastUsed}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditTag(tag)}
                        className="p-1 hover:bg-gray-100 rounded text-blue-600 hover:text-blue-800"
                        title="Edit Tag"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-gray-800"
                        title="Configure Settings"
                      >
                        <Settings size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteTag(tag)}
                        className="p-1 hover:bg-gray-100 rounded text-red-600 hover:text-red-800"
                        title="Delete Tag"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredTags.length} tag types
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                1
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Tag Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Tag Type</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag No.</label>
                <input
                  type="text"
                  value={newTag.type}
                  onChange={(e) => setNewTag({ ...newTag, type: e.target.value })}
                  placeholder="Enter tag number (e.g., S)"
                  maxLength={1}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newTag.description}
                  onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
                  placeholder="Enter tag description"
                  className="w-full p-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starting Number</label>
                <input
                  type="number"
                  value={newTag.startingNumber}
                  onChange={(e) => setNewTag({ ...newTag, startingNumber: e.target.value })}
                  placeholder="Enter starting number"
                  min={1}
                  max={20}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Tag Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Tag Type</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  defaultValue={selectedTag.description}
                  className="w-full p-2 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedTag && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Delete Tag Type</h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the tag type "{formatTagNumber(selectedTag)}"? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Import Tag Data</h2>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <TagImport
              onComplete={() => {
                setShowImportModal(false);
                // Refresh the tag list here
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaggingConfiguration;