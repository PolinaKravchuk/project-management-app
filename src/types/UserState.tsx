import { User } from './UserData';

type UserState = {
  data: User | object | void;
  inProgress: boolean;
  userId: string;
};

export default UserState;
