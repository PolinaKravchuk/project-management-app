import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import Task from 'components/Task';

import checkImg from 'assets/img/check.svg';
import removeImg from 'assets/img/remove.svg';
import closeImg from 'assets/img/close.svg';
import { IColumn, IDragItem } from './types';
import './Column.css';

export default function Column({ column, moveColumn, index, onClick }: IColumn) {
  const [t] = useTranslation('common');
  const [editMode, setEditMode] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const id = column._id;

  const [{ handlerId }, drop] = useDrop<IDragItem, void, { handlerId: Identifier | null }>({
    accept: 'Column',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: IDragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      moveColumn(dragIndex, hoverIndex);
      // Time to actually perform the action

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'Column',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <>
      <div ref={ref} style={{ opacity }} onClick={(e) => onClick(e)} className="board-body__column">
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
      </div>
    </>
  );
}
