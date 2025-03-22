import React from "react";
import { MapPin, Calendar, ChevronRight } from 'lucide-react';

const TicketSum = ({ ticketPlanningInfo, ticketTripInfo }) => {
  if (!ticketTripInfo) return <div>No ticket data available</div>;

  const { departure, arrival, departureDate, returnDate, passengers, passengerTypes } = ticketTripInfo;
  const serviceFee = 10;

  // Discount rates
  const discountRates = {
    student: 0.10,  // 10% discount for students
    senior: 0.20,  // 20% discount for seniors
    child: 1.00     //Free 
  };

  // Calculate initial prices (before discounts)
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

  const calculatePassengerPrices = (basePrice, passengerTypes) => {
    if (!passengerTypes || basePrice === "N/A") return { total: "N/A", breakdown: {} };
    
    let total = 0;
    const breakdown = {};
    
    // Calculate price for each passenger type with appropriate discounts
    if (passengerTypes.adult) {
      const adultPrice = basePrice * passengerTypes.adult;
      total += adultPrice;
      breakdown.adult = {
        count: passengerTypes.adult,
        unitPrice: basePrice,
        discount: 0,
        total: adultPrice
      };
    }
    
    if (passengerTypes.student) {
      const studentUnitPrice = basePrice * (1 - discountRates.student);
      const studentPrice = studentUnitPrice * passengerTypes.student;
      total += studentPrice;
      breakdown.student = {
        count: passengerTypes.student,
        unitPrice: basePrice,
        discount: discountRates.student * 100,
        discountedPrice: studentUnitPrice,
        total: studentPrice
      };
    }
    
    if (passengerTypes.senior) {
      const seniorUnitPrice = basePrice * (1 - discountRates.senior);
      const seniorPrice = seniorUnitPrice * passengerTypes.senior;
      total += seniorPrice;
      breakdown.senior = {
        count: passengerTypes.senior,
        unitPrice: basePrice,
        discount: discountRates.senior * 100,
        discountedPrice: seniorUnitPrice,
        total: seniorPrice
      };
    }
    if (passengerTypes.child) {
      const childUnitPrice = basePrice * (1 - discountRates.child);
      const childPrice = childUnitPrice * passengerTypes.child;
      total += childPrice;
      breakdown.child = {
        count: passengerTypes.child,
        unitPrice: basePrice,
        discount: discountRates.child * 100,
        discountedPrice: childUnitPrice,
        total: childPrice
      };
    }
    
    return { total, breakdown };
  };

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

        // Calculate prices with discounts
        const passengerPrices = calculatePassengerPrices(selectedPrice, passengerTypes);
        
        // Update total prices for departure and return
        if (ticket.label === "ONE WAY" && passengerPrices.total !== "N/A") {
          departureTotalPrice = departureTotalPrice - (serviceFee * passengers) + passengerPrices.total + (serviceFee * passengers);
        } else if (ticket.label === "RETURN" && passengerPrices.total !== "N/A") {
          returnTotalPrice = returnTotalPrice - (serviceFee * passengers) + passengerPrices.total + (serviceFee * passengers);
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

            {/* Display passenger counts by type */}
            <div className="mb-2">
              <div className="font-medium mb-1">Passengers:</div>
              {passengerTypes && (
                <div className="space-y-1">
                  {passengerTypes.adult > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="text-gray-700">Adult × {passengerTypes.adult}</div>
                      {passengerPrices.breakdown.adult && (
                        <div className="font-bold" style={{ color: colorStyle }}>
                          ₺{passengerPrices.breakdown.adult.total.toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {passengerTypes.student > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="text-gray-700">
                        Student × {passengerTypes.student} 
                        <span className="text-green-600 ml-1">(10% off)</span>
                      </div>
                      {passengerPrices.breakdown.student && (
                        <div className="font-bold" style={{ color: colorStyle }}>
                          ₺{passengerPrices.breakdown.student.total.toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {passengerTypes.senior > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="text-gray-700">
                        Senior × {passengerTypes.senior}
                        <span className="text-green-600 ml-1">(20% off)</span>
                      </div>
                      {passengerPrices.breakdown.senior && (
                        <div className="font-bold" style={{ color: colorStyle }}>
                          ₺{passengerPrices.breakdown.senior.total.toFixed(2)}
                        </div>
                      )}
                    </div>
                  )}
                  {passengerTypes.child > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="text-gray-700">
                        Child × {passengerTypes.child}
                        <span className="text-green-600 ml-1">(100% off)</span>
                      </div>
                      {passengerPrices.breakdown.child && (
                        <div className="font-bold" style={{ color: colorStyle }}>
                          ₺0.00
                        </div>
                      )}
                    </div>
                  )}
                </div>              
              )}
            </div>

            {/* Display only the selected seat type's price */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">Base Price</div>
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
                {ticket.label === "ONE WAY" ? `₺${departureTotalPrice.toFixed(2)}` : `₺${returnTotalPrice.toFixed(2)}`}
              </div>
            </div>
          </div>
        );
      })}

      {/* Total Price at the end */}
      <div className="bg-green-600 text-white p-4 mt-6 rounded-md shadow-md flex justify-between items-center">
        <div className="text-lg font-bold">Grand Total</div>
        <div className="text-xl font-bold">
          {returnDate === "" ? 
            `₺${departureTotalPrice.toFixed(2)}` : 
            `₺${(departureTotalPrice + returnTotalPrice).toFixed(2)}`}
        </div>
      </div>
    </>
  );
};

export default TicketSum;