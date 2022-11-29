import axios from 'axios';
import Constants from 'utils/Constants';

function useFetch() {
  return async function (token: string, url: string) {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    return axios.get(Constants.APP_URL + url, config);
  };
}

export default useFetch;
