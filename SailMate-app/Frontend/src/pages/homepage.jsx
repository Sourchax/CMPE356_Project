import React from "react";
import "../assets/styles/homepage.css";
import Cards from "../components/cards.jsx";
import creditCard from "../assets/images/secure-payment.png"
import ship from "../assets/images/ship.png"
import passenger from "../assets/images/passenger.png"

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
    <div className="infobar-home">
      <div>
        <img src={creditCard}></img>
        <h4> Secure Online Payment </h4>
      </div>
      <div>
        <img src={ship}></img>
        <h4> Accessibility Service </h4>
      </div>
      <div>
        <img src={passenger}></img>
        <h4> Enjoyable Journey </h4>
      </div>
    </div>
    <Cards/>
    </>
  );
};

export default Homepage;
