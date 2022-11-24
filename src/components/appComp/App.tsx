import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';

import './App.css';
import Constants from 'utils/Constants';
import useCheckToken from 'hooks/useCheckToken';
import { authUser, logoutUser } from 'redux/authSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import Toast from 'components/toast/Toast';
import Header from 'components/header/Header';
import Login from 'components/form/login/Login';
import Registration from 'components/form/registration/Registration';
import PrivateRoute from 'components/privateRoute/PrivateRoute';
import WelcomePage from 'components/welcomPage';
import EditProfile from 'components/edit/EditProfile';

function App() {
  const token = useAppSelector((state) => state.app.token);
  const toastMessage = useAppSelector((state) => state.app.toastMessage);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const checkToken = useCheckToken(token);
  // check if user is logged in already
  useEffect(() => {
    checkToken()
      .then(() => {
        dispatch(authUser(token));
      })
      .catch(() => {
        dispatch(logoutUser());
        navigate('/');
      });
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="welcome" element={<WelcomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/main"
          element={<PrivateRoute element={<Header type={Constants.PAGE.MAIN} />}></PrivateRoute>}
        />
        <Route path="/edit" element={<PrivateRoute element={<EditProfile />}></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {toastMessage && <Toast />}
    </div>
  );
}

export default App;
