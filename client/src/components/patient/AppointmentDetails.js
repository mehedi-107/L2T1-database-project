import React from 'react';

const AppointmentDetails = ({ appointments }) => {
  return (
    <div className="appointments">
      <h3>Upcoming Appointments</h3>
      <table>
        <thead>
          <tr>
            <th>Appointment ID</th>
            <th>Appointment Date</th>
            <th>Doctor ID</th>
            <th>Doctor Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.APPOINTMENT_ID}>
              <td>{appointment.APPOINTMENT_ID}</td>
              <td>{appointment.APPOINTMENT_DATE.split('T')[0]}</td>
              <td>{appointment.DOCTOR_ID}</td>
              <td>{`${appointment.FIRST_NAME} ${appointment.LAST_NAME}`}</td>
              <td>{appointment.EMAIL}</td>
              <td>{appointment.CONTACT_NO}</td>
              <td>{appointment.START_TIME}</td>
              <td>{appointment.end_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentDetails;
