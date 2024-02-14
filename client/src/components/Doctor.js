import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Doctor.css';

const Doctor = ({ userData }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState(null);

  const navigate = useNavigate();

  const handleChangePassword = () => {
    setShowPopup(true);
  };

  const handleAppointmentsClick = () => {
    navigate('/appointments');
  };

  const handleTaskListClick = () => {
    console.log('View Task List');
  };

  const handleEmergencyAlertsClick = () => {
    console.log('View Emergency Alerts');
  };

  const handleScheduleManagementClick = () => {
    console.log('Manage Schedule');
  };

  const handleFeedbackAndReviewsClick = () => {
    console.log('View Feedback and Reviews');
  };

  const handleSavePassword = async () => {
    if (newPassword === confirmPassword) {
      try {
        const response = await fetch('http://localhost:5000/changePassword', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID: userData.user.ID,
            currentPassword,
            newPassword,
          }),
        });
        if (response.ok) {
          setShowPopup(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
        } else {
          setChangePasswordError('Failed to change password. Please try again.');
        }
      } catch (error) {
        console.error('Error occurred:', error);
        setChangePasswordError('An error occurred. Please try again later.');
      }
    } else {
      setChangePasswordError('Passwords do not match.');
    }
  };

  const handleDiscardChanges = () => {
    setShowPopup(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePasswordError(null);
  };
  const handleLogout = () => {
    navigate('/');
  }

  return (
    <div className="doctor-container">
      <div className="doctor-info">
        <div className="profile-picture">
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <div className="personal-details">
          <h2>Your Info</h2>
          <div className="info-item">
            <span className="info-label">User ID:</span>
            <span className="info-value">{userData.user.ID}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{`${userData.user.FIRST_NAME} ${userData.user.LAST_NAME}`}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{userData.user.EMAIL}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date of Birth:</span>
            <span className="info-value">{userData.user.DATE_OF_BIRTH}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Contact No:</span>
            <span className="info-value">{userData.user.CONTACT_NO}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Salary:</span>
            <span className="info-value">{userData.user.SALARY}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Department:</span>
            <span className="info-value">{userData.user.DEPT_ID}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Gender:</span>
            <span className="info-value">{userData.user.GENDER}</span>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button className="appointment-btn" onClick={handleAppointmentsClick}>
          Appointments
        </button>
        <button className="change-password-btn" onClick={handleChangePassword}>
          Change Password
        </button>
      </div>

      {showPopup && (
        <div className="popup">
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleSavePassword}>Save</button>
          <button onClick={handleDiscardChanges}>Discard</button>
          {changePasswordError && <p className="error-msg">{changePasswordError}</p>}
        </div>
      )}

      <div className="additional-features">
        <button className="task-list-btn" onClick={handleTaskListClick}>
          View Task List
        </button>
        <button className="emergency-alerts-btn" onClick={handleEmergencyAlertsClick}>
          View Emergency Alerts
        </button>
        <button className="schedule-management-btn" onClick={handleScheduleManagementClick}>
          Manage Schedule
        </button>
        <button className="feedback-reviews-btn" onClick={handleFeedbackAndReviewsClick}>
          View Feedback and Reviews
        </button>
      </div>

      <div className="logout-btn">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Doctor;
