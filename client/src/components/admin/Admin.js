import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';
import UpdateCabin from './UpdateCabin';
import UpdateWard from './UpdateWard';
import AssignPatientToWard from './AssignPatientToWard'; // Import the AssignPatientToWard component
import AssignPatientToCabin from './AssignPatientToCabin'; // Import the AssignPatientToCabin component
import image1 from './logo2.png';
import LeaveRequestList from './LeaveRequestList';
const Admin = () => {
  const [showUpdateCabin, setShowUpdateCabin] = useState(false);
  const [showUpdateWard, setShowUpdateWard] = useState(false);
  const [showAssignToWard, setShowAssignToWard] = useState(false); // State for displaying AssignPatientToWard component
  const [showAssignToCabin, setShowAssignToCabin] = useState(false); // State for displaying AssignPatientToCabin component

  const handleCardClick = () => {
    setShowUpdateCabin(true);
  };

  const handleWardClick = () => {
    setShowUpdateWard(true);
  };

  const handleAssignToWardClick = () => {
    setShowAssignToWard(true);
  };

  const handleAssignToCabinClick = () => {
    setShowAssignToCabin(true);
  };

  return (
    <div>
      <header>
        <div className="logo">
          <img src={image1} alt="Health Harbor Logo" />
        </div>
        <nav>
          <Link to="/">Logout</Link>
        </nav>
      </header>
      <div className="admin-container">
        <h2>Welcome Admin!</h2>
        <div className="leave-requests">
        <LeaveRequestList />
      </div>
        <div className="view-cabin-details">
          <h3>View Cabin Details</h3>
          <div className="cabin-card" onClick={handleCardClick}>
            <h4>Cabin Details</h4>
          </div>
          {showUpdateCabin && <UpdateCabin />}
        </div>
        <div className="view-ward-details">
          <h3>View Ward Details</h3>
          <div className="ward-card" onClick={handleWardClick}>
            <h4>Ward Details</h4>
          </div>
          {showUpdateWard && <UpdateWard />}
        </div>
        <div className="assign-to-ward">
          <h3>Assign Patient to Ward</h3>
          <button onClick={handleAssignToWardClick}>Assign</button>
          {showAssignToWard && <AssignPatientToWard />}
        </div>
        <div className="assign-to-cabin">
          <h3>Assign Patient to Cabin</h3>
          <button onClick={handleAssignToCabinClick}>Assign</button>
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
