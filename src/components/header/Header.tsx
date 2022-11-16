import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FormControlLabel, Switch } from '@mui/material';

import './Header.css';
import Constants from 'utils/Constants';

function Header() {
  const [isENLanguage, setIsENLanguage] = useState(true);
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
    setIsENLanguage(!isENLanguage);
  }

  return (
    <header id="header" className="header dark-bg-brand">
      <Link to="/">
        <img className="header-logo" alt="logo" />
      </Link>
      <nav className="header-nav">
        <Link className="header-link light-txt-brand" to="/login">
          Sign In
        </Link>
        <Link className="header-link light-txt-brand" to="/registration">
          Sign Out
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
