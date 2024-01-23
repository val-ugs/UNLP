import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface NlpDatasetState {
  nlpDatasetId: number | undefined;
}

const initialState: NlpDatasetState = {
  nlpDatasetId: 0,
};

export const nlpDatasetSlice = createSlice({
  name: 'nlp-dataset',
  initialState,
  reducers: {
    setNlpDatasetId(state, action: PayloadAction<number>) {
      state.nlpDatasetId = action.payload;
    },
  },
});

export default nlpDatasetSlice.reducer;
