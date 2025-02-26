import React from "react";
import "../assets/styles/homepage.css";
import Cards from "../components/cards.jsx";
import creditCard from "../assets/images/secure-payment.png"
import ship from "../assets/images/ship.png"
import passenger from "../assets/images/passenger.png"
import Contact from "./Contact.jsx";

const Homepage = () => {
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
            <form>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departure">Departure</label>
                  <select id="departure">
                    <option value="yenikapi">Yenikapı</option>
                    <option value="bursa">Bursa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="arrival">Arrival</label>
                  <select id="arrival">
                    <option value="bandirma">Bandırma</option>
                    <option value="yalova">Yalova</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="departure-date">Departure Date</label>
                  <input type="date" id="departure-date" />
                </div>
                <div className="form-group">
                  <label htmlFor="return-date">Return Date</label>
                  <input type="date" id="return-date" />
                </div>
                <div className="form-group">
                  <label htmlFor="passengers">Passengers</label>
                  <input type="number" id="passengers" min="1" defaultValue="1" />
                </div>
              </div>

              <button type="submit" className="search-button">Search</button>
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

    <Cards/>
    </>
  );
};

export default Homepage;
