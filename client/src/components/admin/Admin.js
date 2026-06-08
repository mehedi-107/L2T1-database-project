import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';
import UpdateCabin from './UpdateCabin';
import UpdateWard from './UpdateWard';
import AssignPatientToWard from './AssignPatientToWard';
import AssignPatientToCabin from './AssignPatientToCabin';
import Notification from './Notification';
import image1 from './logo2.png';
import LeaveRequestList from './LeaveRequestList';
import EmployeeManagement from './EmployeeManagement';
const Admin = ({ onLogout }) => {
  const [showLeaveRequests, setShowLeaveRequests] = useState(false);
  const [showUpdateCabin, setShowUpdateCabin] = useState(false);
  const [showUpdateWard, setShowUpdateWard] = useState(false);
  const [showAssignToWard, setShowAssignToWard] = useState(false);
  const [showAssignToCabin, setShowAssignToCabin] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [showEmployeeManagement, setShowEmployeeManagement] = useState(false); // State to control the visibility of the EmployeeManagement component

  const handleLeaveRequestsClick = () => {
    setShowLeaveRequests(!showLeaveRequests);
  };

  const handleCardClick = () => {
    setShowUpdateCabin(!showUpdateCabin);
  };

  const handleWardClick = () => {
    setShowUpdateWard(!showUpdateWard);
  };

  const handleAssignToWardClick = () => {
    setShowAssignToWard(!showAssignToWard);
  };

  const handleAssignToCabinClick = () => {
    setShowAssignToCabin(!showAssignToCabin);
  };

  const handleEmployeeManagementClick = () => {
    setShowEmployeeManagement(!showEmployeeManagement);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  const triggerNotification = () => {
    setShowNotification(true);
  };

  return (
    <div>
      <header>
        <div className="logo">
          <img src={image1} alt="Health Harbor Logo" />
        </div>
        <nav>
          <Link to="/" onClick={onLogout}>Logout</Link>
          <button onClick={triggerNotification}>Show Notification</button>
        </nav>
      </header>
      {showNotification && (
        <Notification message="This is a notification message" onClose={handleNotificationClose} />
      )}
      <div className="admin-container">
        <h2>Welcome Admin!</h2>
        <div className="leave-requests">
          <div className="leave-requests-card" onClick={handleLeaveRequestsClick}>
            <h4>Leave Requests</h4>
          </div>
          {showLeaveRequests && <LeaveRequestList />}
        </div>
        <div className="employee-management">
          <div className="employee-management-card" onClick={handleEmployeeManagementClick}>
            <h4>Employee Management</h4>
          </div>
          {showEmployeeManagement && <EmployeeManagement />}
        </div>
        <div className="view-cabin-details">
          <div className="cabin-card" onClick={handleCardClick}>
            <h4>Cabin Details</h4>
          </div>
          {showUpdateCabin && <UpdateCabin />}
        </div>
        <div className="view-ward-details">
          <div className="ward-card" onClick={handleWardClick}>
            <h4>Ward Details</h4>
          </div>
          {showUpdateWard && <UpdateWard />}
        </div>
        <div className="assign-to-ward">
          <div className="assign-to-ward-card" onClick={handleAssignToWardClick}>
            <h4>Assign Patient to Ward</h4>
          </div>
          {showAssignToWard && <AssignPatientToWard />}
        </div>
        <div className="assign-to-cabin">
          <div className="assign-to-cabin-card" onClick={handleAssignToCabinClick}>
            <h4>Assign Patient to Cabin</h4>
          </div>
          {showAssignToCabin && <AssignPatientToCabin />}
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 Your Hospital Name. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Admin;
