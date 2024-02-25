// AppointmentForm.js
import React, { useState, useEffect } from 'react';

const AppointmentForm = ({userData }) => {
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

    useEffect(() => {
        const fetchAvailableTimeSlots = async () => {
            try {
                const response = await fetch(`http://localhost:5000/availableTimeSlots?doctor=${selectedDoctor}`);
                const data = await response.json();
                setAvailableTimeSlots(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching available time slots:', error);
            }
        };

        if (selectedDoctor) {
            fetchAvailableTimeSlots();
        }
    }, [selectedDoctor]);


    useEffect(() => {
        // Fetch departments when the component mounts
        const fetchDepartments = async () => {
            try {
                const response = await fetch('http://localhost:5000/departments');
                const data = await response.json();
                setDepartments(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, []);

    useEffect(() => {
        // Fetch doctors when the selected department changes
        const fetchDoctors = async () => {
            try {
                console.log(selectedDepartment);
                const response = await fetch(`http://localhost:5000/doctors?department=${selectedDepartment}`);
                const data = await response.json();
                setDoctors(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        if (selectedDepartment) {
            fetchDoctors();
        }
    }, [selectedDepartment]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
      
        // Extracting date and time from the selectedTime value
        const [selectedDate, time] = selectedTime.split(' ');
      
        // Show a confirmation dialog
        const isConfirmed = window.confirm(`Confirm the appointment for ${selectedDate} at ${time}?`);
      
        if (!isConfirmed) {
          // If the user cancels the confirmation, do nothing
          return;
        }
      
        // Prepare data for submission
        const data = {
          doctor: selectedDoctor,
          time: time,
          date: selectedDate,
          patientId: userData.user.PATIENT_ID,
        };
      
        // Make a POST request to the server
        try {
          const response = await fetch('http://localhost:5000/submitAppointment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
      
          if (response.ok) {
            // Handle successful submission, e.g., show a success message
            console.log('Appointment submitted successfully');
          } else {
            // Handle unsuccessful submission, e.g., show an error message
            console.error('Error submitting appointment');
          }
        } catch (error) {
          console.error('Error submitting appointment:', error);
        }
      };
      

    return (
        <div className="appointment-form">
            <h2>Request for an Appointment</h2>
            <form onSubmit={handleFormSubmit}>
                <label>
                    Select Department:
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        required

                    >
                        <option value="" disabled>-- Select Department --</option>
                        {departments.map((department) => (
                            <option key={department.DEPARTMENT_NAME} value={department.DEPARTMENT_NAME}>
                                {department.DEPARTMENT_NAME}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Select Doctor:
                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        required
                    >
                        <option value="" disabled>-- Select Doctor --</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.DOCTOR_ID} value={doctor.DOCTOR_ID}>
                                {`${doctor.DOCTOR_ID}`}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Select Time:
                    Select Time:
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            
            required
          >
            
            <option value="" disabled>-- Select Time --</option>
            {availableTimeSlots.map((timeSlot) => (
              <option key={`${timeSlot.date}_${timeSlot.time}`} value={`${timeSlot.date} ${timeSlot.time}`}>
                {`${timeSlot.date} ${timeSlot.time}`}
              </option>
            ))}
          </select>
                </label>


                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AppointmentForm;
