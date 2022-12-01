export type UserPayload = {
  name: string;
  login: string;
  password: string;
};
export type UserParams = {
  id: string;
  token: string;
  payload?: UserPayload;
};
