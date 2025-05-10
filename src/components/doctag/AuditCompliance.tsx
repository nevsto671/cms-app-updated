import React, { useState } from 'react';
import { Search, Filter, Download, AlertCircle, Shield, FileText, Clock, User, Activity, ChevronDown, RefreshCw, Calendar } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'active' | 'inactive';
  lastChecked: string;
  violations: number;
}

const AuditCompliance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('audit');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('last7');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEntityType, setSelectedEntityType] = useState('all');
  const [selectedAction, setSelectedAction] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const mockAuditLogs: AuditLog[] = [
    {
      id: '1',
      timestamp: '2025-05-10 14:30:22',
      user: 'john.smith@example.com',
      action: 'document.create',
      entityType: 'document',
      entityId: 'doc-123',
      details: 'Created new document: Contract Agreement.pdf',
      ipAddress: '192.168.1.100',
      status: 'success'
    },
    {
      id: '2',
      timestamp: '2025-05-10 14:28:15',
      user: 'sarah.jones@example.com',
      action: 'workflow.approve',
      entityType: 'workflow',
      entityId: 'wf-456',
      details: 'Approved document in review workflow',
      ipAddress: '192.168.1.101',
      status: 'success'
    },
    {
      id: '3',
      timestamp: '2025-05-10 14:25:30',
      user: 'system',
      action: 'tag.assign',
      entityType: 'tag',
      entityId: 'tag-789',
      details: 'Automatically assigned tag to document',
      ipAddress: 'system',
      status: 'warning'
    }
  ];

  const mockComplianceRules: ComplianceRule[] = [
    {
      id: '1',
      name: 'Document Retention Policy',
      description: 'Ensures documents are retained according to policy requirements',
      type: 'retention',
      status: 'active',
      lastChecked: '2025-05-10 12:00:00',
      violations: 0
    },
    {
      id: '2',
      name: 'Access Control Verification',
      description: 'Verifies proper access controls are in place for sensitive documents',
      type: 'security',
      status: 'active',
      lastChecked: '2025-05-10 12:00:00',
      violations: 2
    },
    {
      id: '3',
      name: 'Workflow Compliance Check',
      description: 'Ensures workflows follow required approval processes',
      type: 'workflow',
      status: 'active',
      lastChecked: '2025-05-10 12:00:00',
      violations: 1
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.split('.')[0]) {
      case 'document': return <FileText size={16} className="text-blue-500" />;
      case 'workflow': return <Activity size={16} className="text-green-500" />;
      case 'tag': return <AlertCircle size={16} className="text-yellow-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {[
            { id: 'audit', label: 'Audit Logs', icon: Clock },
            { id: 'compliance', label: 'Compliance Rules', icon: Shield },
            { id: 'reports', label: 'Compliance Reports', icon: FileText },
            { id: 'settings', label: 'Audit Settings', icon: AlertCircle }
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

      {activeTab === 'audit' && (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-200 rounded-lg p-2"
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

            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <Download size={16} />
                Export Logs
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
                <select
                  value={selectedEntityType}
                  onChange={(e) => setSelectedEntityType(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2"
                >
                  <option value="all">All Types</option>
                  <option value="document">Document</option>
                  <option value="workflow">Workflow</option>
                  <option value="tag">Tag</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
                <select
                  value={selectedAction}
                  onChange={(e) => setSelectedAction(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2"
                >
                  <option value="all">All Actions</option>
                  <option value="create">Create</option>
                  <option value="update">Update</option>
                  <option value="delete">Delete</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-2"
                >
                  <option value="all">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          )}

          {/* Audit Log Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Timestamp</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">User</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Action</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Details</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">IP Address</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockAuditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="p-4 text-sm">
                        <div className="font-mono">{log.timestamp}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <User size={16} className="text-gray-400 mr-2" />
                          <span className="text-sm">{log.user}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="text-sm">{log.action}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">{log.details}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-mono">{log.ipAddress}</span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'compliance' && (
        <>
          {/* Compliance Rules Header */}
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                <RefreshCw size={16} />
                Run Compliance Check
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Calendar size={16} />
                Schedule Check
              </button>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                Add Rule
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                Import Rules
              </button>
            </div>
          </div>

          {/* Compliance Rules Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Rule Name</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Type</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Last Checked</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Violations</th>
                    <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockComplianceRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-gray-900">{rule.name}</div>
                          <div className="text-sm text-gray-500">{rule.description}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {rule.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rule.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm">{rule.lastChecked}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          rule.violations > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {rule.violations}
                        </span>
                      </td>
                      <td className="p-4">
                        <button className="text-blue-600 hover:text-blue-800">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Compliance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Overall Compliance Score</h3>
              <div className="text-2xl font-bold text-green-600">98%</div>
              <p className="text-sm text-gray-500 mt-1">Based on all active rules</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Active Rules</h3>
              <div className="text-2xl font-bold text-blue-600">12</div>
              <p className="text-sm text-gray-500 mt-1">Out of 15 total rules</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Total Violations</h3>
              <div className="text-2xl font-bold text-red-600">3</div>
              <p className="text-sm text-gray-500 mt-1">Across all rules</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AuditCompliance;