import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../Form.css';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import store from 'redux/store';
import {
  loginUser,
  receiveData,
  registerErrorMessage,
  registerSuccessMessage,
  requestData,
} from 'redux/appSlice';

import Header from 'components/header/Header';
import Form from 'components/form/Form';

import Constants from 'utils/Constants';
import { UserRegistration } from 'types/UserData';

function Registration() {
  const navigate = useNavigate();
  const [t] = useTranslation('common');
  function handleRegister(formData: UserRegistration) {
    store.dispatch(requestData({ isPending: true }));
    axios
      .post(Constants.APP_URL + Constants.AUTH_API.SIGN_UP, formData)
      .then(() =>
        axios.post(Constants.APP_URL + Constants.AUTH_API.SIGN_IN, {
          login: formData.login,
          password: formData.password,
        })
      )
      .then((res) => {
        store.dispatch(receiveData({ isPending: false }));

        const token = res.data.token;
        store.dispatch(loginUser({ token: token }));
        store.dispatch(registerSuccessMessage({ message: t('form.successMsg.accountCreated') }));
        setTimeout(function () {
          store.dispatch(registerSuccessMessage({ message: '' }));
        }, 3000);
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
      <Form type={Constants.FORM_TYPE.REGISTRATION} onSubmit={handleRegister} />
    </>
  );
}

export default Registration;
