import React from 'react';
import { useTranslation } from 'react-i18next';

import Constants from 'utils/Constants';
import Header from 'components/header/Header';
import notFoundImg from 'assets/img/notFound.jpg';
import './NotFound.css';

function NotFound() {
  const [t] = useTranslation('common');

  return (
    <>
      <Header type={Constants.PAGE.WELCOME} />
      <main className="not-found-page page light-bg-brand">
        <section>
          <h2>{t('notFound.title')}</h2>
          <p>{t('notFound.content')}</p>
          <img className="not-found-img" src={notFoundImg} alt="Not Found" />
        </section>
      </main>
    </>
  );
}

export default NotFound;
