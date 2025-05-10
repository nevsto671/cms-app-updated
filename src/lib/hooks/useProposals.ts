import { useState, useCallback, useMemo } from 'react';
import { Proposal } from '../../types/workflow';

export const useProposals = (initialProposals: Proposal[]) => {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);

  const createProposal = useCallback((newProposal: Partial<Proposal>) => {
    if (newProposal.title && newProposal.naicsCode) {
      const proposal: Proposal = {
        id: `p${Date.now()}`,
        title: newProposal.title,
        naicsCode: newProposal.naicsCode,
        value: newProposal.value || '$0',
        description: newProposal.description || '',
        status: 'queued',
        priority: newProposal.priority as 'high' | 'medium' | 'low',
        queuedAt: new Date()
      };
      
      setProposals(prev => [...prev, proposal]);
      return true;
    }
    return false;
  }, []);

  const autoRouteProposals = useCallback((routingRules: Record<string, string>) => {
    setProposals(prev => prev.map(proposal => {
      if (proposal.status === 'queued' && routingRules[proposal.naicsCode]) {
        return {
          ...proposal,
          status: 'assigned',
          assignedOffice: routingRules[proposal.naicsCode]
        };
      }
      return proposal;
    }));
  }, []);

  const manualRouteProposal = useCallback((proposalId: string, officeId: string) => {
    setProposals(prev => prev.map(p => 
      p.id === proposalId 
        ? { ...p, status: 'assigned', assignedOffice: officeId }
        : p
    ));
  }, []);

  const getQueuedProposals = useCallback((priority: string) => {
    return proposals.filter(p => 
      p.status === 'queued' && 
      (priority === 'all' || p.priority === priority)
    ).sort((a, b) => (b.queuedAt?.getTime() || 0) - (a.queuedAt?.getTime() || 0));
  }, [proposals]);

  const proposalStats = useMemo(() => {
    return {
      high: proposals.filter(p => p.status === 'queued' && p.priority === 'high').length,
      medium: proposals.filter(p => p.status === 'queued' && p.priority === 'medium').length,
      low: proposals.filter(p => p.status === 'queued' && p.priority === 'low').length,
      total: proposals.length
    };
  }, [proposals]);

  return {
    proposals,
    createProposal,
    autoRouteProposals,
    manualRouteProposal,
    getQueuedProposals,
    proposalStats
  };
};