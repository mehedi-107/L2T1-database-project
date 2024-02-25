import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Doctor.css';
import image1 from '../assets/logo2.png';
import TaskList from './TaskList';

const Doctor = ({ userData }) => {
  console.log("userData", userData);
  const [showPopup, setShowPopup] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changePasswordError, setChangePasswordError] = useState(null);

  const handleChangePassword = () => {
    setShowPopup(true);
  };

  const handleUpdateProfileClick = () => {
    console.log('Update Profile');
  };

  const handleLogout = () => {
    window.location.href = '/';
  };

  const handleSavePassword = () => {
    // Implementation for saving password
  };

  const handleDiscardChanges = () => {
    setShowPopup(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setChangePasswordError(null);
  };

  return (
    <div className="doctor-container">
      <header className="doctor-header">
        <div className="logo">
          <img src={image1} alt="Health Harbor Logo" />
        </div>
        <nav className="navbar">
          <ul>
            <li><Link to="/appointments">Appointments</Link></li>
            <li><Link to="/Tasklist" state={userData}>Task List</Link></li> {/* Pass doctorInfo as state */}
            <li><Link to="/schedule">Manage Schedule</Link></li>
            <li><Link to="/feedback">Feedback & Reviews</Link></li>
            <li className="dropdown">
              <button className="dropbtn">More</button>
              <div className="dropdown-content">
                <button onClick={handleChangePassword}>Change Password</button>
                <button onClick={handleUpdateProfileClick}>Update Profile</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </li>
          </ul>
        </nav>
      </header>

      {/* Popup */}
      {showPopup && (
        <div className="popup">
          <h3>Change Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={handleSavePassword}>Save</button>
          <button onClick={handleDiscardChanges}>Discard</button>
          {changePasswordError && <p className="error-msg">{changePasswordError}</p>}
        </div>
      )}

      {/* Doctor Info */}
      <div className="doctor-info">
        <div className="profile-picture">
          <img src="https://via.placeholder.com/150" alt="Profile" />
        </div>
        <div className="personal-details">
          <h2>Your Info</h2>
          <div className="info-item">
            <span className="info-label">User ID:</span>
            <span className="info-value">{userData.user.ID}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Name:</span>
            <span className="info-value">{`${userData.user.FIRST_NAME} ${userData.user.LAST_NAME}`}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{userData.user.EMAIL}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date of Birth:</span>
            <span className="info-value">{userData.user.DATE_OF_BIRTH}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Contact No:</span>
            <span className="info-value">{userData.user.CONTACT_NO}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Salary:</span>
            <span className="info-value">{userData.user.SALARY}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Department:</span>
            <span className="info-value">{userData.user.DEPT_ID}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Gender:</span>
            <span className="info-value">{userData.user.GENDER}</span>
          </div>
        </div>
      </div>

      {/* Additional Content */}
      <div className="doctor-content">
        <h2>Our Services</h2>
        <p>At Health Harbor, we provide comprehensive medical services to ensure your well-being.</p>
        <div className="service-list">
          <div className="service-item">
            <img src="service1.jpg" alt="Service 1" />
            <h3>Primary Care</h3>
            <p>Our primary care physicians offer preventive care, health screenings, and treatment for common illnesses.</p>
          </div>
          <div className="service-item">
            <img src="service2.jpg" alt="Service 2" />
            <h3>Specialized Care</h3>
            <p>We have specialists in various fields including cardiology, orthopedics, neurology, and more.</p>
          </div>
          <div className="service-item">
            <img src="service3.jpg" alt="Service 3" />
            <h3>Emergency Care</h3>
            <p>Our emergency department is equipped to handle medical emergencies 24/7.</p>
          </div>
        </div>
        <h2>Our Motto</h2>
        <p>Our motto is to provide compassionate care with a focus on patient safety and satisfaction.</p>
      </div>

      {/* Logout Button */}
      <div className="logout-btn">
        <button onClick={handleLogout}>Logout</button>
      </div>
      <footer className="footer">
        <p>&copy; 2021 Health Harbor</p>
      </footer>


    </div>
    
  );
};

export default Doctor;
