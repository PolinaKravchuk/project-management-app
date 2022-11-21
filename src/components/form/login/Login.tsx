import React from 'react';
import '../Form.css';

import useLogin from 'hooks/useLogin';
import { useAppDispatch } from 'redux/hooks';
import { requestData } from 'redux/authSlice';

import Header from 'components/header/Header';
import Form from 'components/form/Form';

import Constants from 'utils/Constants';
import { UserLogin } from 'types/UserData';

function Login() {
  const login = useLogin();
  const dispatch = useAppDispatch();

  function handleLogin(formData: UserLogin) {
    dispatch(requestData({ isPending: true }));
    login(formData);
  }

  return (
    <>
      <Header />
      <Form type={Constants.FORM_TYPE.LOGIN} onSubmit={handleLogin} />
    </>
  );
}

export default Login;
