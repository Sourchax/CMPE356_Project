import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Ticket, Mail, Info, Clock, Calendar, Ship, MapPin, Users, FileCheck, AlertCircle } from 'lucide-react';
import Button from "../components/Button";
import '../assets/styles/ticketcheck.css';

const TicketCheck = () => {
  const [ticketId, setTicketId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [ticketStatus, setTicketStatus] = useState("confirmed"); // Can be "confirmed", "pending", "canceled"
  const navigate = useNavigate();

  // Mock ticket details for demonstration
  const [ticketDetails, setTicketDetails] = useState({
    id: "",
    departure: "Yenikapı",
    destination: "Bursa",
    departureDate: "2023-07-15",
    departureTime: "09:30",
    ticketClass: "Economy",
    passenger: "1 Adult",
    price: "₺450.00",
    status: "Confirmed"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Set mock ticket details based on input
      setTicketDetails({
        ...ticketDetails,
        id: ticketId,
        email: email,
        // Status would normally come from the backend
        status: ticketStatus === "confirmed" ? "Confirmed" : 
                ticketStatus === "pending" ? "Pending" : "Canceled"
      });
      
      // Show the ticket status section
      setShowStatus(true);
    }, 1500);
  };

  const handleBackToSearch = () => {
    setShowStatus(false);
    setTicketId("");
    setEmail("");
  };

  const navigateToContact = () => {
    navigate("/contact");
  };

  /* You can also add this if you want a more dramatic effect */
  const heroStyles = `
    .hero-background::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%);
      z-index: -1;
    }
  `;

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case "confirmed": return "text-green-600";
      case "pending": return "text-amber-500";
      case "canceled": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-white font-sans">
      {/* Add the CSS */}
      <style>{heroStyles}</style>
      
      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-cover bg-center z-0 hero-background" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
      </div>
      
      {/* Wave Transition */}
      <div className="absolute top-[35vh] left-0 w-full h-[10vh] z-[1] overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"
             className="absolute w-full h-full fill-white">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      <div className="relative z-10 mt-[20vh] px-4 flex flex-col items-center flex-grow">
        <div className="text-center text-white mb-5 animate-[fadeIn_0.8s_ease-out]">
          <h1 className="text-4xl font-bold mb-1 font-sans">Check Your Ticket Status</h1>
          <p className="text-base opacity-90 max-w-[600px] mx-auto font-sans">Enter your ticket details below to view your booking information</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg w-full max-w-[500px] p-6 mb-8 animate-[fadeIn_1s_ease-out]">
          {!showStatus ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="ticket-id" className="block text-sm font-medium text-gray-700">
                    Ticket ID / Reservation Number
                  </label>
                  <div className="input-with-icon">
                    <input 
                      type="text" 
                      id="ticket-id" 
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      placeholder="Enter your ticket ID" 
                      required 
                      className="w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:outline-none"
                    />
                    <Ticket className="input-icon" size={18} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="input-with-icon">
                    <input 
                      type="email" 
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter the email used for booking" 
                      required 
                      className="w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:outline-none"
                    />
                    <Mail className="input-icon" size={18} />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                  disabled={loading}
                  className="submit-button ticketcheck-button"
                >
                  Check Ticket Status
                </Button>
              </form>
            </>
          ) : (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <div className="flex flex-col items-center pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 font-sans">Ticket Status</h2>
                <div className={`mt-2 px-4 py-1 rounded-full ${
                  ticketDetails.status.toLowerCase() === "confirmed" ? "bg-green-100" : 
                  ticketDetails.status.toLowerCase() === "pending" ? "bg-amber-100" : "bg-red-100"
                }`}>
                  <span className={`font-medium ${getStatusColor(ticketDetails.status)}`}>
                    {ticketDetails.status}
                  </span>
                </div>
              </div>
              
              <div className="py-4 space-y-4">
                <div className="bg-gray-50 rounded-md p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Ticket size={16} className="mr-2 text-gray-500" />
                      Ticket ID:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">{ticketDetails.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Ship size={16} className="mr-2 text-gray-500" />
                      Journey:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">
                      {ticketDetails.departure} to {ticketDetails.destination}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-500" />
                      Departure Date:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">{ticketDetails.departureDate}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Clock size={16} className="mr-2 text-gray-500" />
                      Departure Time:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">{ticketDetails.departureTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Users size={16} className="mr-2 text-gray-500" />
                      Passengers:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">{ticketDetails.passenger}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Info size={16} className="mr-2 text-gray-500" />
                      Class:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">{ticketDetails.ticketClass}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                    <span className="text-gray-600 font-sans">Total Price:</span>
                    <span className="font-bold text-gray-900 font-sans">{ticketDetails.price}</span>
                  </div>
                </div>
                
                {ticketDetails.status.toLowerCase() === "confirmed" && (
                  <div className="bg-blue-50 rounded-md p-4">
                    <p className="text-sm text-blue-700 font-sans">
                      Your ticket is confirmed! Please arrive at the port at least 30 minutes before departure.
                    </p>
                  </div>
                )}
                
                {ticketDetails.status.toLowerCase() === "pending" && (
                  <div className="bg-amber-50 rounded-md p-4">
                    <p className="text-sm text-amber-700 font-sans">
                      Your payment is being processed. Please check back in a few minutes.
                    </p>
                  </div>
                )}
                
                {ticketDetails.status.toLowerCase() === "canceled" && (
                  <div className="bg-red-50 rounded-md p-4">
                    <p className="text-sm text-red-700 font-sans">
                      This ticket has been canceled. If you did not cancel it, please contact our support.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button 
                  onClick={handleBackToSearch}
                  variant="outline"
                  size="lg"
                  className="ticketcancel-button px-4 py-3 text-base w-full"
                >
                  Go Back
                </Button>
                <Button 
                  onClick={() => {
                    // Handle download ticket functionality here
                    alert("Downloading ticket...");
                  }}
                  variant="primary"
                  size="lg"
                  className="ticketcheck-button px-4 py-3 text-base w-full"
                >
                  Download Ticket
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center text-gray-600">
            <p className="font-sans">
              Need help?{" "}
              <span 
                onClick={navigateToContact} 
                className="text-[#0D3A73] font-medium hover:brightness-90 underline cursor-pointer transition-all duration-300 ease-in-out font-sans"
              >
                Contact our support team
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCheck;