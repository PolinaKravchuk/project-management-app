import { useTranslation } from 'react-i18next';
import store from 'redux/store';
import { receiveData, registerErrorMessage } from 'redux/appSlice';

export default function useLogError() {
  const [t] = useTranslation('common');

  return function (e: { message: string }) {
    store.dispatch(receiveData({ isPending: false }));

    const message = e.message;
    store.dispatch(registerErrorMessage({ message: message, label: t('toast.errorLabel') }));
    setTimeout(function () {
      store.dispatch(registerErrorMessage({ message: '' }));
    }, 3000);
  };
}
