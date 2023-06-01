import React, { useState } from 'react';
import axios from 'axios';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BASE_API_URL } from '../utilities/CONSTANTS.jsx';

function PasswordResetConfirmationRoute(props) {
  const { t } = props;
  const { uid, token } = props.computedMatch.params;
  const [newPassword, setNewPassword] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const history = useHistory();

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const resetPassword = async () => {
    const { t } = props;
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = { uid, token, new_password: newPassword };
    try {
      await axios.post(`${BASE_API_URL}auth/users/reset_password_confirm/`, body, config);
      setResetMessage(t('Your password has been reset successfully. You can now login with the new password.'));
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        history.push('/');
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setResetMessage(t('Password reset failed. Please try again.'));
      setShowFeedback(true);
    }
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
  };

  return (
    <div className="container">
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: '50vh' }}
      >
        <h1>{resetMessage}</h1>
        <div>
          <label>{t('New Password')}:</label>
          <input type="password" value={newPassword} onChange={handlePasswordChange} />
        </div>
        <button type="button" onClick={resetPassword}>
          {t('Reset Password')}
        </button>
      </div>
      {showFeedback && (
        <div className="feedback-popup">
          <button type="button" onClick={handleFeedbackClose}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}

export default withTranslation()(PasswordResetConfirmationRoute);
