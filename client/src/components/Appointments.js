import React, { useEffect, useState } from 'react';
import './Appointments.css';

const Appointments = (userData) => {
  let x = userData;
  console.log("x", x.userData.user.DOCTOR_ID);
  let dcID = x.userData.user.DOCTOR_ID;

  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [result, setResult] = useState('');

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

  const markCompleted = (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    setShowModal(true);
  };

  const submitResult = async () => {
    try {
      await fetch(`http://localhost:5000/markCompleted`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: selectedAppointmentId,
          result,
        }),
      });

      // Update the state to reflect the change
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.APPOINTMENT_ID === selectedAppointmentId
            ? { ...appointment, COMPLETED: true }
            : appointment
        )
      );

      // Close the modal and reset result
      setShowModal(false);
      setResult('');
    } catch (error) {
      console.error('Error marking appointment as completed:', error);
    }
  };

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
            <th>Completed</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((appointment) => (
            <tr key={`${appointment.APPOINTMENT_DATE}-${appointment.APPOINTMENT_ID}`}>
              <td>{appointment.APPOINTMENT_ID}</td>
              <td>{appointment.PATIENT_ID}</td>
              <td>{appointment.APPOINTMENT_DATE.split('T')[0]}</td>
              <td>{appointment.START_TIME}</td>
              <td>
                {appointment.COMPLETED ? (
                  <span>Completed</span>
                ) : (
                  <button onClick={() => markCompleted(appointment.APPOINTMENT_ID)}>Mark Completed</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>&times;</span>
            <h2>Enter Appointment Result</h2>
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              placeholder="Enter result..."
              rows="4"
              cols="50"
            />
            <button onClick={submitResult}>Submit</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
