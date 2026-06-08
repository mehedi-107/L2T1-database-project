import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import heroImage from '../assets/a.jpg';
import logo from '../assets/logo2.png';

const highlights = [
  { value: '4', label: 'Role-based portals' },
  { value: '24/7', label: 'Ward and cabin visibility' },
  { value: '15m', label: 'Appointment slots' },
];

const services = [
  {
    title: 'Clinical Scheduling',
    description: 'Doctors and patients can coordinate appointments, status updates, and visit records.',
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Ward Operations',
    description: 'Administrators can assign patients, track beds, and manage ward teams from one place.',
    image:
      'https://images.unsplash.com/photo-1588011930968-eadac80e6a5a?q=80&w=1200&auto=format&fit=crop',
  },
  {
    title: 'Staff Communication',
    description: 'Doctors, nurses, patients, and admins can send and review recent notifications.',
    image:
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1200&auto=format&fit=crop',
  },
];

const Home = () => {
  return (
    <div className="home-shell">
      <header className="home-header">
        <Link to="/" className="home-brand" aria-label="Health Harbor Navigator home">
          <img src={logo} alt="" />
          <span>Health Harbor</span>
        </Link>
        <nav className="home-nav">
          <Link to="/login">Sign In</Link>
          <Link to="/signup" className="home-nav-primary">
            Create Patient Account
          </Link>
        </nav>
      </header>

      <main>
        <section
          className="home-hero"
          style={{
            backgroundImage: `url(${heroImage})`,
          }}
        >
          <div className="home-hero-content">
            <p className="home-eyebrow">Hospital database management system</p>
            <h1>Health Harbor Navigator</h1>
            <p>
              A role-based hospital operations platform for appointments, patients, wards, cabins,
              leave requests, and internal communication.
            </p>
            <div className="home-actions">
              <Link to="/login" className="home-button home-button-primary">
                Access Portal
              </Link>
              <Link to="/signup" className="home-button home-button-secondary">
                Register Patient
              </Link>
            </div>
          </div>
        </section>

        <section className="home-stats" aria-label="Platform highlights">
          {highlights.map((item) => (
            <div className="home-stat" key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="home-section">
          <div className="home-section-heading">
            <p className="home-eyebrow">Core workflows</p>
            <h2>Built around the term-project database scope</h2>
          </div>
          <div className="home-service-grid">
            {services.map((service) => (
              <article className="home-service" key={service.title}>
                <img src={service.image} alt="" />
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="home-footer">
        <span>Health Harbor Navigator</span>
        <span>DBMS Term Project</span>
      </footer>
    </div>
  );
};

export default Home;
