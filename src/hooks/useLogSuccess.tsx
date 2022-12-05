import { useTranslation } from 'react-i18next';

import { useAppDispatch } from 'redux/hooks';
import { registerSuccessMessage } from 'redux/appSlice';

export default function useLogSuccess() {
  const [t] = useTranslation('common');
  const dispatch = useAppDispatch();

  return function (message: string) {
    dispatch(
      registerSuccessMessage({
        message: t(message),
        label: t('toast.successLabel'),
      })
    );
    setTimeout(function () {
      dispatch(registerSuccessMessage({ message: '' }));
    }, 3000);
  };
}
