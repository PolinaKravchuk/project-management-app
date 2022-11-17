import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// redux
import store from 'redux/store';
import { loginUser, receiveData } from 'redux/appSlice';
// custom hook
import useLogError from './useLogError';
// others
import { UserLogin } from 'types/UserData';
import Constants from 'utils/Constants';

export default function useLogin() {
  const navigate = useNavigate();
  const logError = useLogError();

  return function (formData: UserLogin) {
    axios
      .post(Constants.APP_URL + Constants.AUTH_API.SIGN_IN, {
        login: formData.login,
        password: formData.password,
      })
      .then((res) => {
        store.dispatch(receiveData({ isPending: false }));

        const token = res.data.token;
        store.dispatch(loginUser({ token: token }));
        navigate('/main');
        return Promise.resolve();
      })
      .catch((e) => {
        logError(e);
      });
  };
}
