import { AlertColor } from '@mui/material';

export interface ConfirmModal {
  name: string;
  id: string;
  boardId?: string;
  columnId?: string;
}

type AppState = {
  isENLanguage: boolean;
  isPending: boolean;
  toastLabel: string;
  toastColor: AlertColor;
  toastMessage: string;
  isModal: boolean;
  isConfirmModal: boolean;
  сonfirmModalId: ConfirmModal;
};

export default AppState;
