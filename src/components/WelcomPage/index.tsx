import React from 'react';
import './WelcomPage.css';
import { Link } from 'react-router-dom';
import emblem from 'assets/img/page-logo.png';
import rsSchool from 'assets/img/rsSchool.png';
import Footer from 'components/Footer';
import { Developer } from './types';
import Header from 'components/Header';
import Constants from 'utils/Constants';
import { useTranslation } from 'react-i18next';
import useDevelopersTranslate from './aboutTeamData';

export default function WelcomePage() {
  const [t] = useTranslation('common');
  const developers = useDevelopersTranslate();
  return (
    <>
      <Header type={Constants.PAGE.WELCOME} />
      <main className="main">
        <section className="about-app light-bg-brand">
          <div className="about-app-container">
            <h1 className="title">{t('welcomePage.aboutUp.aboutTitle')}</h1>
            <div className="about-app__content-container">
              <div className="about-app__text-container">
                <p className="about-app__text">{t('welcomePage.aboutUp.paragraph1')}</p>
                <p className="about-app__text">
                  <strong>{t('welcomePage.aboutUp.strong')}</strong>{' '}
                  {t('welcomePage.aboutUp.paragraph2')}
                  divorse etc.
                </p>
              </div>
              <img className="about-app__emblem" src={emblem} alt="emblem" />
            </div>
          </div>
        </section>
        <section className="about-team">
          <div className="about-team-container">
            <h2 className="section-title">{t('welcomePage.aboutTeam.aboutTitle')}</h2>
            <div className="about-team__list-container">
              <ul className="about-team__list">
                {developers.map((developer: Developer) => (
                  <li key={developer.name} className="about-team__item">
                    <img className="about-team__avatar" src={developer.img} alt="avatar" />
                    <h3 className="about-team__name">
                      <Link className="about-team__link" to={developer.link}>
                        {developer.name}
                      </Link>
                    </h3>
                    <p className="about-team2__text">{developer.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className="about-course">
          <div className="about-course-container">
            <h2 className="section-title">{t('welcomePage.aboutCourse.aboutTitle')}</h2>
            <p className="about-course__text">{t('welcomePage.aboutCourse.paragraph1')}</p>
            <Link className="rs__link" to="https://rs.school/react/" target="_blank">
              <img className="rss__img" src={rsSchool} alt="RS School Logo" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
