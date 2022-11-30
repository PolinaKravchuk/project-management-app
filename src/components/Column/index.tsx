import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Task from 'components/Task';

import checkImg from 'assets/img/check.svg';
import removeImg from 'assets/img/remove.svg';
import closeImg from 'assets/img/close.svg';
import './Column.css';

// export default function Column(props: IColumn) {
export default function Column({
  column,
}: {
  column: { _id: string; title: string; order: number; boardId: string };
}) {
  const [t] = useTranslation('common');
  const [editMode, setEditMode] = useState(false);
  return (
    <>
      <div className="board-body__column__header">
        <div className="board-body__column__header__title">
          <h2>{column.title}</h2>
        </div>
        <div className="board-body__column__header__settings">
          <a href="#" className="remove">
            <img className="remove__img" src={removeImg} alt={'Remove'} />
          </a>
        </div>
      </div>

      {editMode && (
        <div className="board-body__column__headercorrect">
          <div className="board-body__column__headercorrect__input">
            <input type="text" placeholder="Done" />
          </div>
          <div className="board-body__column__headercorrect__settings">
            <a href="#" className="check">
              <img src={checkImg} alt="Check" />
            </a>
            <a href="#" className="close">
              <img src={closeImg} alt="Close" />
            </a>
          </div>
        </div>
      )}

      <Task title="Test" />
      <div className="board-body__column__add-task">
        <button>
          <span>+</span>
          {t('board.addTask')}
        </button>
      </div>
    </>
  );
}
