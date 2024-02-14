import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');

  // Use useNavigate hook to get the navigate function
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, password }),
      });

      if (response.ok) {
        const user = await response.json();
        onLoginSuccess(user);

        // Use navigate('/doctor') for navigation
        navigate('/doctor');
      } else {
        console.log('Invalid user ID or password');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="login-container">
  <div className="login-content">
    <h2 className="login-heading">Sign In</h2>
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Username or Email"
          value={userID}
          onChange={(e) => setUserID(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Sign In
      </button>

      <p className="text-white mt-3">
        Don't have an account?{' '}
        <button type="button" className="btn-link-signup" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </p>
    </form>
  </div>
</div>

  );
};

export default Login;
