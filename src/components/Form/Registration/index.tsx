import React from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import useLogin from 'hooks/useLogin';
import useLogError from 'hooks/useLogError';

import { useAppDispatch } from 'redux/hooks';
import { registerSuccessMessage, requestData } from 'redux/appSlice';

import Header from 'components/Header';
import Form from 'components/Form';

import { UserRegistration } from '../types';
import Constants from 'utils/Constants';
import '../Form.css';

function Registration() {
  const login = useLogin();
  const logError = useLogError();
  const dispatch = useAppDispatch();
  const [t] = useTranslation('common');

  function handleRegister(formData: UserRegistration) {
    dispatch(requestData());
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
      <Header type={Constants.PAGE.WELCOME} />
      <Form type={Constants.FORM_TYPE.REGISTRATION} onSubmit={handleRegister} />
    </>
  );
}

export default Registration;
