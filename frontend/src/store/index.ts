import { combineReducers, configureStore } from '@reduxjs/toolkit';
import loadDataModalReducer from './reducers/loadDataModalSlice';
import { nlpDatasetApi } from 'services/nlpDatasetService';

const rootReducer = combineReducers({
  loadDataModalReducer,
  [nlpDatasetApi.reducerPath]: nlpDatasetApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat([nlpDatasetApi.middleware]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
