import React from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BASE_API_URL } from '../utilities/CONSTANTS.jsx';
import { Formik, Form, Field } from 'formik';
import { TextField } from '@material-ui/core';

function PasswordResetRoute(props) {
  const { t } = props;
  const history = useHistory();

  const passwordReset = async (values) => {
    const { email } = values;
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = { email };
    await axios.post(`${BASE_API_URL}auth/users/reset_password/`, body, config);
    history.push('/');
  };

  return (
    <Formik initialValues={{ email: '' }} onSubmit={passwordReset}>
      <div>
        <h1>Password Reset</h1>
        <Form>
          <Field
            type="email"
            name="email"
            placeholder="Enter Email"
            as={TextField}
            fullWidth
          />
          <p style={{ color: 'red' }}>
            {t(
              'Please check your email after submitting this form and follow the instructions.'
            )}
          </p>
          <button type="submit">RESET</button>
        </Form>
      </div>
    </Formik>
  );
}

export default withTranslation()(PasswordResetRoute);
