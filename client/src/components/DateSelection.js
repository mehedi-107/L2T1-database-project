// DateSelection.js
import React, { useState } from 'react';

const DateSelection = ({ onNext }) => {
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = () => {
    onNext(selectedDate);
  };

  return (
    <div>
      <h2>Select Appointment Date</h2>
      <input type="date" value={selectedDate} onChange={handleDateChange} />
      <button onClick={handleSubmit}>Next</button>
    </div>
  );
};

export default DateSelection;
