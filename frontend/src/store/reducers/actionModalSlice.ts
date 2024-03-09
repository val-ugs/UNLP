import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ActionModalState {
  isActive: boolean;
  actionName?: string;
}

const initialState: ActionModalState = {
  isActive: false,
  actionName: undefined,
};

export const actionModalSlice = createSlice({
  name: 'action-modal',
  initialState,
  reducers: {
    activate(state, action: PayloadAction<any>) {
      state.isActive = true;
      state.actionName = action.payload;
    },
    deactivate(state) {
      state.isActive = false;
    },
  },
});

export default actionModalSlice.reducer;
