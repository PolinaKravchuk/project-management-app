import React, { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './App.css';

import store from 'redux/store';
import { loginUser, logoutUser } from 'redux/appSlice';

import useCheckToken from 'hooks/useCheckToken';

import Toast from 'components/toast/Toast';
import Header from 'components/header/Header';
import Login from 'components/form/login/Login';
import Registration from 'components/form/registration/Registration';

import GlobalState from 'types/GlobalState';

function App() {
  const token = useSelector((state: GlobalState) => state.token);
  const toastMessage = useSelector((state: GlobalState) => state.toastMessage);
  const navigate = useNavigate();

  const checkToken = useCheckToken(token);
  // check if user is logged in already
  useEffect(() => {
    checkToken()
      .then(() => {
        store.dispatch(loginUser(token));
      })
      .catch(() => {
        store.dispatch(logoutUser());
        navigate('/');
      });
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Header />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
      {toastMessage && <Toast />}
    </div>
  );
}

export default App;
