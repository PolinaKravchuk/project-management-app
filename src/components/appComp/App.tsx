import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { fetchRemoveBoard } from 'redux/mainSlice';
import { deleteUser } from 'redux/userSlice';
import { logoutUser } from 'redux/authSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { closeConfirmModal, currentConfirmModalId, receiveData, requestData } from 'redux/appSlice';
import useCheckToken from 'hooks/useCheckToken';
import useLogError from 'hooks/useLogError';

import Toast from 'components/toast/Toast';
import Header from 'components/header/Header';
import Login from 'components/form/login/Login';
import Registration from 'components/form/registration/Registration';
import PrivateRoute from 'components/privateRoute/PrivateRoute';
import WelcomePage from 'components/welcomPage';
import EditProfile from 'components/edit/EditProfile';
import NotFound from 'components/notFound/NotFound';
import Footer from 'components/Footer';
import Main from 'components/main';
import Board from 'components/board';
import ModalWindow from 'components/modal';

import Constants from 'utils/Constants';
import './App.css';

function App() {
  const { toastMessage, isPending, isConfirmModal, сonfirmModalId } = useAppSelector(
    (state) => state.app
  );
  const { token } = useAppSelector((state) => state.auth) || localStorage.getItem('token');
  const { handleSubmit } = useForm();
  const [t] = useTranslation('common');
  const logError = useLogError();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const checkToken = useCheckToken(token);

  // check if user is logged in already
  useEffect(() => {
    checkToken().catch((e) => {
      if (e.response.status === Constants.ERROR_STATUS.EXPIRED) {
        dispatch(logoutUser());
      }
      if (location.pathname !== `/${Constants.PAGE.WELCOME}` && location.pathname !== '/') {
        navigate(`/${Constants.PAGE.NOT_FOUND}`);
      } else {
        navigate(`/${Constants.PAGE.WELCOME}`);
      }
    });
  }, []);

  const handelConfirmRemove = () => {
    dispatch(requestData({ isPending: true }));
    const { name, id } = сonfirmModalId;
    switch (name) {
      case 'board':
        dispatch(fetchRemoveBoard({ token, id })).finally(() => {
          dispatch(receiveData({ isPending: false }));
          dispatch(currentConfirmModalId({ name: '', id: '' }));
        });
        break;
      case 'edit':
        dispatch(deleteUser({ id, token }))
          .then(() => {
            dispatch(logoutUser());
            navigate('/welcome');
          })
          .catch((e) => {
            logError(e);
          })
          .finally(() => {
            dispatch(receiveData({ isPending: false }));
            dispatch(currentConfirmModalId({ name: '', id: '' }));
          });
        break;
    }
    dispatch(closeConfirmModal());
  };

  const handleCloseConfirmModal = () => {
    dispatch(closeConfirmModal());
  };

  return (
    <div className="App">
      {isPending && <CircularProgress className="busy-indicator" />}

      <Routes>
        <Route path="/" element={<Navigate to="/welcome" />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route
          path="/404"
          element={
            <>
              <Header type={Constants.PAGE.NOT_FOUND} />
              <NotFound />
            </>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route
          path="/main"
          element={
            <PrivateRoute
              element={
                <>
                  <Header type={Constants.PAGE.MAIN} />
                  <Main />
                  <Footer />
                </>
              }
            ></PrivateRoute>
          }
        />
        <Route
          path="/board/:_id"
          element={
            <PrivateRoute
              element={
                <>
                  <Header type={Constants.PAGE.BOARD} />
                  <Board />
                  <Footer />
                </>
              }
            ></PrivateRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <PrivateRoute
              element={
                <>
                  <Header type={Constants.PAGE.EDIT} />
                  <EditProfile />
                  <Footer />
                </>
              }
            ></PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      {toastMessage && <Toast />}
      {isConfirmModal && (
        <ModalWindow>
          <form
            className="form light-bg-brand"
            name="create-board"
            onSubmit={handleSubmit(handelConfirmRemove)}
          >
            <h3 className="form-title form-title_confirm">{t('main.modalConfirm')}?</h3>
            <div className="form-button-container">
              <input
                className="modal__button modal__button_active"
                type="submit"
                value={t<string>('form.delete')}
              />
              <input
                className="modal__button"
                type="button"
                onClick={handleCloseConfirmModal}
                value={t<string>('form.cancel')}
              />
            </div>
          </form>
        </ModalWindow>
      )}
    </div>
  );
}

export default App;
