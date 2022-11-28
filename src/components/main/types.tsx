export interface BoardForm {
  title: string;
  description: string;
  users: string;
}
export interface User {
  _id: string;
  name: string;
  login: string;
}