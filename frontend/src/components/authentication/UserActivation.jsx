import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import {BASE_API_URL} from "../utilities/CONSTANTS.jsx";

function ActivateRoute(props) {
  const { t } = props;
  const { uid, token } = props.computedMatch.params;
  const [activationMessage, setActivationMessage] = useState('');

  useEffect(() => {
    const activateAccount = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const body = {'uid': uid, 'token': token };
      try {
        await axios.post(
          `${BASE_API_URL}auth/users/activation/`,
          body,
          config
        );
        setActivationMessage(t('Your account has been activated successfully. You can now login.'));
      } catch (err) {
        setActivationMessage(t('Activation failed. Please try again.'));
      }
    };

    activateAccount();
  }, [t, uid, token]);

  return (
    <div className="container">
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '50vh'}}
      >
        <h1>{activationMessage}</h1>
      </div>
    </div>
  );
}

export default withTranslation()(ActivateRoute);
