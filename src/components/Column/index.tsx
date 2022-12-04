import React, { useState, SyntheticEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import update from 'immutability-helper';

import { fetchUpdateColumnTitle, openTaskModal } from 'redux/boardSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { currentConfirmModalId, openConfirmModal, openModal } from 'redux/appSlice';

import Task from 'components/Task';

import checkImg from 'assets/img/check.svg';
import removeImg from 'assets/img/remove.svg';
import closeImg from 'assets/img/close.svg';
import { TaskBody } from 'types/BoardState';
import { ColumnProps, IColumn } from './types';
import './Column.css';
import useDnDItems from 'hooks/useDnDItems';
import Constants from 'utils/Constants';

export default function Column({ column, moveColumn, index }: ColumnProps) {
  const [t] = useTranslation('common');
  const [dndTasks, setDndTasks] = useState([] as TaskBody[]);
  const [editMode, setEditMode] = useState(false);

  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.board);

  const id = column._id;

  const handleAddTask = () => {
    dispatch(openTaskModal(column._id));
    dispatch(openModal());
  };

  let inputChangeTitleText = '';
  const handleInputChangeTitle = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    inputChangeTitleText = target.value;
  };

  const handleSubmitChangeTitle = (e: SyntheticEvent, column: IColumn) => {
    e.preventDefault();
    const columnBody = {
      title: inputChangeTitleText,
      order: column.order,
    };
    dispatch(
      fetchUpdateColumnTitle({ _id: column._id, token, columnBody, boardId: column.boardId })
    );
    setEditMode(false);
  };
  const handleCancelChangeTitle = (e: SyntheticEvent) => {
    e.preventDefault();
    setEditMode(false);
  };
  useEffect(() => {
    const dnd = tasks.filter((task) => task.columnId === column._id);
    setDndTasks(dnd);
  }, [tasks]);

  const handelRemoveColumn = (e: SyntheticEvent, column: IColumn) => {
    e.preventDefault();
    const { _id, boardId } = column;
    dispatch(openConfirmModal());
    dispatch(currentConfirmModalId({ name: 'column', id: _id, boardId }));
  };
  const ref = useRef<HTMLDivElement>(null);

  const dndConfig = useDnDItems(Constants.DND_TYPE.COLUMN, ref, {
    id,
    index,
    order: column.order,
    move: moveColumn,
  });
  const opacity = dndConfig.isDragging ? 0 : 1;

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    setDndTasks(
      update(dndTasks, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dndTasks[dragIndex] as TaskBody],
        ],
      })
    );
  };

  return (
    <>
      <div ref={ref} style={{ opacity }} className="board-body__column">
        <div className="board-body__column__header">
          {editMode ? (
            <div className="board-body__column__headercorrect">
              <div className="board-body__column__headercorrect__input">
                <input type="text" onInput={(e) => handleInputChangeTitle(e)} placeholder="Done" />
              </div>
              <div className="board-body__column__headercorrect__settings">
                <a href="#" className="check" onClick={(e) => handleSubmitChangeTitle(e, column)}>
                  <img src={checkImg} alt="Check" />
                </a>
                <a href="#" className="close" onClick={(e) => handleCancelChangeTitle(e)}>
                  <img src={closeImg} alt="Close" />
                </a>
              </div>
            </div>
          ) : (
            <>
              <div className="board-body__column__header__title" onClick={() => setEditMode(true)}>
                <h2>{column.title}</h2>
              </div>
              <div className="board-body__column__header__settings">
                <a href="#" className="remove" onClick={(e) => handelRemoveColumn(e, column)}>
                  <img className="remove__img" src={removeImg} alt={'Remove'} />
                </a>
              </div>
            </>
          )}
        </div>

        {!!dndTasks.length &&
          dndTasks.map((task, index) => (
            <Task key={task._id} task={task} index={index} moveTask={moveTask} />
          ))}

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
