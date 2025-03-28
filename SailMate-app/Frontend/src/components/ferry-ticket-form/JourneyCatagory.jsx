import React, { useState, useEffect } from "react";
import "../../assets/styles/ferry-ticket-form/PlaPha.css";
import PromoLogo from "../../assets/images/Promo.png";
import EconomyLogo from "../../assets/images/Economy.png";
import BusinessLogo from "../../assets/images/Business.png";
import { Ship, Clock, Users, ChevronUp, ChevronDown, Calendar, ArrowRight } from "lucide-react";

const PlanningPhase = ({tripData, availableVoyages, onSelectDeparture, onSelectReturn }) => {
  const [departureTrips, setDepartureTrips] = useState([]);
  const [returnTrips, setReturnTrips] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    departure: null,
    return: null
  });
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [collapsedDeparture, setCollapsedDeparture] = useState(false);
  const [collapsedReturn, setCollapsedReturn] = useState(false);

  // Check viewport width for responsive design
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Process voyage data from props when it's available
  useEffect(() => {
    setLoading(true);
    
    try {
      // Check if availableVoyages exists and has data
      if (availableVoyages) {
        // For one-way trip
        if (!Array.isArray(availableVoyages[0])) {
          // Transform API voyage data to match the component's expected format
          const transformedDepartureData = availableVoyages.map(voyage => ({
            departure: voyage.departureTime ? voyage.departureTime.substring(0, 5) : "00:00",
            arrival: voyage.arrivalTime ? voyage.arrivalTime.substring(0, 5) : "00:00",
            promo: voyage.promoFare || 200,
            economy: voyage.economyFare || 250,
            business: voyage.businessFare || 350,
            availableSeats: voyage.availableSeats || 30,
            voyageId: voyage.id
          }));
          
          setDepartureTrips(transformedDepartureData);
          setReturnTrips([]);
        } 
        // For round trip
        else if (Array.isArray(availableVoyages[0]) && Array.isArray(availableVoyages[1])) {
          // Transform departure voyages
          const transformedDepartureData = availableVoyages[0].map(voyage => ({
            departure: voyage.departureTime ? voyage.departureTime.substring(0, 5) : "00:00",
            arrival: voyage.arrivalTime ? voyage.arrivalTime.substring(0, 5) : "00:00",
            promo: voyage.promoFare || 200,
            economy: voyage.economyFare || 250,
            business: voyage.businessFare || 350,
            availableSeats: voyage.availableSeats || 30,
            voyageId: voyage.id
          }));
          
          // Transform return voyages
          const transformedReturnData = availableVoyages[1].map(voyage => ({
            departure: voyage.departureTime ? voyage.departureTime.substring(0, 5) : "00:00",
            arrival: voyage.arrivalTime ? voyage.arrivalTime.substring(0, 5) : "00:00",
            promo: voyage.promoFare || 200,
            economy: voyage.economyFare || 250,
            business: voyage.businessFare || 350,
            availableSeats: voyage.availableSeats || 30,
            voyageId: voyage.id
          }));
          
          setDepartureTrips(transformedDepartureData);
          setReturnTrips(transformedReturnData);
        }
      } else {
        // If no data is available, use empty arrays
        setDepartureTrips([]);
        setReturnTrips([]);
      }
    } catch (error) {
      console.error("Error processing voyage data:", error);
    } finally {
      setLoading(false);
    }
  }, [availableVoyages]);

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

  const toggleDepartureCollapse = () => {
    setCollapsedDeparture(!collapsedDeparture);
  };

  const toggleReturnCollapse = () => {
    setCollapsedReturn(!collapsedReturn);
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

  const getClassForType = (type) => {
    switch (type) {
      case "promo":
        return "text-yellow-800 bg-yellow-100";
      case "economy":
        return "text-green-800 bg-green-100";
      case "business":
        return "text-red-800 bg-red-100";
      default:
        return "text-gray-800 bg-gray-100";
    }
  };

  // Mobile view for trip card
  const renderMobileCard = (trip, isReturn = false) => {
    const duration = calculateDuration(trip.departure, trip.arrival);
    
    return (
      <div className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
        {/* Trip header with departure and arrival */}
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-center">
            <div className="text-lg font-bold">{trip.departure}</div>
            <div className="text-xs text-gray-500">{tripData[isReturn ? "arrival" : "departure"]}</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-600 flex items-center">
              <Clock size={12} className="mr-1" />
              {duration}
            </div>
            <div className="w-16 h-1 bg-gray-300 my-1"></div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold">{trip.arrival}</div>
            <div className="text-xs text-gray-500">{tripData[isReturn ? "departure" : "arrival"]}</div>
          </div>
        </div>
        
        {/* Fare options */}
        <div className="p-4 grid grid-cols-3 gap-2">
          {/* Promo fare */}
          <div 
            className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${
              selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && 
              selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                ? "bg-[#f0c808]" 
                : "bg-gray-100 hover:bg-[#f0c808]/60"
            }`}
            onClick={() => handleSelectTrip(trip, "promo", isReturn)}
          >
            <div className="text-xs font-medium mb-1">Promo</div>
            <div className="text-base font-bold">{trip.promo}₺</div>
            <div className="mt-1 text-xs flex items-center justify-center text-gray-700">
              <Users size={10} className="mr-1" />
              {trip.availableSeats}
            </div>
          </div>
          
          {/* Economy fare */}
          <div 
            className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${
              selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && 
              selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                ? "bg-[#D1FFD7]" 
                : "bg-gray-100 hover:bg-[#D1FFD7]/60"
            }`}
            onClick={() => handleSelectTrip(trip, "economy", isReturn)}
          >
            <div className="text-xs font-medium mb-1">Economy</div>
            <div className="text-base font-bold">{trip.economy}₺</div>
            <div className="mt-1 text-xs flex items-center justify-center text-gray-700">
              <Users size={10} className="mr-1" />
              {trip.availableSeats}
            </div>
          </div>
          
          {/* Business fare */}
          <div 
            className={`p-2 rounded-lg text-center cursor-pointer transition-colors ${
              selectedOption[isReturn ? "return" : "departure"]?.type === "business" && 
              selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                ? "bg-[#F05D5E] text-white" 
                : "bg-gray-100 hover:bg-[#F05D5E]/60"
            }`}
            onClick={() => handleSelectTrip(trip, "business", isReturn)}
          >
            <div className="text-xs font-medium mb-1">Business</div>
            <div className="text-base font-bold">{trip.business}₺</div>
            <div className="mt-1 text-xs flex items-center justify-center text-gray-700">
              <Users size={10} className="mr-1" />
              {trip.availableSeats}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Desktop table view
  const renderTable = (trips, isReturn = false) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="text-blue bg-gray-50">
            <th className="p-4 md:p-6" style={{ textAlign: 'center', fontSize: '1rem', md: 'text-lg' }}>
              <div className="flex items-center justify-center space-x-2">
                <Clock size={16} className="text-gray-600" />
                <span>Departure</span>
              </div>
            </th>
            <th className="p-4 md:p-6" style={{ textAlign: 'center', fontSize: '1rem', md: 'text-lg' }}>
              <div className="flex items-center justify-center space-x-2">
                <Clock size={16} className="text-gray-600" />
                <span>Arrival</span>
              </div>
            </th>
            <th className="p-3 md:p-6" style={{ backgroundImage: `url(${PromoLogo})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', fontSize: '1rem', md: 'text-lg' }}>
            </th>
            <th className="p-3 md:p-6" style={{ backgroundImage: `url(${EconomyLogo})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', fontSize: '1rem', md: 'text-lg' }}>
            </th>
            <th className="p-3 md:p-6" style={{ backgroundImage: `url(${BusinessLogo})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', fontSize: '1rem', md: 'text-lg' }}>
            </th>
          </tr>
        </thead>
        <tbody>
          {trips.length > 0 ? (
            trips.map((trip, index) => {
              const duration = calculateDuration(trip.departure, trip.arrival);
              
              return (
                <tr key={trip.voyageId || index} className={`text-center border-b border-gray-200 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-3 md:p-5">
                    <div className="flex flex-col items-center">
                      <div className="text-base md:text-xl font-bold">{trip.departure}</div>
                      <div className="text-xs md:text-sm text-gray-500">{tripData[isReturn ? "arrival" : "departure"]}</div>
                    </div>
                  </td>
                  <td className="p-3 md:p-5">
                    <div className="flex flex-col items-center">
                      <div className="text-base md:text-xl font-bold">{trip.arrival}</div>
                      <div className="text-xs md:text-sm text-gray-500">{tripData[isReturn ? "departure" : "arrival"]}</div>
                      <div className="flex items-center mt-1 text-xs">
                        <div className="bg-blue-50 text-blue-700 rounded-full px-2 py-1 flex items-center">
                          <Clock size={12} className="mr-1" />
                          {duration}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    className={`p-3 md:p-5 cursor-pointer transition-colors relative ${
                      selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && 
                      selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                        ? "bg-[#f0c808]" 
                        : "hover:bg-[#f0c808]/60"
                    }`}
                    onClick={() => handleSelectTrip(trip, "promo", isReturn)}
                  >
                    <div className={`text-base md:text-xl font-medium ${
                      selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && 
                      selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                        ? "text-black" 
                        : ""
                    }`}>
                      {trip.promo}₺
                    </div>
                    
                    {selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && 
                     selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId && (
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
                    className={`p-3 md:p-5 cursor-pointer transition-colors relative ${
                      selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && 
                      selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                        ? "bg-[#D1FFD7]" 
                        : "hover:bg-[#D1FFD7]/60"
                    }`}
                    onClick={() => handleSelectTrip(trip, "economy", isReturn)}
                  >
                    <div className={`text-base md:text-xl font-medium ${
                      selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && 
                      selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                        ? "text-black" 
                        : ""
                    }`}>
                      {trip.economy}₺
                    </div>
                    
                    {selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && 
                     selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId && (
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
                    className={`p-3 md:p-5 cursor-pointer transition-colors relative ${
                      selectedOption[isReturn ? "return" : "departure"]?.type === "business" && 
                      selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                        ? "bg-[#F05D5E]" 
                        : "hover:bg-[#F05D5E]/60"
                    }`}
                    onClick={() => handleSelectTrip(trip, "business", isReturn)}
                  >
                    <div className={`text-base md:text-xl font-medium ${
                      selectedOption[isReturn ? "return" : "departure"]?.type === "business" && 
                      selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                        ? "text-white" 
                        : ""
                    }`}>
                      {trip.business}₺
                    </div>
                    
                    {selectedOption[isReturn ? "return" : "departure"]?.type === "business" && 
                     selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId && (
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
            })
          ) : (
            <tr>
              <td colSpan="5" className="p-8 text-center text-gray-500">
                No voyages available for this route and date
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // Render mobile cards for each trip
  const renderMobileView = (trips, isReturn = false) => (
    <div className="space-y-4">
      {trips.length > 0 ? (
        trips.map((trip, index) => (
          <div key={trip.voyageId || index}>
            {renderMobileCard(trip, isReturn)}
          </div>
        ))
      ) : (
        <div className="p-4 bg-white rounded-lg shadow text-center text-gray-500">
          No voyages available for this route and date
        </div>
      )}
    </div>
  );

  // Departure Selection Summary
  const renderDepartureSummary = () => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };
    
    // If no departure selection has been made, show a prompt
    if (!selectedOption.departure) {
      return (
        <div className="w-full bg-white shadow-lg border border-gray-200 rounded-lg p-4 mb-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-blue-600">
                <Ship size={18} className="mr-2" />
                <span className="text-lg font-medium">Please select your departure option</span>
              </div>
              <button 
                onClick={toggleDepartureCollapse} 
                className="ml-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                {collapsedDeparture ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Show the selection details
    const basePrice = selectedOption.departure[selectedOption.departure.type];
    
    return (
      <div className="w-full bg-white shadow-lg border border-gray-200 rounded-lg p-4 mb-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-2 md:mb-0">
              <div className="p-2 rounded-lg mr-2">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Departure</div>
                <div className="flex items-center">
                  <span className="font-medium">{formatDate(tripData.departureDate)}</span>
                  <span className="mx-1">•</span>
                  <span className="font-medium">{selectedOption.departure.departure}</span>
                  <ArrowRight size={12} className="mx-1" />
                  <span className="font-medium">{selectedOption.departure.arrival}</span>
                </div>
                <div className="text-xs mt-1">
                  <span className={`capitalize px-2 py-0.5 rounded ${getClassForType(selectedOption.departure.type)}`}>
                    {selectedOption.departure.type}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Base Price and Collapse Button */}
            <div className="flex items-center justify-between md:justify-end md:space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Base Price</div>
                <div className="text-xl font-bold text-blue-600">{basePrice}₺</div>
              </div>
              
              <button 
                onClick={toggleDepartureCollapse} 
                className="ml-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                {collapsedDeparture ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Return Selection Summary
  const renderReturnSummary = () => {
    if (!tripData.returnDate) return null;
    
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };
    
    // If no return selection has been made, show a prompt
    if (!selectedOption.return) {
      return (
        <div className="w-full bg-white shadow-lg border border-gray-200 rounded-lg p-4 mb-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-blue-600">
                <Ship size={18} className="mr-2" />
                <span className="text-lg font-medium">Please select your return option</span>
              </div>
              <button 
                onClick={toggleReturnCollapse} 
                className="ml-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                {collapsedReturn ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Show the selection details
    const basePrice = selectedOption.return[selectedOption.return.type];
    
    return (
      <div className="w-full bg-white shadow-lg border border-gray-200 rounded-lg p-4 mb-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center mb-2 md:mb-0">
              <div className="p-2 rounded-lg mr-2">
                <Calendar size={16} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Return</div>
                <div className="flex items-center">
                  <span className="font-medium">{formatDate(tripData.returnDate)}</span>
                  <span className="mx-1">•</span>
                  <span className="font-medium">{selectedOption.return.departure}</span>
                  <ArrowRight size={12} className="mx-1" />
                  <span className="font-medium">{selectedOption.return.arrival}</span>
                </div>
                <div className="text-xs mt-1">
                  <span className={`capitalize px-2 py-0.5 rounded ${getClassForType(selectedOption.return.type)}`}>
                    {selectedOption.return.type}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Base Price and Collapse Button */}
            <div className="flex items-center justify-between md:justify-end md:space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Base Price</div>
                <div className="text-xl font-bold text-blue-600">{basePrice}₺</div>
              </div>
              
              <button 
                onClick={toggleReturnCollapse} 
                className="ml-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                {collapsedReturn ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center mb-4 md:mb-6">
        <Ship className="text-[#0D3A73] mr-2" size={24} />
        <h2 className="text-xl md:text-3xl font-bold text-[#0D3A73]">Journey Planning</h2>
      </div>
      
      {/* Departure Section */}
      <h3 className="text-lg md:text-2xl font-bold text-[#0D3A73] mb-3 md:mb-4">Departure Trip</h3>
      {renderDepartureSummary()}
      
      {!collapsedDeparture && (
        <>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            isMobile ? renderMobileView(departureTrips) : renderTable(departureTrips)
          )}
        </>
      )}
      
      {/* Return Section */}
      {tripData.returnDate && (
        <>
          <h3 className="text-lg md:text-2xl font-bold text-[#0D3A73] mt-6 md:mt-8 mb-3 md:mb-4">Return Trip</h3>
          {renderReturnSummary()}
          
          {!collapsedReturn && (
            isMobile ? renderMobileView(returnTrips, true) : renderTable(returnTrips, true)
          )}
        </>
      )}
    </div>
  );
};

export default PlanningPhase;