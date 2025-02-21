import React from "react";
import "../assets/styles/ticketcheck.css";

const TicketCheck = () => {
  return (
    <div className="ticketcheck-container">
      {/* Main Content */}
      <main className="ticketcheck-main">
        <h1>Check Your Ticket</h1>
        <p>Enter your ticket details below to check your booking status.</p>

        {/* Ticket Check Form */}
        <form className="ticketcheck-form">
          <div className="form-group">
            <label htmlFor="ticket-id">Ticket ID</label>
            <input type="text" id="ticket-id" placeholder="Enter your ticket ID" />
          </div>
          <button type="submit">Check Ticket</button>
        </form>
      </main>
    </div>
  );
};

export default TicketCheck;
