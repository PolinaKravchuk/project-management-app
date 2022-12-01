import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';

function PrivateRoute(props: { element: ReactElement }) {
  const { token } = useAppSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/welcome" />;
  }

  return props.element;
}
export default PrivateRoute;
