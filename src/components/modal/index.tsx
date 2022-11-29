import React, { ReactNode } from 'react';
import './ModalWindow.css';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { closeModal } from 'redux/mainSlice';
import { closeConfirmModal } from 'redux/appSlice';

export default function ModalWindow({ children }: { children: ReactNode }) {
  const { isConfirmModal } = useAppSelector((state) => state.app);
  const { isModal } = useAppSelector((state) => state.main);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(closeModal());
    dispatch(closeConfirmModal());
  };

  return (
    <div
      className={`overlay ${isModal ? 'overlay_active' : ''}
        ${isConfirmModal ? 'overlay_active' : ''}`}
      onClick={() => handleCloseModal()}
    >
      <div
        className="modal-window light-bg-brand"
        onClick={(e) => e.stopPropagation()}
        data-testid={'modal-window'}
      >
        <div className="modal__content">
          <>{children}</>
        </div>
      </div>
    </div>
  );
}
