import React, { useState } from 'react';
import { Plus, Trash2, Edit2, MoveRight, Search, Folder } from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  folders: number;
  actions: number;
  nextDueDate: string;
  modified: string;
}

interface BranchSelectionInterfaceProps {
  onBranchSelect: (branchId: string, branchName: string) => void;
}

const BranchSelectionInterface: React.FC<BranchSelectionInterfaceProps> = ({ onBranchSelect }) => {
  const [branches, setBranches] = useState<Branch[]>([
    { id: '1', name: 'Folder 1', folders: 8, actions: 24, nextDueDate: '2025-06-15', modified: '2025-04-20' },
    { id: '2', name: 'Folder 2', folders: 5, actions: 17, nextDueDate: '2025-05-28', modified: '2025-04-15' },
    { id: '3', name: 'Folder 3', folders: 12, actions: 31, nextDueDate: '2025-07-03', modified: '2025-04-22' },
    { id: '4', name: 'Folder 4', folders: 3, actions: 9, nextDueDate: '2025-05-10', modified: '2025-04-05' }
  ]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [renameBranchName, setRenameBranchName] = useState('');
  const [moveDestination, setMoveDestination] = useState('');

  const handleSelectItem = (id: string, isDoubleClick: boolean = false) => {
    if (isDoubleClick) {
      const branch = branches.find(b => b.id === id);
      if (branch) {
        onBranchSelect(branch.id, branch.name);
      }
      return;
    }

    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === branches.length ? [] : branches.map(b => b.id)
    );
  };

  const handleNewBranch = () => {
    if (newBranchName.trim()) {
      const newBranch: Branch = {
        id: `folder-${Date.now()}`,
        name: newBranchName.trim(),
        folders: 0,
        actions: 0,
        nextDueDate: new Date().toISOString().split('T')[0],
        modified: new Date().toISOString().split('T')[0]
      };
      setBranches([...branches, newBranch]);
      setNewBranchName('');
      setShowNewModal(false);
    }
  };

  const handleRenameBranch = () => {
    if (renameBranchName.trim() && selectedItems.length === 1) {
      setBranches(branches.map(branch => 
        branch.id === selectedItems[0]
          ? { ...branch, name: renameBranchName.trim() }
          : branch
      ));
      setRenameBranchName('');
      setShowRenameModal(false);
      setSelectedItems([]);
    }
  };

  const handleDeleteBranches = () => {
    setBranches(branches.filter(branch => !selectedItems.includes(branch.id)));
    setSelectedItems([]);
  };

  const handleMoveBranches = () => {
    if (moveDestination && selectedItems.length > 0) {
      // Here you would implement the actual move logic
      // For now, we'll just close the modal and clear selection
      setShowMoveModal(false);
      setSelectedItems([]);
      setMoveDestination('');
    }
  };

  const openRenameModal = () => {
    if (selectedItems.length === 1) {
      const selectedBranch = branches.find(b => b.id === selectedItems[0]);
      if (selectedBranch) {
        setRenameBranchName(selectedBranch.name);
        setShowRenameModal(true);
      }
    }
  };

  const filteredBranches = branches.filter(branch =>
    branch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="bg-[#1c1f26] text-white px-4 py-3 rounded-t-lg">
        <h1 className="text-lg">File Cabinet</h1>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewModal(true)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1.5 text-sm"
          >
            <Plus size={16} />
            New
          </button>

          <button
            onClick={handleDeleteBranches}
            disabled={selectedItems.length === 0}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={16} />
            Delete
          </button>

          <button
            onClick={openRenameModal}
            disabled={selectedItems.length !== 1}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Edit2 size={16} />
            Rename
          </button>

          <button
            onClick={() => setShowMoveModal(true)}
            disabled={selectedItems.length === 0}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded hover:bg-gray-50 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MoveRight size={16} />
            Move
          </button>

          <div className="ml-auto relative">
            <input
              type="text"
              placeholder="Search folders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 p-4">
                <input
                  type="checkbox"
                  checked={selectedItems.length === branches.length && branches.length > 0}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Name</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Folders</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Next Due Date</th>
              <th className="text-left text-sm font-medium text-gray-600 p-4">Modified</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBranches.map((branch) => (
              <tr
                key={branch.id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedItems.includes(branch.id) ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSelectItem(branch.id)}
                onDoubleClick={() => handleSelectItem(branch.id, true)}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(branch.id)}
                    onChange={() => handleSelectItem(branch.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <Folder className="text-blue-500 mr-2" size={20} />
                    <span className="text-blue-600">{branch.name}</span>
                  </div>
                </td>
                <td className="p-4">{branch.folders}</td>
                <td className="p-4">{branch.actions}</td>
                <td className="p-4">{branch.nextDueDate}</td>
                <td className="p-4">{branch.modified}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* New Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Create New Folder</h2>
            <input
              type="text"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="Enter folder name"
              className="w-full p-2 border border-gray-200 rounded-lg mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleNewBranch}
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
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Rename Folder</h2>
            <input
              type="text"
              value={renameBranchName}
              onChange={(e) => setRenameBranchName(e.target.value)}
              placeholder="Enter new name"
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
                onClick={handleRenameBranch}
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
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-lg font-semibold mb-4">Move Folder</h2>
            <select
              value={moveDestination}
              onChange={(e) => setMoveDestination(e.target.value)}
              className="w-full p-2 border border-gray-200 rounded-lg mb-4"
            >
              <option value="">Select destination...</option>
              <option value="archive">Archive</option>
              <option value="active">Active Folders</option>
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
                onClick={handleMoveBranches}
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

export default BranchSelectionInterface;