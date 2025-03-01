import React from "react";
import { MapPin, Calendar, ChevronRight } from 'lucide-react';

const TicketSum = ({ ticketPlanningInfo, ticketTripInfo }) => {
  if (!ticketTripInfo) return <div>No ticket data available</div>;

  const { departure, arrival, departureDate, returnDate, passengers } = ticketTripInfo;
  const serviceFee = 10;

  // Initialize totalPrice for both departure and return separately
  let departureTotalPrice = serviceFee * passengers;
  let returnTotalPrice = serviceFee * passengers;

  const tickets = [
    { label: "ONE WAY", date: departureDate, dep: departure, arr: arrival, planningInfo: ticketPlanningInfo?.departure },
    returnDate ? { label: "RETURN", date: returnDate, dep: arrival, arr: departure, planningInfo: ticketPlanningInfo?.return } : null
  ].filter(Boolean);

  // Define seat type colors
  const seatTypeColors = {
    business: "#c74646",
    promo: "#f0c808",
    economy: "#34a693"
  };

  let finalTotalPrice = 0;

  return (
    <>
      {tickets.map((ticket, index) => {
        // Extract data from planningInfo or use placeholder if missing
        const planning = ticket.planningInfo || {};
        const depTime = planning?.departure || "N/A";
        const arrTime = planning?.arrival || "N/A";
        const businessPrice = planning?.business || "N/A";
        const promoPrice = planning?.promo || "N/A";
        const economyPrice = planning?.economy || "N/A";
        const seatType = planning?.type || "N/A";

        // Set price based on selected seat type
        let selectedPrice;
        if (seatType === "business") {
          selectedPrice = businessPrice;
        } else if (seatType === "promo") {
          selectedPrice = promoPrice;
        } else if (seatType === "economy") {
          selectedPrice = economyPrice;
        } else {
          selectedPrice = "N/A";
        }

        // Update total price for departure and return separately
        if (ticket.label === "ONE WAY" && selectedPrice !== "N/A") {
          departureTotalPrice += selectedPrice * passengers;
        } else if (ticket.label === "RETURN" && selectedPrice !== "N/A") {
          returnTotalPrice += selectedPrice * passengers;
        }

        // Set the overall color style based on the selected seat type
        const colorStyle = seatTypeColors[seatType] || "black";  // Default to black if seat type is unknown

        return (
          <div key={index} className="bg-white rounded-md shadow-sm p-4 mb-4" style={{ borderColor: colorStyle, borderWidth: '2px' }}>
            <div className="flex justify-between items-center mb-2">
              <div className="bg-white text-blue-600 font-bold" style={{ color: colorStyle }}>
                {ticket.label}
              </div>
              <div className="flex items-center">
                <ChevronRight className="mr-2 text-gray-500" />
                <span 
                  className="text-green-500 font-bold"
                  style={{ color: colorStyle }}
                >
                  {seatType.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-gray-600" style={{ color: colorStyle }}>{ticket.dep}</span>
                <MapPin className="mx-2" style={{ color: colorStyle }} />
              </div>
              <div className="flex items-center">
                <span className="text-gray-600" style={{ color: colorStyle }}>{ticket.arr}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Calendar className="mr-2" style={{ color: colorStyle }} />
                <div>
                  <div className="text-gray-600">Date</div>
                  <div>{ticket.date || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-right">
                  <div className="text-gray-600">Departure - Arrival</div>
                  <div>{depTime} - {arrTime}</div>
                </div>
              </div>
            </div>

            <div className="border-t my-2"></div>

            <div className="flex justify-between items-center mb-2">
              <div>{passengers} Passenger{passengers > 1 ? 's' : ''}</div>
              <div className="font-bold" style={{ color: colorStyle }}>
                ₺{selectedPrice !== "N/A" ? selectedPrice * passengers : "N/A"}
              </div>
            </div>

            {/* Display only the selected seat type's price */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">Selected Price</div>
              <div className="font-bold" style={{ color: colorStyle }}>
                ₺{selectedPrice}
              </div>
            </div>

            <div className="border-t my-2"></div>

            {/* Display Service Fee */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">Service Fee</div>
              <div className="font-bold" style={{ color: colorStyle }}>
                ₺{serviceFee * passengers}
              </div>
            </div>

            {/* Display Total Price */}
            <div className="bg-green-500 text-white p-2 flex justify-between items-center" style={{ backgroundColor: colorStyle }}>
              <div>TOTAL</div>
              <div>
                {ticket.label === "ONE WAY" ? `₺${departureTotalPrice}` : `₺${returnTotalPrice}`}
              </div>
            </div>

          
          </div>
        );
      })}

      {/* Total Price at the end */}
      <div className="bg-green-600 text-white p-4 mt-6 rounded-md shadow-md flex justify-between items-center">
        <div className="text-lg font-bold">Grand Total</div>
        <div className="text-xl font-bold">{`₺${departureTotalPrice + returnTotalPrice}`}</div>
      </div>
    </>
  );
};

export default TicketSum;
