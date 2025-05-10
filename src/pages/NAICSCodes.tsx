import React, { useState } from 'react';
import { Search, Edit2, Eye, Settings, Bell, X } from 'lucide-react';
import ActionButtons from '../components/shared/ActionButtons';
import RoutingTable from '../components/naics/RoutingTable';
import RoutingAnalytics from '../components/naics/RoutingAnalytics';
import { importCodes, exportCodes, syncFromAPI } from '../lib/api';

interface NAICSCode {
  code: string;
  title: string;
  category: string;
  level: string;
}

const mockData: NAICSCode[] = [
  {
    code: '541511',
    title: 'Custom Computer Programming Services',
    category: 'Information technology',
    level: '6-Digit'
  },
  {
    code: '541512',
    title: 'Computer Systems Design Services',
    category: 'Information technology',
    level: '6-Digit'
  },
  {
    code: '541513',
    title: 'Computer Facilities Management Services',
    category: 'Information technology',
    level: '6-Digit'
  },
  {
    code: '541519',
    title: 'Other Computer Related Services',
    category: 'Information technology',
    level: '6-Digit'
  },
  {
    code: '5415',
    title: 'Computer Systems Design and Related Services',
    category: 'Information technology',
    level: '4-Digit'
  },
  {
    code: '518210',
    title: 'Data Processing, Hosting, and Related Services',
    category: 'Information technology',
    level: '6-Digit'
  },
  {
    code: '541330',
    title: 'Engineering Services',
    category: 'Professional services',
    level: '6-Digit'
  }
];

const NAICSCodes: React.FC = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    setLoading(true);
    const result = await importCodes('PSC', { source: 'file', format: 'json', overwrite: false });
    alert(result.message);
    setLoading(false);
  };

  const handleExport = async () => {
    setLoading(true);
    const result = await exportCodes('PSC', { format: 'json', includeMetadata: true });
    setLoading(false);
  };

  const handleSync = async () => {
    setLoading(true);
    const result = await syncFromAPI('PSC');
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
          <h1 className="text-2xl font-bold text-gray-900">NAICS Codes Management</h1>
          <p className="text-sm text-gray-600">North American Industry Classification System - Last Updated: 2023</p>
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
        <h2 className="text-lg font-semibold text-gray-800">Search NAICS Codes</h2>
        
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry Sector</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
            >
              <option>All Sectors</option>
              <option>Information Technology</option>
              <option>Manufacturing</option>
              <option>Professional Services</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Code Level</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
            >
              <option>All Levels</option>
              <option>2-Digit</option>
              <option>3-Digit</option>
              <option>4-Digit</option>
              <option>5-Digit</option>
              <option>6-Digit</option>
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
              <option>Manufacturing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 15 of 1,057 codes
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
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
                <th className="text-left text-sm font-medium text-gray-600 p-4">NAICS Code</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Title</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Category</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Level</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockData.map((code) => (
                <tr key={code.code} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className="text-blue-600 font-medium">{code.code}</span>
                    </div>
                  </td>
                  <td className="p-4">{code.title}</td>
                  <td className="p-4">{code.category}</td>
                  <td className="p-4">{code.level}</td>
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
      </div>

      {/* Add RoutingAnalytics before RoutingTable */}
      <RoutingAnalytics />
      
      {/* Existing RoutingTable */}
      <RoutingTable />
    </div>
  );
};

export default NAICSCodes;