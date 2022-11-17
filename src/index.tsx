import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

import common_ru from 'translations/ru/common.json';
import common_en from 'translations/en/common.json';

import { store } from './redux/store';
import App from 'components/appComp/App';
import reportWebVitals from './reportWebVitals';
import './index.css';
import Constants from 'utils/Constants';

i18next.init({
  interpolation: { escapeValue: false },
  lng: Constants.LANGUAGE.EN,
  resources: {
    en: {
      common: common_en,
    },
    ru: {
      common: common_ru,
    },
  },
});

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <I18nextProvider i18n={i18next}>
          <App />
        </I18nextProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
