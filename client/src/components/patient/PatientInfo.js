// PatientInfo.js
import React from 'react';

const PatientInfo = ({ userData }) => {
  return (
    <div className="patient-details">
      <div className="patient-image">
        {/* Add patient image here */}
      </div>
      <div className="patient-info">
        <p className="info-item"><span>User ID:</span> {userData.user.PATIENT_ID}</p>
        <p className="info-item"><span>Name:</span> {`${userData.user.FIRST_NAME} ${userData.user.LAST_NAME}`}</p>
        <p className="info-item"><span>Email:</span> {userData.user.EMAIL_ID}</p>
        <p className="info-item"><span>Date of Birth:</span> {userData.user.DATE_OF_BIRTH}</p>
        <p className="info-item"><span>Contact Number:</span> {userData.user.CONTACT_NO}</p>
        <p className="info-item"><span>Gender:</span> {userData.user.GENDER}</p>
      </div>
    </div>
  );
};

export default PatientInfo;
