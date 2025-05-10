import React, { useState } from 'react';
import { Bell, X, Inbox, Clock, Settings, AlertCircle, Plus, Trash2 } from 'lucide-react';
import WorkflowCharts from '../components/workflow/WorkflowCharts';
import WorkflowVisualization from '../components/workflow/WorkflowVisualization';
import ProposalSearch from '../components/workflow/ProposalSearch';

interface Proposal {
  id: string;
  title: string;
  naicsCode: string;
  value: string;
  description: string;
  status: 'pending' | 'assigned' | 'queued';
  priority: 'high' | 'medium' | 'low';
  assignedOffice?: string;
  queuedAt?: Date;
}

interface Office {
  id: string;
  name: string;
  color: string;
  assignedProposals: number;
}

const initialProposals: Proposal[] = [
  {
    id: 'p1',
    title: 'Cloud Migration Services',
    naicsCode: '541512',
    value: '$1,250,000',
    description: 'Federal agency cloud migration services for legacy applications',
    status: 'queued',
    priority: 'high',
    queuedAt: new Date('2025-03-15')
  },
  {
    id: 'p2',
    title: 'Facilities Maintenance',
    naicsCode: '561210',
    value: '$890,000',
    description: 'Ongoing facilities maintenance for federal buildings in the Southwest region',
    status: 'queued',
    priority: 'medium',
    queuedAt: new Date('2025-03-14')
  },
  {
    id: 'p3',
    title: 'IT Professional Services',
    naicsCode: '541519',
    value: '$2,450,000',
    description: 'IT consulting services for cybersecurity implementation',
    status: 'queued',
    priority: 'high',
    queuedAt: new Date('2025-03-13')
  }
];

const initialOffices: Office[] = [
  { id: 'o1', name: 'Office of Professional Services & Human Capital', color: 'bg-blue-500', assignedProposals: 0 },
  { id: 'o2', name: 'Office of Information Technology', color: 'bg-green-500', assignedProposals: 0 },
  { id: 'o3', name: 'Office of General Supplies & Services', color: 'bg-purple-500', assignedProposals: 0 },
  { id: 'o4', name: 'Office of Travel, Transportation & Logistics', color: 'bg-red-500', assignedProposals: 0 },
  { id: 'o5', name: 'Office of Facilities Management', color: 'bg-yellow-500', assignedProposals: 0 },
  { id: 'o6', name: 'Office of Acquisition Policy', color: 'bg-indigo-500', assignedProposals: 0 },
  { id: 'o7', name: 'Office of Small Business Utilization', color: 'bg-pink-500', assignedProposals: 0 },
  { id: 'o8', name: 'Office of Enterprise Strategy Management', color: 'bg-teal-500', assignedProposals: 0 },
  { id: 'o9', name: 'Office of Government-wide Policy', color: 'bg-orange-500', assignedProposals: 0 },
  { id: 'o10', name: 'Office of Customer Experience', color: 'bg-gray-500', assignedProposals: 0 },
  { id: 'o11', name: 'Office of Congressional & Intergovernmental Affairs', color: 'bg-lime-500', assignedProposals: 0 },
  { id: 'o12', name: 'Office of Strategic Communication', color: 'bg-cyan-500', assignedProposals: 0 }
];

const availableColors = [
  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500',
  'bg-indigo-500', 'bg-pink-500', 'bg-teal-500', 'bg-orange-500', 'bg-gray-500',
  'bg-lime-500', 'bg-cyan-500'
];

