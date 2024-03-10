// DoctorInfo.js
import React from 'react';
import './DoctorInfo.css';
import image from './dummy.jpeg';   
const DoctorInfo = ({ userData }) => {
  return (
    <div className="doctor-info">
      <div className="doctor-profile-picture">
        <img src={image} alt="Doctor" />
      </div>
      <div className="doctor-personal-details">
        <div className="doctor-info-item">
          <span className="doctor-info-label">User ID:</span>
          <span className="doctor-info-value"> {userData.user.DOCTOR_ID}</span>
        </div>
        <div className="doctor-info-item">
          <span className="doctor-info-label">Name:</span>
          <span className="doctor-info-value"> {`${userData.user.FIRST_NAME} ${userData.user.LAST_NAME}`}</span>
        </div>
        <div className="doctor-info-item">
          <span className="doctor-info-label">Email:</span>
          <span className="doctor-info-value"> {userData.user.EMAIL}</span>
        </div>
        <div className="doctor-info-item">
          <span className="doctor-info-label">Date of Birth:</span>
          <span className="doctor-info-value">{userData.user.DATE_OF_BIRTH.split('T')[0]}</span>
        </div>
        <div className="doctor-info-item">
          <span className="doctor-info-label">Contact No:</span>
          <span className="doctor-info-value">{userData.user.CONTACT_NO}</span>
        </div>
        <div className="doctor-info-item">
          <span className="doctor-info-label">Salary:</span>
          <span className="doctor-info-value">{userData.user.SALARY}</span>
        </div>
        <div className="doctor-info-item">
          <span className="doctor-info-label">Department:</span>
          <span className="doctor-info-value">{userData.user.DEPT_ID}</span>
        </div>
        <div className="doctor-info-item">
          <span className="doctor-info-label">Gender:</span>
          <span className="doctor-info-value">{userData.user.GENDER}</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;
