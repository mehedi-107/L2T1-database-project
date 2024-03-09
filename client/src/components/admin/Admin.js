import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';
import UpdateCabin from './UpdateCabin';
import UpdateWard from './UpdateWard';
import AssignPatientToWard from './AssignPatientToWard';
import AssignPatientToCabin from './AssignPatientToCabin';
import Notification from './Notification'; // Import the Notification component
import image1 from './logo2.png';
import LeaveRequestList from './LeaveRequestList';

const Admin = () => {
  const [showLeaveRequests, setShowLeaveRequests] = useState(false);
  const [showUpdateCabin, setShowUpdateCabin] = useState(false);
  const [showUpdateWard, setShowUpdateWard] = useState(false);
  const [showAssignToWard, setShowAssignToWard] = useState(false);
  const [showAssignToCabin, setShowAssignToCabin] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // State to control the visibility of the notification

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

  const handleNotificationClose = () => {
    setShowNotification(false);
  };

  // Function to trigger the notification
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
          <Link to="/">Logout</Link>
          {/* Display the notification trigger */}
          <button onClick={triggerNotification}>Show Notification</button>
        </nav>
      </header>
      {/* Conditionally render the notification */}
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
