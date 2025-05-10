import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, Copy, Trash2, MoveRight, Search, Filter, ChevronRight } from 'lucide-react';
import { useFileCabinet, DocumentType } from '../../hooks/useFileCabinet';

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
  const { 
    documentTypes,
    loading,
    error,
    fetchDocumentTypes,
    createDocumentType,
    updateDocumentType,
    deleteDocumentType
  } = useFileCabinet();

  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeDescription, setNewTypeDescription] = useState('');

  useEffect(() => {
    // Only fetch if we have a valid folder ID
    if (folderId) {
      fetchDocumentTypes(folderId);
    }
  }, [folderId]);

  const handleSelectType = (id: string) => {
    setSelectedTypes(prev =>
      prev.includes(id)
        ? prev.filter(typeId => typeId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedTypes(
      selectedTypes.length === documentTypes.length
        ? []
        : documentTypes.map(type => type.id)
    );
  };

  const handleCreateType = async () => {
    if (!newTypeName.trim() || !folderId) return;

    try {
      await createDocumentType(folderId, newTypeName.trim(), newTypeDescription.trim() || undefined);
      setNewTypeName('');
      setNewTypeDescription('');
      setShowNewModal(false);
    } catch (err) {
      console.error('Failed to create document type:', err);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedTypes.map(id => deleteDocumentType(id)));
      setSelectedTypes([]);
    } catch (err) {
      console.error('Failed to delete document types:', err);
    }
  };

  const filteredTypes = documentTypes.filter(type =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    type.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!folderId) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
        No folder selected. Please select a folder to view document types.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Error: {error}
      </div>
    );
  }

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
            <button 
              onClick={() => setShowNewModal(true)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Plus size={16} />
              New Type
            </button>
            <button 
              onClick={handleDeleteSelected}
              disabled={selectedTypes.length === 0}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              Delete
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-8 p-4">
                <input
                  type="checkbox"
                  checked={selectedTypes.length === documentTypes.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Name</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Description</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Created</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredTypes.map((type) => (
              <tr
                key={type.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedTypes.includes(type.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectType(type.id)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type.id)}
                    onChange={() => handleSelectType(type.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">{type.name}</td>
                <td className="p-4">{type.description || '-'}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    type.status === 'active' ? 'bg-green-100 text-green-800' :
                    type.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {type.status}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(type.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(type.updated_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Document Type Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Document Type</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter type name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTypeDescription}
                  onChange={(e) => setNewTypeDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateType}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={!newTypeName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentTypesInterface;