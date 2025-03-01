import React, { useState, useEffect } from "react";
import "../assets/styles/homepage.css";
import Cards from "../components/cards.jsx";
import creditCard from "../assets/images/secure-payment.png";
import ship from "../assets/images/ship.png";
import passenger from "../assets/images/passenger.png";
import Contact from "./Contact.jsx";
import FerrySlider from "../components/FerrySlider";


const Homepage = () => {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [tripType, setTripType] = useState("one-way");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengerDetails, setPassengerDetails] = useState({
    adult: 1,
    child: 0,
    senior: 0
  });
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  
  // Calculate total passengers
  const totalPassengers = Object.values(passengerDetails).reduce((sum, count) => sum + count, 0);
  
  // Get today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];
  
  // Handle location switch
  const handleSwitch = () => {
    setDeparture(arrival);
    setArrival(departure);
  };
  
  // Prevent same selection in departure and arrival
  useEffect(() => {
    if (departure && departure === arrival) {
      setArrival("");
    }
  }, [departure, arrival]);

  // Update passenger counts
  const updatePassengerCount = (type, value) => {
    const newCount = Math.max(type === 'adult' ? 1 : 0, passengerDetails[type] + value);
    setPassengerDetails({
      ...passengerDetails,
      [type]: newCount
    });
  };

  // Toggle passenger selection modal
  const togglePassengerModal = () => {
    setShowPassengerModal(!showPassengerModal);
  };

  return (
    <>
      {/* Hero Section with Background Image and Animated Elements */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center animate-slow-zoom" 
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1605281317010-fe5ffe798166?q=80&w=2048&auto=format&fit=crop')", 
              filter: "brightness(0.7)"
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
        </div>
        
        {/* Animated Wave Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-32 z-[1] opacity-30">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
        
        {/* Hero Content with Animation */}
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">Sail with Comfort & Style</h1>
          <p className="text-xl md:text-2xl mb-8 drop-shadow-md">Discover the easiest way to travel across the sea with SailMate</p>
          <a href="#booking" className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all transform hover:scale-105 inline-block animate-pulse-subtle">
            Book Your Journey
          </a>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="relative -mt-16 mb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Ferry Tickets Header - Replacing the tabs */}
          <div className="bg-orange-500 text-white rounded-t-xl shadow-lg">
            <div className="py-4 px-6 text-center font-semibold text-lg">
              <i className="fas fa-ship mr-2"></i> Ferry Tickets
            </div>
          </div>
          
          {/* Booking Form */}
          <div className="bg-white shadow-xl rounded-b-xl p-6">
            {/* Trip Type Selection */}
            <div className="flex mb-6 text-sm">
              <label className="flex items-center gap-2 mr-6">
                <input
                  type="radio"
                  checked={tripType === "one-way"}
                  onChange={() => setTripType("one-way")}
                  className="accent-orange-500"
                /> 
                One-Way
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={tripType === "round-trip"}
                  onChange={() => setTripType("round-trip")}
                  className="accent-orange-500"
                /> 
                Round-Trip
              </label>
            </div>

            {/* Search Form - Horizontal Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* From-To Section */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1 flex items-center space-x-2">
                <div className="flex-1">
                  <label className="block text-sm mb-2 text-gray-600 font-medium">From</label>
                  <select 
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  >
                    <option value="">Select Departure</option>
                    <option value="yenikapi" disabled={arrival === "yenikapi"}>Yenikapı</option>
                    <option value="bursa" disabled={arrival === "bursa"}>Bursa</option>
                  </select>
                </div>

                {/* Switch Button */}
                <div className="self-end mb-1">
                  <button 
                    type="button" 
                    onClick={handleSwitch}
                    disabled={!departure || !arrival}
                    className={`bg-gray-200 p-3 rounded-full hover:bg-gray-300 transition-colors ${(!departure || !arrival) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8L22 12L18 16"></path>
                      <path d="M6 16L2 12L6 8"></path>
                      <path d="M2 12H22"></path>
                    </svg>
                  </button>
                </div>

                <div className="flex-1">
                  <label className="block text-sm mb-2 text-gray-600 font-medium">To</label>
                  <select 
                    value={arrival}
                    onChange={(e) => setArrival(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  >
                    <option value="">Select Arrival</option>
                    <option value="bandirma" disabled={departure === "bandirma"}>Bandırma</option>
                    <option value="yalova" disabled={departure === "yalova"}>Yalova</option>
                  </select>
                </div>
                </div>

              {/* Date Selection */}
              <div className="col-span-1 flex space-x-2">
                <div className="flex-1">
                  <label className="block text-sm mb-2 text-gray-600 font-medium">Departure Date</label>
                  <input 
                    type="date" 
                    value={departureDate}
                    min={today}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  />
                </div>

                {tripType === "round-trip" && (
                  <div className="flex-1">
                    <label className="block text-sm mb-2 text-gray-600 font-medium">Return Date</label>
                    <input 
                      type="date" 
                      value={returnDate}
                      min={departureDate || today}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Passengers and Search */}
              <div className="col-span-1 flex space-x-2">
                {/* Passengers Dropdown */}
                <div className="flex-1 relative">
                  <label className="block text-sm mb-2 text-gray-600 font-medium">Passengers</label>
                  <button
                    onClick={togglePassengerModal}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-800 text-left flex justify-between items-center focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
                  >
                    <span>{totalPassengers} Passenger{totalPassengers !== 1 ? 's' : ''}</span>
                    <span>▼</span>
                  </button>
                  
                  {/* Passenger Selection Modal */}
                  {showPassengerModal && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 z-10 p-4">
                      {/* Adult Passengers */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="font-medium text-gray-800">Adults</div>
                          <div className="text-xs text-gray-500">18+ years</div>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => updatePassengerCount('adult', -1)}
                            disabled={passengerDetails.adult <= 1}
                            className={`w-8 h-8 flex items-center justify-center rounded-full border ${passengerDetails.adult <= 1 ? 'border-gray-300 text-gray-300' : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'}`}
                          >
                            -
                          </button>
                          <span className="mx-3 text-gray-800">{passengerDetails.adult}</span>
                          <button 
                            onClick={() => updatePassengerCount('adult', 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Child Passengers */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="font-medium text-gray-800">Children</div>
                          <div className="text-xs text-gray-500">2-17 years</div>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => updatePassengerCount('child', -1)}
                            disabled={passengerDetails.child <= 0}
                            className={`w-8 h-8 flex items-center justify-center rounded-full border ${passengerDetails.child <= 0 ? 'border-gray-300 text-gray-300' : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'}`}
                          >
                            -
                          </button>
                          <span className="mx-3 text-gray-800">{passengerDetails.child}</span>
                          <button 
                            onClick={() => updatePassengerCount('child', 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Senior Passengers */}
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <div className="font-medium text-gray-800">Seniors</div>
                          <div className="text-xs text-gray-500">65+ years</div>
                        </div>
                        <div className="flex items-center">
                          <button 
                            onClick={() => updatePassengerCount('senior', -1)}
                            disabled={passengerDetails.senior <= 0}
                            className={`w-8 h-8 flex items-center justify-center rounded-full border ${passengerDetails.senior <= 0 ? 'border-gray-300 text-gray-300' : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'}`}
                          >
                            -
                          </button>
                          <span className="mx-3 text-gray-800">{passengerDetails.senior}</span>
                          <button 
                            onClick={() => updatePassengerCount('senior', 1)}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Apply Button */}
                      <button 
                        onClick={togglePassengerModal}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg mt-2 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <div className="flex-1">
                  {tripType === "one-way" ? (
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg text-base font-semibold transition-colors h-[46px] mt-8">
                      Search
                    </button>
                  ) : (
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg text-base font-semibold transition-colors h-[46px] mt-8">
                      Search Round Trip
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New Addition */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">Hear from travelers who have experienced our services</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-orange-500 font-bold text-xl">A</span>
                </div>
                <div>
                  <h4 className="font-semibold">Ahmet K.</h4>
                  <div className="flex text-orange-500">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"The online booking process was so easy, and the ferry was clean and comfortable. Will definitely use SailMate for my next trip!"</p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-orange-500 font-bold text-xl">M</span>
                </div>
                <div>
                  <h4 className="font-semibold">Mehmet Y.</h4>
                  <div className="flex text-orange-500">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"I travel weekly between Yenikapı and Bandırma, and SailMate has made my commute so much more pleasant. The staff is always friendly and helpful."</p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-orange-500 font-bold text-xl">Z</span>
                </div>
                <div>
                  <h4 className="font-semibold">Zeynep A.</h4>
                  <div className="flex text-orange-500">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">"The views during the journey were spectacular! The ferry was on time and the seating was comfortable. Would recommend to anyone traveling in the area."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ferry Slider Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Explore Our Ferries</h2>
          <p className="text-gray-600 mb-8">Check out our featured ferries and routes to find the perfect journey for you.</p>
          
          {/* Ferry Slider Component */}
          <div className="relative z-10 w-full max-w-5xl mx-auto mt-6">
            <FerrySlider />
          </div>
        </div>
      </section>

      {/* Features Section with Animated Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Why Choose SailMate</h2>
          <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">Experience the best sea travel with our premium services and customer-focused approach</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:rotate-12">
                <img src={creditCard} className="w-10 h-10" alt="Secure Payment" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Payment</h3>
              <p className="text-gray-600">Multiple secure payment options with instant confirmation and e-tickets. We ensure your transaction is safe and protected.</p>
            </div>
            
            <div className="text-center p-8 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:rotate-12">
                <img src={ship} className="w-10 h-10" alt="Modern Fleet" />
              </div>
              <h3 className="text-xl font-bold mb-3">Modern Fleet</h3>
              <p className="text-gray-600">Travel on our modern vessels with comfortable seating, dining options, and entertainment to make your journey enjoyable.</p>
            </div>
            
            <div className="text-center p-8 rounded-xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl border border-gray-100">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-transform hover:rotate-12">
                <img src={passenger} className="w-10 h-10" alt="Customer Service" />
              </div>
              <h3 className="text-xl font-bold mb-3">24/7 Support</h3>
              <p className="text-gray-600">Our customer service team is available around the clock to assist you with bookings, changes, or any questions you may have.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Latest Announcements</h2>
          <Cards />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-orange-500 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated with SailMate</h2>
          <p className="mb-8">Subscribe to our newsletter for exclusive deals, travel tips, and updates on new routes.</p>
          
          <div className="flex flex-col md:flex-row gap-2 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 p-3 rounded-lg text-gray-800 focus:outline-none"
            />
            <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Homepage;