import React, { useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { logoutUser } from 'redux/authSlice';
import { deleteUser } from 'redux/userSlice';
import { fetchRemoveBoard } from 'redux/mainSlice';
import { fetchRemoveColumn } from 'redux/boardSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { closeConfirmModal, currentConfirmModalId, receiveData, requestData } from 'redux/appSlice';
import useCheckToken from 'hooks/useCheckToken';
import useLogError from 'hooks/useLogError';
import useLogSuccess from 'hooks/useLogSuccess';

import Toast from 'components/Toast';
import Header from 'components/Header';
import Login from 'components/Form/Login';
import Registration from 'components/Form/Registration';
import PrivateRoute from 'components/PrivateRoute';
import WelcomePage from 'components/WelcomPage';
import EditProfile from 'components/Edit';
import NotFound from 'components/NotFound';
import Footer from 'components/Footer';
import Main from 'components/Main';
import Board from 'components/Board';
import ModalWindow from 'components/Modal';

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
  const logSuccess = useLogSuccess();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const checkToken = useCheckToken(token);

  // check if user is logged in already
  useEffect(() => {
    checkToken().catch((e) => {
      if (e.response.status === Constants.ERROR_STATUS.EXPIRED) {
        dispatch(logoutUser());
        navigate(`/${Constants.PAGE.WELCOME}`);
      } else {
        navigate(`${location.pathname}`);
      }
    });
  }, []);

  const handelConfirmRemove = () => {
    dispatch(requestData());
    const { name, id, boardId } = сonfirmModalId;
    switch (name) {
      case 'board':
        dispatch(fetchRemoveBoard({ token, id })).finally(() => {
          dispatch(receiveData());
          dispatch(currentConfirmModalId({ name: '', id: '' }));
        });
        break;
      case 'edit':
        dispatch(deleteUser({ id, token }))
          .then(() => {
            logSuccess('edit.removeSuccess');
            dispatch(logoutUser());
            navigate('/welcome');
          })
          .catch((e) => {
            logError(e);
          })
          .finally(() => {
            dispatch(receiveData());
            dispatch(currentConfirmModalId({ name: '', id: '' }));
          });
        break;
      case 'column':
        dispatch(fetchRemoveColumn({ token, _id: id, boardId })).finally(() => {
          dispatch(receiveData());
          dispatch(currentConfirmModalId({ name: '', id: '', boardId: '' }));
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
