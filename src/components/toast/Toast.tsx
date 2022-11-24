import React from 'react';
import { Alert, AlertTitle } from '@mui/material';
import { useAppSelector } from 'redux/hooks';

import './Toast.css';

const Toast = function () {
  const label = useAppSelector((state) => state.app.toastLabel);
  const color = useAppSelector((state) => state.app.toastColor);
  const message = useAppSelector((state) => state.app.toastMessage);

  return (
    <Alert className="message-toast" severity={color}>
      <AlertTitle>{label}</AlertTitle>
      {message}
    </Alert>
  );
};
export default Toast;
