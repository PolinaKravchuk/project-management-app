import store from 'redux/store';
import { receiveData, registerErrorMessage } from 'redux/appSlice';

export default function useLogError() {
  return function (e: { message: string }) {
    store.dispatch(receiveData({ isPending: false }));

    const message = e.message;
    store.dispatch(registerErrorMessage({ message: message }));
    setTimeout(function () {
      store.dispatch(registerErrorMessage({ message: '' }));
    }, 3000);
  };
}
