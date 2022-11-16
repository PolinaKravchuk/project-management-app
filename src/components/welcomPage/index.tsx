import React from 'react';
import './WelcomPage.css';
import { Link } from 'react-router-dom';
import emblem from '../../assets/img/emblem.png';
import { data } from './aboutTeamData';
import rsSchool from '../../assets/img/rsSchool.png';
import Footer from 'components/Footer';
import { Developer } from './types';

export default function WelcomePage() {
  const isAuth = false;
  return (
    <>
      <header className="header-welcome-page">
        {isAuth ? (
          <Link className="header-welcome-page__link_active" to="/main">
            Main page
          </Link>
        ) : (
          <>
            <Link className="header-welcome-page__link_active" to="/signIn">
              Sign In
            </Link>
            <Link className="header-welcome-page__link" to="/signUp">
              Sign Up
            </Link>
          </>
        )}
      </header>
      <main className="main">
        <section className="about-app">
          <div className="about-app-container">
            <h1 className="title">Project Management App</h1>
            <div className="about-app__content-container">
              <div className="about-app__text-container">
                <p className="about-app__text">Don’t panic if you have a lot of things to do.</p>
                <p className="about-app__text">
                  <strong>Managerka</strong> helps you to deal with all problems you have, exept
                  divorse etc.
                </p>
              </div>
              <img className="about-app__emblem" src={emblem} alt="emblem" />
            </div>
          </div>
        </section>
        <section className="about-team">
          <div className="about-team-container">
            <h2 className="section-title">About team</h2>
            <div className="about-team__list-container">
              <ul className="about-team__list">
                {data.map((developer: Developer) => (
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
            <h2 className="section-title">RS School</h2>
            <p className="about-course__text">
              RS School is free-of-charge and community-based education program conducted by The
              Rolling Scopes developer community since 2013. Everyone can study at RS School,
              regardless of age, professional employment, or place of residence. Thementors and
              trainers of our school are front-end and javascript developers from different
              companies and countries. You can learn more about the course by clicking on the logo
              below.
            </p>
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
