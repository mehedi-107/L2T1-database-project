import React, { useState, useEffect } from 'react';
import './DoctorCard.css';

const DoctorCard = ({ doctor, patient }) => {
  
  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const handleGetAppointmentClick = (doctorId) => {
    setShowPopup(true);
  };

  const handleViewProfile = (doctorId) => {
    window.location.href = `/doctor/${doctorId}`;
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    console.log(doctor);
  console.log(patient);
  };

  const handleFormSubmit = async (e) => {
    console.log(doctor);
  console.log(patient);
    e.preventDefault();

    const data = {
      doctor: doctor.DOCTOR_ID,
      time: selectedTimeSlot.split(' ')[1], // Extract time from selectedTimeSlot
      date: selectedDate,
      patientId: patient.PATIENT_ID,
    };

    try {
      const response = await fetch('http://localhost:5000/submitAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        setSubmissionStatus('success');
        setTimeout(() => {
          setShowPopup(false); // Hide the popup after a delay
        }); // Adjust the delay as needed
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error('Error submitting appointment:', error);
      setSubmissionStatus('error');
    }
};
  useEffect(() => {
    const fetchAvailableTimeSlots = async () => {
      try {
        const response = await fetch(`http://localhost:5000/availableTimeSlots?doctor=${doctor.DOCTOR_ID}&date=${selectedDate}`);
        const data = await response.json();
        setAvailableTimeSlots(data);
      } catch (error) {
        console.error('Error fetching available time slots:', error);
      }
    };

    if (selectedDate) {
      fetchAvailableTimeSlots();
    }
  }, [selectedDate, doctor]);

  return (
      <div className="doctor-card">
      <img src={doctor.GENDER === 'Male' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQrjQ-c-a6Lc4H1N74ZNcWgq4jDuh7LkB0DoQ&usqp=CAU' : 'https://img.freepik.com/premium-photo/funny-doctor-cartoon-character-with-friendly-behavior_958272-1314.jpg'} alt={`${doctor.FIRST_NAME} ${doctor.LAST_NAME}`} />
      <h2>{`${doctor.FIRST_NAME} ${doctor.LAST_NAME}`}</h2>
      <p>{doctor.SPECIALIZATION}</p>
      <p>Experience: {doctor.EXPERIENCE} years</p>
      <p>{doctor.CONTACT_NO}</p>
      <button onClick={() => handleGetAppointmentClick(doctor.DOCTOR_ID)}>Get an Appointment</button>
      <button onClick={() => handleViewProfile(doctor.DOCTOR_ID)}>Doctor Profile</button>

      {/* Popup */}
      {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <span className="close" onClick={handleClosePopup}>&times;</span>
            <h2>Select Appointment Date</h2>
            <input className='appointmentDate' type="date" value={selectedDate} onChange={handleDateChange} min={new Date().toISOString().split("T")[0]} />
            <h2>Available Time Slots</h2>
            <form onSubmit={handleFormSubmit}>
              <ul>
                {availableTimeSlots.map((slot, index) => (
                  <li className='slotList' key={`${slot.date}-${slot.time}`}>
                    <input
                      type="radio"
                      id={`slot-${index}`}
                      name="timeSlot"
                      value={`${slot.date} ${slot.time}`}
                      onChange={() => setSelectedTimeSlot(`${slot.date} ${slot.time}`)}
                    />
                    <label className='timeLabel' htmlFor={`slot-${index}`}>{slot.time}</label>
                  </li>
                ))}
              </ul>
              <button type="submit">Submit</button>
              <button type="button" onClick={handleClosePopup}>Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* Submission status message */}
      {submissionStatus === 'success' && (
        <div className="submission-message success">Appointment submitted successfully!</div>
      )}
      {submissionStatus === 'error' && (
        <div className="submission-message error">Error submitting appointment. Please try again later.</div>
      )}
    </div>
  );
};

export default DoctorCard;
