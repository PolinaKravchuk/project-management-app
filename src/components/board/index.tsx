import Column from 'components/column';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import { useAppSelector } from 'redux/hooks';
import './Board.css';

export default function Board() {
  const [t] = useTranslation('common');
  const { token } = useAppSelector((state) => state.auth);
  const { boards } = useAppSelector((state) => state.main);
  const { _id } = useParams();

  if (!token) {
    return <Navigate to="/welcome" />;
  }

  const board = boards.find((board) => board._id === _id);

  return (
    <>
      {/* <Header /> */}
      <main className="board-wrapper light-bg-brand main-padding">
        <div>
          {t('board.label')}-{_id}
        </div>
        <p>{board?.title}</p>
        <p>{board?.description}</p>
        <p>{board?.owner}</p>
        <section className="board-body">
          {/* Здесь должен подгружаться компонент column */}
          <Column title="Test" />
          <button className="board-body__addcard">
            <span>+</span>
            {t('board.addColumn')}
          </button>
        </section>
      </main>
    </>
  );
}
