import { AlertColor } from '@mui/material';

type GlobalState = {
  isLogged: boolean;
  isENLanguage: boolean;
  isPending: boolean;
  token: string;
  toastLabel: string;
  toastColor: AlertColor;
  toastMessage: string;
};

export default GlobalState;
