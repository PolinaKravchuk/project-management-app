import React, { SyntheticEvent } from 'react';
import removeImg from 'assets/img/remove.svg';
import './Task.css';
import { TaskBody } from 'types/BoardState';
import { useAppDispatch } from 'redux/hooks';
import { currentConfirmModalId, openConfirmModal } from 'redux/appSlice';

export default function Task({ task }: { task: TaskBody }) {
  const dispatch = useAppDispatch();

  const handlrRemoveTask = (e: SyntheticEvent, task: TaskBody) => {
    e.preventDefault();

    const { _id, columnId, boardId } = task;

    if (_id) {
      dispatch(openConfirmModal());
      dispatch(currentConfirmModalId({ name: 'task', id: _id, boardId, columnId }));
    }
  };

  return (
    <>
      <div className="board-body__card__task">
        <div className="board-body__card__task__title">{task.title}</div>
        <div className="board-body__card__task__remove">
          <a href="#" onClick={(e) => handlrRemoveTask(e, task)}>
            <img src={removeImg} alt={'Remove'} />
          </a>
        </div>
      </div>
    </>
  );
}
