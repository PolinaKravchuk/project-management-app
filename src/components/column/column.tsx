import React from 'react';
import './column.css';

export default function Board() {
  return (
    <>
      <div className="board-body__column">
        {/* Ниже сохранённый заголовок */}
        <div className="board-body__column__header">
          <div className="board-body__column__header__title">
            <h2>To do</h2>
          </div>
          <div className="board-body__column__header__settings">
            <a href="#" className="remove">
              <img src={'assets/img/remove.svg'} alt={'Remove'} />
            </a>
          </div>
        </div>
        {/* Или ниже редактирование заголовка */}
        <div className="board-body__column__headercorrect">
          <div className="board-body__column__headercorrect__input">
            <input type="text" placeholder="Done" />
          </div>
          <div className="board-body__column__headercorrect__settings">
            <a href="#" className="check">
              <img src={'assets/img/check.svg'} alt={'Check'} />
            </a>
            <a href="#" className="close">
              <img src={'assets/img/close.svg'} alt={'Check'} />
            </a>
          </div>
        </div>
        {/* Здесь должен подгружаться компонент task */}
        <div className="board-body__column__add-task">
          <button>
            <span>+</span>Add task
          </button>
        </div>
      </div>
    </>
  );
}
