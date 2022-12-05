import React from 'react';
import './Footer.css';
import rsSchool from 'assets/img/rsSchool.png';
import { developers } from './teamData';
import { FooterDeveloper } from './types';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-link-container">
          <a
            className="footer-menu__link"
            href="https://rs.school/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className="rss__img" src={rsSchool} alt="RS School Logo" />
          </a>
          <ul className="footer-menu">
            {developers.map((developer: FooterDeveloper) => (
              <li key={developer.link}>
                <a
                  className="footer-menu__name"
                  href={developer.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className="footer__gitHub-icon" src={developer.img} alt="gitHub icon" />
                  {developer.name}
                </a>
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
