import React from 'react';
import './AppointmentDetails.css';
const AppointmentDetails = ({ appointments }) => {
  console.log(appointments);
  return (
    <div className="appointments">
      <h3>Upcoming Appointments</h3>
      {appointments.map((appointment) => (
        <div key={appointment.APPOINTMENT_ID} className="appointment-details">
          <p><strong>Appointment ID:</strong> {appointment.APPOINTMENT_ID}</p>
          <p><strong>Appointment Date:</strong> {appointment.APPOINTMENT_DATE.split('T')[0]}</p>
          <p><strong>Doctor ID:</strong> {appointment.DOCTOR_ID}</p>
          <p><strong>Doctor Name:</strong> {`${appointment.FIRST_NAME} ${appointment.LAST_NAME}`}</p>
          <p><strong>Email:</strong> {appointment.EMAIL}</p>
          <p><strong>Contact Number:</strong> {appointment.CONTACT_NO}</p>
          <p><strong>Start Time:</strong> {appointment.START_TIME}</p>
          <p><strong>End Time:</strong> {appointment.end_time}</p>
          <p><strong>Reason:</strong> {appointment.REASON}</p>
         <hr />
        </div>
      ))}
    </div>
  );
};

export default AppointmentDetails;
