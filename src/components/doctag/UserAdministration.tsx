import React, { useState } from 'react';
import { Users, Shield, UserPlus, Search, Edit2, Trash2, CheckCircle, XCircle, Settings, Activity } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  groups: string[];
}

const UserAdministration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('directory');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      role: 'Administrator',
      status: 'active',
      lastLogin: '2025-05-10 14:30',
      groups: ['IT', 'Management']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      role: 'Document Manager',
      status: 'active',
      lastLogin: '2025-05-09 16:45',
      groups: ['Operations']
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'm.brown@example.com',
      role: 'Viewer',
      status: 'inactive',
      lastLogin: '2025-05-01 09:15',
      groups: ['Finance']
    }
  ];

  const handleSelectUser = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {[
            { id: 'directory', label: 'User Directory', icon: Users },
            { id: 'roles', label: 'Roles & Permissions', icon: Shield },
            { id: 'groups', label: 'Groups', icon: Users },
            { id: 'access', label: 'Access Control', icon: Settings },
            { id: 'activity', label: 'Activity Logs', icon: Activity }
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

      {/* Actions Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <UserPlus size={16} />
            Add User
          </button>
          <button
            disabled={selectedUsers.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            disabled={selectedUsers.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 p-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === mockUsers.length}
                    onChange={() => {
                      if (selectedUsers.length === mockUsers.length) {
                        setSelectedUsers([]);
                      } else {
                        setSelectedUsers(mockUsers.map(u => u.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Name</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Email</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Role</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Groups</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Last Login</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      {user.groups.map((group, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                        >
                          {group}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    {user.status === 'active' ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={16} />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle size={16} />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">{user.lastLogin}</td>
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

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="Enter user's name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="Enter user's email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full border border-gray-200 rounded-lg p-2">
                  <option>Administrator</option>
                  <option>Document Manager</option>
                  <option>Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Groups</label>
                <select multiple className="w-full border border-gray-200 rounded-lg p-2 h-32">
                  <option>IT</option>
                  <option>Management</option>
                  <option>Operations</option>
                  <option>Finance</option>
                  <option>HR</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Add User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdministration;