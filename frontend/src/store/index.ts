import { combineReducers, configureStore } from '@reduxjs/toolkit';
import nerLabelFormModalReducer from './reducers/nerLabelFormModalSlice';
import loadDataModalReducer from './reducers/loadDataModalSlice';
import nlpDatasetReducer from './reducers/nlpDatasetSlice';
import nlpTokenSettingsModalReducer from './reducers/nlpTokenSettingsModalSlice';
import { nerLabelApi } from 'services/nerLabelService';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { nlpTextApi } from 'services/nlpTextService';

const rootReducer = combineReducers({
  nerLabelFormModalReducer,
  loadDataModalReducer,
  nlpDatasetReducer,
  nlpTokenSettingsModalReducer,
  [nerLabelApi.reducerPath]: nerLabelApi.reducer,
  [nlpDatasetApi.reducerPath]: nlpDatasetApi.reducer,
  [nlpTextApi.reducerPath]: nlpTextApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(
      nerLabelApi.middleware,
      nlpDatasetApi.middleware,
      nlpTextApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
