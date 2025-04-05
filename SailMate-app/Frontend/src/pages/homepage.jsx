import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../assets/styles/homepage.css";
import Cards from "../components/cards.jsx";
import creditCard from "../assets/images/secure-payment.png";
import ship from "../assets/images/ship.png";
import passenger from "../assets/images/passenger.png";
import Contact from "./Contact.jsx";
import FerrySlider from "../components/FerrySlider";
import { useNavigate, useLocation } from "react-router-dom";
import { SignedIn, useSession } from "@clerk/clerk-react";
import shipIcon from "../assets/images/ship.png";
import calendarIcon from "../assets/images/calendars.png";
import clockIcon from "../assets/images/clock.png";
import passengerIcon from "../assets/images/passenger.png";
import ferry1 from "../assets/images/ferry1.png";
import ferry3 from "../assets/images/ferry3.png";
import ferry4 from "../assets/images/ferry4.png";
import Button from "../components/Button";

const API_URL = "http://localhost:8080/api";

const Homepage = () => {
  const navigate = useNavigate();
  const {isSignedIn} = useSession();

  const [stations, setStations] = useState([]);
  const [stationsLoaded, setStationsLoaded] = useState(false);
  const [stationsArray, setStationsArray] = useState([]);
  

  // Fetch stations on component mount
  useEffect(() => {
    const fetchStations = async () => {
      try {
        // First try to get data from the API
        const response = await axios.get(`${API_URL}/stations`);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const stationTitles = response.data.map(station => station.title);
          setStationsArray(response.data);
          setStations(stationTitles);
        } else {
          // Fallback to hardcoded values if API returns empty array
          console.log("API returned empty array, using hardcoded stations");
          setStations(["Yenikapı", "Bursa", "Bandırma", "Yalova"]);
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
        // Fallback to hardcoded stations if API fails
        setStations(["Yenikapı", "Bursa", "Bandırma", "Yalova"]);
      } finally {
        setStationsLoaded(true);
      }
    };
    
    fetchStations();
  }, []);
  
  const location = useLocation();
  // Get today's date in YYYY-MM-DD format for min date validation

  const today = new Date().toISOString().split('T')[0];
  
  // Form state
  const [tripType, setTripType] = useState("one-way");
  const [availableVoyages, setAvailableVoyages] = useState();
  const [formData, setFormData] = useState({
    departure: "",
    arrival: "",
    departureDate:"",
    returnDate: "",
    passengers: 1,
  });

  useEffect(() => {
    const voyageData = location.state?.voyage;
    
    if (voyageData) {
      // Update form data with voyage details
      setFormData({
        departure: voyageData.fromStationTitle,
        arrival: voyageData.toStationTitle,
        departureDate: voyageData.departureDate,
        returnDate: "",
        passengers: 1
      });
      
      // Set default passenger (1 adult)
      setPassengerDetails({
        adult: 1,
        student: 0,
        senior: 0,
        child: 0
      });
      
    }
  }, [location.state]);
  
  // Passenger details state
  const [passengerDetails, setPassengerDetails] = useState({
    adult: 0,
    student: 0,
    senior: 0,
    child: 0
  });
  
  // Calculate total passengers
  const totalPassengers = passengerDetails.adult + passengerDetails.student + passengerDetails.senior + passengerDetails.child;
  
  // Update formData when passenger details change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      passengers: totalPassengers
    }));
  }, [totalPassengers]);
  
  // Passenger modal visibility state
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  
  // Toggle passenger selection modal
  const togglePassengerModal = () => {
    setShowPassengerModal(!showPassengerModal);
  };
  
  // Update passenger count
  const updatePassengerCount = (type, change) => {
    setPassengerDetails(prev => {
      const newCount = prev[type] + change;
      
      // Ensure no negative values for any type
      if (newCount < 0) return prev;
      
      // Ensure at least one passenger total if reducing count
      const otherPassengers = Object.entries(prev)
        .filter(([key]) => key !== type)
        .reduce((sum, [_, value]) => sum + value, 0);
        
      if (change < 0 && newCount + otherPassengers === 0) return prev;
      
      return {
        ...prev,
        [type]: newCount
      };
    });
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Switch departure and arrival locations
  const handleSwitch = (e) => {
    // Prevent default button behavior
    e.preventDefault();
    
    if (formData.departure && formData.arrival) {
      setFormData(prev => ({
        ...prev,
        departure: prev.arrival,
        arrival: prev.departure
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }
  
    if (formData.departure === formData.arrival) {
      alert("Departure and arrival locations cannot be the same. Please select different locations.");
      return;
    }
  
    if (formData.passengers === 0) {
      alert("Please enter a valid number of passengers.");
      return;
    }
  
    if (passengerDetails.child !== 0 && passengerDetails.adult === 0 && passengerDetails.senior === 0) {
      alert("There should be at least 1 adult passenger for children!");
      return;
    }
  
    try {
      const tripData = {
        ...formData,
        tripType,
        passengerTypes: passengerDetails,
      };
  
      let voyageData = {
        voyages: [],
        seatInformation: [],
      };
  
      if (formData.returnDate !== "") {
        const response1 = await axios.get(`${API_URL}/voyages/search`, {
          params: {
            fromStationId: stationsArray.find(station => station.title === formData.departure).id,
            toStationId: stationsArray.find(station => station.title === formData.arrival).id,
            departureDate: formData.departureDate
          }
        });
  
        const response2 = await axios.get(`${API_URL}/voyages/search`, {
          params: {
            fromStationId: stationsArray.find(station => station.title === formData.arrival).id,
            toStationId: stationsArray.find(station => station.title === formData.departure).id,
            departureDate: formData.returnDate
          }
        });
  
        if (response1.data.length === 0 || response2.data.length === 0) {
          alert("No voyages available for your selected route and date. Please try different options.");
          return;
        }
  
        const allVoyages = [...response1.data, ...response2.data];
        const seatSoldPromises = allVoyages.map(voyage =>
          axios.get(`${API_URL}/seats-sold/voyage/${voyage.id}`)
        );
  
        const seatsSoldResponses = await Promise.all(seatSoldPromises);
        const seatsSoldDataArray = seatsSoldResponses.map(res => res.data);
  
        const calculatedSeatsResponse = await axios.post(
          `${API_URL}/seats-sold/calculate-seats`,
          seatsSoldDataArray
        );
  
        voyageData.voyages = [[...response1.data],[ ...response2.data]];
        voyageData.seatInformation = calculatedSeatsResponse.data;
      } else {
        const response = await axios.get(`${API_URL}/voyages/search`, {
          params: {
            fromStationId: stationsArray.find(station => station.title === formData.departure).id,
            toStationId: stationsArray.find(station => station.title === formData.arrival).id,
            departureDate: formData.departureDate
          }
        });
  
        if (response.data.length === 0) {
          alert("No voyages available for your selected route and date. Please try different options.");
          return;
        }
  
        const seatSoldPromises = response.data.map(voyage =>
          axios.get(`${API_URL}/seats-sold/voyage/${voyage.id}`)
        );
  
        const seatsSoldResponses = await Promise.all(seatSoldPromises);
        const seatsSoldDataArray = seatsSoldResponses.map(res => res.data);
  
        const calculatedSeatsResponse = await axios.post(
          `${API_URL}/seats-sold/calculate-seats`,
          seatsSoldDataArray
        );
  
        voyageData.voyages = [response.data];
        voyageData.seatInformation = calculatedSeatsResponse.data;
      }
  
      console.log(voyageData);
  
      navigate('/ferry-ticket-form', {
        state: {
          tripData,
          availableVoyages: voyageData,
          from: 'homepage',
          timestamp: Date.now()
        }
      });
  
      console.log(tripData);
    } catch (error) {
      console.error("Error searching for voyages:", error);
      alert("There was a problem searching for voyages. Please try again later.");
    }
  };
  
  
  // Add this useEffect hook near your other hooks at the top of the component
  const [dropdownPosition, setDropdownPosition] = useState('bottom');

  // Add this effect to handle dropdown positioning
  useEffect(() => {
    if (showPassengerModal) {
      // Check if we need to render dropdown upward
      const handleDropdownPosition = () => {
        const passengerElement = document.getElementById('passenger-dropdown-button');
        if (passengerElement) {
          const rect = passengerElement.getBoundingClientRect();
          const spaceBelow = window.innerHeight - rect.bottom;
          const dropdownHeight = 350; // Approximate height of the dropdown
          
          if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
            setDropdownPosition('top');
          } else {
            setDropdownPosition('bottom');
          }
        }
      };
      
      handleDropdownPosition();
      window.addEventListener('resize', handleDropdownPosition);
      window.addEventListener('scroll', handleDropdownPosition);
      
      return () => {
        window.removeEventListener('resize', handleDropdownPosition);
        window.removeEventListener('scroll', handleDropdownPosition);
      };
    }
  }, [showPassengerModal]);

  return (
    <>
      {/* Modern Hero Section with Dynamic Elements */}
      <section className="relative h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Slider with Enhanced Overlay */}
        <div className="absolute inset-0 z-0">
        <div className="w-full h-full relative">
          {/* First slide */}
          <div 
            className="w-full h-full bg-cover bg-center absolute inset-0 opacity-100 animate-slide1" 
            style={{ 
              backgroundImage: `url(${ferry1})`,
              filter: "brightness(0.85) saturate(1.2) contrast(1.1)"
            }}
          ></div>
          
          {/* Second slide */}
          <div 
            className="w-full h-full bg-cover bg-center absolute inset-0 opacity-0 animate-slide2" 
            style={{ 
              backgroundImage: `url(${ferry3})`,
              filter: "brightness(0.85) saturate(1.2) contrast(1.1)"
            }}
          ></div>
          
          {/* Third slide */}
          <div 
            className="w-full h-full bg-cover bg-center absolute inset-0 opacity-0 animate-slide3" 
            style={{ 
              backgroundImage: `url(${ferry4})`,
              filter: "brightness(0.85) saturate(1.2) contrast(1.1)"
            }}
          ></div>
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 via-blue-900/20 to-pink-900/60"></div>
        </div>
      </div>
      
      {/* Animation keyframes using style tag */}
      <style>{`
        @keyframes slide1 {
          0%, 30% { opacity: 1; }
          33%, 96% { opacity: 0; }
          97%, 100% { opacity: 1; }
        }
        
        @keyframes slide2 {
          0%, 30% { opacity: 0; }
          33%, 63% { opacity: 1; }
          66%, 100% { opacity: 0; }
        }
        
        @keyframes slide3 {
          0%, 63% { opacity: 0; }
          66%, 96% { opacity: 1; }
          97%, 100% { opacity: 0; }
        }
        
        .animate-slide1 {
          animation: slide1 21s infinite;
        }
        
        .animate-slide2 {
          animation: slide2 21s infinite;
        }
        
        .animate-slide3 {
          animation: slide3 21s infinite;
        }
      `}</style>
        
        {/* Add some CSS for the slider animation */}

        
        {/* Enhanced Hero Content with Improved Typography */}
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto transform -translate-y-6">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-xl tracking-tight leading-tight">
              Sail with Comfort <span className="text-[#F0C808]">&</span> Style
            </h1>
            <div className="w-24 h-1 bg-[#F0C808] mx-auto mb-4"></div>
            <p className="text-base md:text-xl mb-2 drop-shadow-lg font-light max-w-3xl mx-auto leading-relaxed">
              Fast, reliable ferry service across Turkey's most beautiful waters
            </p>
          </div>
        </div>
      </section>

      {/* Booking Section - updated positioning to work with new hero height */}
      <section id="booking" className="relative -mt-40 md:-mt-48 mb-40 px-4 z-20">
      <div className="max-w-6xl mx-auto">
        {/* Ferry Tickets Header */}
        <div className="bg-[#0D3A73] text-white rounded-t-xl shadow-lg">
          <div className="py-5 px-8 flex items-center justify-center font-semibold text-lg">
            <i className="fas fa-ship mr-2"></i> Ferry Tickets
          </div>
        </div>
        
        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-b-xl p-8">
          {/* Trip Type Selection */}
          <div className="flex mb-8 text-base">
            <label className="flex items-center gap-3 mr-8 cursor-pointer">
              <input
                type="radio"
                checked={tripType === "one-way"}
                onChange={() => setTripType("one-way")}
                className="accent-[#06AED5] w-4 h-4"
              /> 
              <span className="font-medium">One-Way</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={tripType === "round-trip"}
                onChange={() => setTripType("round-trip")}
                className="accent-[#06AED5] w-4 h-4"
              /> 
              <span className="font-medium">Round-Trip</span>
            </label>
          </div>

          {/* Search Form - Single Row Layout */}
          <div className="flex flex-col lg:flex-row justify-between items-end gap-x-2 w-full">
            {/* From Field */}
            <div className="w-full lg:w-1/5">
              <label className="block text-sm mb-2.5 text-gray-700 font-medium">From</label>
              <select 
                name="departure"
                value={formData.departure}
                onChange={handleInputChange}
                className="w-full p-3.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-[#06AED5] focus:ring-1 focus:ring-[#06AED5] outline-none shadow-sm h-[50px]"
                required
              >
                <option value="">Select Departure</option>
                {stations.map(station => (
                  <option 
                    key={station} 
                    value={station}
                    disabled={formData.arrival === station}
                  >
                    {station}
                  </option>
                ))}
              </select>
            </div>

            {/* Left-Right Switch Arrow */}
            <div className="hidden lg:flex items-center self-end pb-3 mx-0">
              <button 
                type="button" 
                onClick={handleSwitch}
                disabled={!formData.departure || !formData.arrival}
                className={`text-[#0D3A73] hover:opacity-80 cursor-pointer transition-all duration-200 flex items-center justify-center bg-transparent border-none ${(!formData.departure || !formData.arrival) ? 'opacity-40 cursor-not-allowed' : ''}`}
                aria-label="Switch departure and arrival locations"
                style={{ background: 'transparent' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 9L4.5 12L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 9L19.5 12L16.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="4.5" y1="12" x2="19.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* To Field */}
            <div className="w-full lg:w-1/5 mt-4 lg:mt-0">
              <label className="block text-sm mb-2.5 text-gray-700 font-medium">To</label>
              <select 
                name="arrival"
                value={formData.arrival}
                onChange={handleInputChange}
                className="w-full p-3.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-[#06AED5] focus:ring-1 focus:ring-[#06AED5] outline-none shadow-sm h-[50px]"
                required
              >
                <option value="">Select Arrival</option>
                {stations.map(station => (
                  <option 
                    key={station} 
                    value={station}
                    disabled={formData.departure === station}
                  >
                    {station}
                  </option>
                ))}
              </select>
            </div>

            {/* Left-Right Mobile Switch Arrow */}
            <div className="flex lg:hidden items-center justify-center w-full my-3">
              <button 
                type="button" 
                onClick={handleSwitch}
                disabled={!formData.departure || !formData.arrival}
                className={`text-[#0D3A73] hover:opacity-80 cursor-pointer transition-all duration-200 flex items-center justify-center bg-transparent border-none ${(!formData.departure || !formData.arrival) ? 'opacity-40 cursor-not-allowed' : ''}`}
                aria-label="Switch departure and arrival locations"
                style={{ background: 'transparent' }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 9L4.5 12L7.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 9L19.5 12L16.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="4.5" y1="12" x2="19.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Date Fields */}
            <div className="w-full lg:w-2/5 mt-4 lg:mt-0 flex flex-col lg:flex-row gap-4">
              {/* Departure Date */}
              <div className={`w-full ${tripType === "one-way" ? "lg:w-full" : "lg:w-1/2"}`}>
                <label className="block text-sm mb-2.5 text-gray-700 font-medium">
                  Departure Date
                </label>
                <input 
                  type="date" 
                  name="departureDate"
                  value={formData.departureDate}
                  min={today}
                  onChange={handleInputChange}
                  className="w-full p-3.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-[#06AED5] focus:ring-1 focus:ring-[#06AED5] outline-none shadow-sm h-[50px]"
                  required
                />
              </div>

              {/* Return Date - For desktop, shown inline when round-trip is selected */}
              {tripType === "round-trip" && (
                <div className="lg:w-1/2 w-full">
                  <label className="block text-sm mb-2.5 text-gray-700 font-medium">Return Date</label>
                  <input 
                    type="date" 
                    name="returnDate"
                    value={formData.returnDate}
                    min={formData.departureDate || today}
                    onChange={handleInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-[#06AED5] focus:ring-1 focus:ring-[#06AED5] outline-none shadow-sm h-[50px]"
                    required={tripType === "round-trip"}
                  />
                </div>
              )}
            </div>

            {/* Passengers Field */}
            <div className="w-full lg:w-1/5 mt-4 lg:mt-0 relative">
              <label className="block text-sm mb-2.5 text-gray-700 font-medium">Passengers</label>
              <button
                id="passenger-dropdown-button"
                type="button"
                onClick={togglePassengerModal}
                className="w-full p-3.5 border border-gray-300 rounded-lg bg-white text-gray-800 text-left flex justify-between items-center focus:border-[#06AED5] focus:ring-1 focus:ring-[#06AED5] outline-none shadow-sm h-[50px] appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23606060' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
              >
                <span>{totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}</span>
              </button>
              
              {/* Passenger Selection Modal */}
              <div 
                className={`${showPassengerModal ? 'opacity-100 visible' : 'opacity-0 invisible'} 
                            absolute ${dropdownPosition === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} 
                            left-0 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-10 p-5
                            transition-all duration-300 ease-in-out transform 
                            ${showPassengerModal ? 'translate-y-0' : dropdownPosition === 'top' ? 'translate-y-4' : '-translate-y-4'}`}
              >
                {/* Adult Passengers */}
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <div className="font-medium text-gray-800">Adults</div>
                    <div className="text-xs text-gray-500 mt-0.5">20+ years</div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => updatePassengerCount('adult', -1)}
                      disabled={passengerDetails.adult <= 0}
                      className={`w-9 h-9 flex items-center justify-center rounded-full border ${passengerDetails.adult <= 0 ? 'border-gray-300 text-gray-300' : 'border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white'}`}
                    >
                      -
                    </button>
                    <span className="mx-4 text-gray-800 font-medium">{passengerDetails.adult}</span>
                    <button 
                      type="button"
                      disabled={totalPassengers === 8}
                      onClick={() => updatePassengerCount('adult', 1)}
                      className={`w-9 h-9 flex items-center justify-center rounded-full border ${totalPassengers === 8 ? 'border-gray-300 text-gray-300' : 'border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white'}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Student Passengers */}
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <div className="font-medium text-gray-800">Students</div>
                    <div className="text-xs text-gray-500 mt-0.5">8-25 years</div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => updatePassengerCount('student', -1)}
                      disabled={passengerDetails.student <= 0}
                      className={`w-9 h-9 flex items-center justify-center rounded-full border ${passengerDetails.student <= 0 ? 'border-gray-300 text-gray-300' : 'border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white'}`}
                    >
                      -
                    </button>
                    <span className="mx-4 text-gray-800 font-medium">{passengerDetails.student}</span>
                    <button 
                      type="button"
                      disabled={totalPassengers === 8}
                      onClick={() => updatePassengerCount('student', 1)}
                      className={`w-9 h-9 flex items-center justify-center rounded-full border ${totalPassengers === 8 ? 'border-gray-300 text-gray-300' : 'border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white'}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Senior Passengers */}
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <div className="font-medium text-gray-800">Seniors</div>
                    <div className="text-xs text-gray-500 mt-0.5">65+ years</div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => updatePassengerCount('senior', -1)}
                      disabled={passengerDetails.senior <= 0}
                      className={`w-9 h-9 flex items-center justify-center rounded-full border ${passengerDetails.senior <= 0 ? 'border-gray-300 text-gray-300' : 'border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white'}`}
                    >
                      -
                    </button>
                    <span className="mx-4 text-gray-800 font-medium">{passengerDetails.senior}</span>
                    <button 
                      type="button"
                      onClick={() => updatePassengerCount('senior', 1)}
                      disabled={totalPassengers === 8}
                      className={`w-9 h-9 flex items-center justify-center rounded-full border ${totalPassengers === 8 ? 'border-gray-300 text-gray-300' : 'border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white'}`}
                    >
                      +
                    </button>
                  </div>
                </div>          
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <div className="font-medium text-gray-800">Child</div>
                    <div className="text-xs text-gray-500 mt-0.5">0 - 8 years</div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => updatePassengerCount('child', -1)}
                      disabled={passengerDetails.child <= 0}
                      className={`w-9 h-9 flex items-center justify-center rounded-full border ${passengerDetails.child <= 0 ? 'border-gray-300 text-gray-300' : 'border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white'}`}
                    >
                      -
                    </button>
                    <span className="mx-4 text-gray-800 font-medium">{passengerDetails.child}</span>
                    <button 
                      type="button"
                      onClick={() => updatePassengerCount('child', 1)}
                      disabled={totalPassengers === 8}
                      className={`w-9 h-9 flex items-center justify-center rounded-full border ${totalPassengers === 8 ? 'border-gray-300 text-gray-300' : 'border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white'}`}
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Apply Button */}
                <button 
                  type="button"
                  onClick={togglePassengerModal}
                  className="w-full bg-[#0D3A73] hover:bg-[#0D3A73]/90 text-white py-3 rounded-lg mt-3 transition-colors font-medium shadow-md"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Search Button */}
            <div className="w-full lg:w-1/5 mt-4 lg:mt-0">
              <label className="block text-sm mb-2.5 text-gray-700 font-medium opacity-0">Search</label>
              <button 
                type="submit"
                className="w-full bg-[#0D3A73] text-white p-3.5 rounded-lg text-base font-semibold transition-all duration-300 ease-in-out h-[50px] overflow-hidden homepage-button"
              >
                <span className="block truncate">Search Tickets</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

      {/* Latest Announcements */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-[#0D3A73]">Latest Announcements</h2>
          <Cards />
        </div>
      </section>

      {/* Features Section with Animated Cards */}
      <section className="py-20 bg-[#C5EFC9]/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0D3A73]">Why Choose SailMate</h2>
          <p className="text-gray-700 text-center mb-16 max-w-3xl mx-auto text-lg leading-relaxed">Experience the best sea travel with our premium services and customer-focused approach</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-24 h-24 bg-[#06AED5]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <img src={creditCard} className="w-12 h-12" alt="Secure Payment" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0D3A73] text-center">Secure Payment</h3>
              <p className="text-gray-700 leading-relaxed">Multiple secure payment options with instant confirmation and e-tickets. We ensure your transaction is safe and protected.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-24 h-24 bg-[#06AED5]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <img src={ship} className="w-12 h-12" alt="Modern Fleet" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0D3A73] text-center">Modern Fleet</h3>
              <p className="text-gray-700 leading-relaxed">Travel on our modern vessels with comfortable seating, dining options, and entertainment to make your journey enjoyable.</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-24 h-24 bg-[#06AED5]/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <img src={passenger} className="w-12 h-12" alt="Customer Service" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0D3A73] text-center">24/7 Support</h3>
              <p className="text-gray-700 leading-relaxed">Our customer service team is available around the clock to assist you with bookings, changes, or any questions you may have.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ferry Slider Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0D3A73]">Explore Our Ferries</h2>
          <p className="text-gray-700 mb-12 max-w-3xl mx-auto text-lg leading-relaxed">Check out our featured ferries and routes to find the perfect journey for you.</p>
          
          {/* Ferry Slider Component */}
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-8">
            <FerrySlider />
          </div>
        </div>
      </section>
            {/* Testimonials Section - New Addition */}
      <section className="py-20 bg-[#C5EFC9]/30">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0D3A73]">What Our Customers Say</h2>
          <p className="text-gray-700 text-center mb-16 max-w-3xl mx-auto text-lg leading-relaxed">Hear from travelers who have experienced our services</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-[#06AED5]/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-[#06AED5] font-bold text-xl">E</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Emir Ö.</h4>
                  <div className="flex text-[#F0C808]">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">"The online booking process was so easy, and the ferry was clean and comfortable. Will definitely use SailMate for my next trip!"</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-[#06AED5]/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-[#06AED5] font-bold text-xl">K</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Ozan K.</h4>
                  <div className="flex text-[#F0C808]">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">"I travel weekly between Yenikapı and Bandırma, and SailMate has made my commute so much more pleasant. The staff is always friendly and helpful."</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-[#06AED5]/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-[#06AED5] font-bold text-xl">E</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Ekin A.</h4>
                  <div className="flex text-[#F0C808]">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 italic leading-relaxed">"The views during the journey were spectacular! The ferry was on time and the seating was comfortable. Would recommend to anyone traveling in the area."</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;