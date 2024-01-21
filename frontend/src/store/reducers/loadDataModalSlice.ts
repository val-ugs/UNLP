import { createSlice } from '@reduxjs/toolkit';

interface LoadDataModalState {
  isActive: boolean;
}

const initialState: LoadDataModalState = {
  isActive: false,
};

export const loadDataModalSlice = createSlice({
  name: 'load-data-modal',
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

export default loadDataModalSlice.reducer;
