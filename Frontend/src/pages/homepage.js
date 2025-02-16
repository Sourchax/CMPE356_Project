import React from 'react';
import '../assets/styles/homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <header className="header">
        <div className="logo">
            🚢 <span className="logo-text">İDO</span>
        </div>
        <nav className="navigation">
          <ul>
          <li>Stations</li>
            <li className="dropdown">
              <a href="#">Tickets</a>
              <ul className="dropdown-content">
                <li><a href="#ticketCancel">Ticket Cancel</a></li>
                <li><a href="#ticketCheck">Ticket Check</a></li>
              </ul>
            </li>
            <li><a href="#voyage-times">Voyage Times</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button>Login</button>
          <button>Register</button>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero">
          <div className="hero-text">
            <h1>Welcome to İDO</h1>
            <p>Your gateway to the sea travel in Istanbul.</p>
          </div>
        </section>

        {/* Ticket Search Section */}
        <section className="ticket-search">
          <h2>Book Your Journey</h2>
          <form>
            <div className="form-group">
              <label htmlFor="departure">Departure</label>
              <select id="departure">
                <option value="yenikapi">Yenikapı</option>
                <option value="bursa">Bursa</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="arrival">Arrival</label>
              <select id="arrival">
                <option value="bandirma">Bandırma</option>
                <option value="yalova">Yalova</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="departure-date">Departure Date</label>
              <input type="date" id="departure-date" />
            </div>
            <div className="form-group">
              <label htmlFor="return-date">Return Date</label>
              <input type="date" id="return-date" />
            </div>
            <div className="form-group">
              <label htmlFor="passengers">Passengers</label>
              <input type="number" id="passengers" min="1" defaultValue="1" />
            </div>
            <button type="submit">Search</button>
          </form>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="footer">
        <div className="footer-links">
          <ul>
            <li><a href="#privacy-policy">Privacy Policy</a></li>
            <li><a href="#terms-of-service">Terms of Service</a></li>
            <li><a href="#contact">Contact Us</a></li>
          </ul>
        </div>
        <div className="social-media">
          <a href="#facebook">Facebook</a>
          <a href="#twitter">Twitter</a>
          <a href="#instagram">Instagram</a>
        </div>
        <div className="call-center">
          <p>Call Center: 0850 222 44 36 / 444 44 36</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
