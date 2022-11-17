import React from 'react';
import '../Form.css';

import Header from 'components/header/Header';
import Form from 'components/form/Form';
import Constants from 'utils/Constants';

function Registration() {
  return (
    <>
      <Header />
      <Form type={Constants.FORM_TYPE.REGISTRATION} />
    </>
  );
}

export default Registration;
