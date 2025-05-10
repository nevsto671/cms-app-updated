import React, { useState } from 'react';
import { Flower as Flow, Plus, Save, Play, Trash2, Edit2, Search, Filter, ArrowRight, Settings, AlertCircle, X, Bell, Tag, Activity, Copy } from 'lucide-react';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  steps: WorkflowStep[];
  createdAt: string;
  lastModified: string;
}

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'review' | 'notification' | 'tagging' | 'routing';
  assignee?: string;
  conditions?: string[];
  actions?: string[];
}

const WorkflowDesigner: React.FC = () => {
  const [activeTab, setActiveTab] = useState('workflows');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const mockWorkflows: Workflow[] = [
    {
      id: '1',
      name: 'Contract Review Process',
      description: 'Standard workflow for contract review and approval',
      status: 'active',
      steps: [
        {
          id: 's1',
          name: 'Initial Review',
          type: 'review',
          assignee: 'Legal Team'
        },
        {
          id: 's2',
          name: 'Department Approval',
          type: 'approval',
          assignee: 'Department Head'
        },
        {
          id: 's3',
          name: 'Final Approval',
          type: 'approval',
          assignee: 'Executive Team'
        }
      ],
      createdAt: '2025-05-01',
      lastModified: '2025-05-10'
    },
    {
      id: '2',
      name: 'Document Classification',
      description: 'Automated document tagging and routing workflow',
      status: 'draft',
      steps: [
        {
          id: 's1',
          name: 'Auto-Tag',
          type: 'tagging'
        },
        {
          id: 's2',
          name: 'Route to Department',
          type: 'routing'
        }
      ],
      createdAt: '2025-05-05',
      lastModified: '2025-05-09'
    }
  ];

  const handleSelectWorkflow = (id: string) => {
    setSelectedWorkflows(prev =>
      prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'approval': return <Settings className="text-blue-500" size={16} />;
      case 'review': return <AlertCircle className="text-yellow-500" size={16} />;
      case 'notification': return <Bell className="text-purple-500" size={16} />;
      case 'tagging': return <Tag className="text-green-500" size={16} />;
      case 'routing': return <ArrowRight className="text-red-500" size={16} />;
      default: return <Settings className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4">
          {[
            { id: 'workflows', label: 'Workflows', icon: Flow },
            { id: 'templates', label: 'Templates', icon: Copy },
            { id: 'monitoring', label: 'Monitoring', icon: Activity },
            { id: 'settings', label: 'Settings', icon: Settings }
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
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus size={16} />
            Create Workflow
          </button>
          <button
            disabled={selectedWorkflows.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Edit2 size={16} />
            Edit
          </button>
          <button
            disabled={selectedWorkflows.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Play size={16} />
            Activate
          </button>
          <button
            disabled={selectedWorkflows.length === 0}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search workflows..."
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

      {/* Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select className="w-full border border-gray-200 rounded-lg p-2">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Archived</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select className="w-full border border-gray-200 rounded-lg p-2">
              <option>All Types</option>
              <option>Approval</option>
              <option>Review</option>
              <option>Notification</option>
              <option>Tagging</option>
              <option>Routing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
            <select className="w-full border border-gray-200 rounded-lg p-2">
              <option>All Users</option>
              <option>Current User</option>
              <option>System</option>
            </select>
          </div>
        </div>
      )}

      {/* Workflow List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-8 p-4">
                  <input
                    type="checkbox"
                    checked={selectedWorkflows.length === mockWorkflows.length}
                    onChange={() => {
                      if (selectedWorkflows.length === mockWorkflows.length) {
                        setSelectedWorkflows([]);
                      } else {
                        setSelectedWorkflows(mockWorkflows.map(w => w.id));
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Name</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Steps</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Status</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Created</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Modified</th>
                <th className="text-left text-sm font-medium text-gray-600 p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockWorkflows.map((workflow) => (
                <tr key={workflow.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedWorkflows.includes(workflow.id)}
                      onChange={() => handleSelectWorkflow(workflow.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{workflow.name}</div>
                      <div className="text-sm text-gray-500">{workflow.description}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {workflow.steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                          <div className="flex items-center">
                            {getStepIcon(step.type)}
                            <span className="text-xs text-gray-500 ml-1">{step.name}</span>
                          </div>
                          {index < workflow.steps.length - 1 && (
                            <ArrowRight size={12} className="text-gray-400" />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">{workflow.createdAt}</td>
                  <td className="p-4 text-sm text-gray-600">{workflow.lastModified}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit2 size={16} className="text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Play size={16} className="text-gray-600" />
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

      {/* Create Workflow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Create New Workflow</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Workflow Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-200 rounded-lg p-2"
                  placeholder="Enter workflow name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full border border-gray-200 rounded-lg p-2"
                  rows={3}
                  placeholder="Enter workflow description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workflow Steps
                </label>
                <div className="space-y-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <select className="w-full border border-gray-200 rounded-lg p-2">
                          <option>Select step type...</option>
                          <option>Approval</option>
                          <option>Review</option>
                          <option>Notification</option>
                          <option>Tagging</option>
                          <option>Routing</option>
                        </select>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  <button className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400">
                    + Add Step
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
                  <Save size={16} />
                  Create Workflow
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowDesigner;