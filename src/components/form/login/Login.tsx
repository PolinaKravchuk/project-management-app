import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Form.css';
import axios from 'axios';

import store from 'redux/store';
import { loginUser, receiveData, registerErrorMessage, requestData } from 'redux/appSlice';

import Header from 'components/header/Header';
import Form from 'components/form/Form';

import Constants from 'utils/Constants';
import { UserLogin } from 'types/UserData';

function Login() {
  const navigate = useNavigate();

  function handleLogin(formData: UserLogin) {
    store.dispatch(requestData({ isPending: true }));
    axios
      .post(Constants.APP_URL + Constants.AUTH_API.SIGN_IN, {
        login: formData.login,
        password: formData.password,
      })
      .then((res) => {
        store.dispatch(receiveData({ isPending: false }));

        const token = res.data.token;
        store.dispatch(loginUser({ token: token }));
        navigate('/main');
      })
      .catch((e) => {
        store.dispatch(receiveData({ isPending: false }));

        const message = e.message;
        store.dispatch(registerErrorMessage({ message: message }));
        setTimeout(function () {
          store.dispatch(registerErrorMessage({ message: '' }));
        }, 3000);
      });
  }
  return (
    <>
      <Header />
      <Form type={Constants.FORM_TYPE.LOGIN} onSubmit={handleLogin} />
    </>
  );
}

export default Login;
