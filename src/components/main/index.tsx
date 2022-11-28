import React, { SyntheticEvent, useEffect } from 'react';
import './Main.css';
import boardAvatar from 'assets/img/boardAvatar.png';
import cartDelete from 'assets/img/cartDelete.png';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import ModalWindow from 'components/modal';
import { useForm } from 'react-hook-form';
import {
  closeModal,
  confirmModalText,
  fetchAddBoard,
  fetchGetBoards,
  fetchRemoveBoard,
  openModal,
  saveCurrentBoardRemove,
} from 'redux/mainSlice';
import Constants from 'utils/Constants';
import { ErrorMessage } from '@hookform/error-message';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';
import { BoardForm, User } from './types';

const getUsers = async (token: string) => {
  const response = await fetch(`${Constants.APP_URL}users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

export default function Main() {
  const { isModal, isConfirmModal, isPending, currentBoardRemoveId, error, boards } =
    useAppSelector((state) => state.main);
  const { id } = useAppSelector((state) => state.user);
  const { token } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [t] = useTranslation('common');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BoardForm>();

  useEffect(() => {
    dispatch(fetchGetBoards(token));
  }, []);

  const onSubmit = async (value: BoardForm) => {
    const title = JSON.stringify({ title: value.title, description: value.description });
    let usersId: string[] | [] = [];
    if (value.users.length) {
      const arr = value.users.split(',');
      const usersInvaited = await getUsers(token);
      usersId = arr.reduce((acc: string[], name) => {
        const userName: User = usersInvaited.find((user: User) => user.name === name.trim());
        return userName ? [...acc, userName._id] : acc;
      }, []);
    }

    const boardBody = {
      title,
      owner: id,
      users: usersId,
    };

    dispatch(fetchAddBoard({ token, boardBody }));
    dispatch(closeModal());
    navigate('/main');
    reset();
  };

  const handelRemoveBoard = () => {
    dispatch(fetchRemoveBoard({ token, currentBoardRemoveId }));
    dispatch(closeModal());
  };

  const handleCloseModal = () => {
    dispatch(closeModal());
    reset();
  };

  const handelBoardNavigate = (e: SyntheticEvent, id: string) => {
    const target = e.target as HTMLElement;
    if (target?.closest('.board') && !target?.classList.contains('board__delete-img')) {
      navigate(`/board/${id}`);
      return;
    }
    dispatch(openModal());
    dispatch(confirmModalText());
    dispatch(saveCurrentBoardRemove(id));
  };
  return (
    <>
      <main className="main page light-bg-brand main-padding">
        {isPending && <CircularProgress className="busy-indicator" />}
        {error ? (
          <h2 className="main_error">{error}</h2>
        ) : (
          <ul className="boards">
            {boards.map((board, index) => {
              return (
                <li
                  key={index}
                  className="board"
                  onClick={(e) => handelBoardNavigate(e, board._id || '')}
                >
                  <div className="board-container">
                    <img className="board__img" src={boardAvatar} alt="boardAvatar" />
                    <div className="board__content-container">
                      <p className="board__name">{board.title}</p>
                      <p className="board__description">{board.description}</p>
                    </div>
                  </div>
                  <button className="board__delete">
                    <img className="board__delete-img" src={cartDelete} alt="cartDelete" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </main>
      {isModal && (
        <ModalWindow>
          {isConfirmModal ? (
            <form
              className="form light-bg-brand"
              name="create-board"
              onSubmit={handleSubmit(handelRemoveBoard)}
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
                  onClick={handleCloseModal}
                  value={t<string>('form.cancel')}
                />
              </div>
            </form>
          ) : (
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
              <input
                className="input-create-board"
                type="text"
                id="users"
                {...register('users')}
                placeholder={t<string>('main.placeholderInvaiteUsers')}
              />
              <input
                className="input-create-board"
                id="descrip"
                {...register('description')}
                placeholder={t<string>('main.placeholderDescription')}
              />
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
