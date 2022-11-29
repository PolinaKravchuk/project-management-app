import React from 'react';
import { Task } from './types';
import removeImg from 'assets/img/remove.svg';
import './Task.css';

export default function Board(props: Task) {
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
