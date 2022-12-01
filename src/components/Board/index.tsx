import React, { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import update from 'immutability-helper';

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
import { getUser } from 'redux/userSlice';
import { fetchAddColumn, fetchGetColumns, updateColumns } from 'redux/boardSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import { TColumn } from 'types/BoardState';
import boardAvatar from 'assets/img/boardAvatar.png';
import './Board.css';

export default function Board() {
  const { _id } = useParams();
  const [t] = useTranslation('common');
  const dispatch = useAppDispatch();
  const { isModal } = useAppSelector((state) => state.app);
  const { token } = useAppSelector((state) => state.auth);
  const { boards } = useAppSelector((state) => state.main);
  const { name } = useAppSelector((state) => state.user);
  const { columns, error, order } = useAppSelector((state) => state.board);

  const board = boards.find((board) => board._id === _id);
  const [dndColumns, setDndColumns] = useState([] as TColumn[]);
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
  }, [_id]); //if change board id -> trigger useEffect

  useEffect(() => {
    setDndColumns(columns);
  }, [columns]);

  useEffect(() => {
    if (board) {
      dispatch(updateColumns([]));

      dispatch(requestData());
      dispatch(getUser({ id: board?.owner, token: token })).finally(() => dispatch(receiveData()));
    }
  }, [_id]);

  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    setDndColumns((prevColumn: TColumn[]) =>
      update(prevColumn, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevColumn[dragIndex] as TColumn],
        ],
      })
    );
  }, []);

  if (!token) {
    return <Navigate to="/welcome" />;
  }

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
            : !!dndColumns.length &&
              dndColumns.map((column, index) => {
                return (
                  <Column
                    key={column._id}
                    column={column}
                    index={index}
                    moveColumn={moveColumn}
                    onClick={(e) => handelRemoveColumn(e, column._id, column.boardId)}
                  />
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
