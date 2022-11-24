import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Button, TextField } from '@mui/material';

import Header from 'components/header/Header';
import Toast from 'components/toast/Toast';

import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchUser } from 'redux/userSlice';
import './EditProfile.css';

// component is in progress
function EditProfile() {
  const [t] = useTranslation('common');

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.userId);
  const [toastMessage, setToastMessage] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, []);

  function onSubmitForm() {
    handleReset();

    const userId = '123';
    dispatch(fetchUser(userId));
  }

  function handleReset() {
    reset();
  }
  return (
    <>
      <Header />

      <main className="edit-profile-main light-bg-brand">
        <h2>{t('edit.title')}</h2>
        <form className="form" onSubmit={handleSubmit(onSubmitForm)}>
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
            <Button variant="outlined" onClick={handleReset}>
              {t('form.reset')}
            </Button>
          </div>
        </form>
        {toastMessage && <Toast />}
      </main>
    </>
  );
}
export default EditProfile;
