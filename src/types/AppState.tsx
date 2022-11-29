import { AlertColor } from '@mui/material';

type AppState = {
  isENLanguage: boolean;
  isPending: boolean;
  toastLabel: string;
  toastColor: AlertColor;
  toastMessage: string;
  isConfirmModal: boolean;
  сonfirmModalId: { 
    name: string;
    id: string;
   };
};

export default AppState;
