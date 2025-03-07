import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // New X logo
import "../assets/styles/footer.css";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 relative">
      {/* Background Overlay - Similar to Contact page */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
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
                <Link to="/guides" className="text-white opacity-80 hover:opacity-100">Ferry Guides</Link>
              </li>
              {/* Travelling Rules */}
              <li>
                <Link to="/travelling-rules" className="text-white opacity-80 hover:opacity-100">Travelling Rules</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 list-none">
              <li className="text-white opacity-80">sailmatesup@gmail.com</li>
              <li className="text-white opacity-80">+90 546 434 20 22</li>
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
          </div>
        </div>
      </div>

      {/* Social Media Section (Vanilla CSS) */}
      <div className="social-media flex justify-center space-x-6 mt-8 relative z-10">
        <a href="https://www.facebook.com/profile.php?id=61573753716618" target="_blank" rel="noopener noreferrer" className="facebook text-2xl text-gray-300 hover:text-[#F0C808] transition duration-300">
          <FaFacebookF />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="instagram text-2xl text-gray-300 hover:text-[#F0C808] transition duration-300">
          <FaInstagram />
        </a>
        <a href="https://x.com/sailmate221538" target="_blank" rel="noopener noreferrer" className="x text-2xl text-gray-300 hover:text-[#F0C808] transition duration-300">
          <FaXTwitter />
        </a>
      </div>
    </footer>
  );
};

export default Footer;