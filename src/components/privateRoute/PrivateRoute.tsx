import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';

function PrivateRoute(props: { element: ReactElement }) {
  const isLogged = useAppSelector((state) => state.app.isLogged);

  if (!isLogged) {
    return <Navigate to="/" />;
  }

  return props.element;
}
export default PrivateRoute;
