import React, { SyntheticEvent, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';

import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { currentConfirmModalId, openConfirmModal } from 'redux/appSlice';

import { TaskBody, TaskBodyUpdate, TaskBodyUpdateParams, TaskParams } from 'types/BoardState';
import { IDragItem, TaskProps } from './types';
import removeImg from 'assets/img/remove.svg';
import './Task.css';
import { updateTaskOrder } from 'redux/boardSlice';

export default function Task({ task, index, moveTask }: TaskProps) {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const { token } = useAppSelector((state) => state.auth);
  const { tasks } = useAppSelector((state) => state.board);

  const updateTasksPositions = function (dragIndex: number, hoverIndex: number) {
    const draggedCol = tasks[dragIndex] as TaskBody;
    const draggedColBody: TaskBodyUpdate = {
      title: draggedCol.title,
      order: hoverIndex,
      columnId: draggedCol.columnId || '',
      description: draggedCol.description,
      userId: draggedCol.userId,
      users: draggedCol.users,
    };
    dispatch(
      updateTaskOrder({
        _id: draggedCol._id || '',
        token,
        taskBody: draggedColBody,
        boardId: draggedCol.boardId || '',
      })
    );

    const hoveredCol = tasks[hoverIndex] as TaskBody;
    const hoveredColBody: TaskBodyUpdate = {
      title: hoveredCol.title,
      order: dragIndex,
      columnId: hoveredCol.columnId || '',
      description: hoveredCol.description,
      userId: hoveredCol.userId,
      users: hoveredCol.users,
    };
    dispatch(
      updateTaskOrder({
        _id: hoveredCol._id || '',
        token,
        taskBody: hoveredColBody,
        boardId: hoveredCol.boardId || '',
      })
    );
  };
  // const dndItems = useDnDItems('Task', {id: task._id, index, move: moveTask);
  const [{ isDragging }, drag] = useDrag({
    type: 'Task',
    item: () => {
      return { id: task._id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ handlerId }, drop] = useDrop<IDragItem, void, { handlerId: Identifier | null }>({
    accept: 'Task',
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
      moveTask(dragIndex, hoverIndex);
      // Time to actually perform the action

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;

      updateTasksPositions(dragIndex, hoverIndex);
    },
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

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
      <div className="board-body__card__task" ref={ref} style={{ opacity }}>
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
