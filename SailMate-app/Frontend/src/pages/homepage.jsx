import React, { useState, useEffect } from "react";
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


const Homepage = () => {
  const navigate = useNavigate();
  const {isSignedIn} = useSession();
  
  const location = useLocation();
  // Get today's date in YYYY-MM-DD format for min date validation

  const today = new Date().toISOString().split('T')[0];
  
  // Form state
  const [tripType, setTripType] = useState("one-way");
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
        departure: voyageData.from,
        arrival: voyageData.to,
        departureDate: voyageData.date,
        returnDate: "",
        passengers: 1
      });
      
      // Set default passenger (1 adult)
      setPassengerDetails({
        adult: 1,
        student: 0,
        senior: 0
      });
      
    }
  }, [location.state]);
  
  // Passenger details state
  const [passengerDetails, setPassengerDetails] = useState({
    adult: 0,
    student: 0,
    senior: 0
  });
  
  // Calculate total passengers
  const totalPassengers = passengerDetails.adult + passengerDetails.student + passengerDetails.senior;
  
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
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!isSignedIn) {
      navigate("/sign-in");
      return;
    }
    // Check if departure and arrival are the same
    if (formData.departure === formData.arrival) {
      alert("Departure and arrival locations cannot be the same. Please select different locations.");
      return;
    }
    if(formData.passengers === 0){
      alert("Please enter a valid number of passengers.");
      return;
    }
    
    // Create trip data to pass via location state
    const tripData = {
      ...formData,
      tripType,
      passengerTypes: passengerDetails
    };
    
    navigate('/ferry-ticket-form', { 
      state: { 
        tripData,
        from: 'homepage',
        timestamp: Date.now()
      } 
    });
    console.log(tripData);
  };
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 drop-shadow-lg tracking-tight leading-tight">
              Sail with Comfort <span className="text-[#F0C808]">&</span> Style
            </h1>
            <div className="w-24 h-1 bg-[#F0C808] mx-auto mb-4"></div>
            <p className="text-base md:text-xl mb-2 drop-shadow-md font-light max-w-3xl mx-auto leading-relaxed opacity-90">
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

          {/* Search Form - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* From-To Section */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-center space-x-3">
              <div className="flex-1">
                <label className="block text-sm mb-2.5 text-gray-700 font-medium">From</label>
                <select 
                  name="departure"
                  value={formData.departure}
                  onChange={handleInputChange}
                  className="w-full p-3.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-[#06AED5] focus:ring-1 focus:ring-[#06AED5] outline-none shadow-sm"
                  required
                >
                  <option value="">Select Departure</option>
                  <option value="Yenikapı" disabled={formData.arrival === "Yenikapı"}>Yenikapı</option>
                  <option value="Bursa" disabled={formData.arrival === "Bursa"}>Bursa</option>
                  <option value="Bandırma" disabled={formData.arrival === "Bandırma"}>Bandırma</option>
                  <option value="Yalova" disabled={formData.arrival === "Yalova"}>Yalova</option>
                </select>
              </div>

              {/* Switch Button */}
              <div className="self-end mb-1">
                <button 
                  type="button" 
                  onClick={handleSwitch}
                  disabled={!formData.departure || !formData.arrival}
                  className={`bg-gray-100 p-3.5 rounded-full hover:bg-gray-200 transition-colors shadow-sm ${(!formData.departure || !formData.arrival) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8L22 12L18 16"></path>
                    <path d="M6 16L2 12L6 8"></path>
                    <path d="M2 12H22"></path>
                  </svg>
                </button>
              </div>

              <div className="flex-1">
                <label className="block text-sm mb-2.5 text-gray-700 font-medium">To</label>
                <select 
                  name="arrival"
                  value={formData.arrival}
                  onChange={handleInputChange}
                  className="w-full p-3.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-[#06AED5] focus:ring-1 focus:ring-[#06AED5] outline-none shadow-sm"
                  required
                >
                  <option value="">Select Arrival</option>
                  <option value="Yenikapı" disabled={formData.departure === "Yenikapı"}>Yenikapı</option>
                  <option value="Bursa" disabled={formData.departure === "Bursa"}>Bursa</option>
                  <option value="Bandırma" disabled={formData.departure === "Bandırma"}>Bandırma</option>
                  <option value="Yalova" disabled={formData.departure === "Yalova"}>Yalova</option>
                </select>
              </div>
            </div>

            {/* Date Selection */}
            <div className="col-span-1 flex space-x-3">
              <div className="flex-1">
                <label className="block text-sm mb-2.5 text-gray-700 font-medium">Departure Date</label>
                <input 
                  type="date" 
                  name="departureDate"
                  value={formData.departureDate}
                  min={today}
                  onChange={handleInputChange}
                  className="w-full p-3.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-[#06AED5] focus:ring-1 focus:ring-[#06AED5] outline-none shadow-sm"
                  required
                />
              </div>

              {tripType === "round-trip" && (
                <div className="flex-1">
                  <label className="block text-sm mb-2.5 text-gray-700 font-medium">Return Date</label>
                  <input 
                    type="date" 
                    name="returnDate"
                    value={formData.returnDate}
                    min={formData.departureDate || today}
                    onChange={handleInputChange}
                    className="w-full p-3.5 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-[#06AED5] focus:ring-1 focus:ring-[#06AED5] outline-none shadow-sm"
                    required={tripType === "round-trip"}
                  />
                </div>
              )}
            </div>

            {/* Passengers and Search */}
            <div className="col-span-1 flex space-x-3">
              {/* Passengers Dropdown */}
              <div className="flex-1 relative">
                <label className="block text-sm mb-2.5 text-gray-700 font-medium">Passengers</label>
                <button
                  type="button"
                  onClick={togglePassengerModal}
                  className="w-full p-3.5 border border-gray-300 rounded-lg bg-white text-gray-800 text-left flex justify-between items-center focus:border-[#06AED5] focus:ring-1 focus:ring-[#06AED5] outline-none shadow-sm"
                >
                  <span>{totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}</span>
                  <span className="text-[#06AED5]">▼</span>
                </button>
                
                {/* Passenger Selection Modal */}
                {showPassengerModal && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-10 p-5">
                    {/* Adult Passengers */}
                    <div className="flex justify-between items-center mb-5">
                      <div>
                        <div className="font-medium text-gray-800">Adults</div>
                        <div className="text-xs text-gray-500 mt-0.5">18+ years</div>
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
                          onClick={() => updatePassengerCount('adult', 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white"
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
                          onClick={() => updatePassengerCount('student', 1)}
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white"
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
                          className="w-9 h-9 flex items-center justify-center rounded-full border border-[#06AED5] text-[#06AED5] hover:bg-[#06AED5] hover:text-white"
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
                )}
              </div>

              {/* Search Button */}
              <div className="flex-1">
                <button 
                  type="submit"
                  className="w-full bg-[#0D3A73] hover:bg-[#06AED5] text-white py-2 sm:py-3.5 px-2 sm:px-4 rounded-lg text-xs sm:text-sm md:text-base font-semibold transition-all duration-300 ease-in-out h-auto min-h-[40px] sm:min-h-[50px] mt-4 sm:mt-8 relative overflow-hidden shadow-md hover:shadow-lg transform hover:translate-y-[-2px]"
                >
                  <span className="block truncate">Search Tickets</span>
                </button>
              </div>
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
      <section className="py-20 bg-[#D1FFD7]/20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0D3A73]">Why Choose SailMate</h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto text-lg leading-relaxed">Experience the best sea travel with our premium services and customer-focused approach</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-10 rounded-xl hover:bg-[#D1FFD7]/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-gray-100 group">
              <div className="w-24 h-24 bg-[#06AED5]/10 rounded-full flex items-center justify-center mx-auto mb-8 transform transition-transform group-hover:rotate-12 group-hover:bg-[#06AED5]/20">
                <img src={creditCard} className="w-12 h-12" alt="Secure Payment" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0D3A73]">Secure Payment</h3>
              <p className="text-gray-600 leading-relaxed">Multiple secure payment options with instant confirmation and e-tickets. We ensure your transaction is safe and protected.</p>
            </div>
            
            <div className="text-center p-10 rounded-xl hover:bg-[#D1FFD7]/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-gray-100 group">
              <div className="w-24 h-24 bg-[#06AED5]/10 rounded-full flex items-center justify-center mx-auto mb-8 transform transition-transform group-hover:rotate-12 group-hover:bg-[#06AED5]/20">
                <img src={ship} className="w-12 h-12" alt="Modern Fleet" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0D3A73]">Modern Fleet</h3>
              <p className="text-gray-600 leading-relaxed">Travel on our modern vessels with comfortable seating, dining options, and entertainment to make your journey enjoyable.</p>
            </div>
            
            <div className="text-center p-10 rounded-xl hover:bg-[#D1FFD7]/10 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-gray-100 group">
              <div className="w-24 h-24 bg-[#06AED5]/10 rounded-full flex items-center justify-center mx-auto mb-8 transform transition-transform group-hover:rotate-12 group-hover:bg-[#06AED5]/20">
                <img src={passenger} className="w-12 h-12" alt="Customer Service" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#0D3A73]">24/7 Support</h3>
              <p className="text-gray-600 leading-relaxed">Our customer service team is available around the clock to assist you with bookings, changes, or any questions you may have.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ferry Slider Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0D3A73]">Explore Our Ferries</h2>
          <p className="text-gray-600 mb-12 max-w-3xl mx-auto text-lg leading-relaxed">Check out our featured ferries and routes to find the perfect journey for you.</p>
          
          {/* Ferry Slider Component */}
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-8">
            <FerrySlider />
          </div>
        </div>
      </section>
            {/* Testimonials Section - New Addition */}
      <section className="py-20 bg-[#D1FFD7]/20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#0D3A73]">What Our Customers Say</h2>
          <p className="text-gray-600 text-center mb-16 max-w-3xl mx-auto text-lg leading-relaxed">Hear from travelers who have experienced our services</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-[#06AED5]/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-[#06AED5] font-bold text-xl">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Ahmet K.</h4>
                  <div className="flex text-[#F0C808]">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"The online booking process was so easy, and the ferry was clean and comfortable. Will definitely use SailMate for my next trip!"</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-[#06AED5]/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-[#06AED5] font-bold text-xl">M</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Mehmet Y.</h4>
                  <div className="flex text-[#F0C808]">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"I travel weekly between Yenikapı and Bandırma, and SailMate has made my commute so much more pleasant. The staff is always friendly and helpful."</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 bg-[#06AED5]/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-[#06AED5] font-bold text-xl">Z</span>
                </div>
                <div>
                  <h4 className="font-semibold text-lg">Zeynep A.</h4>
                  <div className="flex text-[#F0C808]">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic leading-relaxed">"The views during the journey were spectacular! The ferry was on time and the seating was comfortable. Would recommend to anyone traveling in the area."</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;