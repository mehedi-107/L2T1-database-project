import React, { useEffect, useState } from 'react';
import './Appointments.css';
import AppointmentCard from './AppointmentCard';

const Appointments = ({ userData }) => {
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [result, setResult] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/appointments?doctorId=${userData.user.DOCTOR_ID}`);
        const data = await response.json();
        console.log(data);
        const sortedAppointments = data.sort((a, b) => {
          const dateComparison = Date.parse(a.APPOINTMENT_DATE) - Date.parse(b.APPOINTMENT_DATE);
          return dateComparison !== 0 ? dateComparison : a.APPOINTMENT_ID - b.APPOINTMENT_ID;
        });

        setAppointments(sortedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [userData]);

  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const markCompleted = (appointmentId, result, paymentComplete, paymentAmount) => {
    setSelectedAppointmentId(appointmentId);
    setResult(result);
    setShowModal(true);
    // Handle marking the appointment as completed and updating the result and payment details
  };

  const removeFromList = (appointmentIdToRemove) => {
    setAppointments(prevAppointments =>
      prevAppointments.filter(appointment => appointment.APPOINTMENT_ID !== appointmentIdToRemove)
    );
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

      // Remove the appointment from the list
      removeFromList(selectedAppointmentId);

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
      {currentAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment.APPOINTMENT_ID}
          appointment={appointment}
          markCompleted={markCompleted}
          removeFromList={removeFromList} // Pass the function to remove from the list
        />
      ))}
      {/* Pagination and other UI elements */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentAppointments.length < appointmentsPerPage}>Next</button>
      </div>
   </div>
  );
};

export default Appointments;
