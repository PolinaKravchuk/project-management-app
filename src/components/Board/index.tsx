import React, { SyntheticEvent, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';

import ModalWindow from 'components/Modal';
import Column from 'components/Column';

import {
  closeModal,
  currentConfirmModalId,
  openConfirmModal,
  openModal,
  receiveData,
  requestData,
} from 'redux/appSlice';
import { fetchAddColumn, fetchGetColumns } from 'redux/boardSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import boardAvatar from 'assets/img/boardAvatar.png';
import './Board.css';
import { getUser } from 'redux/userSlice';

export default function Board() {
  const [t] = useTranslation('common');
  const { isModal } = useAppSelector((state) => state.app);
  const { token } = useAppSelector((state) => state.auth);
  const { boards } = useAppSelector((state) => state.main);
  const { name } = useAppSelector((state) => state.user);
  const { columns, error, order } = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const { _id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{ title: string }>();

  useEffect(() => {
    if (_id) {
      dispatch(requestData());
      dispatch(fetchGetColumns({ _id, token })).finally(() => dispatch(receiveData()));
    }
  }, []);
  const board = boards.find((board) => board._id === _id);

  useEffect(() => {
    if (board) {
      dispatch(requestData());
      dispatch(getUser({ id: board?.owner, token: token })).finally(() => dispatch(receiveData()));
    }
  }, []);

  if (!token) {
    return <Navigate to="/welcome" />;
  }

  const columnsSort = columns.filter((column) => column.boardId === _id);

  const onSubmit = async (value: { title: string }) => {
    const columnBody = {
      title: value.title,
      order,
    };
    if (_id) {
      dispatch(requestData());
      dispatch(fetchAddColumn({ _id, token, columnBody })).finally(() => dispatch(receiveData()));
    }
    dispatch(closeModal());
    reset();
  };

  const handelAddColumn = () => {
    dispatch(openModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    reset();
  };

  const handelRemoveColumn = (e: SyntheticEvent, id: string, boardId: string) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    if (!target?.classList.contains('remove__img')) {
      return;
    }
    dispatch(openConfirmModal());
    dispatch(currentConfirmModalId({ name: 'column', id, boardId }));
  };

  return (
    <>
      <main className="board-wrapper light-bg-brand main-padding">
        <div className="board-header">
          <div className="board-header-avatar">
            <img src={boardAvatar} alt="avatar" />
          </div>
          <div className="board-header-desc">
            <div>
              <h2>{board?.title} </h2>
              <span className="board-id">{_id}</span>
              <p></p>
            </div>
            <p>{board?.description}</p>
            <p>
              <strong>{t('board.createdBy')}</strong>
              {name}
            </p>
          </div>
        </div>
        {error && <h2 className="main_error">{t(error)}</h2>}
        <section className="board-body">
          {error
            ? null
            : !!columnsSort.length &&
              columnsSort.map((column) => {
                return (
                  <div
                    key={column._id}
                    className="board-body__column"
                    onClick={(e) => handelRemoveColumn(e, column._id, column.boardId)}
                  >
                    <Column column={column} />
                  </div>
                );
              })}
          <button className="board-body__addcard" onClick={handelAddColumn}>
            <span>+</span>
            {t('board.addColumn')}
          </button>
        </section>
      </main>
      {isModal && (
        <ModalWindow>
          <form
            className="form light-bg-brand"
            name="create-board"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h3 className="form-title">{t('main.modalCreateTitle')}</h3>
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
        </ModalWindow>
      )}
    </>
  );
}
