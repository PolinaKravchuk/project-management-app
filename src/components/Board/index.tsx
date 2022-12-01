import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';

import ModalWindow from 'components/Modal';
import Column from 'components/Column';

import { closeModal, openModal, receiveData, requestData } from 'redux/appSlice';
import {
  closeColumnModal,
  closeTaskModal,
  fetchAddColumn,
  fetchAddTask,
  openColumnModal,
} from 'redux/boardSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import './Board.css';
import { TaskBody } from 'types/BoardState';

export default function Board() {
  const [t] = useTranslation('common');
  const { isModal } = useAppSelector((state) => state.app);
  const { token } = useAppSelector((state) => state.auth);
  const { id } = useAppSelector((state) => state.user);
  const { columns, error, orderColumn, isColumnModal, isTaskModal, columnId, orderTask } =
    useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const { _id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ title: string; description?: string }>();

  if (!token) {
    return <Navigate to="/welcome" />;
  }

  const onSubmit = async (value: { title: string; description?: string }) => {
    if (isColumnModal) {
      const columnBody = {
        title: value.title,
        order: orderColumn,
      };
      if (_id) {
        dispatch(requestData());
        dispatch(fetchAddColumn({ _id, token, columnBody })).finally(() => dispatch(receiveData()));
      }
      dispatch(closeColumnModal());
    } else if (isTaskModal) {
      const taskBody: TaskBody = {
        title: value.title,
        order: orderTask,
        description: value.description || '',
        userId: id,
        users: [],
      };
      if (_id) {
        dispatch(requestData());
        dispatch(fetchAddTask({ _id, token, columnId, taskBody })).finally(() =>
          dispatch(receiveData())
        );
      }
      dispatch(closeTaskModal());
    }
    dispatch(closeModal());
    reset();
  };

  const handelAddColumn = () => {
    dispatch(openModal());
    dispatch(openColumnModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    if (isColumnModal) {
      dispatch(closeColumnModal());
    } else if (isTaskModal) {
      dispatch(closeTaskModal());
    }
    reset();
  };

  return (
    <>
      <main className="board-wrapper light-bg-brand main-padding">
        {error && <h2 className="main_error">{t(error)}</h2>}
        <section className="board-body">
          {error
            ? null
            : !!columns.length &&
              columns.map((column) => <Column key={column._id} column={column} />)}
          <button className="board-body__addcard" onClick={handelAddColumn}>
            <span>+</span>
            {t('board.addColumn')}
          </button>
        </section>
      </main>
      {isModal && (
        <ModalWindow>
          {isColumnModal && (
            <form
              className="form light-bg-brand"
              name="create-board"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h3 className="form-title">{t('board.modalCreateTitle')}</h3>
              <div className="input-create-board-err-container">
                <input
                  className="input-create-board"
                  type="text"
                  id="name"
                  {...register('title', {
                    required: {
                      value: true,
                      message: t('form.errorMsg.required'),
                    },
                    minLength: {
                      value: 3,
                      message: t('form.errorMsg.minLength'),
                    },
                  })}
                  placeholder={`${t('main.placeholderTitle')}`}
                />
                {errors.title && (
                  <span className="input-error-msg">
                    <ErrorMessage errors={errors} name="title" />
                  </span>
                )}
              </div>
              <div className="form-button-container">
                <input
                  className="modal__button modal__button_active"
                  type="submit"
                  value={t<string>('form.submit')}
                />
                <input
                  className="modal__button"
                  type="button"
                  value={`${t('form.cancel')}`}
                  onClick={handleCloseModal}
                />
              </div>
            </form>
          )}
          {isTaskModal && (
            <form
              className="form light-bg-brand"
              name="create-board"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h3 className="form-title">{t('task.modalCreateTitle')}</h3>
              <div className="input-create-board-err-container">
                <input
                  className="input-create-board"
                  type="text"
                  id="name"
                  {...register('title', {
                    required: {
                      value: true,
                      message: t('form.errorMsg.required'),
                    },
                    minLength: {
                      value: 3,
                      message: t('form.errorMsg.minLength'),
                    },
                  })}
                  placeholder={`${t('main.placeholderTitle')}`}
                />
                {errors.title && (
                  <span className="input-error-msg">
                    <ErrorMessage errors={errors} name="title" />
                  </span>
                )}
              </div>
              <div className="input-create-board-err-container">
                <input
                  className="input-create-board"
                  id="descrip"
                  {...register('description', {
                    required: {
                      value: true,
                      message: t('form.errorMsg.required'),
                    },
                    minLength: {
                      value: 3,
                      message: t('form.errorMsg.minLength'),
                    },
                  })}
                  placeholder={t<string>('main.placeholderDescription')}
                />
                {errors.description && (
                  <span className="input-error-msg">
                    <ErrorMessage errors={errors} name="description" />
                  </span>
                )}
              </div>
              <div className="form-button-container">
                <input
                  className="modal__button modal__button_active"
                  type="submit"
                  value={t<string>('form.submit')}
                />
                <input
                  className="modal__button"
                  type="button"
                  value={`${t('form.cancel')}`}
                  onClick={handleCloseModal}
                />
              </div>
            </form>
          )}
        </ModalWindow>
      )}
    </>
  );
}
