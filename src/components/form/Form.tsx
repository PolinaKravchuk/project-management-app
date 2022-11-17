import React from 'react';
import axios from 'axios';
import { Button, CircularProgress, TextField } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';

import store from 'redux/store';
import {
  loginUser,
  receiveData,
  registerErrorMessage,
  registerSuccessMessage,
  requestData,
} from 'redux/appSlice';

import Constants from 'utils/Constants';
import Toast from 'components/toast/Toast';
import './Form.css';
import { useSelector } from 'react-redux';
import GlobalState from 'types/GlobalState';

type FormProps = {
  type: string;
};
function Form(props: FormProps) {
  const [t] = useTranslation('common');

  const navigate = useNavigate();
  const toastMessage = useSelector((state: GlobalState) => state.toastMessage);
  const isPending = useSelector((state: GlobalState) => state.isPending);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  function onSubmitForm() {
    const formData = watch();

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
          store.dispatch(registerErrorMessage({ message: '' }));
        }, 3000);
      })
      .catch((e) => {
        store.dispatch(receiveData({ isPending: false }));

        const message = e.message;
        store.dispatch(registerErrorMessage({ message: message }));
        setTimeout(function () {
          store.dispatch(registerErrorMessage({ message: '' }));
        }, 3000);
      });
    reset();
  }

  function handleCancel() {
    navigate('/');
  }

  return (
    <>
      {isPending && <CircularProgress className="busy-indicator" />}
      <main className="form-container light-bg-brand">
        {props.type === Constants.FORM_TYPE.REGISTRATION ? (
          <h2>{t('header.signUp')}</h2>
        ) : (
          <h2>{t('header.signIn')}</h2>
        )}
        <form className="form" onSubmit={handleSubmit(onSubmitForm)}>
          {props.type === Constants.FORM_TYPE.REGISTRATION && (
            <div>
              <TextField
                id="outlined-name"
                variant="standard"
                className="form-input"
                label={t('form.name')}
                type="text"
                {...register('name', {
                  required: {
                    value: true,
                    message: t('form.errorMsg.required'),
                  },
                  minLength: {
                    value: 3,
                    message: t('form.errorMsg.minLength'),
                  },
                  maxLength: {
                    value: 20,
                    message: t('form.errorMsg.maxNameLength'),
                  },
                })}
              />
              <br />
              <span className="input-error-msg">
                <ErrorMessage errors={errors} name="name" />
              </span>
            </div>
          )}
          <br />

          <div>
            <TextField
              id="outlined-login"
              variant="standard"
              className="form-input"
              label={t('form.login')}
              type="text"
              {...register('login', {
                required: {
                  value: true,
                  message: t('form.errorMsg.required'),
                },
                minLength: {
                  value: 3,
                  message: t('form.errorMsg.minLength'),
                },
                maxLength: {
                  value: 15,
                  message: t('form.errorMsg.maxLoginPassLength'),
                },
              })}
            />
            <br />
            <span className="input-error-msg">
              <ErrorMessage errors={errors} name="login" />
            </span>
          </div>

          <br />
          <div>
            <TextField
              id="outlined-password"
              variant="standard"
              className="form-input"
              label={t('form.password')}
              type="password"
              {...register('password', {
                required: {
                  value: true,
                  message: t('form.errorMsg.required'),
                },
                minLength: {
                  value: 3,
                  message: t('form.errorMsg.minLength'),
                },
                maxLength: {
                  value: 15,
                  message: t('form.errorMsg.maxLoginPassLength'),
                },
              })}
            />
            <br />
            <span className="input-error-msg">
              <ErrorMessage errors={errors} name="password" />
            </span>
          </div>
          <br />
          <div className="form-buttons">
            <Button className="form-button light-txt-brand" type="submit" variant="outlined">
              {t('form.submit')}
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              {t('form.cancel')}
            </Button>
          </div>
        </form>
        {toastMessage && <Toast />}
      </main>
    </>
  );
}
export default Form;
