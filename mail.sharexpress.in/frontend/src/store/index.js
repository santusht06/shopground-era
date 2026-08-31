import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import mailReducer from './mailSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mail: mailReducer,
    ui: uiReducer,
  },
});

export default store;
