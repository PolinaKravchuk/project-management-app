import React from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import '../Form.css';

import store from 'redux/store';
import { registerSuccessMessage, requestData } from 'redux/authSlice';

import useLogin from 'hooks/useLogin';
import useLogError from 'hooks/useLogError';

import Header from 'components/header/Header';
import Form from 'components/form/Form';

import { UserRegistration } from 'types/UserData';
import Constants from 'utils/Constants';
import { useAppDispatch } from 'redux/hooks';

function Registration() {
  const login = useLogin();
  const logError = useLogError();
  const dispatch = useAppDispatch();
  const [t] = useTranslation('common');

  function handleRegister(formData: UserRegistration) {
    dispatch(requestData({ isPending: true }));
    axios
      .post(Constants.APP_URL + Constants.AUTH_API.SIGN_UP, formData)
      .then(() => login(formData))
      .then(() => {
        dispatch(
          registerSuccessMessage({
            message: t('form.successMsg.accountCreated'),
            label: t('toast.successLabel'),
          })
        );
        setTimeout(function () {
          dispatch(registerSuccessMessage({ message: '' }));
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
