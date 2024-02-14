import React, { useState } from 'react';

import './Doctor.css';

const Doctor = ({ userData , goToAppointments}) => {
  console.log(userData);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState(null);

  const handleChangePassword = () => {
    setShowPopup(true);
  };
  const handleAppointmentsClick = () => {
    goToAppointments();
    console.log(userData.user);
    
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

  return (
    <div class='doctor-container'>
      <h2>Your Info
      </h2>
      <div>
      
      <p>User ID: {userData.user.ID}</p>
      <p>First Name: {userData.user.FIRST_NAME}</p>
      <p>Last Name: {userData.user.LAST_NAME}</p>
      <p>Email: {userData.user.EMAIL}</p>
      <p>DATE_OF_BIRTH:{userData.user.DATE_OF_BIRTH}</p>
      <p>CONTACT_NO:{userData.user.CONTACT_NO}</p>
      <p>Salary: {userData.user.SALARY}</p>
      <p>Department: {userData.user.DEPT_ID}</p>
      <p>Gender: {userData.user.GENDER}</p>
      <button onClick={handleAppointmentsClick}>Appointments</button>
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
      
      {/* <Link to="/appointments">
        <button>Appointments</button>
      </Link> */}
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
      
    </div>
    
  );
};

export default Doctor;
