import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';

interface NlpTokenSettingsModalState {
  isActive: boolean;
  nlpDataset: NlpDatasetProps | undefined;
}

const initialState: NlpTokenSettingsModalState = {
  isActive: false,
  nlpDataset: undefined,
};

export const nlpTokenSettingsModalSlice = createSlice({
  name: 'nlp-token-settings-modal',
  initialState,
  reducers: {
    activate(state, action: PayloadAction<NlpDatasetProps>) {
      state.isActive = true;
      state.nlpDataset = action.payload;
    },
    deactivate(state) {
      state.isActive = false;
    },
  },
});

export default nlpTokenSettingsModalSlice.reducer;
