import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';

import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { changeLang, logoutUser } from 'redux/authSlice';

import logo from 'assets/img/small-logo.png';
import HeaderType from 'types/HeaderType';
import Constants from 'utils/Constants';
import './Header.css';

function Header(props: HeaderType) {
  const isLogged = useAppSelector((state) => state.app.isLogged);
  const isENLanguage = useAppSelector((state) => state.app.isENLanguage);
  const dispatch = useAppDispatch();

  let className = 'header dark-bg-brand';
  className = props.type !== Constants.PAGE.WELCOME ? className + ' fixed' : className;

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
    if (props.type !== Constants.PAGE.WELCOME) {
      window.addEventListener('scroll', handleScrollPage);
    }
    return () => {
      if (props.type !== Constants.PAGE.WELCOME) {
        window.removeEventListener('scroll', handleScrollPage);
      }
    };
  }, []);

  function handleChange() {
    dispatch(changeLang({ lang: !isENLanguage }));
    i18n.changeLanguage(!isENLanguage ? Constants.LANGUAGE.EN : Constants.LANGUAGE.RU);
  }

  return (
    <header id="header" className={className}>
      <Link className="header-logo-link" to="/">
        <img className="header-logo" src={logo} alt="logo" />
      </Link>
      <nav className="header-nav">
        {!isLogged && (
          <>
            <Link className="header-link light-txt-brand" to="/login">
              {t('header.signIn')}
            </Link>
            <Link className="header-link light-txt-brand" to="/registration">
              {t('header.signUp')}
            </Link>{' '}
          </>
        )}
        {isLogged && props.type !== Constants.PAGE.MAIN && (
          <Link className="header-link light-txt-brand" to="/main">
            {t('header.main')}
          </Link>
        )}
        {isLogged && props.type === Constants.PAGE.MAIN && (
          <>
            <Link className="header-link light-txt-brand" to="/edit">
              {t('header.editProfile')}
            </Link>
            <Link
              className="header-link light-txt-brand"
              to="/"
              onClick={() => dispatch(logoutUser())}
            >
              {t('header.signOut')}
            </Link>
            <Link className="header-link light-txt-brand" to="/newBoard">
              {t('header.newBoard')}
            </Link>
          </>
        )}
        <FormControlLabel
          control={<Switch checked={isENLanguage} onChange={handleChange} />}
          label={isENLanguage ? Constants.LANGUAGE.EN : Constants.LANGUAGE.RU}
        />
      </nav>
    </header>
  );
}
export default Header;
