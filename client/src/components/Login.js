import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!userID || !password) {
      setError('Please enter both user ID and password.');
      return;
    }

    if (userID === 'admin' && password === 'admin') {
      onLoginSuccess({
        success: true,
        message: 'Admin login successful',
        user: {
          ADMIN_ID: 'admin',
          FIRST_NAME: 'Admin',
          ROLE: 'admin',
        },
      });
      navigate('/admin');
      return;
    }

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userID, password }),
      });

      if (response.ok) {
        const user = await response.json();
        onLoginSuccess(user);
        navigate('/doctor');
      } else {
        setError('Invalid user ID or password.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Unable to connect to the server. Please try again.');
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
          className="form-control-login"
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

      {error && <p className="auth-error">{error}</p>}

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
