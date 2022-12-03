import React, { useRef, useState, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import Task from 'components/Task';

import checkImg from 'assets/img/check.svg';
import removeImg from 'assets/img/remove.svg';
import closeImg from 'assets/img/close.svg';
import { ColumnProps, IColumn, IDragItem } from './types';
import './Column.css';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { currentConfirmModalId, openConfirmModal, openModal } from 'redux/appSlice';
import { fetchUpdateColumnTitle, openTaskModal, updateColumnOrder } from 'redux/boardSlice';

export default function Column({ column, moveColumn, index }: ColumnProps) {
  const [t] = useTranslation('common');
  const ref = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { tasks, columns } = useAppSelector((state) => state.board);
  const [editMode, setEditMode] = useState(false);

  const id = column._id;
  const tasksInColumn = tasks.filter((task) => task.columnId === column._id);

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

  const handelRemoveColumn = (e: SyntheticEvent, column: IColumn) => {
    e.preventDefault();
    const { _id, boardId } = column;
    dispatch(openConfirmModal());
    dispatch(currentConfirmModalId({ name: 'column', id: _id, boardId }));
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'Column',
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const updateColumnPositions = function (dragIndex: number, hoverIndex: number) {
    const draggedCol = columns[dragIndex];
    const draggedColBody = {
      title: draggedCol.title,
      order: hoverIndex,
    };
    dispatch(
      updateColumnOrder({
        _id: draggedCol._id,
        token,
        columnBody: draggedColBody,
        boardId: draggedCol.boardId,
      })
    );

    const hoveredCol = columns[hoverIndex];
    const hoveredColBody = {
      title: hoveredCol.title,
      order: dragIndex,
    };
    dispatch(
      updateColumnOrder({
        _id: hoveredCol._id,
        token,
        columnBody: hoveredColBody,
        boardId: hoveredCol.boardId,
      })
    );
  };

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

      updateColumnPositions(dragIndex, hoverIndex);
    },
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

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
