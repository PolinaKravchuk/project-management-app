import { AlertColor } from '@mui/material';

type AppState = {
  isENLanguage: boolean;
  isPending: boolean;
  toastLabel: string;
  toastColor: AlertColor;
  toastMessage: string;
};

export default AppState;
