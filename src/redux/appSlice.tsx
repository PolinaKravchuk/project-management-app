import { createSlice } from '@reduxjs/toolkit';
import GlobalState from 'types/GlobalState';

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
      state.toastLabel = 'Error';
      state.toastColor = 'error';
      state.toastMessage = action.payload.message;
    },
    registerSuccessMessage: (state, action) => {
      state.toastLabel = 'Success';
      state.toastColor = 'success';
      state.toastMessage = action.payload.message;
    },
    loginUser: (state, action) => {
      state.isLogged = true;
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
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
  changeLang,
} = appSlice.actions;
export default appSlice;
