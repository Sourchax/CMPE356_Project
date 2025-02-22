import React from "react";
import SeatLayout from "../components/seatLayout";
import "../assets/styles/aboutus.css";
import TicketSum from "../components/seatSelectionPhase/TicketSum.jsx";

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <TicketSum/>
      <main className="aboutus-main"></main>
    </div>
  );
};

export default AboutUs;
