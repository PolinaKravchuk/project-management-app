import React, { SyntheticEvent, useRef } from 'react';

import { useAppDispatch } from 'redux/hooks';
import { currentConfirmModalId, openConfirmModal, openModal } from 'redux/appSlice';

import useDnDItems from 'hooks/useDnDItems';
import { TaskProps } from './types';
import { TaskBody } from 'types/BoardState';
import removeImg from 'assets/img/remove.svg';
import './Task.css';
import Constants from 'utils/Constants';

import { openAboutTaskModal } from 'redux/boardSlice';

export default function Task({ task, index, moveTask }: TaskProps) {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);

  const dndConfig = useDnDItems(
    Constants.DND_TYPE.TASK,
    ref,
    {
      id: task._id || '',
      index,
      order: task.order,
      move: moveTask,
    },
    task.columnId
  );
  const opacity = dndConfig.isDragging ? 0 : 1;

  const handleChangeTask = (e: SyntheticEvent, task: TaskBody) => {
    const { _id, columnId, boardId } = task;
    dispatch(openModal());
    dispatch(openAboutTaskModal(task));
  };
  const handleRemoveTask = (e: SyntheticEvent, task: TaskBody) => {
    e.preventDefault();

    const { _id, columnId, boardId } = task;

    if (_id) {
      dispatch(openConfirmModal());
      dispatch(currentConfirmModalId({ name: 'task', id: _id, boardId, columnId }));
    }
  };

  return (
    <>
      <div
        className="board-body__card__task"
        ref={ref}
        style={{ opacity }}
        onClick={(e) => handleChangeTask(e, task)}
      >
        <div className="board-body__card__task__title">{task.title}</div>
        <div className="board-body__card__task__remove">
          <a href="#" onClick={(e) => handleRemoveTask(e, task)}>
            <img src={removeImg} alt={'Remove'} />
          </a>
        </div>
      </div>
    </>
  );
}
