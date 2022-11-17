import { AlertColor } from '@mui/material';
import { createSlice } from '@reduxjs/toolkit';
import GlobalState from 'types/GlobalState';
import Constants from 'utils/Constants';

const initialState: GlobalState = {
  isLogged: false,
  isENLanguage: true,
  isPending: false,
  token: localStorage.getItem('token') || '',
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
    loginUser: (state, action) => {
      state.isLogged = true;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
    },
    logoutUser: (state) => {
      state.isLogged = false;
      state.token = '';
      localStorage.setItem('token', '');
    },
    changeLang: (state, action) => {
      state.isENLanguage = action.payload.lang;
    },
  },
});

export const isPending = (state: GlobalState) => state.isPending;
export const {
  requestData,
  receiveData,
  registerErrorMessage,
  registerSuccessMessage,
  loginUser,
  logoutUser,
  changeLang,
} = appSlice.actions;
export default appSlice;
