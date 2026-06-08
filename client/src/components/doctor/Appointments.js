import React, { useEffect, useState } from 'react';
import './Appointments.css';
import AppointmentCard from './AppointmentCard';

const Appointments = ({ userData }) => {
  const [appointments, setAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`/appointments?doctorId=${userData.user.DOCTOR_ID}`);
        const data = await response.json();
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

  const removeFromList = (appointmentIdToRemove) => {
    setAppointments(prevAppointments =>
      prevAppointments.filter(appointment => appointment.APPOINTMENT_ID !== appointmentIdToRemove)
    );
  };

  return (
    <div className='appointment-container'>
      <h2>Upcoming Appointments</h2>
      {currentAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment.APPOINTMENT_ID}
          appointment={appointment}
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
