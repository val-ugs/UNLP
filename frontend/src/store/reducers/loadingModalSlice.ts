import { createSlice } from '@reduxjs/toolkit';

interface LoadingModalState {
  isActive: boolean;
}

const initialState: LoadingModalState = {
  isActive: false,
};

export const loadingModalSlice = createSlice({
  name: 'loading-modal',
  initialState,
  reducers: {
    activate(state) {
      state.isActive = true;
    },
    deactivate(state) {
      state.isActive = false;
    },
  },
});

export default loadingModalSlice.reducer;
