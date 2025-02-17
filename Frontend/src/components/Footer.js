import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <ul>
          <li><Link to="/privacy-policy">Privacy Policy</Link></li>
          <li><Link to="/terms-of-service">Terms of Service</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
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
  );
};

export default Footer;
