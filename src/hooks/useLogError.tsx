import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'redux/hooks';
import { receiveData, registerErrorMessage } from 'redux/appSlice';

export default function useLogError() {
  const [t] = useTranslation('common');
  const dispatch = useAppDispatch();

  return function (e: { message: string }) {
    dispatch(receiveData({ isPending: false }));

    const message = e.message;
    dispatch(registerErrorMessage({ message: message, label: t('toast.errorLabel') }));
    setTimeout(function () {
      dispatch(registerErrorMessage({ message: '' }));
    }, 3000);
  };
}
