import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import rsSchool from 'assets/img/rsSchool.png';
import { developers } from './teamData';
import { FooterDeveloper } from './types';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-link-container">
          <Link className="footer-menu__link" to="https://rs.school/" target="_blank">
            <img className="rss__img" src={rsSchool} alt="RS School Logo" />
          </Link>
          <ul className="footer-menu">
            {developers.map((developer: FooterDeveloper) => (
              <li key={developer.link}>
                <Link className="footer-menu__name" to={developer.link} target="_blank">
                  <img className="footer__gitHub-icon" src={developer.img} alt="gitHub icon" />
                  {developer.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-year-container">
          <span className="footer__year">&copy;2022</span>
        </div>
      </div>
    </footer>
  );
}
