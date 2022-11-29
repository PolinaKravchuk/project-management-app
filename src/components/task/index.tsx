import React from 'react';
import { ITask } from './types';
import removeImg from 'assets/img/remove.svg';
import './Task.css';

export default function Task(props: ITask) {
  return (
    <>
      <div className="board-body__card__task">
        <div className="board-body__card__task__title">{props.title}</div>
        <div className="board-body__card__task__remove">
          <a href="#">
            <img src={removeImg} alt={'Remove'} />
          </a>
        </div>
      </div>
    </>
  );
}
