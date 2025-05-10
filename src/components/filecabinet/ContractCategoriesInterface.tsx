import React, { useState } from 'react';
import { ChevronLeft, Folder, Plus, Trash2, Edit2, MoveRight, Search } from 'lucide-react';

interface Vendor {
  id: string;
  name: string;
  documents: number;
  actions: number;
  lastModified: string;
  status: 'active' | 'pending' | 'expired';
}

interface ContractCategoriesInterfaceProps {
  onBack: () => void;
  onVendorSelect: (vendorId: string) => void;
  branchName: string;
}

const ContractCategoriesInterface: React.FC<ContractCategoriesInterfaceProps> = ({ onBack, onVendorSelect, branchName }) => {
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: '1', name: 'Vendor A', documents: 12, actions: 5, lastModified: '2025-04-15', status: 'active' },
    { id: '2', name: 'Vendor B', documents: 8, actions: 3, lastModified: '2025-04-10', status: 'active' },
    { id: '3', name: 'Vendor C', documents: 15, actions: 7, lastModified: '2025-04-22', status: 'pending' },
    { id: '4', name: 'Vendor D', documents: 6, actions: 2, lastModified: '2025-04-05', status: 'expired' },
    { id: '5', name: 'Vendor E', documents: 10, actions: 4, lastModified: '2025-04-18', status: 'active' }
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renameFolderName, setRenameFolderName] = useState('');
  const [moveDestination, setMoveDestination] = useState('');

  const handleSelectItem = (id: string, isDoubleClick: boolean = false) => {
    if (isDoubleClick) {
      onVendorSelect(id);
      return;
    }

    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleNewFolder = () => {
    if (newFolderName.trim()) {
      const newVendor: Vendor = {
        id: `${Date.now()}`,
        name: newFolderName.trim(),
        documents: 0,
        actions: 0,
        lastModified: new Date().toISOString().split('T')[0],
        status: 'active'
      };
      setVendors([...vendors, newVendor]);
      setNewFolderName('');
      setShowNewFolderModal(false);
    }
  };

  const handleRename = () => {
    if (renameFolderName.trim() && selectedItems.length === 1) {
      setVendors(vendors.map(vendor => 
        vendor.id === selectedItems[0]
          ? { ...vendor, name: renameFolderName.trim() }
          : vendor
      ));
      setRenameFolderName('');
      setShowRenameModal(false);
      setSelectedItems([]);
    }
  };

  const handleDelete = () => {
    if (selectedItems.length > 0) {
      setVendors(vendors.filter(vendor => !selectedItems.includes(vendor.id)));
      setSelectedItems([]);
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
      const selectedVendor = vendors.find(v => v.id === selectedItems[0]);
      if (selectedVendor) {
        setRenameFolderName(selectedVendor.name);
        setShowRenameModal(true);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      <div className="bg-[#1c1f26] text-white px-4 py-3 flex items-center rounded-t-lg">
        <button
          onClick={onBack}
          className="mr-3 hover:bg-[#2a2f3a] p-1 rounded transition-colors"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">File Cabinet | {branchName}</h1>
      </div>

      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm"
          >
            <Plus size={16} />
            New Folder
          </button>

          <button
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm"
          >
            <Plus size={16} />
            New Action
          </button>

          <button
            onClick={handleDelete}
            disabled={selectedItems.length === 0}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            Delete
          </button>

          <button
            onClick={openRenameModal}
            disabled={selectedItems.length !== 1}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit2 size={16} />
            Rename
          </button>

          <button
            onClick={() => setShowMoveModal(true)}
            disabled={selectedItems.length === 0}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MoveRight size={16} />
            Move
          </button>

          <div className="ml-auto relative">
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

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === vendors.length && vendors.length > 0}
                  onChange={() => setSelectedItems(selectedItems.length === vendors.length ? [] : vendors.map(v => v.id))}
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
            {vendors.map((vendor) => (
              <tr
                key={vendor.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedItems.includes(vendor.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectItem(vendor.id)}
                onDoubleClick={() => handleSelectItem(vendor.id, true)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(vendor.id)}
                    onChange={() => handleSelectItem(vendor.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <Folder className="text-blue-500 mr-2" size={20} />
                    <span className="text-blue-600">{vendor.name}</span>
                  </div>
                </td>
                <td className="p-4">{vendor.documents}</td>
                <td className="p-4">{vendor.actions}</td>
                <td className="p-4">{vendor.lastModified}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    vendor.status === 'active' ? 'bg-green-100 text-green-800' :
                    vendor.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {vendor.status}
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
            <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full p-2 border border-gray-200 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleNewFolder}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
            <h2 className="text-lg font-semibold mb-4">Rename Folder</h2>
            <input
              type="text"
              value={renameFolderName}
              onChange={(e) => setRenameFolderName(e.target.value)}
              placeholder="Enter new folder name"
              className="w-full p-2 border border-gray-200 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRenameModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
            <h2 className="text-lg font-semibold mb-4">Move Folder</h2>
            <select
              value={moveDestination}
              onChange={(e) => setMoveDestination(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg mb-4"
            >
              <option value="">Select destination...</option>
              <option value="archive">Archive</option>
              <option value="active">Active Contracts</option>
              <option value="pending">Pending Review</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowMoveModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMove}
                disabled={!moveDestination}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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