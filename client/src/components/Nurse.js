// Nurse.js
import React, { useState, useEffect } from 'react';
import './Nurse.css';

const Nurse = ({ userData }) => {
  const [showCabins, setShowCabins] = useState(false);
  const [showWards, setShowWards] = useState(false);
  const [nurseDutiesInCabins, setNurseDutiesInCabins] = useState([]);
  const [nurseDutiesInWards, setNurseDutiesInWards] = useState([]);

  const handleCabinsClick = async () => {
    setShowCabins(!showCabins);

    if (!showCabins) {
      try {
        const response = await fetch(`http://localhost:5000/nurseDutiesInCabins?nurseId=${userData.user.NURSE_ID}`);
        const data = await response.json();
        setNurseDutiesInCabins(data);
      } catch (error) {
        console.error('Error fetching nurse duties in cabins:', error);
      }
    }
  };

  const handleWardsClick = async () => {
    setShowWards(!showWards);

    if (!showWards) {
      try {
        const response = await fetch(`http://localhost:5000/nurseDutiesInWards?nurseId=${userData.user.NURSE_ID}`);
        const data = await response.json();
        setNurseDutiesInWards(data);
      } catch (error) {
        console.error('Error fetching nurse duties in wards:', error);
      }
    }
  };

  return (
    <div className='nurse-container'>
      <h2>Your Information</h2>
      <div>
        <p>User ID: {userData.user.NURSE_ID}</p>
        <p>First Name: {userData.user.FIRST_NAME}</p>
        <p>Last Name: {userData.user.LAST_NAME}</p>
        <p>Email: {userData.user.EMAIL_ID}</p>
        <p>Date of Birth: {userData.user.DATE_OF_BIRTH}</p>
        <p>Contact Number: {userData.user.CONTACT_NO}</p>
        <p>Gender: {userData.user.GENDER}</p>

        <button className="cabins-button" onClick={handleCabinsClick}>
          {showCabins ? 'Hide Duties in Cabins' : 'View Duties in Cabins'}
        </button>
        <br />
        <button className="wards-button" onClick={handleWardsClick}>
          {showWards ? 'Hide Duties in Wards' : 'View Duties in Wards'}
        </button>

        {showCabins && (
          <div>
            <h3>Nurse Duties in Cabins</h3>
            <table>
              <thead>
                <tr>
                  <th>Cabin Number</th>
                  <th>Floor Number</th>
                  <th>Patient ID</th>
                  <th>Day Doctor ID</th>
                  <th>Night Doctor ID</th>
                  <th>Cabin Type</th>
                  <th>Accompanied Nurse</th>
                </tr>
              </thead>
              <tbody>
                {nurseDutiesInCabins.map((duty) => (
                  <tr key={duty.CABIN_NO}>
                    <td>{duty.CABIN_NO}</td>
                    <td>{duty.FLOOR_NO}</td>
                    <td>{duty.PATIENT_ID}</td>
                    <td>{duty.DOCTOR_ID_DAY}</td>
                    <td>{duty.DOCTOR_ID_NIGHT}</td>
                    <td>{duty.CABIN_TYPE}</td>
                    <td>
                      {userData.user.NURSE_ID === duty.NURSE_ID_1
                        ? duty.NURSE_ID_2
                        : duty.NURSE_ID_1
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showWards && (
          <div>
            <h3>Nurse Duties in Wards</h3>
            <table>
              <thead>
                <tr>
                  <th>Ward Number</th>
                  <th>Floor Number</th>
                  <th>Day Doctor ID</th>
                  <th>Night Doctor ID</th>

                </tr>
              </thead>
              <tbody>
                {nurseDutiesInWards.map((duty) => (
                  <tr key={duty.WARD_ID}>
                    <td>{duty.WARD_NO}</td>
                    <td>{duty.FLOOR_NO}</td>
                    <td>{duty.DOCTOR_ID_DAY}</td>
                    <td>{duty.DOCTOR_ID_NIGHT}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nurse;
