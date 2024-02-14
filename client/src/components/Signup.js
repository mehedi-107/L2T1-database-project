
import React, { useState, useEffect } from 'react';
import './Signup.css';

const Signup = () => {
  const [FIRST_NAME, setFIRST_NAME] = useState('');
  const [LAST_NAME, setLAST_NAME] = useState('');
  const [EMAIL, setEMAIL] = useState('');
  const [GENDER, setGENDER] = useState('');
  const [DATE_OF_BIRTH, setDATE_OF_BIRTH] = useState('');
  const [CONTACT_NO, setCONTACT_NO] = useState('');
  const [PASSWORD, setPASSWORD] = useState('');
  const [error, setError] = useState('');
  const [lastUserID, setLastUserID] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    FIRST_NAME: '',
    LAST_NAME: '',
    EMAIL: '',
    GENDER: '',
    DATE_OF_BIRTH: '',
    CONTACT_NO: '',
    PASSWORD: '',
  });

  const [popupActive, setPopupActive] = useState(false); // Added state for popup

  const goToLogin = () => {
    window.location.href = '/login';
  };

  const goBack = () => {
    window.location.href = '/';
  };

  useEffect(() => {
    const fetchLastUserID = async () => {
      try {
        const response = await fetch('http://localhost:5000/lastUserID');
        if (response.ok) {
          const data = await response.json();
          setLastUserID(data.max);
        } else {
          console.error('Failed to fetch last userID.');
        }
      } catch (error) {
        console.error('Error occurred:', error);
      }
    };

    fetchLastUserID();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!FIRST_NAME) {
      errors.FIRST_NAME = 'Please fill up this field.';
    }
    if (!LAST_NAME) {
      errors.LAST_NAME = 'Please fill up this field.';
    }
    if (!EMAIL) {
      errors.EMAIL = 'Please fill up this field.';
    }
    if (!GENDER) {
      errors.GENDER = 'Please fill up this field.';
    }
    if (!DATE_OF_BIRTH) {
      errors.DATE_OF_BIRTH = 'Please fill up this field.';
    }
    if (!CONTACT_NO) {
      errors.CONTACT_NO = 'Please fill up this field.';
    }
    if (!PASSWORD) {
      errors.PASSWORD = 'Please fill up this field.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please fill in all fields.');
      return;
    }

    setFieldErrors({});
    setError('');

    const userData = {
      FIRST_NAME,
      LAST_NAME,
      EMAIL,
      GENDER,
      DATE_OF_BIRTH,
      CONTACT_NO,
      PASSWORD,
    };

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log('User signed up successfully!');
        goToLogin();
      } else {
        console.error('Sign up failed.');
      }
    } catch (error) {
      console.error('Error occurred:', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <form onSubmit={handleSubmit} className="signup-form">
          <h1>Sign Up</h1>

          <div className="form-group error-popup">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={FIRST_NAME}
              onChange={(e) => setFIRST_NAME(e.target.value)}
            />
            {fieldErrors.FIRST_NAME && <p className="field-error">{fieldErrors.FIRST_NAME}</p>}
          </div>

          <div className="form-group error-popup">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              value={LAST_NAME}
              onChange={(e) => setLAST_NAME(e.target.value)}
            />
            {fieldErrors.LAST_NAME && <p className="field-error">{fieldErrors.LAST_NAME}</p>}
          </div>

          <div className="form-group error-popup">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={EMAIL}
              onChange={(e) => setEMAIL(e.target.value)}
            />
            {fieldErrors.EMAIL && <p className="field-error">{fieldErrors.EMAIL}</p>}
          </div>

          <div className="form-group error-popup">
            <select
              className="form-control"
              value={GENDER}
              onChange={(e) => setGENDER(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {fieldErrors.GENDER && <p className="field-error">{fieldErrors.GENDER}</p>}
          </div>

          <div className="form-group error-popup">
            <input
              type="date"
              className="form-control"
              value={DATE_OF_BIRTH}
              onChange={(e) => setDATE_OF_BIRTH(e.target.value)}
            />
            {fieldErrors.DATE_OF_BIRTH && <p className="field-error">{fieldErrors.DATE_OF_BIRTH}</p>}
          </div>

          <div className="form-group error-popup">
            <input
              type="text"
              className="form-control"
              placeholder="Contact Number"
              value={CONTACT_NO}
              onChange={(e) => setCONTACT_NO(e.target.value)}
            />
            {fieldErrors.CONTACT_NO && <p className="field-error">{fieldErrors.CONTACT_NO}</p>}
          </div>

          <div className="form-group error-popup">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={PASSWORD}
              onChange={(e) => setPASSWORD(e.target.value)}
            />
            {fieldErrors.PASSWORD && <p className="field-error">{fieldErrors.PASSWORD}</p>}
          </div>

          <button type="submit" className="btn-primary">
            Sign Up
          </button>

          <p>
            Already have an account?{' '}
            <button type="button" className="btn btn-link" onClick={goToLogin}>
              Login
            </button>
          </p>
          <p>
            <button type="button" className="btn btn-link" onClick={goBack}>
              Back
            </button>
          </p>
        </form>
        {popupActive && (
          <div className="popup-message">
            <p>{error}</p>
            <button type="button" onClick={() => setPopupActive(false)}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