const WorkflowAllocator: React.FC = () => {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [offices, setOffices] = useState<Office[]>(initialOffices);
  const [newProposal, setNewProposal] = useState<Partial<Proposal>>({
    title: '',
    naicsCode: '',
    value: '',
    description: '',
    priority: 'medium'
  });
  const [filterNaics, setFilterNaics] = useState('');
  const [filterOffice, setFilterOffice] = useState('All Offices');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showRules, setShowRules] = useState(false);
  const [routingRules, setRoutingRules] = useState<Record<string, string>>({
    '541512': 'o2',
    '561210': 'o5',
    '541519': 'o2'
  });
  const [activeTab, setActiveTab] = useState('queue');
  const [showNotification, setShowNotification] = useState(true);
  const [newOfficeName, setNewOfficeName] = useState('');
  const [showAddOfficeModal, setShowAddOfficeModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleCreateProposal = () => {
    if (newProposal.title && newProposal.naicsCode) {
      const proposal: Proposal = {
        id: `p${proposals.length + 1}`,
        title: newProposal.title,
        naicsCode: newProposal.naicsCode,
        value: newProposal.value || '$0',
        description: newProposal.description || '',
        status: 'queued',
        priority: newProposal.priority as 'high' | 'medium' | 'low',
        queuedAt: new Date()
      };
      
      setProposals([...proposals, proposal]);
      setNewProposal({ title: '', naicsCode: '', value: '', description: '', priority: 'medium' });
    }
  };

  const handleAutoRoute = () => {
    const updatedProposals = proposals.map(proposal => {
      if (proposal.status === 'queued' && routingRules[proposal.naicsCode]) {
        return {
          ...proposal,
          status: 'assigned',
          assignedOffice: routingRules[proposal.naicsCode]
        };
      }
      return proposal;
    });
    
    setProposals(updatedProposals);
  };

  const handleManualRoute = (proposalId: string, officeId: string) => {
    setProposals(proposals.map(p => 
      p.id === proposalId 
        ? { ...p, status: 'assigned', assignedOffice: officeId }
        : p
    ));
  };

  const handleAddOffice = () => {
    if (newOfficeName.trim()) {
      const newOffice: Office = {
        id: `o${offices.length + 1}`,
        name: newOfficeName.trim(),
        color: availableColors[offices.length % availableColors.length],
        assignedProposals: 0
      };
      setOffices([...offices, newOffice]);
      setNewOfficeName('');
      setShowAddOfficeModal(false);
    }
  };

  const handleRemoveOffice = (officeId: string) => {
    const updatedProposals = proposals.map(proposal => {
      if (proposal.assignedOffice === officeId) {
        return { ...proposal, status: 'queued', assignedOffice: undefined };
      }
      return proposal;
    });
    
    setOffices(offices.filter(office => office.id !== officeId));
    setProposals(updatedProposals);
    
    const updatedRules = { ...routingRules };
    Object.keys(updatedRules).forEach(naicsCode => {
      if (updatedRules[naicsCode] === officeId) {
        delete updatedRules[naicsCode];
      }
    });
    setRoutingRules(updatedRules);
  };

  const addRoutingRule = (naicsCode: string, officeId: string) => {
    setRoutingRules({ ...routingRules, [naicsCode]: officeId });
  };

  const getQueuedProposals = (priority: string) => {
    return proposals.filter(p => 
      p.status === 'queued' && 
      (priority === 'all' || p.priority === priority)
    ).sort((a, b) => (b.queuedAt?.getTime() || 0) - (a.queuedAt?.getTime() || 0));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      {showNotification && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="text-blue-500" size={20} />
            <div>
              <p className="text-blue-800 font-medium">New System Update</p>
              <p className="text-blue-600 text-sm">Workflow automation features have been enhanced. Check out the new auto-routing capabilities.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNotification(false)}
            className="text-blue-500 hover:text-blue-700"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workflow Allocator</h1>
          <p className="text-gray-600">Manage and route proposals to appropriate offices</p>
        </div>
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {sidebarExpanded ? 'Hide Workflow' : 'View Workflow'}
        </button>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('queue')}
            className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'queue'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Inbox size={18} />
            <span>Queue Management</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Clock size={18} />
            <span>Processing History</span>
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'rules'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Settings size={18} />
            <span>Routing Rules</span>
          </button>

          <button
            onClick={() => setActiveTab('alerts')}
            className={`py-4 px-1 inline-flex items-center space-x-2 border-b-2 font-medium text-sm ${
              activeTab === 'alerts'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <AlertCircle size={18} />
            <span>Alerts</span>
          </button>
        </nav>
      </div>

      {activeTab === 'queue' && (
        <>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Proposal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newProposal.title}
                  onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Proposal title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">NAICS Code</label>
                <input
                  type="text"
                  value={newProposal.naicsCode}
                  onChange={(e) => setNewProposal({ ...newProposal, naicsCode: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 541512"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                <input
                  type="text"
                  value={newProposal.value}
                  onChange={(e) => setNewProposal({ ...newProposal, value: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. $1,000,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={newProposal.priority}
                  onChange={(e) => setNewProposal({ ...newProposal, priority: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description"
                  rows={2}
                />
              </div>
            </div>
            <button
              onClick={handleCreateProposal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Create Proposal
            </button>
          </div>

          <WorkflowCharts proposals={proposals} offices={offices} />

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Search Assigned Proposals</h2>
            <ProposalSearch proposals={proposals} offices={offices} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-red-600">High Priority</h2>
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                  {getQueuedProposals('high').length} Proposals
                </span>
              </div>
              <div className="space-y-3">
                {getQueuedProposals('high').map(proposal => (
                  <div key={proposal.id} className="p-3 bg-red-50 rounded-lg border border-red-100">
                    <h3 className="font-medium">{proposal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{proposal.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        Queued: {proposal.queuedAt?.toLocaleDateString()}
                      </span>
                      <select
                        onChange={(e) => handleManualRoute(proposal.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg p-1"
                      >
                        <option value="">Assign to...</option>
                        {offices.map(office => (
                          <option key={office.id} value={office.id}>{office.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-yellow-600">Medium Priority</h2>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  {getQueuedProposals('medium').length} Proposals
                </span>
              </div>
              <div className="space-y-3">
                {getQueuedProposals('medium').map(proposal => (
                  <div key={proposal.id} className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <h3 className="font-medium">{proposal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{proposal.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        Queued: {proposal.queuedAt?.toLocaleDateString()}
                      </span>
                      <select
                        onChange={(e) => handleManualRoute(proposal.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg p-1"
                      >
                        <option value="">Assign to...</option>
                        {offices.map(office => (
                          <option key={office.id} value={office.id}>{office.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-green-600">Low Priority</h2>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {getQueuedProposals('low').length} Proposals
                </span>
              </div>
              <div className="space-y-3">
                {getQueuedProposals('low').map(proposal => (
                  <div key={proposal.id} className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <h3 className="font-medium">{proposal.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{proposal.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        Queued: {proposal.queuedAt?.toLocaleDateString()}
                      </span>
                      <select
                        onChange={(e) => handleManualRoute(proposal.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg p-1"
                      >
                        <option value="">Assign to...</option>
                        {offices.map(office => (
                          <option key={office.id} value={office.id}>{office.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Offices</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleAutoRoute}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Auto-Route All Proposals
                </button>
                <button
                  onClick={() => setShowAddOfficeModal(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Office
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {offices.map(office => {
                const assignedCount = proposals.filter(p => p.assignedOffice === office.id).length;
                return (
                  <div key={office.id} className={`p-4 rounded-lg ${office.color} text-white relative group`}>
                    <button
                      onClick={() => handleRemoveOffice(office.id)}
                      className="absolute top-2 right-2 p-1 bg-white/20 rounded hover:bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove Office"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                    <h3 className="font-medium">{office.name}</h3>
                    <div className="text-sm mt-1">Assigned Proposals: {assignedCount}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Processing History</h2>
          <p className="text-gray-600">View the history of processed proposals and their routing paths.</p>
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Routing Rules Configuration</h2>
          <p className="text-gray-600">Configure and manage automated routing rules for proposals.</p>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">System Alerts</h2>
          <p className="text-gray-600">View and manage system alerts and notifications.</p>
        </div>
      )}

      {showAddOfficeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Office</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Name</label>
              <input
                type="text"
                value={newOfficeName}
                onChange={(e) => setNewOfficeName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter office name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddOfficeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOffice}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                disabled={!newOfficeName.trim()}
              >
                Add Office
              </button>
            </div>
          </div>
        </div>
      )}

      <WorkflowVisualization
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
      />
    </div>
  );
};

export default WorkflowAllocator;