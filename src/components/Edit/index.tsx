import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Button, TextField } from '@mui/material';

import Toast from 'components/Toast';

import { updateLogin, updatePassword } from 'redux/authSlice';
import { currentConfirmModalId, openConfirmModal, receiveData, requestData } from 'redux/appSlice';
import { getUser, setUserData, updateUser } from 'redux/userSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import useLogSuccess from 'hooks/useLogSuccess';
import useLogError from 'hooks/useLogError';
import './EditProfile.css';

// component is in progress
function EditProfile() {
  const [t] = useTranslation('common');
  const logError = useLogError();
  const logSuccess = useLogSuccess();
  const dispatch = useAppDispatch();

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
    if (!id) {
      dispatch(requestData());
      dispatch(
        getUser({
          id: id || localStorage.getItem('userId') || '',
          token: token || localStorage.getItem('token') || '',
        })
      )
        .then((data) => {
          dispatch(updateLogin(data.payload));
          dispatch(setUserData(data.payload));
          dispatch(updatePassword());
        })
        .finally(() => {
          dispatch(receiveData());
        });
    }
  }, []);

  useEffect(() => {
    setInitialData();
  }, [name, login, password]);

  function setInitialData() {
    setValue('userName', name);
    setValue('userLogin', login);
    setValue('userPassword', password);
  }

  function handleCancel() {
    if (isDirty) {
      logSuccess('edit.resetChages');

      setInitialData();
    }
  }

  function onSubmitForm() {
    const newUserData = watch();
    if (isDirty) {
      dispatch(requestData());

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

          logSuccess('edit.updateSuccess');
        })
        .catch((e) => {
          logError(e);
        })
        .finally(() => {
          dispatch(receiveData());
        });
    }
  }

  function handleDelete() {
    dispatch(openConfirmModal());
    dispatch(currentConfirmModalId({ name: 'edit', id }));
  }

  return (
    <>
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
            <Button
              className="form-button light-txt-brand"
              type="submit"
              variant="outlined"
              disabled={!isDirty}
            >
              {t('form.submit')}
            </Button>
            <Button variant="outlined" onClick={handleCancel} disabled={!isDirty}>
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
