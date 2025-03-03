import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/ticketcheck.css";

const TicketCheck = () => {
  const [ticketId, setTicketId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Handle ticket check logic here
      alert("Ticket check functionality will be implemented soon.");
    }, 1500);
  };

  const navigateToContact = () => {
    navigate("/contact");
  };

  return (
    <div className="ticket-page-container">
      {/* Hero Background */}
      <div className="hero-background"></div>
      
      {/* Wave Transition */}
      <div className="wave-transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="ticket-page-content">
        <div className="ticket-page-header">
          <h1>Check Your Ticket Status</h1>
          <p>Enter your ticket details below to view your booking information</p>
        </div>

        <div className="ticket-form-container">
          <form onSubmit={handleSubmit} className="ticket-form">
            <div className="form-group">
              <label htmlFor="ticket-id">Ticket ID / Reservation Number</label>
              <div className="input-with-icon">
                <i className="fas fa-ticket-alt"></i>
                <input 
                  type="text" 
                  id="ticket-id" 
                  value={ticketId}
                  onChange={(e) => setTicketId(e.target.value)}
                  placeholder="Enter your ticket ID" 
                  required 
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter the email used for booking" 
                  required 
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>Check Ticket Status</>
              )}
            </button>
          </form>
          
          <div className="ticket-form-footer">
            <p>Need help? <button onClick={navigateToContact} className="text-link">Contact our support team</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCheck;