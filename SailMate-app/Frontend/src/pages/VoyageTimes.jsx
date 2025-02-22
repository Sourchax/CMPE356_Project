import React, { useState } from "react";
import "../assets/styles/VoyageTimes.css";

const VoyageTimes = () => {
  const allVoyages = [
    { departure: "07:00", arrival: "07:45", date: "2025-02-22", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "08:00", arrival: "08:45", date: "2025-02-22", status: "Voyage Cancel", type: "Sea Bus", fuel: "No LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "09:00", arrival: "09:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Yalova", to: "Pendik" },
    { departure: "11:00", arrival: "11:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Istanbul", to: "Yalova" },
    { departure: "13:00", arrival: "13:45", date: "2025-02-22", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "15:00", arrival: "15:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Istanbul", to: "Pendik" },
    { departure: "07:00", arrival: "07:45", date: "2025-02-22", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "08:00", arrival: "08:45", date: "2025-02-22", status: "Voyage Cancel", type: "Sea Bus", fuel: "No LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "09:00", arrival: "09:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Yalova", to: "Pendik" },
    { departure: "11:00", arrival: "11:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Istanbul", to: "Yalova" },
    { departure: "13:00", arrival: "13:45", date: "2025-02-22", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "15:00", arrival: "15:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Istanbul", to: "Pendik" },
  ];

  const [selectedDate, setSelectedDate] = useState("2025-02-22");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");

  const filteredVoyages = allVoyages.filter((voyage) =>
    (selectedDate === "" || voyage.date === selectedDate) &&
    (selectedFrom === "" || voyage.from === selectedFrom) &&
    (selectedTo === "" || voyage.to === selectedTo)
  );

  return (
    <div className="voyage-container">
      <div className="voyage_filter_info_box" >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-info-circle-fill"
        viewBox="0 0 16 16"
        style={{ marginRight: '8px' }}
      >
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2"/>
      </svg>
      <span>Voyage Filter</span>
    </div>
      <div className="filter-bar">
        <div className="dep-arr_filter">
          <label>Departure:</label>
          <select value={selectedFrom} onChange={(e) => setSelectedFrom(e.target.value)}>
            <option value="">All</option>
            <option value="Yalova">Yalova</option>
            <option value="Istanbul">Istanbul</option>
          </select>
          <label>Arrival:</label>
          <select value={selectedTo} onChange={(e) => setSelectedTo(e.target.value)}>
            <option value="">All</option>
            <option value="Pendik">Pendik</option>
            <option value="Yalova">Yalova</option>
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>
      <h2 className="title_voyage">Voyage List</h2>
      {filteredVoyages.length === 0 ? (
        <p>No voyages found matching your criteria.</p>
      ) : (
        <table className="voyage_table">
          <thead>
            <tr>
              <th>Voyage</th>
              <th>Departure Arrival Point</th>
              <th>Voyage Date</th>
              <th>Voyage Status</th>
              <th>Ship Type</th>
              <th>Fuel Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVoyages.map((voyage, index) => (
              <tr key={index} className={voyage.status === "Voyage Cancel" ? "cancelled" : "normal"}>
                <td>{voyage.from} - {voyage.to}</td>
                <td>Departure {voyage.departure} <br /> Arrival {voyage.arrival}</td>
                <td>{voyage.date}</td>
                <td>{voyage.status}</td>
                <td>{voyage.type}</td>
                <td className={voyage.fuel === "LPG" ? "lpg" : "no-lpg"}>{voyage.fuel}</td>
                <td>{voyage.available ? <button className="buy-button">Buy Ticket</button> : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VoyageTimes;
