import React, { useState } from 'react';
import { Search, Edit2, Eye, Settings, Bell, X } from 'lucide-react';
import ActionButtons from '../components/shared/ActionButtons';
import { importCodes, exportCodes, syncFromAPI } from '../lib/api';

interface SINCode {
  code: string;
  title: string;
  schedule: string;
  category: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

const mockData: SINCode[] = [
  {
    code: '54151S',
    title: 'Information Technology Professional Services',
    schedule: 'MAS',
    category: 'Information Technology',
    status: 'Active'
  },
  {
    code: '541519PIV',
    title: 'Homeland Security Presidential Directive 12 Product and Service Components',
    schedule: 'MAS',
    category: 'Information Technology',
    status: 'Active'
  },
  {
    code: '541519ICAM',
    title: 'Identity, Credentialing and Access Management (ICAM)',
    schedule: 'MAS',
    category: 'Information Technology',
    status: 'Active'
  },
  {
    code: '54151HEAL',
    title: 'Health Information Technology Services',
    schedule: 'MAS',
    category: 'Healthcare',
    status: 'Active'
  },
  {
    code: '54151ECOM',
    title: 'Electronic Commerce and Subscription Services',
    schedule: 'MAS',
    category: 'Information Technology',
    status: 'Inactive'
  }
];

const SINCodes: React.FC = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('All Schedules');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    const result = await importCodes('SIC', { source: 'file', format: 'json', overwrite: false });
    alert(result.message);
    setLoading(false);
  };

  const handleExport = async () => {
    setLoading(true);
    const result = await exportCodes('SIC', { format: 'json', includeMetadata: true });
    setLoading(false);
  };

  const handleSync = async () => {
    setLoading(true);
    const result = await syncFromAPI('SIC');
    alert(result.message);
    setLoading(false);
  };

  const handleAdd = () => {
    // Add new code logic
  };

  return (
    <div className="p-4 max-w-[1400px] mx-auto space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SIN Codes Management</h1>
          <p className="text-sm text-gray-600">Special Item Numbers - Last Updated: 2023</p>
        </div>
        <ActionButtons
          onImport={handleImport}
          onExport={handleExport}
          onSync={handleSync}
          onAdd={handleAdd}
        />
      </div>

      {/* Notification Banner */}
      {showNotification && (
        <div className="bg-gray-100 text-gray-800 px-3 py-2 flex items-center justify-between rounded-lg border border-gray-200">
          <div className="flex items-center space-x-2">
            <Bell size={16} className="text-gray-600" />
            <span className="text-sm">System maintenance scheduled for May 10, 2025 at 2:00 AM UTC. <a href="#" className="text-blue-600 hover:text-blue-800 underline">Learn more</a></span>
          </div>
          <button onClick={() => setShowNotification(false)} className="text-gray-600 hover:text-gray-800">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Search SIN Codes</h2>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search by code, title, or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          <button className="absolute right-2 top-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2"
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
            >
              <option>All Schedules</option>
              <option>Multiple Award Schedule (MAS)</option>
              <option>Professional Services Schedule (PSS)</option>
              <option>IT Schedule 70</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>Information Technology</option>
              <option>Professional Services</option>
              <option>Healthcare</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* SIN Code Structure */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">SIN Code Structure</h2>
        <p className="text-gray-600">Special Item Numbers (SINs) are used to identify specific products, services, and solutions offered through GSA contracts.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Schedule</h3>
            <p className="text-sm text-gray-600">Identifies the GSA Schedule program (e.g., MAS - Multiple Award Schedule)</p>
            <div className="mt-2 bg-blue-100 px-3 py-1 rounded text-blue-800 inline-block font-mono">MAS</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Category</h3>
            <p className="text-sm text-gray-600">Represents the broad category or service area</p>
            <div className="mt-2 bg-green-100 px-3 py-1 rounded text-green-800 inline-block font-mono">54151</div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Subcategory</h3>
            <p className="text-sm text-gray-600">Specific service or product subcategory identifier</p>
            <div className="mt-2 bg-yellow-100 px-3 py-1 rounded text-yellow-800 inline-block font-mono">S</div>
          </div>
        </div>

        {/* Example Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 className="font-medium mb-4">Example Breakdown: SIN 54151S - Information Technology Professional Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-lg font-mono font-bold text-blue-600">54151</div>
              <div className="text-sm text-gray-600">IT Services Category</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-lg font-mono font-bold text-green-600">S</div>
              <div className="text-sm text-gray-600">Professional Services</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-lg font-mono font-bold text-yellow-600">MAS</div>
              <div className="text-sm text-gray-600">Multiple Award Schedule</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 5 of 315 codes
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Export
              </button>
              <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                Bulk Edit
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left text-sm font-medium text-gray-600 p-4">SIN Code</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Title</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Schedule</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Category</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockData.map((code) => (
                <tr key={code.code} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="text-blue-600 font-mono font-medium">{code.code}</span>
                    </div>
                  </td>
                  <td className="p-4">{code.title}</td>
                  <td className="p-4">{code.schedule}</td>
                  <td className="p-4">{code.category}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${code.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        code.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'}`}>
                      {code.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Settings size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-center gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              1
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
              3
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SINCodes;