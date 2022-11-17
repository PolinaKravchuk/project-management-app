import React from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import '../Form.css';
// redux
import store from 'redux/store';
import { registerSuccessMessage, requestData } from 'redux/appSlice';
// custom hooks
import useLogin from 'hooks/useLogin';
import useLogError from 'hooks/useLogError';
// components
import Header from 'components/header/Header';
import Form from 'components/form/Form';
// others
import { UserRegistration } from 'types/UserData';
import Constants from 'utils/Constants';

function Registration() {
  const login = useLogin();
  const logError = useLogError();
  const [t] = useTranslation('common');

  function handleRegister(formData: UserRegistration) {
    store.dispatch(requestData({ isPending: true }));
    axios
      .post(Constants.APP_URL + Constants.AUTH_API.SIGN_UP, formData)
      .then(() => login(formData))
      .then(() => {
        store.dispatch(registerSuccessMessage({ message: t('form.successMsg.accountCreated') }));
        setTimeout(function () {
          store.dispatch(registerSuccessMessage({ message: '' }));
        }, 3000);
      })
      .catch((e) => {
        logError(e);
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
