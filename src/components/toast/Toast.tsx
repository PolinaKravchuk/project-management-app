import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { useAppSelector } from 'redux/hooks';

import './Toast.css';

const Toast = function () {
  const { toastLabel, toastColor, toastMessage } = useAppSelector((state) => state.app);

  return (
    <Alert className="message-toast" severity={toastColor}>
      <AlertTitle>{toastLabel}</AlertTitle>
      {toastMessage}
    </Alert>
  );
};
export default Toast;
