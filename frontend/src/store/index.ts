import { combineReducers, configureStore } from '@reduxjs/toolkit';
import loadDataModalReducer from './reducers/loadDataModalSlice';
import nlpDatasetReducer from './reducers/nlpDatasetSlice';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { nlpTextApi } from 'services/nlpTextService';

const rootReducer = combineReducers({
  loadDataModalReducer,
  nlpDatasetReducer,
  [nlpDatasetApi.reducerPath]: nlpDatasetApi.reducer,
  [nlpTextApi.reducerPath]: nlpTextApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(
      nlpDatasetApi.middleware,
      nlpTextApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
