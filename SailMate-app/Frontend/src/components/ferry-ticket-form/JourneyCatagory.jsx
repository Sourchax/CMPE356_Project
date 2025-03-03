import React, { useState, useEffect } from "react";
import "../../assets/styles/ferry-ticket-form/PlaPha.css";
import PromoLogo from "../../assets/images/Promo.png";
import EconomyLogo from "../../assets/images/Economy.png";
import BusinessLogo from "../../assets/images/Business.png";
import { Ship, Clock, Users } from "lucide-react";

const fetchFerryData = async (route, date) => {
  console.log(`Fetching data for route: ${route}, date: ${date}`);
  return [
    { departure: "08:00", arrival: "08:45", promo: 195, economy: 225, business: 250, availableSeats: 42 },
    { departure: "10:00", arrival: "10:45", promo: 195, economy: 225, business: 250, availableSeats: 28 },
    { departure: "12:00", arrival: "12:45", promo: 195, economy: 225, business: 250, availableSeats: 56 },
  ];
};

const PlanningPhase = ({ tripData, onSelectDeparture, onSelectReturn }) => {
  const [departureTrips, setDepartureTrips] = useState([]);
  const [returnTrips, setReturnTrips] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    departure: null,
    return: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDepartureData = async () => {
      setLoading(true);
      try {
        const data = await fetchFerryData(tripData.departure, tripData.departureDate);
        setDepartureTrips(data);
      } catch (error) {
        console.error("Error fetching departure data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDepartureData();

    if (tripData.returnDate) {
      const loadReturnData = async () => {
        try {
          const data = await fetchFerryData(tripData.arrival, tripData.returnDate);
          setReturnTrips(data);
        } catch (error) {
          console.error("Error fetching return data:", error);
        }
      };
      loadReturnData();
    }
  }, [tripData]);

  const handleSelectTrip = (trip, type, isReturn = false) => {
    const selectedTrip = { ...trip, type };
    setSelectedOption((prev) => ({
      ...prev,
      [isReturn ? "return" : "departure"]: selectedTrip,
    }));

    // Send the selected trip data to the parent component
    if (isReturn) {
      onSelectReturn(selectedTrip);
    } else {
      onSelectDeparture(selectedTrip);
    }
  };

  const calculatePrice = (basePrice) => {
    const passengersCount = parseInt(tripData.passengers, 10) || 1;
    return (basePrice * passengersCount).toFixed(0);
  };

  const calculateDuration = (departure, arrival) => {
    const [departHours, departMinutes] = departure.split(":").map(Number);
    const [arriveHours, arriveMinutes] = arrival.split(":").map(Number);
    
    let durationMinutes = (arriveHours * 60 + arriveMinutes) - (departHours * 60 + departMinutes);
    if (durationMinutes < 0) durationMinutes += 24 * 60; // Handle crossing midnight
    
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const renderTable = (trips, isReturn = false) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="text-blue text-xl bg-gray-50">
            <th className="p-6" style={{ textAlign: 'center', fontSize: '1.25rem' }}>
              <div className="flex items-center justify-center space-x-2">
                <Clock size={20} className="text-gray-600" />
                <span>Departure</span>
              </div>
            </th>
            <th className="p-6" style={{ textAlign: 'center', fontSize: '1.25rem' }}>
              <div className="flex items-center justify-center space-x-2">
                <Clock size={20} className="text-gray-600" />
                <span>Arrival</span>
              </div>
            </th>
            <th className="p-6" style={{ backgroundImage: `url(${PromoLogo})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', fontSize: '1.25rem' }}>
            </th>
            <th className="p-6" style={{ backgroundImage: `url(${EconomyLogo})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', fontSize: '1.25rem' }}>
            </th>
            <th className="p-6" style={{ backgroundImage: `url(${BusinessLogo})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', fontSize: '1.25rem' }}>
            </th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => {
            const duration = calculateDuration(trip.departure, trip.arrival);
            
            return (
              <tr key={index} className={`text-center border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="p-5">
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold">{trip.departure}</div>
                    <div className="text-sm text-gray-500">{tripData[isReturn ? "arrival" : "departure"]}</div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex flex-col items-center">
                    <div className="text-xl font-bold">{trip.arrival}</div>
                    <div className="text-sm text-gray-500">{tripData[isReturn ? "departure" : "arrival"]}</div>
                    <div className="flex items-center mt-1 text-xs">
                      <div className="bg-blue-50 text-blue-700 rounded-full px-2 py-1 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {duration}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  className={`p-5 cursor-pointer transition-colors relative ${
                    selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && 
                    selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure
                      ? "bg-[#f0c808]" 
                      : "hover:bg-[#f0c808]/60"
                  }`}
                  onClick={() => handleSelectTrip(trip, "promo", isReturn)}
                >
                  <div className={`text-xl font-medium ${
                    selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && 
                    selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure
                      ? "text-black" 
                      : ""
                  }`}>
                    {calculatePrice(trip.promo)}₺
                  </div>
                  
                  {selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && 
                   selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure && (
                    <div className="absolute top-1 right-1 bg-white text-yellow-700 p-1 rounded-full">
                      ✓
                    </div>
                  )}
                  
                  <div className="mt-1 flex justify-center">
                    <div className="text-xs flex items-center text-gray-700">
                      <Users size={10} className="mr-1" />
                      {trip.availableSeats} seats left
                    </div>
                  </div>
                </td>
                <td
                  className={`p-5 cursor-pointer transition-colors relative ${
                    selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && 
                    selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure
                      ? "bg-[#D1FFD7]" 
                      : "hover:bg-[#D1FFD7]/60"
                  }`}
                  onClick={() => handleSelectTrip(trip, "economy", isReturn)}
                >
                  <div className={`text-xl font-medium ${
                    selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && 
                    selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure
                      ? "text-black" 
                      : ""
                  }`}>
                    {calculatePrice(trip.economy)}₺
                  </div>
                  
                  {selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && 
                   selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure && (
                    <div className="absolute top-1 right-1 bg-white text-green-700 p-1 rounded-full">
                      ✓
                    </div>
                  )}
                  
                  <div className="mt-1 flex justify-center">
                    <div className="text-xs flex items-center text-gray-700">
                      <Users size={10} className="mr-1" />
                      {trip.availableSeats} seats left
                    </div>
                  </div>
                </td>
                <td
                  className={`p-5 cursor-pointer transition-colors relative ${
                    selectedOption[isReturn ? "return" : "departure"]?.type === "business" && 
                    selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure
                      ? "bg-[#F05D5E]" 
                      : "hover:bg-[#F05D5E]/60"
                  }`}
                  onClick={() => handleSelectTrip(trip, "business", isReturn)}
                >
                  <div className={`text-xl font-medium ${
                    selectedOption[isReturn ? "return" : "departure"]?.type === "business" && 
                    selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure
                      ? "text-white" 
                      : ""
                  }`}>
                    {calculatePrice(trip.business)}₺
                  </div>
                  
                  {selectedOption[isReturn ? "return" : "departure"]?.type === "business" && 
                   selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure && (
                    <div className="absolute top-1 right-1 bg-white text-red-700 p-1 rounded-full">
                      ✓
                    </div>
                  )}
                  
                  <div className="mt-1 flex justify-center">
                    <div className="text-xs flex items-center text-gray-700">
                      <Users size={10} className="mr-1" />
                      {trip.availableSeats} seats left
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <Ship className="text-[#0D3A73] mr-2" size={28} />
        <h2 className="text-3xl font-bold text-[#0D3A73]">Journey Planning</h2>
      </div>
      
      <h3 className="text-2xl font-bold text-[#0D3A73] mb-4">Departure Trip</h3>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        renderTable(departureTrips)
      )}
      
      {tripData.returnDate && (
        <>
          <h3 className="text-2xl font-bold text-[#0D3A73] mt-8 mb-4">Return Trip</h3>
          {renderTable(returnTrips, true)}
        </>
      )}
    </div>
  );
};

export default PlanningPhase;