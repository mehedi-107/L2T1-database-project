// DoctorCard.js

import React from 'react';
import './DoctorCard.css'; // Import the CSS file for styling

const DoctorCard = ({ doctor }) => {
  const { name, specialization, experience, imageUrl } = doctor;

  return (
    <div className="doctor-card">
      <img src={imageUrl} alt={`${name}'s Photo`} className="doctor-image" />
      <div className="doctor-details">
        <h2>{name}</h2>
        <p>{specialization}</p>
        <p>Experience: {experience} years</p>
      </div>
    </div>
  );
};

export default DoctorCard;
