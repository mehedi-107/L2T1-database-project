import React from 'react';

const WardDetails = ({ ward }) => {
  if (!ward || ward.error) {
    return (
      <div className="ward-details">
        <h3>Ward Details</h3>
        <p>You are not admitted in any ward.</p>
      </div>
    );
  }
  return (
    <div className="ward-details">
      <h3>Ward Details</h3>
      <div className="ward-info">
        <table>
          <tbody>
            <tr>
              <td><strong>Ward Number:</strong></td>
              <td>{ward.WARD_NO}</td>
            </tr>
            <tr>
              <td><strong>Floor Number:</strong></td>
              <td>{ward.FLOOR_NO}</td>
            </tr>
            <tr>
              <td><strong>Day Doctor ID:</strong></td>
              <td>{ward.DOCTOR_ID_DAY}</td>
            </tr>
            <tr>
              <td><strong>Night Doctor ID:</strong></td>
              <td>{ward.DOCTOR_ID_NIGHT}</td>
            </tr>
            <tr>
              <td><strong>Admission Reason:</strong></td>
              <td>{ward.ADMISSION_REASON}</td>
            </tr>
            <tr>
              <td><strong>Day Doctor:</strong></td>
              <td>{ward.DOCTOR_NAME_DAY}</td>
            </tr>
            <tr>
              <td><strong>Day Doctor Email:</strong></td>
              <td>{ward.DOCTOR_EMAIL_DAY}</td>
            </tr>
            <tr>
              <td><strong>Day Doctor Contact Number:</strong></td>
              <td>{ward.DOCTOR_CONTACT_NO_DAY}</td>
            </tr>
            <tr>
              <td><strong>Night Doctor:</strong></td>
              <td>{ward.DOCTOR_NAME_NIGHT}</td>
            </tr>
            <tr>
              <td><strong>Night Doctor Email:</strong></td>
              <td>{ward.DOCTOR_EMAIL_NIGHT}</td>
            </tr>
            <tr>
              <td><strong>Night Doctor Contact Number:</strong></td>
              <td>{ward.DOCTOR_CONTACT_NO_NIGHT}</td>
            </tr>
            <tr>
              <td><strong>Nurse 1:</strong></td>
              <td>{ward.NURSE_1_NAME}</td>
            </tr>
            <tr>
              <td><strong>Nurse 1 Email:</strong></td>
              <td>{ward.NURSE_1_EMAIL}</td>
            </tr>
            <tr>
              <td><strong>Nurse 1 Contact Number:</strong></td>
              <td>{ward.NURSE_1_CONTACT_NO}</td>
            </tr>
            <tr>
              <td><strong>Nurse 2:</strong></td>
              <td>{ward.NURSE_2_NAME}</td>
            </tr>
            <tr>
              <td><strong>Nurse 2 Email:</strong></td>
              <td>{ward.NURSE_2_EMAIL}</td>
            </tr>
            <tr>
              <td><strong>Nurse 2 Contact Number:</strong></td>
              <td>{ward.NURSE_2_CONTACT_NO}</td>
            </tr>
            <tr>
              <td><strong>Nurse 3:</strong></td>
              <td>{ward.NURSE_3_NAME}</td>
            </tr>
            <tr>
              <td><strong>Nurse 3 Email:</strong></td>
              <td>{ward.NURSE_3_EMAIL}</td>
            </tr>
            <tr>
              <td><strong>Nurse 3 Contact Number:</strong></td>
              <td>{ward.NURSE_3_CONTACT_NO}</td>
            </tr>
            <tr>
              <td><strong>Nurse 4:</strong></td>
              <td>{ward.NURSE_4_NAME}</td>
            </tr>
            <tr>
              <td><strong>Nurse 4 Email:</strong></td>
              <td>{ward.NURSE_4_EMAIL}</td>
            </tr>
            <tr>
              <td><strong>Nurse 4 Contact Number:</strong></td>
              <td>{ward.NURSE_4_CONTACT_NO}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WardDetails;
