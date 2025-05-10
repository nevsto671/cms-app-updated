import React, { useState, useEffect } from 'react';
import { ChevronLeft, Folder, Plus, Trash2, Edit2, MoveRight, Search } from 'lucide-react';
import { useFileCabinet } from '../../hooks/useFileCabinet';

interface ContractCategoriesInterfaceProps {
  onBack: () => void;
  onVendorSelect: (vendorId: string, vendorName: string) => void;
  branchName: string;
}

const ContractCategoriesInterface: React.FC<ContractCategoriesInterfaceProps> = ({ 
  onBack, 
  onVendorSelect, 
  branchName 
}) => {
  const { 
    folders,
    loading,
    error,
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder
  } = useFileCabinet();

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameFolderName, setRenameFolderName] = useState('');
  const [moveDestination, setMoveDestination] = useState('');

  useEffect(() => {
    fetchFolders(null); // Fetch root folders
  }, []);

  const handleSelectItem = (id: string, name: string, isDoubleClick: boolean = false) => {
    if (isDoubleClick) {
      onVendorSelect(id, name);
      return;
    }

    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleNewFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderModal(false);
    } catch (err) {
      console.error('Failed to create folder:', err);
    }
  };

  const handleRename = async () => {
    if (!renameFolderName.trim() || selectedItems.length !== 1) return;

    try {
      await updateFolder(selectedItems[0], { name: renameFolderName.trim() });
      setRenameFolderName('');
      setShowRenameModal(false);
      setSelectedItems([]);
    } catch (err) {
      console.error('Failed to rename folder:', err);
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) return;

    try {
      await Promise.all(selectedItems.map(id => deleteFolder(id)));
      setSelectedItems([]);
    } catch (err) {
      console.error('Failed to delete folders:', err);
    }
  };

  const handleMove = () => {
    if (selectedItems.length > 0 && moveDestination) {
      // Implement move logic here
      setShowMoveModal(false);
      setSelectedItems([]);
      setMoveDestination('');
    }
  };

  const openRenameModal = () => {
    if (selectedItems.length === 1) {
      const selectedFolder = folders.find(f => f.id === selectedItems[0]);
      if (selectedFolder) {
        setRenameFolderName(selectedFolder.name);
        setShowRenameModal(true);
      }
    }
  };

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-lg font-semibold">File Cabinet | {branchName}</h1>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewFolderModal(true)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Plus size={16} />
              New Folder
            </button>
            <button
              onClick={handleDelete}
              disabled={selectedItems.length === 0}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <button
              onClick={openRenameModal}
              disabled={selectedItems.length !== 1}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Edit2 size={16} />
              Rename
            </button>
            <button
              onClick={() => setShowMoveModal(true)}
              disabled={selectedItems.length === 0}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MoveRight size={16} />
              Move
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
                  checked={selectedItems.length === folders.length && folders.length > 0}
                  onChange={() => setSelectedItems(selectedItems.length === folders.length ? [] : folders.map(f => f.id))}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Name</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Documents</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Last Modified</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredFolders.map((folder) => (
              <tr
                key={folder.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedItems.includes(folder.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectItem(folder.id, folder.name)}
                onDoubleClick={() => handleSelectItem(folder.id, folder.name, true)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(folder.id)}
                    onChange={() => handleSelectItem(folder.id, folder.name)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <Folder className="text-blue-500 mr-2" size={20} />
                    <span className="text-blue-600">{folder.name}</span>
                  </div>
                </td>
                <td className="p-4">{folder.documents}</td>
                <td className="p-4">{folder.actions}</td>
                <td className="p-4">{folder.lastModified}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    folder.status === 'active' ? 'bg-green-100 text-green-800' :
                    folder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {folder.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Create New Folder</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Folder Name</label>
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter folder name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleNewFolder}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={!newFolderName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Rename Folder</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">New Name</label>
              <input
                type="text"
                value={renameFolderName}
                onChange={(e) => setRenameFolderName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter new name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={!renameFolderName.trim()}
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Move Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Move Folder</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select
                value={moveDestination}
                onChange={(e) => setMoveDestination(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select destination...</option>
                <option value="archive">Archive</option>
                <option value="active">Active Folders</option>
                <option value="pending">Pending Review</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowMoveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMove}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={!moveDestination}
              >
                Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractCategoriesInterface;