import React, { useEffect, useState } from 'react';
import './Appointments.css';

const Appointments = (userData) => {
  let x = userData;
  console.log("x", x.userData.user.DOCTOR_ID);
  let dcID = x.userData.user.DOCTOR_ID;

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/appointments?doctorId=${dcID}`);
        const data = await response.json();

        const sortedAppointments = data.sort((a, b) => {
          const dateComparison = Date.parse(a.APPOINTMENT_DATE) - Date.parse(b.APPOINTMENT_DATE);
          return dateComparison !== 0 ? dateComparison : a.APPOINTMENT_ID - b.APPOINTMENT_ID;
        });

        setAppointments(sortedAppointments);
        console.log(sortedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [dcID]);

  return (
    <div className='appointment-container'>
      <h2>Upcoming Appointments</h2>
      

<table className='table table-striped'>
  <thead>
    <tr>
      <th>Appointment ID</th>
      <th>Patient ID</th>
      <th>Date</th>
      <th>Start time</th>
      {/* <th>Reason</th> */}
    </tr>
  </thead>
  <tbody>
  {appointments.map((appointment) => (
  <tr key={`${appointment.APPOINTMENT_DATE}-${appointment.APPOINTMENT_ID}`}>
    <td>{appointment.APPOINTMENT_ID}</td>
    <td>{appointment.PATIENT_ID}</td>
    <td>{appointment.APPOINTMENT_DATE.split('T')[0]}</td>
    <td>{appointment.START_TIME}</td>
    {/* <td>{appointment.REASON}</td> */}
  </tr>
))}

  </tbody>
</table>
    </div>
  );
};

export default Appointments;
