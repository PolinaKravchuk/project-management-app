import { AlertColor } from '@mui/material';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AppState from 'types/AppState';
import Constants from 'utils/Constants';

const initialState: AppState = {
  isENLanguage: true,
  isPending: false,
  toastLabel: '',
  toastColor: 'info',
  toastMessage: '',
  isModal: false,
  isConfirmModal: false,
  сonfirmModalId: {
    name: '',
    id: '',
  },
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
    openModal(state) {
      state.isModal = true;
    },
    closeModal(state) {
      state.isModal = false;
      state.isConfirmModal = false;
    },
    openConfirmModal(state) {
      state.isConfirmModal = true;
    },
    closeConfirmModal(state) {
      state.isConfirmModal = false;
    },
    currentConfirmModalId(state, action: PayloadAction<{ name: string; id: string }>) {
      state.сonfirmModalId = action.payload;
    },
  },
});

export const {
  requestData,
  receiveData,
  registerErrorMessage,
  registerSuccessMessage,
  changeLang,
  openModal,
  closeModal,
  openConfirmModal,
  closeConfirmModal,
  currentConfirmModalId,
} = appSlice.actions;
export default appSlice;
