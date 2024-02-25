// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import image1 from '../assets/logo2.png'

const Home = () => {
  return (
    <div className="home-container">
      <header className='homeHeader'>
        <div className="logo">

          <img src={image1} alt="Health Harbor Logo" />  
        </div>
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </nav>
      </header>
      <main>
        <section className="hero-section">
          <h1>Your Health, Our Priority</h1>
          <p>Explore our services and manage your health online.</p>
          <Link to="/signup" className="cta-button">
            Sign Up Now
          </Link>
        </section>
        <section className="intro-section">
          <h2>Welcome to Health Harbor</h2>
          <p>
            At Health Harbor, we are committed to providing exceptional healthcare services to our
            community. Our team of dedicated professionals is here to support you in your journey
            towards better health.
          </p>
        </section>
        <section className="feature-section">
          <div className="feature">
            <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Feature 1" />
            <h2>Expert Doctors</h2>
            <p>Connect with experienced doctors for personalized care.</p>
          </div>
          <div className="feature">
            <img src="https://images.unsplash.com/photo-1624969862293-b749659ccc4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8QXBwb2ludG1lbnR8ZW58MHx8MHx8fDA%3D" alt="Feature 2" />
            <h2>Online Appointments</h2>
            <p>Schedule appointments with ease using our online platform.</p>
          </div>
          <div className="feature">
            <img src="https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8c2VjdXJpdHl8ZW58MHx8MHx8fDA%3D" alt="Feature 3" />
            <h2>Secure Access</h2>
            <p>Your health data is safe and secure with us.</p>
          </div>
        </section>
        <section className="services-section">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service">
              <img src="https://images.unsplash.com/photo-1600959907703-125ba1374a12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZW1lcmdlbmN5JTIwY2FyZXxlbnwwfHwwfHx8MA%3D%3D" alt="Service 1" />
              <h3>Emergency Care</h3>
              <p>Immediate medical attention when you need it the most.</p>
            </div>
            <div className="service">
              <img src="https://plus.unsplash.com/premium_photo-1673953509986-9b2bfe934ae5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2xpbmljfGVufDB8fDB8fHww" alt="Service 2" />
              <h3>Specialized Clinics</h3>
              <p>Explore our specialized clinics for focused healthcare.</p>
            </div>
            <div className="service">
              <img src="https://plus.unsplash.com/premium_photo-1661549490929-36181ee04c12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVsZW1lZGljaW5lfGVufDB8fDB8fHww" alt="Service 3" />
              <h3>Telemedicine</h3>
              <p>Consult with our healthcare professionals remotely.</p>
            </div>
          </div>
        </section>
        <section className="health-insights-section">
          <h2>Health Insights</h2>
          <div className="blog-passage">
            <img src="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z29vZCUyMGhlYWx0aHxlbnwwfHwwfHx8MA%3D%3D" alt="Blog Image" />
            <div>
              <h3>The Importance of Regular Checkups</h3>
              <p>
                Regular health checkups are crucial for maintaining optimal health. These
                appointments allow healthcare professionals to detect and address potential issues
                before they become more serious. Remember, prevention is key to a healthy life.
              </p>
              <Link to="/blog/post1" className="read-more-link">
                Read More
              </Link>
            </div>
          </div>
          <div className="blog-passage">
            <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d29ya291dHxlbnwwfHwwfHx8MA%3D%3D" alt="Blog Image" />
            <div>
              <h3>Staying Active for a Healthy Heart</h3>
              <p>
                Incorporating regular physical activity into your routine is essential for a healthy
                heart. Exercise improves blood circulation, lowers blood pressure, and reduces the
                risk of heart disease. Find an activity you enjoy and make it a part of your life.
              </p>
              <Link to="/blog/post2" className="read-more-link">
                Read More
              </Link>
            </div>
          </div>
          <div className="blog-passage">
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RGlldHxlbnwwfHwwfHx8MA%3D%3D" alt="Blog Image" />
            <div>
              <h3>The Power of a Balanced Diet</h3>
              <p>
                A balanced diet provides your body with the necessary nutrients for optimal
                functioning. Include a variety of fruits, vegetables, whole grains, and lean proteins
                in your meals. Eating well contributes to overall health and well-being.
              </p>
              <Link to="/blog/post3" className="read-more-link">
                Read More
              </Link>
            </div>
          </div>
        </section>
        <section className="testimonial-section">
          <h2>What Our Patients Say</h2>
          <div className="testimonial">
            <img src="https://www.cs.ox.ac.uk/img/nophotoavailable.png" alt="Patient Avatar" />
            <p>
              "The care I received at Health Harbor was outstanding. The staff was attentive and
              the facilities were top-notch."
            </p>
            <span>- John Doe, Patient</span>
          </div>
        </section>
      </main>
      <footer>
        <p>&copy; 2023 Health Harbor Navigator. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
