import React from 'react';

const CabinDuties = ({ nurseDutiesInCabins }) => {
  return (
    <div className="nurse-duties">
      <h3>Nurse Duties in Cabins</h3>
      {nurseDutiesInCabins.map((cabin, index) => (
        <div key={index} className="cabin-info">
          <h4>Cabin No: {cabin.CABIN_NO}</h4>
          <table>
            <tbody>
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
                <td>Nurse 1:</td>
                <td>{cabin.NURSE_1_NAME}</td>
                <td>Email:</td>
                <td>{cabin.NURSE_1_EMAIL}</td>
                <td>Contact No:</td>
                <td>{cabin.NURSE_1_CONTACT_NO}</td>
              </tr>
              <tr>
                <td>Nurse 2:</td>
                <td>{cabin.NURSE_2_NAME}</td>
                <td>Email:</td>
                <td>{cabin.NURSE_2_EMAIL}</td>
                <td>Contact No:</td>
                <td>{cabin.NURSE_2_CONTACT_NO}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default CabinDuties;
