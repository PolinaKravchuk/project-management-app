import { AlertColor } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';
import AppState from 'types/AppState';
import Constants from 'utils/Constants';

const initialState: AppState = {
  isENLanguage: true,
  isPending: false,
  toastLabel: '',
  toastColor: 'info',
  toastMessage: '',
};
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    requestData: (state, action) => {
      state.isPending = action.payload.isPending;
    },
    receiveData: (state, action) => {
      state.isPending = action.payload.isPending;
    },
    registerErrorMessage: (state, action) => {
      state.toastLabel = action.payload.label;
      state.toastColor = Constants.TOAST_TYPE.ERROR as AlertColor;
      state.toastMessage = action.payload.message;
    },
    registerSuccessMessage: (state, action) => {
      state.toastLabel = action.payload.label;
      state.toastColor = Constants.TOAST_TYPE.SUCCESS as AlertColor;
      state.toastMessage = action.payload.message;
    },

    changeLang: (state, action) => {
      state.isENLanguage = action.payload.lang;
    },
  },
});

export const {
  requestData,
  receiveData,
  registerErrorMessage,
  registerSuccessMessage,
  changeLang,
} = appSlice.actions;
export default appSlice;
