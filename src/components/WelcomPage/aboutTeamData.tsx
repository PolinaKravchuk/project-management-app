import avatar from 'assets/img/avatar.png';
import polinaImg from 'assets/img/polinaImg.jpg';
import andreiImg from 'assets/img/andreiImg.jpeg';
import { useTranslation } from 'react-i18next';
import { Developer } from './types';

export default function useDevelopersTranslate() {
  const [t] = useTranslation('common');

  const developers: Developer[] = [
    {
      name: 'polinakravchuk',
      img: polinaImg,
      link: 'https://github.com/polinakravchuk',
      text: t('welcomePage.aboutTeam.polina'),
    },
    {
      name: 'niknikolay',
      img: avatar,
      link: 'https://github.com/niknikolay',
      text: t('welcomePage.aboutTeam.nikolay'),
    },
    {
      name: 'andreichaika',
      img: andreiImg,
      link: 'https://github.com/andreichaika',
      text: t('welcomePage.aboutTeam.andrei'),
    },
  ];
  return developers;
}
