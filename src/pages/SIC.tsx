import React, { useState } from 'react';
import { Search, Edit2, Eye, Settings, Bell, X } from 'lucide-react';
import ActionButtons from '../components/shared/ActionButtons';
import { importCodes, exportCodes, syncFromAPI } from '../lib/api';

interface SICCode {
  code: string;
  title: string;
  division: string;
  level: string;
}

const mockData: SICCode[] = [
  {
    code: '7371',
    title: 'Computer Programming Services',
    division: 'Services',
    level: '4-Digit'
  },
  {
    code: '7372',
    title: 'Prepackaged Software',
    division: 'Services',
    level: '4-Digit'
  },
  {
    code: '7373',
    title: 'Computer Integrated Systems Design',
    division: 'Services',
    level: '4-Digit'
  },
  {
    code: '7374',
    title: 'Computer Processing and Data Preparation',
    division: 'Services',
    level: '4-Digit'
  },
  {
    code: '737',
    title: 'Computer Programming, Data Processing, And Other Computer Related Services',
    division: 'Services',
    level: '3-Digit'
  }
];

const SIC: React.FC = () => {
  const [showNotification, setShowNotification] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
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
          <h1 className="text-2xl font-bold text-gray-900">SIC Codes Management</h1>
          <p className="text-sm text-gray-600">Standard Industrial Classification - Last Updated: 2023</p>
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
        <h2 className="text-lg font-semibold text-gray-800">Search SIC Codes</h2>
        
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
            <select
              className="w-full border border-gray-200 rounded-lg p-2"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
            >
              <option>All Divisions</option>
              <option>Agriculture, Forestry, And Fishing</option>
              <option>Mining</option>
              <option>Construction</option>
              <option>Manufacturing</option>
              <option>Services</option>
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
            </select>
          </div>
        </div>
      </div>

      {/* SIC Code Structure */}
      <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">SIC Code Structure</h2>
        <p className="text-gray-600">The Standard Industrial Classification (SIC) system uses a four-digit code to organize industries hierarchically.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Digits 1-2: Major Group</h3>
            <p className="text-sm text-gray-600">Identifies one of the major economic sectors (there are ~83 major groups within 11 divisions)</p>
            <div className="mt-2 bg-blue-100 px-3 py-1 rounded text-blue-800 inline-block font-mono">73 XX</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Digit 3: Industry Group</h3>
            <p className="text-sm text-gray-600">Further refines the business classification into industry groups (over 400 industry groups)</p>
            <div className="mt-2 bg-green-100 px-3 py-1 rounded text-green-800 inline-block font-mono">73 7 X</div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Digit 4: Industry</h3>
            <p className="text-sm text-gray-600">Identifies the specific industry (over 1,000 specific industries)</p>
            <div className="mt-2 bg-yellow-100 px-3 py-1 rounded text-yellow-800 inline-block font-mono">737 1</div>
          </div>
        </div>

        {/* Example Breakdown */}
        <div className="bg-gray-50 p-4 rounded-lg mt-4">
          <h3 className="font-medium mb-4">Example Breakdown: SIC Code 7371 - Computer Programming Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-lg font-mono font-bold text-blue-600">73</div>
              <div className="text-sm text-gray-600">Business Services (Major Group)</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-lg font-mono font-bold text-green-600">7</div>
              <div className="text-sm text-gray-600">Computer & Data Processing Services (Industry Group)</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-lg font-mono font-bold text-yellow-600">1</div>
              <div className="text-sm text-gray-600">Computer Programming Services (Industry)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing 5 of 1,004 codes
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
                <th className="text-left text-sm font-medium text-gray-600 p-4">SIC Code</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Title</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Division</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Level</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockData.map((code) => (
                <tr key={code.code} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-600 font-mono font-medium">{code.code.split('').join(' ')}</span>
                    </div>
                  </td>
                  <td className="p-4">{code.title}</td>
                  <td className="p-4">{code.division}</td>
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
    </div>
  );
};

export default SIC;