import React, { useState } from 'react';
import { BarChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Download, Filter, RefreshCw, Calendar, FileText, Users, Tag, Clock, ChevronDown, Search } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'user' | 'workflow' | 'tag';
  lastRun: string;
  schedule: string;
}

const ReportsAnalytics: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('last30');
  const [showFilters, setShowFilters] = useState(false);

  const mockReports: Report[] = [
    {
      id: '1',
      name: 'Document Activity Summary',
      description: 'Overview of document uploads, modifications, and access patterns',
      type: 'document',
      lastRun: '2025-05-10 14:30',
      schedule: 'Daily'
    },
    {
      id: '2',
      name: 'User Activity Report',
      description: 'Analysis of user interactions and system usage',
      type: 'user',
      lastRun: '2025-05-10 08:15',
      schedule: 'Weekly'
    },
    {
      id: '3',
      name: 'Tag Distribution Analysis',
      description: 'Distribution and usage patterns of document tags',
      type: 'tag',
      lastRun: '2025-05-09 16:45',
      schedule: 'Monthly'
    },
    {
      id: '4',
      name: 'Workflow Performance Metrics',
      description: 'Performance analysis of document workflows',
      type: 'workflow',
      lastRun: '2025-05-09 11:20',
      schedule: 'Weekly'
    }
  ];

  // Mock data for charts
  const documentTypeData = [
    { name: 'Contracts', value: 45 },
    { name: 'Proposals', value: 30 },
    { name: 'Reports', value: 15 },
    { name: 'Forms', value: 10 }
  ];

  const activityData = [
    { date: '05/01', uploads: 12, downloads: 8, views: 45 },
    { date: '05/02', uploads: 15, downloads: 10, views: 52 },
    { date: '05/03', uploads: 8, downloads: 12, views: 38 },
    { date: '05/04', uploads: 20, downloads: 15, views: 65 },
    { date: '05/05', uploads: 16, downloads: 9, views: 48 }
  ];

  const tagUsageData = [
    { tag: '⭐S', count: 25 },
    { tag: '📦P', count: 18 },
    { tag: '📝C', count: 32 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {[
            { id: 'dashboard', label: 'Analytics Dashboard' },
            { id: 'reports', label: 'Report Library' },
            { id: 'custom', label: 'Custom Reports' },
            { id: 'scheduled', label: 'Scheduled Reports' },
            { id: 'exports', label: 'Data Exports' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 text-sm font-medium border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Analytics Dashboard */}
      {activeTab === 'dashboard' && (
        <>
          {/* Filters */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-200 rounded-lg p-2 text-sm"
              >
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 border border-gray-200 rounded-lg hover:bg-gray-50 ${
                  showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : ''
                }`}
              >
                <Filter size={20} />
              </button>
            </div>
            <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <Download size={16} />
              Export Analytics
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <FileText className="text-blue-500" size={24} />
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
              <h3 className="text-2xl font-bold">1,234</h3>
              <p className="text-sm text-gray-600">Total Documents</p>
              <span className="text-xs text-green-600">+12.5%</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Users className="text-green-500" size={24} />
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
              <h3 className="text-2xl font-bold">256</h3>
              <p className="text-sm text-gray-600">Active Users</p>
              <span className="text-xs text-green-600">+8.3%</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Tag className="text-yellow-500" size={24} />
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
              <h3 className="text-2xl font-bold">789</h3>
              <p className="text-sm text-gray-600">Tagged Documents</p>
              <span className="text-xs text-green-600">+15.2%</span>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <Clock className="text-purple-500" size={24} />
                <span className="text-xs text-gray-500">vs last period</span>
              </div>
              <h3 className="text-2xl font-bold">45</h3>
              <p className="text-sm text-gray-600">Active Workflows</p>
              <span className="text-xs text-red-600">-2.1%</span>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Activity Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Document Activity</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="uploads" fill="#3B82F6" name="Uploads" />
                    <Bar dataKey="downloads" fill="#10B981" name="Downloads" />
                    <Bar dataKey="views" fill="#F59E0B" name="Views" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Document Types Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Document Types Distribution</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={documentTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {documentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Tag Usage Chart */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Tag Usage</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tagUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tag" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8B5CF6" name="Documents" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* User Activity Metrics */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">User Activity Metrics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Daily Active Users</span>
                  <span className="font-medium">124</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Documents per User</span>
                  <span className="font-medium">15.3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Session Duration</span>
                  <span className="font-medium">28m 45s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Workflow Completion Rate</span>
                  <span className="font-medium">92.4%</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Report Library */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search reports..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
              <RefreshCw size={16} />
              Run Selected
            </button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Report Name</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Type</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Schedule</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Last Run</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{report.name}</div>
                          <div className="text-sm text-gray-500">{report.description}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {report.type}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{report.schedule}</td>
                      <td className="p-4 text-sm text-gray-600">{report.lastRun}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">
                            Run Now
                          </button>
                          <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-50">
                            Schedule
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
      )}
    </div>
  );
};

export default ReportsAnalytics;