import React, { useState, useEffect } from "react";
import "../../assets/styles/PlanningPhase/PlaPha.css";
import PromoLogo from "../../assets/images/Promo.png";
import EconomyLogo from "../../assets/images/Economy.png";
import BusinessLogo from "../../assets/images/Business.png";

const fetchFerryData = async (route, date) => {
  console.log(`Fetching data for route: ${route}, date: ${date}`);
  return [
    { departure: "08:00", arrival: "08:45", promo: 195, economy: 225, business: 250 },
    { departure: "10:00", arrival: "10:45", promo: 195, economy: 225, business: 250 },
    { departure: "12:00", arrival: "12:45", promo: 195, economy: 225, business: 250 },
  ];
};

const PlanningPhase = ({ tripData, onSelectDeparture, onSelectReturn }) => {
  const [departureTrips, setDepartureTrips] = useState([]);
  const [returnTrips, setReturnTrips] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    departure: null,
    return: null
  });

  useEffect(() => {
    const loadDepartureData = async () => {
      const data = await fetchFerryData(tripData.departure, tripData.departureDate);
      setDepartureTrips(data);
    };

    loadDepartureData();

    if (tripData.returnDate) {
      const loadReturnData = async () => {
        const data = await fetchFerryData(tripData.arrival, tripData.returnDate);
        setReturnTrips(data);
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

    // Send the selected trip data to the parent component via props
    if (isReturn) {
      onSelectReturn(selectedTrip);  // Make sure this function is passed correctly
    } else {
      onSelectDeparture(selectedTrip);  // Make sure this function is passed correctly
    }
  };

  useEffect(() => {
    console.log("Selected Option Updated:", selectedOption);
  }, [selectedOption]);  // Logs whenever the selectedOption changes

  const calculatePrice = (basePrice) => basePrice * tripData.passengers;

  const renderTable = (trips, isReturn = false) => (
    <div className="overflow-x-auto">
      <table className="w-full max-w-full border-collapse shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="text-blue text-xl">
            <th className="p-6" colSpan={2} style={{ textAlign: 'center', fontSize: '1.5rem' }}>Departure & Arrival</th>
            <th className="p-6" style={{ backgroundImage: `url(${PromoLogo})`, backgroundSize: 'cover', fontSize: '1.5rem' }}></th>
            <th className="p-6 bg-[#D1FFD7]" style={{ backgroundImage: `url(${EconomyLogo})`, backgroundSize: 'cover', fontSize: '1.5rem' }}></th>
            <th className="p-6 bg-[#F05D5E]" style={{ backgroundImage: `url(${BusinessLogo})`, backgroundSize: 'cover', fontSize: '1.5rem' }}></th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip, index) => (
            <tr key={index} className="text-center border-b border-gray-300 hover:bg-gray-100">
              <td className="p-6">{trip.departure}</td>
              <td className="p-6">{trip.arrival}</td>
              <td
                className={`p-6 cursor-pointer ${selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure ? "bg-[#f0c808]/80" : "hover:bg-[#f0c808]/80"}`}
                onClick={() => handleSelectTrip(trip, "promo", isReturn)}
              >
                {calculatePrice(trip.promo)}₺
              </td>
              <td
                className={`p-6 cursor-pointer ${selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure ? "bg-[#D1FFD7]/80" : "hover:bg-[#D1FFD7]/80"}`}
                onClick={() => handleSelectTrip(trip, "economy", isReturn)}
              >
                {calculatePrice(trip.economy)}₺
              </td>
              <td
                className={`p-6 cursor-pointer ${selectedOption[isReturn ? "return" : "departure"]?.type === "business" && selectedOption[isReturn ? "return" : "departure"]?.departure === trip.departure ? "bg-[#F05D5E]/80" : "hover:bg-[#F05D5E]/80"}`}
                onClick={() => handleSelectTrip(trip, "business", isReturn)}
              >
                {calculatePrice(trip.business)}₺
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-[#0D3A73] mb-6">Journey Planning</h2>
      <h3 className="text-2xl font-bold text-[#0D3A73] mb-4">Departure Trip</h3>
      {renderTable(departureTrips)}
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