import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Proposal, Office } from '../../types/workflow';

interface WorkflowState {
  proposals: Proposal[];
  offices: Office[];
  selectedProposal: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: WorkflowState = {
  proposals: [],
  offices: [],
  selectedProposal: null,
  loading: false,
  error: null
};

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setProposals: (state, action: PayloadAction<Proposal[]>) => {
      state.proposals = action.payload;
    },
    setOffices: (state, action: PayloadAction<Office[]>) => {
      state.offices = action.payload;
    },
    selectProposal: (state, action: PayloadAction<string>) => {
      state.selectedProposal = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setProposals, setOffices, selectProposal, setLoading, setError } = workflowSlice.actions;
export default workflowSlice.reducer;