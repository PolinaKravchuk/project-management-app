import React, { SyntheticEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Task from 'components/Task';

import checkImg from 'assets/img/check.svg';
import removeImg from 'assets/img/remove.svg';
import closeImg from 'assets/img/close.svg';
import './Column.css';
import { IColumn } from './types';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { currentConfirmModalId, openConfirmModal, openModal } from 'redux/appSlice';
import { openTaskModal } from 'redux/boardSlice';

export default function Column({ column }: { column: IColumn }) {
  const { tasks } = useAppSelector((state) => state.board);
  const dispatch = useAppDispatch();
  const [t] = useTranslation('common');
  const [editMode, setEditMode] = useState(false);

  const tasksInColumn = tasks.filter((task) => task.columnId === column._id);

  const handleAddTask = () => {
    dispatch(openTaskModal(column._id));
    dispatch(openModal());
  };

  const handelRemoveColumn = (e: SyntheticEvent, column: IColumn) => {
    e.preventDefault();
    const { _id, boardId } = column;
    dispatch(openConfirmModal());
    dispatch(currentConfirmModalId({ name: 'column', id: _id, boardId }));
  };
  return (
    <>
      <div className="board-body__column">
        <div className="board-body__column__header">
          <div className="board-body__column__header__title">
            <h2>{column.title}</h2>
          </div>
          <div className="board-body__column__header__settings">
            <a href="#" className="remove" onClick={(e) => handelRemoveColumn(e, column)}>
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

        {!!tasksInColumn.length && tasksInColumn.map((task) => <Task key={task._id} task={task} />)}
        <div className="board-body__column__add-task">
          <button onClick={handleAddTask}>
            <span>+</span>
            {t('board.addTask')}
          </button>
        </div>
      </div>
    </>
  );
}
