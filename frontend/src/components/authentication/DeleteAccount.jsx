import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { BASE_API_URL } from '../utilities/CONSTANTS.jsx';
import axiosInstance from "../utilities/axios.jsx";

function DeleteAccountRoute(props) {
  const { t } = props;
  const [currentPassword, setCurrentPassword] = useState('');
  const [DeleteMessage, setDeleteMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const history = useHistory();

  const handlePasswordChange = (e) => {
    setCurrentPassword(e.target.value);
  };

  const resetPassword = async () => {
    const { t } = props;
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const body = { currentPassword: currentPassword };
    try {
      await axiosInstance.delete(`${BASE_API_URL}auth/users/me/`, { data: body, headers: config.headers});
      setDeleteMessage(t('You have successfully deleted your account. Bye.'));
      setShowFeedback(true);
      setTimeout(() => {
        setShowFeedback(false);
        history.push('/');
      }, 3000); // Redirect after 3 seconds
    } catch (err) {
      setDeleteMessage(t('You were unable to delete your account. Please try again.'));
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
        <h1>{DeleteMessage}</h1>
        <div>
          <label>{t('Current Password')}:</label>
          <input type="password" value={currentPassword} onChange={handlePasswordChange} />
        </div>
        <button type="button" onClick={resetPassword}>
          {t('Delete Account')}
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

export default withTranslation()(DeleteAccountRoute);
