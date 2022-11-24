import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from 'redux/hooks';
import { loginUser, setUserData } from 'redux/userSlice';
import { receiveData, requestData } from 'redux/appSlice';
import { setCredentials } from 'redux/authSlice';

import useLogError from './useLogError';
import { UserLogin } from 'types/UserData';
import Constants from 'utils/Constants';

export default function useLogin() {
  const navigate = useNavigate();
  const logError = useLogError();
  const dispatch = useAppDispatch();

  return function (formData: UserLogin) {
    dispatch(requestData({ isPending: true }));

    axios
      .post(Constants.APP_URL + Constants.AUTH_API.SIGN_IN, {
        login: formData.login,
        password: formData.password,
      })
      .then((res) => {
        dispatch(setCredentials(res.data));
        dispatch(loginUser(res.data));
        dispatch(setUserData(res.data));

        navigate('/main');
        return Promise.resolve();
      })
      .catch((e) => {
        logError(e);
      })
      .finally(() => {
        dispatch(receiveData({ isPending: false }));
      });
  };
}
