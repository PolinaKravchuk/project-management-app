import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';

import { IDragItem as ITaskDragItem } from 'components/Task/types';
import { IDragItem as IColDragItem } from 'components/Column/types';
import {
  ColumnParams,
  IColumn,
  TaskBody,
  TaskBodyUpdate,
  TaskBodyUpdateParams,
} from 'types/BoardState';
import { AppDispatch } from 'redux/store';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { updateTaskOrder, updateColumnOrder } from 'redux/boardSlice';
import Constants from 'utils/Constants';

type IDragItem = ITaskDragItem | IColDragItem;
type BodyType = IColumn | TaskBody;

type ItemParams = {
  id: string;
  index: number;
  order: number;
  move: (a: number, b: number) => void;
};
export default function useDnDItems(
  type: string,
  ref: React.RefObject<HTMLDivElement>,
  params: ItemParams,
  columnId?: string
) {
  const dispatch = useAppDispatch();
  const { columns, tasks } = useAppSelector((state) => state.board);
  const { token } = useAppSelector((state) => state.auth);

  let items = [] as BodyType[];
  if (type === Constants.DND_TYPE.COLUMN) {
    items = columns;
  } else if (type === Constants.DND_TYPE.TASK) {
    items = tasks.filter((task) => task.columnId === columnId);
  }
  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => {
      return { id: params.id, index: params.index, initialInd: params.index, order: params.order };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    end: (dropResult, monitor) => {
      const { initialInd } = monitor.getItem();
      const dragIndex = initialInd;
      const hoverIndex = params.index;
      const didDrop = monitor.didDrop();

      if (didDrop && ~dragIndex && dragIndex !== hoverIndex) {
        updateArrayOrders(dispatch, type, token, items, dragIndex, hoverIndex);
      }
    },
  });

  const [{ handlerId }, drop] = useDrop<IDragItem, void, { handlerId: Identifier | null }>({
    accept: type,
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
      const hoverIndex = params.index;

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
      // Time to actually perform the action
      item.index = hoverIndex;

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.

      params.move(dragIndex, hoverIndex);
    },
  });

  drag(drop(ref));
  return { ref, isDragging, drag, drop };
}

const updateArrayOrders = function (
  dispatch: AppDispatch,
  type: string,
  token: string,
  items: BodyType[],
  dragIndex: number,
  hoverIndex: number
) {
  if (type === Constants.DND_TYPE.COLUMN) {
    items.forEach((item, index) => {
      const draggedBody = {
        title: item.title,
        order: -1,
      } as IColumn;
      const draggedParams = {
        _id: item._id,
        token,
        columnBody: draggedBody,
        boardId: item.boardId,
      } as ColumnParams;

      if (updateOrder(dragIndex, index, hoverIndex, item, draggedBody)) {
        dispatch(updateColumnOrder(draggedParams));
      }
    });
  } else {
    items.forEach((item: BodyType, index) => {
      const currItem = item as TaskBodyUpdate;
      const draggedBody = {
        title: currItem.title,
        order: -1,
        columnId: currItem.columnId || '',
        description: currItem.description,
        userId: currItem.userId,
        users: currItem.users,
      };
      const draggedParams = {
        _id: currItem._id || '',
        token,
        taskBody: draggedBody,
        boardId: currItem.boardId || '',
      } as TaskBodyUpdateParams;

      if (updateOrder(dragIndex, index, hoverIndex, currItem, draggedBody)) {
        dispatch(updateTaskOrder(draggedParams));
      }
    });
  }
};

function updateOrder(
  dragIndex: number,
  index: number,
  hoverIndex: number,
  item: BodyType,
  draggedBody: BodyType
) {
  if (dragIndex < index && index <= hoverIndex) {
    draggedBody.order = item.order - 1;
    return true;
  } else if (index === dragIndex) {
    draggedBody.order = hoverIndex;
    return true;
  } else if (hoverIndex <= index && index < dragIndex) {
    draggedBody.order = item.order + 1;
    return true;
  } else {
    return false;
  }
}
