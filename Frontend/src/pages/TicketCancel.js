import React from "react";
import "../assets/styles/ticketcancel.css";

const TicketCancel = () => {
  return (
    <div className="ticketcancel-container">
      {/* Main Content */}
      <main className="ticketcancel-main">
        <h1>Cancel Your Ticket</h1>
        <p>Enter your ticket details below to cancel your booking.</p>

        {/* Ticket Cancellation Form */}
        <form className="ticketcancel-form">
          <div className="form-group">
            <label htmlFor="ticket-id">Ticket ID</label>
            <input type="text" id="ticket-id" placeholder="Enter your ticket ID" />
          </div>
          <button type="submit">Cancel Ticket</button>
        </form>
      </main>
    </div>
  );
};

export default TicketCancel;
