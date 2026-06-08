import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

const initialForm = {
  FIRST_NAME: '',
  LAST_NAME: '',
  EMAIL: '',
  GENDER: '',
  DATE_OF_BIRTH: '',
  CONTACT_NO: '',
  PASSWORD: '',
};

const Signup = () => {
  const [formData, setFormData] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: '' }));
  };

  const validate = () => {
    const errors = {};

    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        errors[key] = 'Required';
      }
    });

    return errors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError('Please complete all required fields.');
      return;
    }

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Unable to create the patient account. Please try again.');
    }
  };

  return (
    <main className="signup-page">
      <section className="signup-panel" aria-labelledby="signup-heading">
        <div className="signup-copy">
          <p className="signup-eyebrow">Patient registration</p>
          <h1 id="signup-heading">Create a Health Harbor account</h1>
          <p>Register once, then use the patient portal for appointments and admission details.</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="signup-grid">
            <label>
              <span>First name</span>
              <input
                type="text"
                name="FIRST_NAME"
                value={formData.FIRST_NAME}
                onChange={handleChange}
                className={fieldErrors.FIRST_NAME ? 'has-error' : ''}
              />
            </label>
            <label>
              <span>Last name</span>
              <input
                type="text"
                name="LAST_NAME"
                value={formData.LAST_NAME}
                onChange={handleChange}
                className={fieldErrors.LAST_NAME ? 'has-error' : ''}
              />
            </label>
          </div>

          <label>
            <span>Email</span>
            <input
              type="email"
              name="EMAIL"
              value={formData.EMAIL}
              onChange={handleChange}
              className={fieldErrors.EMAIL ? 'has-error' : ''}
            />
          </label>

          <div className="signup-grid">
            <label>
              <span>Gender</span>
              <select
                name="GENDER"
                value={formData.GENDER}
                onChange={handleChange}
                className={fieldErrors.GENDER ? 'has-error' : ''}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              <span>Date of birth</span>
              <input
                type="date"
                name="DATE_OF_BIRTH"
                value={formData.DATE_OF_BIRTH}
                onChange={handleChange}
                className={fieldErrors.DATE_OF_BIRTH ? 'has-error' : ''}
              />
            </label>
          </div>

          <label>
            <span>Contact number</span>
            <input
              type="text"
              name="CONTACT_NO"
              value={formData.CONTACT_NO}
              onChange={handleChange}
              className={fieldErrors.CONTACT_NO ? 'has-error' : ''}
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="PASSWORD"
              value={formData.PASSWORD}
              onChange={handleChange}
              className={fieldErrors.PASSWORD ? 'has-error' : ''}
            />
          </label>

          {error && <p className="signup-error">{error}</p>}

          <button type="submit" className="signup-submit">
            Create Account
          </button>

          <div className="signup-links">
            <Link to="/login">Already registered?</Link>
            <Link to="/">Back to home</Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Signup;
