import React from 'react';

const CabinDetails = ({ cabin }) => {
  if (!cabin || cabin.error) {
    return (
      <div className="cabin-details">
        <h3>Cabin Details</h3>
        <p>You are not admitted to any cabin.</p>
      </div>
    );
  }

  return (
    <div className="cabin-details">
      <h3>Cabin Details</h3>
      <table>
        <tbody>
          <tr>
            <td><strong>Cabin Number:</strong></td>
            <td>{cabin.CABIN_NO}</td>
          </tr>
          <tr>
            <td><strong>Cabin Type:</strong></td>
            <td>{cabin.CABIN_TYPE}</td>
          </tr>
          <tr>
            <td><strong>Floor Number:</strong></td>
            <td>{cabin.FLOOR_NO}</td>
          </tr>
          <tr>
            <td><strong>Patient ID:</strong></td>
            <td>{cabin.PATIENT_ID}</td>
          </tr>
          <tr>
            <td colSpan="2"><strong>Day Doctor</strong></td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{cabin.DOCTOR_NAME_DAY}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{cabin.DOCTOR_EMAIL_DAY}</td>
          </tr>
          <tr>
            <td>Contact Number:</td>
            <td>{cabin.DOCTOR_CONTACT_NO_DAY}</td>
          </tr>
          <tr>
            <td colSpan="2"><strong>Night Doctor</strong></td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{cabin.DOCTOR_NAME_NIGHT}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{cabin.DOCTOR_EMAIL_NIGHT}</td>
          </tr>
          <tr>
            <td>Contact Number:</td>
            <td>{cabin.DOCTOR_CONTACT_NO_NIGHT}</td>
          </tr>
          <tr>
            <td colSpan="2"><strong>Nurse 1</strong></td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{cabin.NURSE_1_NAME}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{cabin.NURSE_1_EMAIL}</td>
          </tr>
          <tr>
            <td>Contact Number:</td>
            <td>{cabin.NURSE_1_CONTACT_NO}</td>
          </tr>
          <tr>
            <td colSpan="2"><strong>Nurse 2</strong></td>
          </tr>
          <tr>
            <td>Name:</td>
            <td>{cabin.NURSE_2_NAME}</td>
          </tr>
          <tr>
            <td>Email:</td>
            <td>{cabin.NURSE_2_EMAIL}</td>
          </tr>
          <tr>
            <td>Contact Number:</td>
            <td>{cabin.NURSE_2_CONTACT_NO}</td>
          </tr>
          <tr>
            <td><strong>Admission Reason:</strong></td>
            <td>{cabin.ADMISSION_REASON}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CabinDetails;
