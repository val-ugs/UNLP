import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { HuggingFaceModelProps } from 'interfaces/huggingFaceModel.interface';

interface HuggingFaceModelFormModalState {
  isActive: boolean;
  huggingFaceModel?: HuggingFaceModelProps;
}

const initialState: HuggingFaceModelFormModalState = {
  isActive: false,
  huggingFaceModel: undefined,
};

export const huggingFaceModelFormModalSlice = createSlice({
  name: 'hugging-face-model-form-modal',
  initialState,
  reducers: {
    activate(state, action: PayloadAction<any>) {
      state.isActive = true;
      state.huggingFaceModel = action.payload.huggingFaceModel;
    },
    deactivate(state) {
      state.isActive = false;
    },
  },
});

export default huggingFaceModelFormModalSlice.reducer;
