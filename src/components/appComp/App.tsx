import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import Constants from 'utils/Constants';

import { logoutUser } from 'redux/authSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import useCheckToken from 'hooks/useCheckToken';

import Toast from 'components/toast/Toast';
import Header from 'components/header/Header';
import Login from 'components/form/login/Login';
import Registration from 'components/form/registration/Registration';
import PrivateRoute from 'components/privateRoute/PrivateRoute';
import WelcomePage from 'components/welcomPage';
import EditProfile from 'components/edit/EditProfile';
import NotFound from 'components/notFound/NotFound';
import './App.css';

function App() {
  const { toastMessage, isPending } = useAppSelector((state) => state.app);
  const { token } = useAppSelector((state) => state.auth) || localStorage.getItem('token');

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const checkToken = useCheckToken(token);

  // check if user is logged in already
  useEffect(() => {
    checkToken().catch(() => {
      dispatch(logoutUser());
      if (location.pathname !== `/${Constants.PAGE.WELCOME}`) {
        navigate(`/${Constants.PAGE.NOT_FOUND}`);
      } else {
        navigate(`/${Constants.PAGE.WELCOME}`);
      }
    });
  }, []);

  return (
    <div className="App">
      {isPending && <CircularProgress className="busy-indicator" />}

      <Routes>
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/main"
          element={<PrivateRoute element={<Header type={Constants.PAGE.MAIN} />}></PrivateRoute>}
        />
        <Route path="/edit" element={<PrivateRoute element={<EditProfile />}></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      {toastMessage && <Toast />}
    </div>
  );
}

export default App;
