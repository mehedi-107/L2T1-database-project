import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Doctor from './components/doctor/Doctor';
import Appointments from './components/doctor/Appointments';
import Patient from './components/patient/Patient';
import Nurse from './components/nurse/Nurse';
import TaskList from './components/doctor/TaskList';
import BedInfo from './components/ward/BedInfo';
import Admin from './components/admin/Admin';
import BedInfoAdmin from './components/admin/BedInfoAdmin';
function App() {
  // Load isLoggedIn and userData from local storage on component mount
  useEffect(() => {
    const savedIsLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn'));
    const savedUserData = JSON.parse(localStorage.getItem('userData'));

    if (savedIsLoggedIn !== null) {
      setIsLoggedIn(savedIsLoggedIn);
    }

    if (savedUserData !== null) {
      setUserData(savedUserData);
    }
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleSuccessfulLogin = (user) => {
    setIsLoggedIn(true);
    setUserData(user);

    // Save isLoggedIn and userData to local storage on successful login
    localStorage.setItem('isLoggedIn', JSON.stringify(true));
    localStorage.setItem('userData', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);

    // Remove isLoggedIn and userData from local storage on logout
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
  };
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLoginSuccess={handleSuccessfulLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/doctor"
          element={
            isLoggedIn ? (
              userData.user.DOCTOR_ID ? (
                <Doctor userData={userData} />
              ) : userData.user.NURSE_ID ? (
                <Nurse userData={userData} />
              ) : userData.user.PATIENT_ID ? (
                <Patient userData={userData} />
              ) : (
                <Home />
              )
            ) : (
              <Home />
            )
          }
        />

        <Route
          path="/patient"
          element={
            isLoggedIn && userData.user.PATIENT_ID ? (
              <Patient userData={userData} />
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/nurse"
          element={
            isLoggedIn && userData.user.NURSE_ID ? (
              <Nurse userData={userData} />
            ) : (
              <Home />
            )
          }
        />
        <Route
          path="/appointments"
          element={
            isLoggedIn ? (
              <Appointments userData={userData} />
            ) : (
              <Home />
            )
          }
        />
        <Route path="/" element={<Home />} />
      
      <Route path="/tasklist" element={<TaskList userData={userData}/>} />
      <Route path="/BedInfo" element={<BedInfo />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/bedInfoAdmin" element={<BedInfoAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
