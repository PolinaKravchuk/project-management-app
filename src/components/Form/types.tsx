export type UserLogin = {
  login: string;
  password: string;
};
export interface UserRegistration extends UserLogin {
  name: string;
}
