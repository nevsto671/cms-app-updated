export interface Proposal {
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

export interface Office {
  id: string;
  name: string;
  color: string;
  assignedProposals: number;
}

export interface ProposalFormData {
  title: string;
  naicsCode: string;
  value: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}