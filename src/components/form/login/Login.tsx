import React from 'react';

import useLogin from 'hooks/useLogin';

import Header from 'components/header/Header';
import Form from 'components/form/Form';

import Constants from 'utils/Constants';
import { UserLogin } from 'types/UserData';
import '../Form.css';

function Login() {
  const login = useLogin();

  function handleLogin(formData: UserLogin) {
    login(formData);
  }

  return (
    <>
      <Header type={Constants.PAGE.WELCOME} />
      <Form type={Constants.FORM_TYPE.LOGIN} onSubmit={handleLogin} />
    </>
  );
}

export default Login;
