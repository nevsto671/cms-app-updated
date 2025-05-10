import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
import catalogReducer from './slices/catalogSlice';
import workflowReducer from './slices/workflowSlice';
import mrasReducer from './slices/mrasSlice';

const rootReducer = combineReducers({
  catalog: catalogReducer,
  workflow: workflowReducer,
  mras: mrasReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['catalog', 'workflow', 'mras']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;