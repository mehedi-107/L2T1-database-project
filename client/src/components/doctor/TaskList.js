import React, { useState } from 'react';
import WardDuty from './WardDuty';
import CabinDuty from './CabinDuty'
import OperationTheatreDuty from '../OperationTheatreDuty';
import './TaskList.css';  
const TaskList = (doctor) => {
  const [selectedOption, setSelectedOption] = useState('ward'); // Default option
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
    <li className="nav-item" onClick={() => setSelectedOption('ward')}>Ward Duty</li>
    <li className="nav-item" onClick={() => setSelectedOption('cabin')}>Cabin Duty</li>
  
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
