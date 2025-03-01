import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // New X logo
import "../assets/styles/footer.css";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* SailMate section */}
          <div>
            <div className="text-[#F0C808] font-bold text-3xl mb-4">SailMate</div>
            <p className="text-sm opacity-80">
              Revolutionizing ferry travel with modern technology and exceptional service.
            </p>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2 list-none">
              <li>
                <Link to="/about" className="text-white opacity-80 hover:opacity-100">About Us</Link>
              </li>
              <li>
                <Link to="/careers" className="text-white opacity-80 hover:opacity-100">Careers</Link>
              </li>
              <li>
                <Link to="/news" className="text-white opacity-80 hover:opacity-100">News</Link>
              </li>
              <li>
                <Link to="/partners" className="text-white opacity-80 hover:opacity-100">Partners</Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2 list-none">
              <li>
                <Link to="/faq" className="text-white opacity-80 hover:opacity-100">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/blog" className="text-white opacity-80 hover:opacity-100">Blog</Link>
              </li>
              <li>
                <Link to="/guides" className="text-white opacity-80 hover:opacity-100">Ferry Guides</Link>
              </li>
              <li>
                <Link to="/api" className="text-white opacity-80 hover:opacity-100">API</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 list-none">
              <li className="text-white opacity-80">hello@sailmate.com</li>
              <li className="text-white opacity-80">+1 (555) 123-4567</li>
              <li className="text-white opacity-80">Cibali, Kadir Has Cd., 34083 Cibali / Fatih/İstanbul</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm opacity-70">© 2025 SailMate. All rights reserved.</div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms-of-service" className="text-white opacity-70 hover:opacity-100">Terms</Link>
            <Link to="/privacy-policy" className="text-white opacity-70 hover:opacity-100">Privacy</Link>
            <Link to="/cookies" className="text-white opacity-70 hover:opacity-100">Cookies</Link>
          </div>
        </div>
      </div>

      {/* Social Media Section (Vanilla CSS) */}
      <div className="social-media flex justify-center space-x-6 mt-8">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="facebook text-2xl text-gray-300 hover:text-[#F0C808] transition duration-300">
          <FaFacebookF />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="instagram text-2xl text-gray-300 hover:text-[#F0C808] transition duration-300">
          <FaInstagram />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="x text-2xl text-gray-300 hover:text-[#F0C808] transition duration-300">
          <FaXTwitter />
        </a>
      </div>

      {/* Call Center */}
      <div className="call-center text-center text-sm opacity-70 mt-6">
        <p>Call Center: 0850 222 44 36 / 444 44 36</p>
      </div>
    </footer>
  );
};

export default Footer;
