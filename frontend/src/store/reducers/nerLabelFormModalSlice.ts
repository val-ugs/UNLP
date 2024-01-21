import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NerLabelProps } from 'interfaces/nerLabel.interface';

interface NerLabelFormModalState {
  isActive: boolean;
  nlpDatasetId: number;
  nerLabel?: NerLabelProps;
}

const initialState: NerLabelFormModalState = {
  isActive: false,
  nlpDatasetId: 0,
  nerLabel: undefined,
};

export const nerLabelFormModalSlice = createSlice({
  name: 'ner-label-form-modal',
  initialState,
  reducers: {
    activate(state, action: PayloadAction<any>) {
      state.isActive = true;
      state.nlpDatasetId = action.payload.nlpDatasetId;
      state.nerLabel = action.payload.nerLabel;
    },
    deactivate(state) {
      state.isActive = false;
    },
  },
});

export default nerLabelFormModalSlice.reducer;
