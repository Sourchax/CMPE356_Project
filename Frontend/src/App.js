import React, { useState } from "react";
import "./App.css";

function App() {
    const [seats, setSeats] = useState(Array(50).fill(null));
    const [name, setName] = useState("");
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [startPoint, setStartPoint] = useState("Start Location");
    const [endPoint, setEndPoint] = useState("End Location");

    const locations = ["Yenikapı", "Bursa"];

    const bookSeat = () => {
        if (!name || selectedSeat === null || startPoint === "Start Location" || endPoint === "End Location" || startPoint === endPoint) return;
        const newSeats = [...seats];
        newSeats[selectedSeat] = `${name} (From: ${startPoint} → To: ${endPoint})`;
        setSeats(newSeats);
        setName("");
        setSelectedSeat(null);
        setStartPoint("Start Location");
        setEndPoint("End Location");
    };

    return (
        <div className="container">
            <h1>⛴️ Ferry Seat Booking System</h1>
            <div className="form">
                <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <select value={startPoint} onChange={(e) => setStartPoint(e.target.value)}>
                    <option disabled>Start Location</option>
                    {locations.map((location, index) => (
                        <option key={index} value={location}>{location}</option>
                    ))}
                </select>
                <select value={endPoint} onChange={(e) => setEndPoint(e.target.value)}>
                    <option disabled>End Location</option>
                    {locations.map((location, index) => (
                        <option key={index} value={location} disabled={location === startPoint}>{location}</option>
                    ))}
                </select>
                <select value={selectedSeat} onChange={(e) => setSelectedSeat(Number(e.target.value))}>
                    <option value="">Select a Seat</option>
                    {seats.map((seat, index) => (
                        <option key={index} value={index} disabled={seat !== null}>
                            Seat {index + 1} {seat ? "(Booked)" : "(Available)"}
                        </option>
                    ))}
                </select>
                <button onClick={bookSeat}>Book Seat</button>
            </div>

            <h2>🪑 Seat Map</h2>
            <div className="seat-map">
                {seats.map((seat, index) => (
                    <div key={index} className={`seat ${seat ? "booked" : "available"}`}>
                        {seat ? `Seat ${index + 1} (Booked by ${seat})` : `Seat ${index + 1} (Available)`}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;