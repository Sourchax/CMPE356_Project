import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/header.css";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
import sailMatelogo from "../assets/images/SailMate_logo.png";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 862);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 862);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = document.querySelectorAll('.nav-links li');

  navLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      if (!this.classList.contains('dropdown')) {
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  const handleLogoClick = () => {
    navLinks.forEach(link => link.classList.remove('active'));
  };

  return (
    <div className="out-package">
      <header className="header">
        <div className="logo" onClick={handleLogoClick}>
          <Link to="/">
          <img src={sailMatelogo} alt="Insert Logo" />
          </Link>
        </div>

        {/* Burger Menu Button */}
        <div className="menu-toggle" 
          onMouseEnter={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>

        {/* Navigation Menu */}
        <nav className={menuOpen ? "navigation open" : "navigation"}>
          <ul className="nav-links" onMouseLeave={() => setMenuOpen(false)}>
            <li><Link to="/">Stations</Link></li>

            {/* Desktop: Show Dropdown | Mobile: Remove it completely */}
            {!isMobile && (
              <li
                className="dropdown"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <span>Tickets</span>
                <ul className={dropdownOpen ? "dropdown-content show" : "dropdown-content"}>
                  <li><Link to="/ticket-cancel">Cancel Ticket</Link></li>
                  <li><Link to="/ticket-check">Check Ticket</Link></li>
                </ul>
              </li>
            )}

            {/* Mobile: Show as separate links */}
            {isMobile && (
              <>
                <li><Link to="/ticket-cancel">Cancel Ticket</Link></li>
                <li><Link to="/ticket-check">Check Ticket</Link></li>
              </>
            )}

            <li><Link to="/voyage-times">Voyage Times</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="auth-buttons">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
        </div>
      </header>
    </div>
  );
};

export default Header;