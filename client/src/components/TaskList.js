import React, { useState } from 'react';
import WardDuty from './WardDuty';
import CabinDuty from './CabinDuty'
import OperationTheatreDuty from './OperationTheatreDuty';
import './TaskList.css';  
const TaskList = (doctor) => {
  const [selectedOption, setSelectedOption] = useState('ward'); // Default option
  console.log(doctor);
  const renderDuty = () => {
    switch (selectedOption) {
      case 'ward':
        return <WardDuty doctor={doctor} />;
      case 'cabin':
        return <CabinDuty doctor={doctor}/>;
      case 'theatre':
        return <OperationTheatreDuty />;
      default:
        return null;
    }
  };

  return (
    <div className="task-list-container">
      <header className="task-list-header">
        <div className="logo">
          {/* Add your logo here */}
        </div>
        <nav className="navbar">
          <ul>
            <li onClick={() => setSelectedOption('ward')}>Ward Duty</li>
            <li onClick={() => setSelectedOption('cabin')}>Cabin Duty</li>
            <li onClick={() => setSelectedOption('theatre')}>Operation Theatre Duty</li>
          </ul>
        </nav>
      </header>

      {/* Render the selected duty component */}
      <div className="duty-details">
        {renderDuty()}
      </div>

      {/* Logout Button */}
      <div className="logout-btn">
        {/* Add your logout button here */}
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2021 Health Harbor</p>
      </footer>
    </div>
  );
};

export default TaskList;
