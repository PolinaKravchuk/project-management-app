import React, { SyntheticEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';

import { logoutUser } from 'redux/authSlice';
import { changeLang, openModal } from 'redux/appSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import logo from 'assets/img/small-logo.png';
import HeaderType from 'types/HeaderType';
import Constants from 'utils/Constants';
import './Header.css';

function Header(props: HeaderType) {
  const { isENLanguage } = useAppSelector((state) => state.app);
  const { token } = useAppSelector((state) => state.auth);
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

  const handleCreateBoard = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(openModal());
  };

  return (
    <header id="header" className={className}>
      <div className="header-logo-container">
        <Link className="header-logo-link" to="/">
          <img className="header-logo" src={logo} alt="logo" />
        </Link>
        {token && props.type !== Constants.PAGE.MAIN && (
          <Link className="header-link header-link-back light-txt-brand" to="/main">
            {t('header.back')}
          </Link>
        )}
      </div>
      <nav className="header-nav">
        {!token && (
          <>
            <Link className="header-link light-txt-brand" to="/login">
              {t('header.signIn')}
            </Link>
            <Link className="header-link light-txt-brand" to="/registration">
              {t('header.signUp')}
            </Link>{' '}
          </>
        )}

        {token && props.type !== Constants.PAGE.WELCOME && (
          <>
            <Link className="header-link light-txt-brand" to="/edit">
              {t('header.editProfile')}
            </Link>
            <Link
              className="header-link light-txt-brand"
              to="/welcome"
              onClick={() => dispatch(logoutUser())}
            >
              {t('header.signOut')}
            </Link>
            <Link className="header-link light-txt-brand" to="/main" onClick={handleCreateBoard}>
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
