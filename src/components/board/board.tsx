import React from 'react';
import './board.css';
import Header from 'components/header/Header';
import Constants from 'utils/Constants';
import Footer from 'components/Footer';

export default function Board() {
  return (
    <>
      <Header type={Constants.PAGE.WELCOME} />
      <main className="board-wrapper">
        <section className="board-body">
          {/* Здесь должен подгружаться компонент column */}
          <button className="board-body__addcard">
            <span>+</span>Add column
          </button>
        </section>
      </main>
      <Footer />
    </>
  );
}
