import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import './Header.css';
import globalStore from 'redux/store';

import Constants from 'utils/Constants';
import GlobalState from 'types/GlobalState';
import { changeLang } from 'redux/appSlice';

function Header() {
  const isENLanguage = useSelector((state: GlobalState) => state.isENLanguage);
  const [t, i18n] = useTranslation('common');
  useEffect(() => {
    const headerComponent = document.getElementById('header');

    function handleScrollPage() {
      const scroll = window.pageYOffset;
      if (scroll > Constants.HEADER_HEIGHT) {
        headerComponent?.classList.add('shrink');
      } else {
        headerComponent?.classList.remove('shrink');
      }
    }
    window.addEventListener('scroll', handleScrollPage);
    return () => {
      window.removeEventListener('scroll', handleScrollPage);
    };
  }, []);

  function handleChange() {
    globalStore.dispatch(changeLang({ lang: !isENLanguage }));
    i18n.changeLanguage(!isENLanguage ? Constants.LANGUAGE.EN : Constants.LANGUAGE.RU);
  }

  return (
    <header id="header" className="header dark-bg-brand">
      <Link to="/">
        <img className="header-logo" alt="logo" />
      </Link>
      <nav className="header-nav">
        <Link className="header-link light-txt-brand" to="/login">
          {t('header.signIn')}
        </Link>
        <Link className="header-link light-txt-brand" to="/registration">
          {t('header.signUp')}
        </Link>
        <FormControlLabel
          control={<Switch defaultChecked onChange={handleChange} />}
          label={isENLanguage ? Constants.LANGUAGE.EN : Constants.LANGUAGE.RU}
        />
      </nav>
    </header>
  );
}
export default Header;
