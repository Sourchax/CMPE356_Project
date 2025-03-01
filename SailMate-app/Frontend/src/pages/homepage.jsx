import React, { useState } from "react";
import "../assets/styles/homepage.css";
import Cards from "../components/cards.jsx";
import creditCard from "../assets/images/secure-payment.png";
import ship from "../assets/images/ship.png";
import passenger from "../assets/images/passenger.png";
import { useNavigate, useLocation } from "react-router-dom";


const Homepage = () => {
  const location = useLocation();
  const [tripType, setTripType] = useState("oneway");
  const [formData, setFormData] = useState({
    departure: " ",
    arrival: " ",
    departureDate: "",
    returnDate: "",
    passengers: 1,
  });

  const handleTripTypeChange = (e) => {
    setTripType(e.target.value);
    if (e.target.value === "oneway") {
      setFormData((prev) => ({ ...prev, returnDate: "" }));
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/ferry-ticket-form", { state: { tripData: formData, fromHomepage: true } });
  };

  return (
    <>
      <main className="homepage">
        {/* Hero Section */}
        <section className="hero">
          <h1>🚢 Welcome to SailMate</h1>
          <p>Your mate for smooth sailing..</p>
        </section>

        {/* Ticket Search Section */}
        <section className="ticket-search">
          <div className="ticket-card">
            <h2>Find Your Ferry</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Trip Type</label>
                <div>
                  <input
                    type="radio"
                    id="oneway"
                    name="tripType"
                    value="oneway"
                    checked={tripType === "oneway"}
                    onChange={handleTripTypeChange}
                  />
                  <label htmlFor="oneway">One-way</label>

                  <input
                    type="radio"
                    id="round"
                    name="tripType"
                    value="round"
                    checked={tripType === "round"}
                    onChange={handleTripTypeChange}
                  />
                  <label htmlFor="round">Round Trip</label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departure">Departure</label>
                  <select id="departure" value={formData.departure} onChange={handleChange}>
                    <option value=" ">Select Departure</option>
                    <option value="Yenikapı">Yenikapı</option>
                    <option value="Bursa">Bursa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="arrival">Arrival</label>
                  <select id="arrival" value={formData.arrival} onChange={handleChange}>
                    <option value=" ">Select Arrival</option>
                    <option value="Bandırma">Bandırma</option>
                    <option value="Yalova">Yalova</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departureDate">Departure Date</label>
                  <input
                    type="date"
                    id="departureDate"
                    value={formData.departureDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="returnDate">Return Date</label>
                  <input
                    type="date"
                    id="returnDate"
                    value={formData.returnDate}
                    onChange={handleChange}
                    disabled={tripType === "oneway"}
                    required={tripType === "round"}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="passengers">Passengers</label>
                  <input
                    type="number"
                    id="passengers"
                    min="1"
                    value={formData.passengers}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
        </section>
      </main>

      <div className="flex justify-around items-center mx-auto max-w-5xl w-full flex-wrap gap-6 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <img src={creditCard} className="w-12 h-12 sm:w-10 sm:h-10 md:w-14 md:h-14" alt="Secure Online Payment" />
          <h4 className="mt-2 text-lg sm:text-sm md:text-base">Secure Online Payment</h4>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <img src={ship} className="w-12 h-12 sm:w-10 sm:h-10 md:w-14 md:h-14" alt="Accessibility Service" />
          <h4 className="mt-2 text-lg sm:text-sm md:text-base">Accessibility Service</h4>
        </div>
        <div className="flex flex-col items-center justify-center text-center">
          <img src={passenger} className="w-12 h-12 sm:w-10 sm:h-10 md:w-14 md:h-14" alt="Enjoyable Journey" />
          <h4 className="mt-2 text-lg sm:text-sm md:text-base">Enjoyable Journey</h4>
        </div>
      </div>

      <h1 className="text-center">Latest Announcements</h1>
      <Cards />
    </>
  );
};

export default Homepage;
