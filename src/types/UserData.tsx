export type UserLogin = {
  login: string;
  password: string;
};
export interface UserRegistration extends UserLogin {
  name: string;
}

export type User = {
  id: string;
  name: string;
  login: string;
};
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
