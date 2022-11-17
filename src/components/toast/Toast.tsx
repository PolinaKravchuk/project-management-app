import React from 'react';
import { useSelector } from 'react-redux';
import { Alert, AlertTitle } from '@mui/material';
import GlobalState from 'types/GlobalState';

import './Toast.css';

const Toast = function () {
  const label = useSelector((state: GlobalState) => state.toastLabel);
  const color = useSelector((state: GlobalState) => state.toastColor);
  const message = useSelector((state: GlobalState) => state.toastMessage);

  return (
    <Alert className="message-toast" severity={color}>
      <AlertTitle>{label}</AlertTitle>
      {message}
    </Alert>
  );
};
export default Toast;
