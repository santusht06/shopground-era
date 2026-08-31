import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isComposeOpen: false,
  composeData: {
    to: [],
    cc: [],
    bcc: [],
    subject: '',
    body: '',
  },
  isAdminPanelOpen: false,
  toast: null, // { message: string, type: 'success' | 'error' | 'info' }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openCompose(state, action) {
      state.isComposeOpen = true;
      if (action.payload) {
        state.composeData = { ...state.composeData, ...action.payload };
      } else {
        state.composeData = { to: [], cc: [], bcc: [], subject: '', body: '' };
      }
    },
    closeCompose(state) {
      state.isComposeOpen = false;
      state.composeData = { to: [], cc: [], bcc: [], subject: '', body: '' };
    },
    toggleAdminPanel(state) {
      state.isAdminPanelOpen = !state.isAdminPanelOpen;
    },
    setAdminPanel(state, action) {
      state.isAdminPanelOpen = action.payload;
    },
    showToast(state, action) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    }
  },
});

export const {
  openCompose,
  closeCompose,
  toggleAdminPanel,
  setAdminPanel,
  showToast,
  clearToast
} = uiSlice.actions;

export default uiSlice.reducer;
