import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CatalogItem } from '../../types/catalog';

interface CatalogState {
  items: CatalogItem[];
  selectedItems: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CatalogState = {
  items: [],
  selectedItems: [],
  loading: false,
  error: null
};

const catalogSlice = createSlice({
  name: 'catalog',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<CatalogItem[]>) => {
      state.items = action.payload;
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setItems, toggleItemSelection, setLoading, setError } = catalogSlice.actions;
export default catalogSlice.reducer;