import React, { useMemo } from 'react';
import { Proposal, Office } from '../../types/workflow';

interface ProposalQueueProps {
  priority: 'high' | 'medium' | 'low';
  proposals: Proposal[];
  offices: Office[];
  onAssign: (proposalId: string, officeId: string) => void;
}

const priorityStyles = {
  high: {
    container: 'bg-red-50 border-red-100',
    header: 'text-red-600',
    count: 'bg-red-100 text-red-800'
  },
  medium: {
    container: 'bg-yellow-50 border-yellow-100',
    header: 'text-yellow-600',
    count: 'bg-yellow-100 text-yellow-800'
  },
  low: {
    container: 'bg-green-50 border-green-100',
    header: 'text-green-600',
    count: 'bg-green-100 text-green-800'
  }
};

const ProposalQueue: React.FC<ProposalQueueProps> = React.memo(({ 
  priority, 
  proposals, 
  offices, 
  onAssign 
}) => {
  const styles = priorityStyles[priority];

  const filteredProposals = useMemo(() => {
    return proposals
      .filter(p => p.priority === priority)
      .sort((a, b) => (b.queuedAt?.getTime() || 0) - (a.queuedAt?.getTime() || 0));
  }, [proposals, priority]);

  if (filteredProposals.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold ${styles.header}`}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </h2>
          <span className={`px-3 py-1 rounded-full text-sm ${styles.count}`}>
            0 Proposals
          </span>
        </div>
        <div className="text-center text-gray-500 py-8">
          No {priority} priority proposals in queue
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-lg font-semibold ${styles.header}`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
        </h2>
        <span className={`px-3 py-1 rounded-full text-sm ${styles.count}`}>
          {filteredProposals.length} Proposals
        </span>
      </div>
      <div className="space-y-3">
        {filteredProposals.map(proposal => (
          <div 
            key={proposal.id} 
            className={`p-3 ${styles.container} rounded-lg border`}
          >
            <h3 className="font-medium">{proposal.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{proposal.description}</p>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                Queued: {proposal.queuedAt?.toLocaleDateString()}
              </span>
              <select
                onChange={(e) => onAssign(proposal.id, e.target.value)}
                className="text-sm border border-gray-200 rounded-lg p-1"
                defaultValue=""
              >
                <option value="">Assign to...</option>
                {offices.map(office => (
                  <option key={office.id} value={office.id}>
                    {office.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ProposalQueue.displayName = 'ProposalQueue';

export default ProposalQueue;