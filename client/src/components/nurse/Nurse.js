import React, { useState, useEffect } from 'react';
import './Nurse.css';
import Notification from './Notification';
import image1 from './logo2.png'; // Make sure to import your image file

const Nurse = ({ userData, onLogout }) => {
  const [showCabins, setShowCabins] = useState(false);
  const [showWards, setShowWards] = useState(false);
  const [nurseDutiesInCabins, setNurseDutiesInCabins] = useState([]);
  const [nurseDutiesInWards, setNurseDutiesInWards] = useState([]);
  const [showNotification, setShowNotification] = useState(false); 
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState(null);

  useEffect(() => {
    const fetchNurseDuties = async () => {
      try {
        const responseCabins = await fetch(`/nurseDutiesInCabins?nurseId=${userData.user.NURSE_ID}`);
        const dataCabins = await responseCabins.json();
        setNurseDutiesInCabins(dataCabins);
        const responseWards = await fetch(`/nurseDutiesInWards/${userData.user.NURSE_ID}`);
        const dataWards = await responseWards.json();
        setNurseDutiesInWards(dataWards);
      } catch (error) {
        console.error('Error fetching nurse duties:', error);
      }
    };

    fetchNurseDuties();
  }, [userData.user.NURSE_ID]);

  const handleCabinsClick = () => {
    setShowCabins(!showCabins);
  };

  const handleWardsClick = () => {
    setShowWards(!showWards);
  };

  const handleNotification = () => {
    setShowNotification(!showNotification); // Toggle notification visibility
  };

  const handleLogout = () => {
    onLogout?.();
    window.location.href = '/';
  };

  const handlePopupClose = () => {
    setShowPasswordPopup(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePasswordError(null);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setChangePasswordError('Please fill in all fields.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setChangePasswordError('New password and confirm password do not match.');
      return;
    }
  
    try {
      const response = await fetch(`/changePassword/${userData.user.NURSE_ID}/${currentPassword}/${newPassword}/nurse`, {
        method: 'GET',
      });
      const data = await response.json();
      if (data.error) {
        setChangePasswordError(data.error);
      } else if (data.triggerMessage === 'PASSWORD DOES NOT MEET CRITERIA') {
        setChangePasswordError('Password should contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character');
      } else if (data.triggerMessage === 'Invalid current password') {
        setChangePasswordError('Current password is incorrect');
      } else {
        alert('Password changed successfully');
        setShowPasswordPopup(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setChangePasswordError(null);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setChangePasswordError('An error occurred while changing the password.');
    }
  };
  
  return (
    <div className='nurse-container'>
      <header className="nurse-header">
        <div className="logo">
          <img src={image1} alt="Health Harbor Logo" />
        </div>
        <nav className="navbar">
          <button onClick={() => setShowPasswordPopup(true)}>Change Password</button> 
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleNotification}>Notifications</button>
        </nav>
      </header>
      {showPasswordPopup && (
        <div className="patient-popup">
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
          <button onClick={handleChangePassword}>Save</button>
          <button onClick={handlePopupClose}>Cancel</button>
          {changePasswordError && <p className="patient-error-msg">{changePasswordError}</p>}
        </div>
      )}

      {showNotification && (
        <Notification nurseId={userData.user.NURSE_ID} onClose={handleNotification} />
      )}
      <div className="nurse-info">
        <h2>Your Information</h2>
        <div className="info-details">
          <p>User ID: {userData.user.NURSE_ID}</p>
          <p>First Name: {userData.user.FIRST_NAME}</p>
          <p>Last Name: {userData.user.LAST_NAME}</p>
          <p>Email: {userData.user.EMAIL_ID}</p>
          <p>Date of Birth: {userData.user.DATE_OF_BIRTH}</p>
          <p>Contact Number: {userData.user.CONTACT_NO}</p>
          <p>Gender: {userData.user.GENDER}</p>
        </div>
      </div>

      <div className="duty-buttons">
        <button className="cabins-button" onClick={handleCabinsClick}>
          {showCabins ? 'Hide Duties in Cabins' : 'View Duties in Cabins'}
        </button>
        <button className="wards-button" onClick={handleWardsClick}>
          {showWards ? 'Hide Duties in Wards' : 'View Duties in Wards'}
        </button>
      </div>

      {showCabins && (
  <div className="nurse-duties">
    <h3>Nurse Duties in Cabins</h3>
    {nurseDutiesInCabins.map((cabin, index) => (
      <div key={index} className="cabin-info">
        <h4>Cabin No: {cabin.CABIN_NO}</h4>
        <table>
          <tbody>
            <tr>
              <td colSpan="2"><strong>Patient Information</strong></td>
            </tr>
            <tr>
              <td>Patient Name:</td>
              <td>{cabin.PATIENT_NAME}</td>
            </tr>
            <tr>
              <td>Patient Email:</td>
              <td>{cabin.PATIENT_EMAIL_ID}</td>
            </tr>
            <tr>
              <td>Patient Contact No:</td>
              <td>{cabin.PATIENT_CONTACT_NO}</td>
            </tr>
            <tr>
              <td colSpan="2"><strong>Doctor Information</strong></td>
            </tr>
            <tr>
              <td>Doctor Name(Day):</td>
              <td>{cabin.DOCTOR_NAME_DAY}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{cabin.DOCTOR_EMAIL_DAY}</td>
            </tr>
            <tr>
              <td>Contact No:</td>
              <td>{cabin.DOCTOR_CONTACT_NO_DAY}</td>
            </tr>
            <tr>
              <td>Doctor Name(Night):</td>
              <td>{cabin.DOCTOR_NAME_NIGHT}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{cabin.DOCTOR_EMAIL_NIGHT}</td>
            </tr>
            <tr>
              <td>Contact No:</td>
              <td>{cabin.DOCTOR_CONTACT_NO_NIGHT}</td>
            </tr>

            <tr>
              <td colSpan="2"><strong>Nurse Information</strong></td>
            </tr>
            <tr>
              <td>Nurse 1:</td>
              <td>{cabin.NURSE_1_NAME}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{cabin.NURSE_1_EMAIL}</td>
            </tr>
            <tr>
              <td>Contact No:</td>
              <td>{cabin.NURSE_1_CONTACT_NO}</td>
            </tr>
            <tr>
              <td>Nurse 2:</td>
              <td>{cabin.NURSE_2_NAME}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{cabin.NURSE_2_EMAIL}</td>
            </tr>
            <tr>
              <td>Contact No:</td>
              <td>{cabin.NURSE_2_CONTACT_NO}</td>
            </tr>
            
          </tbody>
        </table>
      </div>
    ))}
  </div>
)}

{showWards && (
  <div className="nurse-duties">
    <h3>Nurse Duties in Wards</h3>
    {nurseDutiesInWards.map((ward, index) => (
      <div key={index} className="ward-info">
        <h4>Ward No: {ward.WARD_NO}</h4>
        <table>
          <tbody>
            <tr>
              <td colSpan="2"><strong>Doctor Information</strong></td>
            </tr>
            <tr>
              <td>Day Doctor Name:</td>
              <td>{ward.DOCTOR_DAY_NAME}</td>
            </tr>
            <tr>
              <td>Day Doctor Email:</td>
              <td>{ward.DOCTOR_DAY_EMAIL}</td>
            </tr>
            <tr>
              <td>Day Doctor Contact No:</td>
              <td>{ward.DOCTOR_DAY_CONTACT}</td>
            </tr>
            <tr>
              <td>Day Doctor Specialization:</td>
              <td>{ward.DOCTOR_DAY_SPECIALIZATION}</td>
            </tr>
            <tr>
              <td>Night Doctor Name:</td>
              <td>{ward.DOCTOR_NIGHT_NAME}</td>
            </tr>
            <tr>
              <td>Night Doctor Email:</td>
              <td>{ward.DOCTOR_NIGHT_EMAIL}</td>
            </tr>
            <tr>
              <td>Night Doctor Contact No:</td>
              <td>{ward.DOCTOR_NIGHT_CONTACT}</td>
            </tr>
            <tr>
              <td>Night Doctor Specialization:</td>
              <td>{ward.DOCTOR_NIGHT_SPECIALIZATION}</td>
            </tr>

            <tr>
              <td colSpan="2"><strong>Nurse Information</strong></td>
            </tr>
            <tr>
              <td>Nurse 1 Name:</td>
              <td>{ward.NURSE_1_NAME}</td>
            </tr>
            <tr>
              <td>Nurse 1 Email:</td>
              <td>{ward.NURSE_1_EMAIL}</td>
            </tr>
            <tr>
              <td>Nurse 1 Contact No:</td>
              <td>{ward.NURSE_1_CONTACT}</td>
            </tr>
            <tr>
              <td>Nurse 2 Name:</td>
              <td>{ward.NURSE_2_NAME}</td>
            </tr>
            <tr>
              <td>Nurse 2 Email:</td>
              <td>{ward.NURSE_2_EMAIL}</td>
            </tr>
            <tr>
              <td>Nurse 2 Contact No:</td>
              <td>{ward.NURSE_2_CONTACT}</td>
            </tr>
            <tr>
              <td>Nurse 3 Name:</td>
              <td>{ward.NURSE_3_NAME}</td>
            </tr>
            <tr>
              <td>Nurse 3 Email:</td>
              <td>{ward.NURSE_3_EMAIL}</td>
            </tr>
            <tr>
              <td>Nurse 3 Contact No:</td>
              <td>{ward.NURSE_3_CONTACT}</td>
            </tr>
            <tr>
              <td>Nurse 4 Name:</td>
              <td>{ward.NURSE_4_NAME}</td>
            </tr>
            <tr>
              <td>Nurse 4 Email:</td>
              <td>{ward.NURSE_4_EMAIL}</td>
            </tr>
            <tr>
              <td>Nurse 4 Contact No:</td>
              <td>{ward.NURSE_4_CONTACT}</td>
            </tr>
          </tbody>
        </table>
      </div>
    ))}
  </div>
)}


      

      <footer className="footer">
        <p>&copy; 2024 Your Hospital Name</p>
      </footer>
    </div>
  );
};

export default Nurse;
