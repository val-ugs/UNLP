import { combineReducers, configureStore } from '@reduxjs/toolkit';
import actionModalReducer from './reducers/actionModalSlice';
import huggingFaceModelFormModalReducer from './reducers/huggingFaceModelFormModalSlice';
import loadDataModalReducer from './reducers/loadDataModalSlice';
import metricModalReducer from './reducers/metricModalSlice';
import nerLabelFormModalReducer from './reducers/nerLabelFormModalSlice';
import nlpDatasetReducer from './reducers/nlpDatasetSlice';
import nlpTokenSettingsModalReducer from './reducers/nlpTokenSettingsModalSlice';
import reactFlowReducer from './reducers/reactFlowSlice';
import { actionApi } from 'services/actionService';
import { huggingFaceModelApi } from 'services/huggingFaceModelService';
import { nerLabelApi } from 'services/nerLabelService';
import { nlpDatasetApi } from 'services/nlpDatasetService';
import { nlpTextApi } from 'services/nlpTextService';
import { nlpTokenApi } from 'services/nlpTokenService';
import { nlpTokenNerLabelApi } from 'services/nlpTokenNerLabelService';

const rootReducer = combineReducers({
  actionModalReducer,
  huggingFaceModelFormModalReducer,
  loadDataModalReducer,
  metricModalReducer,
  nerLabelFormModalReducer,
  nlpDatasetReducer,
  nlpTokenSettingsModalReducer,
  reactFlowReducer,
  [actionApi.reducerPath]: actionApi.reducer,
  [huggingFaceModelApi.reducerPath]: huggingFaceModelApi.reducer,
  [nerLabelApi.reducerPath]: nerLabelApi.reducer,
  [nlpDatasetApi.reducerPath]: nlpDatasetApi.reducer,
  [nlpTextApi.reducerPath]: nlpTextApi.reducer,
  [nlpTokenApi.reducerPath]: nlpTokenApi.reducer,
  [nlpTokenNerLabelApi.reducerPath]: nlpTokenNerLabelApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware().concat(
      actionApi.middleware,
      huggingFaceModelApi.middleware,
      nerLabelApi.middleware,
      nlpDatasetApi.middleware,
      nlpTextApi.middleware,
      nlpTokenApi.middleware,
      nlpTokenNerLabelApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
