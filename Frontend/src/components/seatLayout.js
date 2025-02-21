import React, { useState } from 'react';
import "../assets/styles/seatLayout.css";
import ferry_icon from "../assets/images/ferry_icon.png";

const SeatLayout = () => {
  const [seats, setSeats] = useState(Array(180).fill(false));
  const [zoom, setZoom] = useState(1);

  const MIN_ZOOM = 0.6;
  const MAX_ZOOM = 1.5;

  const toggleSeat = (index) => {
    setSeats(seats.map((seat, i) => (i === index ? !seat : seat)));
  };

  const generateSeatId = (rowIndex, seatIndex) => {
    const rowLabel = String.fromCharCode(65 + rowIndex);
    return `${rowLabel}${seatIndex + 1}`;
  };

  const renderSeats = () => {
    let seatComponents = [];

    // Upper Windowside (3 rows, 10 seats each)
    for (let i = 0; i < 3; i++) {
      let rowSeats = [];
      for (let j = 0; j < 10; j++) {
        const index = i * 10 + j;
        rowSeats.push(
          <div
            key={index}
            className={`seat ${seats[index] ? 'selected' : ''}`}
            onClick={() => toggleSeat(index)}
          >
            {generateSeatId(i, j)}
          </div>
        );
      }
      if (i === 0) {
        seatComponents.push(
          <div key="window-top" className="window-legend">
            Windows
          </div>
        );
      }
      seatComponents.push(
        <div key={i} className="row">
          {rowSeats}
        </div>
      );
    }

    // Insert a blank row to indicate the hall (a gap between the seat sections)
    seatComponents.push(
      <div key="hall" className="hall-row"></div>
    );

    // Upper Middle (3 rows, 20 seats each)
    for (let i = 0; i < 3; i++) {
      let rowSeats = [];
      for (let j = 0; j < 20; j++) {
        const index = 30 + i * 20 + j;
        rowSeats.push(
          <div
            key={index}
            className={`seat ${seats[index] ? 'selected' : ''}`}
            onClick={() => toggleSeat(index)}
          >
            {generateSeatId(i + 3, j)}
          </div>
        );
      }
      seatComponents.push(
        <div key={i} className="row">
          {rowSeats}
        </div>
      );
    }

    // Insert a blank row to indicate the hall (a gap between the seat sections)
    seatComponents.push(
        <div key="hall" className="hall-row"></div>
        );

    // Lower Middle (3 rows, 20 seats each)
    for (let i = 0; i < 3; i++) {
      let rowSeats = [];
      for (let j = 0; j < 20; j++) {
        const index = 90 + i * 20 + j;
        rowSeats.push(
          <div
            key={index}
            className={`seat ${seats[index] ? 'selected' : ''}`}
            onClick={() => toggleSeat(index)}
          >
            {generateSeatId(i + 6, j)}
          </div>
        );
      }
      seatComponents.push(
        <div key={i} className="row">
          {rowSeats}
        </div>
      );
    }

    // Insert a blank row to indicate the hall (a gap between the seat sections)
    seatComponents.push(
        <div key="hall" className="hall-row"></div>
        
        );

    // Lower Windowside (3 rows, 10 seats each)
    for (let i = 0; i < 3; i++) {
      let rowSeats = [];
      for (let j = 0; j < 10; j++) {
        const index = 150 + i * 10 + j;
        rowSeats.push(
          <div
            key={index}
            className={`seat ${seats[index] ? 'selected' : ''}`}
            onClick={() => toggleSeat(index)}
          >
            {generateSeatId(i + 9, j)}
          </div>
        );
      }
      seatComponents.push(
        <div key={i} className="row">
          {rowSeats}
        </div>
      );
    }

    // Add the bottom window legend
    seatComponents.push(
      <div key="window-bottom" className="window-legend">
        Windows
      </div>
    );

    return seatComponents;
  };

  const zoomIn = () => {
    if (zoom < MAX_ZOOM) {
      setZoom(zoom + 0.1);
    }
  };

  const zoomOut = () => {
    if (zoom > MIN_ZOOM) {
      setZoom(zoom - 0.1);
    }
  };

  return (
    <div className="seat-layout-container">
        <h2>Select your seats</h2>
        <div className="zoom-controls">
            <button className="button" onClick={zoomIn}>Zoom In</button>
            <button className="button" onClick={zoomOut}>Zoom Out</button>
        </div>

        <div className="seat-selection-box">
            <div className="seats" style={{ transform: `scale(${zoom})` }}>
                {renderSeats()}
        </div>
        
    </div>


      <button className="button" onClick={() => alert('Seats Selected!')}>Confirm Selection</button>
    </div>
  );
};

export default SeatLayout;
