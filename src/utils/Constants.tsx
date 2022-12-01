const Constants = {
  APP_URL: 'https://project-management-app-be-production.up.railway.app/',
  AUTH_API: {
    SIGN_UP: 'auth/signup',
    SIGN_IN: 'auth/signin',
  },
  DND_TYPE: {
    BOARD: 'Board',
    COLUMN: 'Column',
  },
  ERROR_STATUS: {
    EXPIRED: '403',
    NOT_FOUND: '404',
  },
  PAGE: {
    WELCOME: 'welcome',
    MAIN: 'main',
    NOT_FOUND: '404',
    BOARD: 'board',
    EDIT: 'edit',
  },

  TOAST_TYPE: {
    ERROR: 'error',
    SUCCESS: 'success',
  },

  HEADER_HEIGHT: 200,

  FORM_TYPE: {
    LOGIN: 'login',
    REGISTRATION: 'registration',
  },

  LANGUAGE: {
    RU: 'ru',
    EN: 'en',
  },
};
export default Constants;
