import { useNavigate } from 'react-router-dom';
import { logoutUser } from 'redux/authSlice';
import { useAppDispatch } from 'redux/hooks';
import Constants from 'utils/Constants';

export default function useCheckToken() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return function () {
    const loggedInUser = localStorage.getItem('token');
    if (loggedInUser) {
      // const foundUser = JSON.parse(loggedInUser);
      navigate(`${location.pathname}`);
    } else {
      dispatch(logoutUser());
      navigate(`/${Constants.PAGE.WELCOME}`);
    }
  };
}
