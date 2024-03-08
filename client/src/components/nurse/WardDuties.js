// WardDuties.js
import React from 'react';

const WardDuties = ({ nurseDutiesInWards }) => {
  return (
    <div className="nurse-duties">
      <h3>Nurse Duties in Wards</h3>
      {nurseDutiesInWards.map((ward, index) => (
        <div key={index} className="ward-info">
          {/* Display ward duties here */}
        </div>
      ))}
    </div>
  );
};

export default WardDuties;
