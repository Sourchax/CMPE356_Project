import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/ticketcancel.css";

const TicketCancel = () => {
  const [ticketId, setTicketId] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowConfirmation(true);
    }, 1500);
  };

  const handleConfirm = () => {
    setLoading(true);
    
    // Simulate API call for actual cancellation
    setTimeout(() => {
      setLoading(false);
      alert("Your ticket has been successfully cancelled. A confirmation email will be sent shortly.");
      // Reset form
      setTicketId("");
      setEmail("");
      setReason("");
      setShowConfirmation(false);
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
          <h1>Cancel Your Ticket</h1>
          <p>We're sorry you need to cancel. Please enter your ticket details below.</p>
        </div>

        <div className="ticket-form-container">
          {!showConfirmation ? (
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
              
              <div className="form-group">
                <label htmlFor="reason">Reason for Cancellation (Optional)</label>
                <div className="input-with-icon textarea-container">
                  <i className="fas fa-comment-alt"></i>
                  <textarea 
                    id="reason" 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please let us know why you're cancelling" 
                    rows="3"
                  ></textarea>
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
                  <>Continue to Cancel</>
                )}
              </button>
              
              <div className="cancellation-policy">
                <p><i className="fas fa-info-circle"></i> Please note: Cancellation fees may apply depending on your ticket type and how close to departure you are cancelling.</p>
              </div>
            </form>
          ) : (
            <div className="confirmation-container">
              <div className="confirmation-header">
                <i className="fas fa-exclamation-triangle warning-icon"></i>
                <h2>Confirm Cancellation</h2>
              </div>
              
              <div className="confirmation-details">
                <p>Are you sure you want to cancel your ticket?</p>
                <div className="ticket-summary">
                  <div className="summary-item">
                    <span>Ticket ID:</span>
                    <strong>{ticketId}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Email:</span>
                    <strong>{email}</strong>
                  </div>
                </div>
                <p className="warning-text">This action cannot be undone. Refund policies will apply according to your ticket terms.</p>
              </div>
              
              <div className="confirmation-actions">
                <button 
                  onClick={() => setShowConfirmation(false)} 
                  className="back-button"
                  disabled={loading}
                >
                  Go Back
                </button>
                <button 
                  onClick={handleConfirm} 
                  className={`confirm-button ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-spinner"></span>
                  ) : (
                    <>Confirm Cancellation</>
                  )}
                </button>
              </div>
            </div>
          )}
          
          <div className="ticket-form-footer">
            <p>Need help? <button onClick={navigateToContact} className="text-link">Contact our support team</button></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCancel;