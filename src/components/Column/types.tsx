export interface ColumnProps {
  column: IColumn;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
}
export interface IColumn {
  _id: string;
  title: string;
  order: number;
  boardId: string;
}

export interface IDragItem {
  index: number;
  id: string;
  type: string;
}
