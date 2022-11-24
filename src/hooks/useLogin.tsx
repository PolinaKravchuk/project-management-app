import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from 'redux/hooks';
import { authUser, receiveData } from 'redux/authSlice';
import { loginUser } from 'redux/userSlice';
import useLogError from './useLogError';

import { UserLogin } from 'types/UserData';
import Constants from 'utils/Constants';

export default function useLogin() {
  const navigate = useNavigate();
  const logError = useLogError();
  const dispatch = useAppDispatch();

  return function (formData: UserLogin) {
    axios
      .post(Constants.APP_URL + Constants.AUTH_API.SIGN_IN, {
        login: formData.login,
        password: formData.password,
      })
      .then((res) => {
        dispatch(receiveData({ isPending: false }));

        const data = res.data;
        dispatch(authUser({ token: data.token }));
        dispatch(loginUser({ id: data._id }));

        navigate('/main');
        return Promise.resolve();
      })
      .catch((e) => {
        logError(e);
      });
  };
}
