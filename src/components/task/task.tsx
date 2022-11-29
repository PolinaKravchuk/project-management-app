import React from 'react';
import './task.css';

export default function Board() {
  return (
    <>
      <div className="board-body__card__task">
        <div className="board-body__card__task__title">Create a new page</div>
        <div className="board-body__card__task__remove">
          <a href="#">
            <img src={'assets/img/remove.svg'} alt={'Remove'} />
          </a>
        </div>
      </div>
    </>
  );
}
