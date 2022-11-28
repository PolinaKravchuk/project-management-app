import React, { ReactNode } from 'react';
import './ModalWindow.css';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { closeModal } from 'redux/mainSlice';

export default function ModalWindow({ children }: { children: ReactNode }) {
  const { isModal } = useAppSelector((state) => state.main);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  return (
    <div
      className={`overlay ${isModal ? 'overlay_active' : ''}`}
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
