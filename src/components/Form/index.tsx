import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import { Button, TextField } from '@mui/material';

import { useAppSelector } from 'redux/hooks';
import Toast from 'components/Toast';
import login from 'assets/img/login.png';
import Constants from 'utils/Constants';
import './Form.css';

type FormProps = {
  type: string;
  onSubmit(data: object): void;
};
function Form(props: FormProps) {
  const [t] = useTranslation('common');

  const navigate = useNavigate();
  const toastMessage = useAppSelector((state) => state.app.toastMessage);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  function onSubmitForm() {
    const formData = watch();
    props.onSubmit(formData);

    reset();
  }

  function handleCancel() {
    navigate('/');
  }

  return (
    <>
      <main className="form-container light-bg-brand">
        {props.type === Constants.FORM_TYPE.REGISTRATION ? (
          <h2>{t('header.signUp')}</h2>
        ) : (
          <h2>{t('header.signIn')}</h2>
        )}
        <div className="form-content-container">
          <img className="form-image" src={login} />
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
        </div>
        {toastMessage && <Toast />}
      </main>
    </>
  );
}
export default Form;
