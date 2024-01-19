import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { NlpDatasetProps } from 'interfaces/nlpDataset.interface';

interface NlpDatasetState {
  nlpDataset: NlpDatasetProps | undefined;
}

const initialState: NlpDatasetState = {
  nlpDataset: undefined,
};

export const nlpDatasetSlice = createSlice({
  name: 'nlp-dataset',
  initialState,
  reducers: {
    setNlpDataset(state, action: PayloadAction<NlpDatasetProps>) {
      state.nlpDataset = action.payload;
    },
  },
});

export default nlpDatasetSlice.reducer;
