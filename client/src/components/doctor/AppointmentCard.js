import React, { useState } from 'react';
import './AppointmentCard.css';

const AppointmentCard = ({ appointment, removeFromList }) => {
  const [result, setResult] = useState('');
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [error, setError] = useState('');
  const [detailsVisible, setDetailsVisible] = useState(false); // State to track whether details are visible
  
  const calculateAge = (dateString) => {
    const dob = new Date(dateString);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };
  const toggleDetails = () => {
    setDetailsVisible(!detailsVisible); // Toggle the state to show/hide details
  };
  const handleMarkCompleted = async () => {
    if (!result.trim()) {
      setError('Please enter a result before marking as completed.');
      return;
    }

    if (paymentComplete && paymentAmount <= 0) {
      setError('Please enter a valid payment amount.');
      return;
    }

    try {
      const response = await fetch('/markCompleted', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: appointment.APPOINTMENT_ID,
          result,
        }),
      });

      if (response.ok) {
        // If the server request is successful, remove the appointment from the list
        removeFromList(appointment.APPOINTMENT_ID);
        // Reset form fields
        setResult('');
        setPaymentComplete(false);
        setPaymentAmount(0);
      } else {
        throw new Error('Failed to mark appointment as completed.');
      }
    } catch (error) {
      console.error('Error marking appointment as completed:', error);
      setError('Failed to mark appointment as completed. Please try again later.');
    }
  };

  return (
    <div className='appointment-card'>
      {detailsVisible && <h3>Appointment Information</h3>}
      <div>
        <b>Appointment ID: {appointment.APPOINTMENT_ID}</b>
        <p>Date: {appointment.APPOINTMENT_DATE.split('T')[0]}</p>
        <p>Start Time: {appointment.START_TIME}</p>
        {detailsVisible && <b>Reason: {appointment.REASON}</b>}
        <br></br>
        {!detailsVisible && <button onClick={toggleDetails}>See Details</button>}
      </div>
      <br></br>
      {detailsVisible && (
        <>
          <div>
            <h3>Patient Information</h3>
            <p>Patient ID: {appointment.PATIENT_ID}</p>
            <p>Name: {appointment.FIRST_NAME} {appointment.LAST_NAME}</p>
            <p>Email: {appointment.EMAIL_ID}</p>
            <p>Gender: {appointment.GENDER}</p>
            <p>Age: {calculateAge(appointment.DATE_OF_BIRTH)}</p>
            <p>Contact No: {appointment.CONTACT_NO}</p>
          <br></br>
          </div>

          <div>
            <h3>Billing Information</h3>
            <br></br>
            <h4>DUE: {appointment.AMOUNT_DUE}$</h4>
            <label>
              Payment Complete:
              
              <input placeholder='Enter payment amount'
                type='checkbox'
                checked={paymentComplete}
                onChange={(e) => setPaymentComplete(e.target.checked)}
              />
            </label>
            
            {paymentComplete && (
              <input
                type='number'
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder='Enter payment amount'
              />
            )}
          </div>

          <div>
            <h3>Doctor Actions</h3>
            <label>
              Result:
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder='Enter result...'
                rows='4'
                cols='50'
              />
            </label>
            <button onClick={handleMarkCompleted}>Mark Complete</button>
            <button onClick={toggleDetails}>Hide Details</button>
            {error && <p className='error'>{error}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentCard;
