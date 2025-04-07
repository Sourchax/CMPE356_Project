import React, { useState, useEffect } from "react";
import "../../assets/styles/ferry-ticket-form/PlaPha.css";
import PromoLogo from "../../assets/images/Promo.png";
import EconomyLogo from "../../assets/images/Economy.png";
import BusinessLogo from "../../assets/images/Business.png";
import { Ship, Clock, Users, ChevronUp, ChevronDown, Calendar, ArrowRight } from "lucide-react";
import axios from 'axios';

const API_URL = "http://localhost:8080/api";

const PlanningPhase = ({tripData, availableVoyages, onSelectDeparture, onSelectReturn, prices }) => {
  const [departureTrips, setDepartureTrips] = useState([]);
  const [returnTrips, setReturnTrips] = useState([]);
  const [selectedOption, setSelectedOption] = useState({
    departure: null,
    return: null
  });
  const [currencyRates, setCurrencyRates] = useState({
    TRY: 1,
    USD: 0.031,
    EUR: 0.028
  });

  // Get the selected currency from tripData
  const selectedCurrency = tripData.currency || 'TRY';
  
  // Currency symbols for display
  const currencySymbols = {
    TRY: '₺',
    USD: '$',
    EUR: '€'
  };
  
  // Fetch currency rates on component mount
  useEffect(() => {
    const fetchRates = async () => {
      if (selectedCurrency === 'TRY') return; // No need to fetch if using default TRY
      
      try {
        // Use your API to get conversion rates
        const usdResponse = await axios.get(`${API_URL}/currency/convert`, {
          params: { amount: 1, from: 'TRY', to: 'USD' }
        });
        
        const eurResponse = await axios.get(`${API_URL}/currency/convert`, {
          params: { amount: 1, from: 'TRY', to: 'EUR' }
        });
        
        setCurrencyRates({
          TRY: 1,
          USD: usdResponse.data || 0.031, // Fallback to default if API fails
          EUR: eurResponse.data || 0.028  // Fallback to default if API fails
        });
      } catch (error) {
        console.error("Error fetching currency rates:", error);
        // Keep fallback rates if API fails
      }
    };
    
    fetchRates();
  }, [selectedCurrency]);
  
  // Convert price from TRY to selected currency
  const convertPrice = (priceTRY) => {
    if (selectedCurrency === 'TRY') return priceTRY;
    return (priceTRY * currencyRates[selectedCurrency]).toFixed(2);
  };

  // Get price values from the price prop
  const getPrice = (className) => {
    const priceItem = prices.find(price => price.className.toLowerCase() === className.toLowerCase());
    return priceItem ? priceItem.value : 0;
  };

  // Get all required prices from props - these are in TRY
  const promoPrice = getPrice("Promo")*tripData.passengers;
  const economyPrice = getPrice("Economy")*tripData.passengers;
  const businessPrice = getPrice("Business")*tripData.passengers;
  
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
      if (availableVoyages && availableVoyages.voyages) {
        // Create a lookup map for seat information by voyageId for faster access
        const seatInfoMap = {};
        if (availableVoyages.seatInformation && Array.isArray(availableVoyages.seatInformation)) {
          availableVoyages.seatInformation.forEach(seatInfo => {
            if (seatInfo && seatInfo.voyageId) {
              seatInfoMap[seatInfo.voyageId] = seatInfo;
            }
          });
        }
        
        // For one-way trip - check if voyages[1] doesn't exist
        if (!availableVoyages.voyages[1]) {
          // Transform API voyage data to match the component's expected format
          const transformedDepartureData = availableVoyages.voyages[0].map(voyage => {
            // Get seat information for this voyage using voyageId
            const seatInfo = seatInfoMap[voyage.id] || {};
            
            return {
              departure: voyage.departureTime ? voyage.departureTime.substring(0, 5) : "00:00",
              arrival: voyage.arrivalTime ? voyage.arrivalTime.substring(0, 5) : "00:00",
              promo: promoPrice,
              economy: economyPrice,
              business: businessPrice,
              promoSeats: seatInfo.promoAvailable || 0,
              economySeats: seatInfo.economyAvailable || 0,
              businessSeats: seatInfo.businessAvailable || 0,
              voyageId: voyage.id,
              shipType: voyage.shipType
            };
          });
          
          setDepartureTrips(transformedDepartureData);
          setReturnTrips([]);
        } 
        // For round trip
        else if (availableVoyages.voyages[0] && availableVoyages.voyages[1]) {
          // Transform departure voyages with prices from props and seat information
          const transformedDepartureData = availableVoyages.voyages[0].map(voyage => {
            // Get seat information for this voyage using voyageId
            const seatInfo = seatInfoMap[voyage.id] || {};
            
            return {
              departure: voyage.departureTime ? voyage.departureTime.substring(0, 5) : "00:00",
              arrival: voyage.arrivalTime ? voyage.arrivalTime.substring(0, 5) : "00:00",
              promo: promoPrice,
              economy: economyPrice,
              business: businessPrice,
              promoSeats: seatInfo.promoAvailable || 0,
              economySeats: seatInfo.economyAvailable || 0,
              businessSeats: seatInfo.businessAvailable || 0,
              voyageId: voyage.id,
              shipType: voyage.shipType
            };
          });
          
          // Transform return voyages with prices from props and seat information
          const transformedReturnData = availableVoyages.voyages[1].map(voyage => {
            // Get seat information for this voyage using voyageId
            const seatInfo = seatInfoMap[voyage.id] || {};
            
            return {
              departure: voyage.departureTime ? voyage.departureTime.substring(0, 5) : "00:00",
              arrival: voyage.arrivalTime ? voyage.arrivalTime.substring(0, 5) : "00:00",
              promo: promoPrice,
              economy: economyPrice,
              business: businessPrice,
              promoSeats: seatInfo.promoAvailable || 0,
              economySeats: seatInfo.economyAvailable || 0,
              businessSeats: seatInfo.businessAvailable || 0,
              voyageId: voyage.id,
              shipType: voyage.shipType
            };
          });
          
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
  }, [availableVoyages, promoPrice, economyPrice, businessPrice]);

  const handleSelectTrip = (trip, type, isReturn = false) => {
    const selectedTrip = { ...trip, type };
    console.log(selectedTrip);
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
  const renderMobileCard = (trip, isReturn = false) => {
    // Check if number of passengers exceeds available seats for each class
    const promoDisabled = trip.promoSeats < tripData.passengers;
    const economyDisabled = trip.economySeats < tripData.passengers;
    const businessDisabled = trip.businessSeats < tripData.passengers;

    return (
      <div className="mb-4 bg-white rounded-lg shadow-md overflow-hidden">
        {/* Trip header with departure and arrival */}
        <div className="p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-center">
            <div className="text-lg font-bold">{trip.departure}</div>
            <div className="text-xs text-gray-500">{tripData[isReturn ? "arrival" : "departure"]}</div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-1 bg-gray-300 my-1"></div>
          </div>
          
          <div className="text-center">
            <div className="text-lg font-bold">{trip.arrival}</div>
            <div className="text-xs text-gray-500">{tripData[isReturn ? "departure" : "arrival"]}</div>
          </div>
        </div>
        
        {/* Ship Type */}
        <div className="p-2 bg-blue-50 text-center text-blue-700 text-sm font-medium flex items-center justify-center">
          <Ship size={14} className="mr-1" />
          {trip.shipType}
        </div>
        
        {/* Fare options */}
        <div className="p-4 grid grid-cols-3 gap-2">
          {/* Promo fare */}
          <div 
            className={`p-2 rounded-lg text-center transition-colors ${
              promoDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : `cursor-pointer ${
                    selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && 
                    selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                      ? "bg-[#f0c808]" 
                      : "bg-gray-100 hover:bg-[#f0c808]/60"
                  }`
            }`}
            onClick={() => !promoDisabled && handleSelectTrip(trip, "promo", isReturn)}
          >
            <div className="text-xs font-medium mb-1">Promo</div>
            <div className="text-base font-bold">{convertPrice(trip.promo)}{currencySymbols[selectedCurrency]}</div>
            <div className="mt-1 text-xs flex items-center justify-center text-gray-700">
              <Users size={10} className="mr-1" />
              {promoDisabled ? 'Not enough seats' : `${trip.promoSeats} seats`}
            </div>
          </div>
          
          {/* Economy fare */}
          <div 
            className={`p-2 rounded-lg text-center transition-colors ${
              economyDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : `cursor-pointer ${
                    selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && 
                    selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                      ? "bg-[#D1FFD7]" 
                      : "bg-gray-100 hover:bg-[#D1FFD7]/60"
                  }`
            }`}
            onClick={() => !economyDisabled && handleSelectTrip(trip, "economy", isReturn)}
          >
            <div className="text-xs font-medium mb-1">Economy</div>
            <div className="text-base font-bold">{convertPrice(trip.economy)}{currencySymbols[selectedCurrency]}</div>
            <div className="mt-1 text-xs flex items-center justify-center text-gray-700">
              <Users size={10} className="mr-1" />
              {economyDisabled ? 'Not enough seats' : `${trip.economySeats} seats`}
            </div>
          </div>
          
          {/* Business fare */}
          <div 
            className={`p-2 rounded-lg text-center transition-colors ${
              businessDisabled
                ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                : `cursor-pointer ${
                    selectedOption[isReturn ? "return" : "departure"]?.type === "business" && 
                    selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                      ? "bg-[#F05D5E] text-white" 
                      : "bg-gray-100 hover:bg-[#F05D5E]/60"
                  }`
            }`}
            onClick={() => !businessDisabled && handleSelectTrip(trip, "business", isReturn)}
          >
            <div className="text-xs font-medium mb-1">Business</div>
            <div className="text-base font-bold">{convertPrice(trip.business)}{currencySymbols[selectedCurrency]}</div>
            <div className="mt-1 text-xs flex items-center justify-center text-gray-700">
              <Users size={10} className="mr-1" />
              {businessDisabled ? 'Not enough seats' : `${trip.businessSeats} seats`}
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
            <th className="p-4 md:p-6" style={{ textAlign: 'center', fontSize: '1rem', md: 'text-lg' }}>
              <div className="flex items-center justify-center space-x-2">
                <Ship size={16} className="text-gray-600" />
                <span>Ship Type</span>
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
              // Check if number of passengers exceeds available seats for each class
              const promoDisabled = trip.promoSeats < tripData.passengers;
              const economyDisabled = trip.economySeats < tripData.passengers;
              const businessDisabled = trip.businessSeats < tripData.passengers;

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
                    </div>
                  </td>
                  <td className="p-3 md:p-5">
                    <div className="flex flex-col items-center">
                      <div className="text-sm font-medium text-blue-600">
                        <span className="flex items-center justify-center">
                          <Ship size={14} className="mr-1" />
                          {trip.shipType}
                        </span>
                      </div>
                    </div>
                  </td>
                  {/* Promo Fare Column */}
                  <td
                    className={`p-3 md:p-5 transition-colors relative ${
                      promoDisabled
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : `cursor-pointer ${
                            selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && 
                            selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                              ? "bg-[#f0c808]" 
                              : "hover:bg-[#f0c808]/60"
                          }`
                    }`}
                    onClick={() => !promoDisabled && handleSelectTrip(trip, "promo", isReturn)}
                  >
                    <div className={`text-base md:text-xl font-medium ${
                      selectedOption[isReturn ? "return" : "departure"]?.type === "promo" && 
                      selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                        ? "text-black" 
                        : ""
                    }`}>
                      {convertPrice(trip.promo)}{currencySymbols[selectedCurrency]}
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
                        {promoDisabled ? 'Not enough seats' : `${trip.promoSeats} seats left`}
                      </div>
                    </div>
                  </td>
                  
                  {/* Economy Fare Column */}
                  <td
                    className={`p-3 md:p-5 transition-colors relative ${
                      economyDisabled
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : `cursor-pointer ${
                            selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && 
                            selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                              ? "bg-[#D1FFD7]" 
                              : "hover:bg-[#D1FFD7]/60"
                          }`
                    }`}
                    onClick={() => !economyDisabled && handleSelectTrip(trip, "economy", isReturn)}
                  >
                    <div className={`text-base md:text-xl font-medium ${
                      selectedOption[isReturn ? "return" : "departure"]?.type === "economy" && 
                      selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                        ? "text-black" 
                        : ""
                    }`}>
                      {convertPrice(trip.economy)}{currencySymbols[selectedCurrency]}
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
                        {economyDisabled ? 'Not enough seats' : `${trip.economySeats} seats left`}
                      </div>
                    </div>
                  </td>
                  
                  {/* Business Fare Column */}
                  <td
                    className={`p-3 md:p-5 transition-colors relative ${
                      businessDisabled
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : `cursor-pointer ${
                            selectedOption[isReturn ? "return" : "departure"]?.type === "business" && 
                            selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                              ? "bg-[#F05D5E]" 
                              : "hover:bg-[#F05D5E]/60"
                          }`
                    }`}
                    onClick={() => !businessDisabled && handleSelectTrip(trip, "business", isReturn)}
                  >
                    <div className={`text-base md:text-xl font-medium ${
                      selectedOption[isReturn ? "return" : "departure"]?.type === "business" && 
                      selectedOption[isReturn ? "return" : "departure"]?.voyageId === trip.voyageId
                        ? "text-white" 
                        : ""
                    }`}>
                      {convertPrice(trip.business)}{currencySymbols[selectedCurrency]}
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
                        {businessDisabled ? 'Not enough seats' : `${trip.businessSeats} seats left`}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="p-8 text-center text-gray-500">
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
                <div className="text-xs mt-1 flex items-center">
                  <span className={`capitalize px-2 py-0.5 rounded ${getClassForType(selectedOption.departure.type)}`}>
                    {selectedOption.departure.type}
                  </span>
                  {selectedOption.departure.shipType && (
                    <span className="ml-2 text-blue-600 flex items-center">
                      <Ship size={10} className="mr-1" /> 
                      {selectedOption.departure.shipType}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Base Price and Collapse Button */}
            <div className="flex items-center justify-between md:justify-end md:space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Base Price</div>
                <div className="text-xl font-bold text-blue-600">{convertPrice(basePrice)}{currencySymbols[selectedCurrency]}</div>
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
                <div className="text-xs mt-1 flex items-center">
                  <span className={`capitalize px-2 py-0.5 rounded ${getClassForType(selectedOption.return.type)}`}>
                    {selectedOption.return.type}
                  </span>
                  {selectedOption.return.shipType && (
                    <span className="ml-2 text-blue-600 flex items-center">
                      <Ship size={10} className="mr-1" /> 
                      {selectedOption.return.shipType}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Base Price and Collapse Button */}
            <div className="flex items-center justify-between md:justify-end md:space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Base Price</div>
                <div className="text-xl font-bold text-blue-600">{convertPrice(basePrice)}{currencySymbols[selectedCurrency]}</div>
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