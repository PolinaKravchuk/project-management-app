import { TaskBody } from 'types/BoardState';

export interface IDragItem {
  index: number;
  id: string;
  type: string;
}

export type TaskProps = {
  task: TaskBody;
  index: number;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
};

export interface ITask {
  _id: string;
  title: string;
  order: number;
  columnId: string;
}
