import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GlobalState from 'types/GlobalState';

function PrivateRoute(props: { element: ReactElement }) {
  const isLogged = useSelector((state: GlobalState) => state.isLogged);

  if (!isLogged) {
    return <Navigate to="/" />;
  }

  return props.element;
}
export default PrivateRoute;
