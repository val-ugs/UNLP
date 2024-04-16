import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HuggingFaceModelType } from 'interfaces/huggingFaceModel.interface';

interface MetricModalState {
  isActive: boolean;
  modelType?: HuggingFaceModelType;
}

const initialState: MetricModalState = {
  isActive: false,
  modelType: undefined,
};

export const metricModalSlice = createSlice({
  name: 'metric-modal',
  initialState,
  reducers: {
    activate(state, action: PayloadAction<any>) {
      state.isActive = true;
      state.modelType = action.payload;
    },
    deactivate(state) {
      state.isActive = false;
    },
  },
});

export default metricModalSlice.reducer;
