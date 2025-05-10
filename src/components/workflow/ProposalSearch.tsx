import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Proposal, Office } from '../../types/workflow';

interface ProposalSearchProps {
  proposals: Proposal[];
  offices: Office[];
}

const ProposalSearch: React.FC<ProposalSearchProps> = ({ proposals, offices }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProposals = useMemo(() => {
    return proposals.filter(proposal => {
      const matchesSearch = searchTerm === '' || 
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.naicsCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOffice = selectedOffice === 'all' || proposal.assignedOffice === selectedOffice;
      const matchesPriority = selectedPriority === 'all' || proposal.priority === selectedPriority;

      return matchesSearch && matchesOffice && matchesPriority;
    });
  }, [proposals, searchTerm, selectedOffice, selectedPriority]);

  const getOfficeNameById = (officeId: string | undefined) => {
    if (!officeId) return 'Unassigned';
    const office = offices.find(o => o.id === officeId);
    return office ? office.name : 'Unknown Office';
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
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search proposals by title, NAICS code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Filter size={16} />
            Filters
            {(selectedOffice !== 'all' || selectedPriority !== 'all') && (
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {(selectedOffice !== 'all' ? 1 : 0) + (selectedPriority !== 'all' ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Office</label>
              <select
                value={selectedOffice}
                onChange={(e) => setSelectedOffice(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2"
              >
                <option value="all">All Offices</option>
                {offices.map(office => (
                  <option key={office.id} value={office.id}>{office.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-200">
        {filteredProposals.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No proposals found matching your search criteria.</p>
          </div>
        ) : (
          filteredProposals.map(proposal => (
            <div key={proposal.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{proposal.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(proposal.priority)}`}>
                  {proposal.priority.charAt(0).toUpperCase() + proposal.priority.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">NAICS Code:</span>{' '}
                  <span className="font-mono">{proposal.naicsCode}</span>
                </div>
                <div>
                  <span className="text-gray-500">Value:</span>{' '}
                  <span>{proposal.value}</span>
                </div>
                <div>
                  <span className="text-gray-500">Assigned Office:</span>{' '}
                  <span>{getOfficeNameById(proposal.assignedOffice)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>{' '}
                  <span className="capitalize">{proposal.status}</span>
                </div>
              </div>
              {proposal.description && (
                <p className="mt-2 text-sm text-gray-600">{proposal.description}</p>
              )}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-sm text-gray-600">
          Showing {filteredProposals.length} of {proposals.length} proposals
        </div>
      </div>
    </div>
  );
};

export default ProposalSearch;