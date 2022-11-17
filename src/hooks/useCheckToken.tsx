import axios from 'axios';
import Constants from 'utils/Constants';

export default function useCheckToken(token: string) {
  return async function () {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    return axios.get(Constants.APP_URL + 'users', config);
  };
}
