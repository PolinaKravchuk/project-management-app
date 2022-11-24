import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Button, TextField } from '@mui/material';

import Header from 'components/header/Header';
import Toast from 'components/toast/Toast';

import { logoutUser, updateLogin } from 'redux/authSlice';
import { receiveData, requestData } from 'redux/appSlice';
import { deleteUser, setUserData, updateUser } from 'redux/userSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import useLogError from 'hooks/useLogError';
import './EditProfile.css';
import { useNavigate } from 'react-router-dom';

// component is in progress
function EditProfile() {
  const [t] = useTranslation('common');
  const logError = useLogError();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, login, password } = useAppSelector((state) => state.auth);
  const { id, name } = useAppSelector((state) => state.user);
  const { toastMessage } = useAppSelector((state) => state.app);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty, errors },
  } = useForm();

  useEffect(() => {
    setInitialData();
  }, [name, login, password]);

  function setInitialData() {
    setValue('userName', name);
    setValue('userLogin', login);
    setValue('userPassword', password);
  }

  function handleCancel() {
    setInitialData();
  }

  function onSubmitForm() {
    const newUserData = watch();
    if (isDirty) {
      dispatch(requestData({ isPending: true }));

      const params = {
        id: id,
        token,
        payload: {
          name: newUserData.userName,
          login: newUserData.userLogin,
          password: newUserData.userPassword,
        },
      };

      dispatch(updateUser(params))
        .then((data) => {
          dispatch(updateLogin(data.payload));
          dispatch(setUserData(data.payload));
        })
        .catch((e) => {
          logError(e);
        })
        .finally(() => {
          dispatch(receiveData({ isPending: false }));
        });
    }
  }

  function handleDelete() {
    // TODO: show confirmation modal window

    dispatch(requestData({ isPending: true }));

    dispatch(deleteUser({ id, token }))
      .then(() => {
        dispatch(logoutUser());
        navigate('/');
      })
      .catch((e) => {
        logError(e);
      })
      .finally(() => {
        dispatch(receiveData({ isPending: false }));
      });
  }

  return (
    <>
      <Header />
      <main className="edit-profile-main light-bg-brand">
        <h2>{t('edit.title')}</h2>
        <form className="form" onSubmit={handleSubmit(onSubmitForm)}>
          <div className="form-content">
            <div className="form-field-container">
              <TextField
                id="outlined-name"
                variant="standard"
                className="form-input"
                label={t('form.name')}
                type="text"
                {...register('userName', {
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
                <ErrorMessage errors={errors} name="userName" />
              </span>
            </div>

            <div className="form-field-container">
              <TextField
                id="outlined-login"
                variant="standard"
                className="form-input"
                label={t('form.login')}
                type="text"
                {...register('userLogin', {
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
                <ErrorMessage errors={errors} name="userLogin" />
              </span>
            </div>

            <div className="form-field-container">
              <TextField
                id="outlined-password"
                variant="standard"
                className="form-input"
                label={t('form.password')}
                type="password"
                disabled={true}
                {...register('userPassword')}
              />
              <br />
              <span className="input-error-msg">
                <ErrorMessage errors={errors} name="userPassword" />
              </span>
            </div>
          </div>
          <div className="form-buttons">
            <Button className="form-button light-txt-brand" type="submit" variant="outlined">
              {t('form.submit')}
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              {t('form.cancel')}
            </Button>
            <Button color="error" variant="outlined" onClick={handleDelete}>
              {t('form.delete')}
            </Button>
          </div>
        </form>
        {toastMessage && <Toast />}
      </main>
    </>
  );
}
export default EditProfile;
