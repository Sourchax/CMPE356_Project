import React from "react";
import "../assets/styles/voyagetimes.css";

const VoyageTimes = () => {
  return (
    <div className="voyagetimes-container">
      {/* Main Content */}
      <main className="voyagetimes-main">
        <h1>Voyage Times</h1>
        <p>Find the latest voyage schedules below:</p>

        {/* Placeholder table for voyage times */}
        <table className="voyage-table">
          <thead>
            <tr>
              <th>Departure</th>
              <th>Arrival</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Yenikapı</td>
              <td>Bandırma</td>
              <td>10:00 AM</td>
              <td>On Time</td>
            </tr>
            <tr>
              <td>Kadıköy</td>
              <td>Bursa</td>
              <td>11:30 AM</td>
              <td>Delayed</td>
            </tr>
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default VoyageTimes;
