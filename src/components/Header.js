import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="Insert Logo" />
      </div>
      <nav className="navigation">
        <ul className="nav-links">
          <li><Link to="/">Stations</Link></li>

          {/* Dropdown Menüsü */}
          <li className="dropdown">
            <span>Tickets</span> {/* Ok (▼) kaldırıldı */}
            <ul className="dropdown-content">
              <li><Link to="/ticket-cancel">Cancel Ticket</Link></li>
              <li><Link to="/ticket-check">Check Ticket</Link></li>
            </ul>
          </li>

          <li><Link to="/voyage-times">Voyage Times</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
      </nav>

      {/* Login ve Register Butonları */}
      <div className="auth-buttons">
        <button className="login-btn">Login</button>
        <button className="register-btn">Register</button>
      </div>
    </header>
  );
};

export default Header;
