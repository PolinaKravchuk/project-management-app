import React, { SyntheticEvent, useEffect } from 'react';
import './Main.css';
import boardAvatar from 'assets/img/boardAvatar.png';
import cartDelete from 'assets/img/cartDelete.png';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import ModalWindow from 'components/modal';
import { useForm } from 'react-hook-form';
import { closeModal, fetchAddBoard, fetchGetBoards } from 'redux/mainSlice';
import { ErrorMessage } from '@hookform/error-message';
import { useTranslation } from 'react-i18next';
import { BoardForm } from './types';
import { currentConfirmModalId, openConfirmModal, receiveData, requestData } from 'redux/appSlice';

export default function Main() {
  const { isModal, error, boards } = useAppSelector((state) => state.main);
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

    const boardBody = {
      title,
      owner: id,
      users: [],
    };
    dispatch(requestData({ isPending: true }));
    dispatch(fetchAddBoard({ token, boardBody })).finally(() =>
      dispatch(receiveData({ isPending: false }))
    );
    dispatch(closeModal());
    navigate('/main');
    reset();
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

    dispatch(openConfirmModal());
    dispatch(currentConfirmModalId({ name: 'board', id }));
  };
  return (
    <>
      <main className="main page light-bg-brand main-padding">
        {error ? (
          <h2 className="main_error">{t(error)}</h2>
        ) : (
          !!boards.length && (
            <ul className="boards">
              {boards.map((board) => {
                return (
                  <li
                    key={board._id}
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
          )
        )}
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
        </ModalWindow>
      )}
    </>
  );
}
