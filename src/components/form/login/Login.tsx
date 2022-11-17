import React from 'react';
import '../Form.css';
// redux
import store from 'redux/store';
import { requestData } from 'redux/appSlice';
// custom hook
import useLogin from 'hooks/useLogin';
// components
import Header from 'components/header/Header';
import Form from 'components/form/Form';
// others
import Constants from 'utils/Constants';
import { UserLogin } from 'types/UserData';

function Login() {
  const login = useLogin();

  function handleLogin(formData: UserLogin) {
    store.dispatch(requestData({ isPending: true }));
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
