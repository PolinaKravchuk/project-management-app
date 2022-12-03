import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from 'redux/authSlice';
import { useAppDispatch } from 'redux/hooks';
import Constants from 'utils/Constants';

export default function useCheckToken(token: string) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  return function () {
    axios.get(Constants.APP_URL, config).catch((e) => {
      if (e.response.status === Constants.ERROR_STATUS.EXPIRED) {
        dispatch(logoutUser());
        navigate(`/${Constants.PAGE.WELCOME}`);
      } else {
        navigate(`${location.pathname}`);
      }
    });
  };
}
