import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchResult {
  id: string;
  description: string;
  price: number;
  manufacturer: string;
  partNumber: string;
}

interface MRASState {
  searchResults: SearchResult[];
  selectedItems: string[];
  compareItems: string[];
  loading: boolean;
  error: string | null;
}

const initialState: MRASState = {
  searchResults: [],
  selectedItems: [],
  compareItems: [],
  loading: false,
  error: null
};

const mrasSlice = createSlice({
  name: 'mras',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.searchResults = action.payload;
    },
    toggleItemSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.selectedItems.indexOf(id);
      if (index === -1) {
        state.selectedItems.push(id);
      } else {
        state.selectedItems.splice(index, 1);
      }
    },
    addToCompare: (state, action: PayloadAction<string>) => {
      if (!state.compareItems.includes(action.payload)) {
        state.compareItems.push(action.payload);
      }
    },
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.compareItems = state.compareItems.filter(id => id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setSearchResults,
  toggleItemSelection,
  addToCompare,
  removeFromCompare,
  setLoading,
  setError
} = mrasSlice.actions;

export default mrasSlice.reducer;