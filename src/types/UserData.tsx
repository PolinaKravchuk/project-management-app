export type UserLogin = {
  login: string;
  password: string;
};
export interface UserRegistration extends UserLogin {
  name: string;
}
export type User = {
  _id: string;
  name: string;
  login: string;
};
