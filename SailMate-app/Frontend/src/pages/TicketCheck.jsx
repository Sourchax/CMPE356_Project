import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Ticket, Mail, Info, Clock, Calendar, Ship, MapPin, Users, FileCheck, AlertCircle, User, DollarSign } from 'lucide-react';
import Button from "../components/Button";
import '../assets/styles/ticketcheck.css';
import { useSessionToken } from "../utils/sessions";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/clerk-react";

const API_URL = "http://localhost:8080/api";

const TicketCheck = () => {
  const { t } = useTranslation();
  const [ticketId, setTicketId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("TRY");
  const location = useLocation();
  const [currencyRates, setCurrencyRates] = useState({
    TRY: 1,
    USD: 0.031,
    EUR: 0.028
  });
  const navigate = useNavigate();

  // Initialize ticket details with empty values
  const [ticketDetails, setTicketDetails] = useState({
    id: "",
    ticketID: "",
    fromStationCity: "",
    fromStationTitle: "",
    toStationCity: "",
    toStationTitle: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    ticketClass: "",
    passengerCount: 0,
    totalPrice: 0,
    status: "",
    voyageId: null,
    passengers: []
  });

  // Currency symbols for display
  const currencySymbols = {
    TRY: '₺',
    USD: '$',
    EUR: '€'
  };

  // Fetch currency rates when component mounts
  useEffect(() => {
    const fetchCurrencyRates = async () => {
      try {
        // Fetch USD rate
        const usdResponse = await axios.get(`${API_URL}/currency/convert`, {
          params: { amount: 1, from: 'TRY', to: 'USD' }
        });
        
        // Fetch EUR rate
        const eurResponse = await axios.get(`${API_URL}/currency/convert`, {
          params: { amount: 1, from: 'TRY', to: 'EUR' }
        });
        
        setCurrencyRates({
          TRY: 1,
          USD: usdResponse.data || 0.031,
          EUR: eurResponse.data || 0.028
        });
      } catch (error) {
        console.error("Error fetching currency rates:", error);
        // Keep fallback rates if API fails
      }
    };
    
    fetchCurrencyRates();
  }, []);

  const { isSignedIn } = useAuth();

  const checkAuthAndProceed = (callback) => {
    if (!isSignedIn) {
      // Redirect to sign-in page if not authenticated
      navigate("/sign-in", { 
        state: { returnUrl: location.pathname } 
      });
      return false;
    }
    // User is authenticated, proceed with the callback
    return callback();
  };

  // Convert price from TRY to selected currency
  const convertPrice = (priceTRY) => {
    if (!priceTRY && priceTRY !== 0) return "";
    if (selectedCurrency === 'TRY') return priceTRY.toFixed(2);
    return (priceTRY * currencyRates[selectedCurrency]).toFixed(2);
  };
  
  // Format price with currency symbol
  const formatPrice = (price) => {
    if (!price && price !== 0) return "";
    const symbol = currencySymbols[selectedCurrency] || '₺';
    return `${symbol}${convertPrice(price)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication before proceeding
    checkAuthAndProceed(async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First, try to fetch ticket by ticketID
        const response = await axios.get(`${API_URL}/tickets/ticketID/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${useSessionToken()}`
          }
        });
        
        if (response.data) {
          // Check if the provided email matches any passenger's email
          const ticket = response.data;
          const passengerEmails = ticket.passengers ? ticket.passengers.map(p => p.email.toLowerCase()) : [];
          
          if (passengerEmails.includes(email.toLowerCase()) || 
              (ticket.bookerEmail && ticket.bookerEmail.toLowerCase() === email.toLowerCase())) {
            
            // Determine ticket status based on departure date/time
            const status = calculateTicketStatus(ticket);
            
            setTicketDetails({
              ...ticket,
              status: status
            });
            
            setShowStatus(true);
          } else {
            setError("The email provided does not match our records for this ticket.");
          }
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
        setError("Ticket not found or invalid information provided. Please check your ticket ID and email.");
      } finally {
        setLoading(false);
      }
    });
  };

  // Function to calculate ticket status based on departure date/time
  const calculateTicketStatus = (ticket) => {
    if (!ticket.departureDate || !ticket.departureTime) return "Unknown";
    
    const now = new Date();
    const departureDate = new Date(ticket.departureDate);
    
    // Set departure time on the departure date
    const timeParts = ticket.departureTime.split(':');
    departureDate.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
    
    // Check if voyage is cancelled
    if (ticket.voyageStatus === "cancel") return "Canceled";
    
    // If departure time is in the past
    if (now > departureDate) return "Completed";
    
    // If departure time is less than 24 hours away
    const oneDayFromNow = new Date(now);
    oneDayFromNow.setHours(now.getHours() + 24);
    
    if (departureDate < oneDayFromNow) return "Upcoming";
    
    // Otherwise, it's confirmed
    return "Confirmed";
  };

  const handleBackToSearch = () => {
    setShowStatus(false);
    setTicketId("");
    setEmail("");
    setError(null);
  };

  const navigateToContact = () => {
    navigate("/contact");
  };

  const handleDownloadTicket = async () => {
    // Check authentication before proceeding
    checkAuthAndProceed(async () => {
      try {
        // Show loading indicator if needed
        setLoading(true);
        
        // We need to use the string ticketID based on the controller endpoint
        const ticketID = ticketDetails.ticketID;
        
        console.log(`Downloading ticket with ID: ${ticketID}`);
        
        // Call the API endpoint to download the ticket
        const response = await axios.get(`${API_URL}/tickets/${ticketID}/download`, {
          responseType: 'blob',  // Important: expect binary data
          headers: {
            Authorization: `Bearer ${useSessionToken()}`
          }
        });
        
        // Create a blob from the PDF bytes
        const blob = new Blob([response.data], { type: 'application/pdf' });
        
        // Create a URL for the blob
        const url = window.URL.createObjectURL(blob);
        
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `ticket-${ticketID}.pdf`);
        
        // Append to body, click the link, and clean up
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Release the blob URL
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error downloading ticket:", err);
        alert("Failed to download ticket. Please try again.");
      } finally {
        setLoading(false);
      }
    });
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
      case "upcoming": return "text-blue-600";
      case "completed": return "text-gray-600";
      case "canceled": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  // Helper function to get status background color
  const getStatusBgColor = (status) => {
    switch(status.toLowerCase()) {
      case "confirmed": return "bg-green-100";
      case "upcoming": return "bg-blue-100";
      case "completed": return "bg-gray-100";
      case "canceled": return "bg-red-100";
      default: return "bg-gray-100";
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get departure and destination display
  const getDepartureDisplay = () => {
    return ticketDetails.fromStationCity || ticketDetails.fromStationTitle || "-";
  };

  const getDestinationDisplay = () => {
    return ticketDetails.toStationCity || ticketDetails.toStationTitle || "-";
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
          <h1 className="text-4xl font-bold mb-1 font-sans">{t('ticketCheck.title')}</h1>
          <p className="text-base opacity-90 max-w-[600px] mx-auto font-sans">{t('ticketCheck.subtitle')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg w-full max-w-[500px] p-6 mb-8 animate-[fadeIn_1s_ease-out]">
          {!showStatus ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="ticket-id" className="block text-sm font-medium text-gray-700">
                    {t('ticketCheck.ticketIdLabel')}
                  </label>
                  <div className="input-with-icon">
                    <input 
                      type="text" 
                      id="ticket-id" 
                      value={ticketId}
                      onChange={(e) => setTicketId(e.target.value)}
                      placeholder={t('ticketCheck.ticketIdPlaceholder')}
                      required 
                      className="w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:outline-none"
                    />
                    <Ticket className="input-icon" size={18} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('ticketCheck.emailLabel')}
                  </label>
                  <div className="input-with-icon">
                    <input 
                      type="email" 
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('ticketCheck.emailPlaceholder')}
                      required 
                      className="w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:outline-none"
                    />
                    <Mail className="input-icon" size={18} />
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-red-700 text-sm">{t('ticketCheck.errorMessage')}</p>
                  </div>
                )}
                
                <Button 
                  type="submit" 
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={loading}
                  loadingText={t('common.loading')}
                  disabled={loading}
                  className="submit-button ticketcheck-button"
                >
                  {t('ticketCheck.checkStatus')}
                </Button>
              </form>
            </>
          ) : (
            <div className="animate-[fadeIn_0.5s_ease-out] selectable">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 font-sans">{t('ticketCheck.ticketStatus')}</h2>
                  <div className={`mt-2 px-4 py-1 rounded-full ${getStatusBgColor(ticketDetails.status)}`}>
                    <span className={`font-medium ${getStatusColor(ticketDetails.status)}`}>
                      {ticketDetails.status}
                    </span>
                  </div>
                </div>
                
                {/* Currency Selector */}
                <div className="flex items-center">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="bg-gray-100 border border-gray-300 text-gray-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D3A73]"
                  >
                    <option value="TRY">₺ TRY</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                  </select>
                </div>
              </div>
              
              <div className="py-4 space-y-4">
                <div className="bg-gray-50 rounded-md p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Ticket size={16} className="mr-2 text-gray-500" />
                      {t('ticketCheck.ticketIdLabel')}:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">{ticketDetails.ticketID}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Ship size={16} className="mr-2 text-gray-500" />
                      {t('ticketCheck.journey')}:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">
                      {getDepartureDisplay()} to {getDestinationDisplay()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-500" />
                      {t('ticketCheck.departureDate')}:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">{formatDate(ticketDetails.departureDate)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Clock size={16} className="mr-2 text-gray-500" />
                      {t('ticketCheck.departureTime')}:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">{ticketDetails.departureTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Users size={16} className="mr-2 text-gray-500" />
                      {t('ticketCheck.passengerCount')}:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">{ticketDetails.passengerCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-sans flex items-center">
                      <Info size={16} className="mr-2 text-gray-500" />
                      {t('ticketCheck.class')}:
                    </span>
                    <span className="font-medium text-gray-700 font-sans">{ticketDetails.ticketClass}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                    <span className="text-gray-600 font-sans flex items-center">
                      <DollarSign size={16} className="mr-2 text-gray-500" />
                      {t('ticketCheck.totalPrice')}:
                    </span>
                    <span className="font-bold text-gray-900 font-sans">{formatPrice(ticketDetails.totalPrice)}</span>
                  </div>
                </div>
                
                {/* Passenger Information Section */}
                {ticketDetails.passengers && ticketDetails.passengers.length > 0 && (
                  <div className="bg-gray-50 rounded-md p-4">
                    <h3 className="text-gray-800 font-medium mb-3 flex items-center">
                      <Users size={16} className="mr-2 text-gray-600" />
                      {t('ticketCheck.passengerInfo')}
                    </h3>
                    
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                      {ticketDetails.passengers.map((passenger, index) => (
                        <div key={index} className="bg-white p-3 rounded border border-gray-200">
                          <div className="flex items-center mb-2">
                            <User size={14} className="mr-2 text-gray-500" />
                            <span className="font-medium">{passenger.name} {passenger.surname}</span>
                            {passenger.passengerType && (
                              <span className="ml-2 text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                                {passenger.passengerType}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            {passenger.birthDate && (
                              <div>
                                <p className="text-gray-500">{t('ticketCheck.birthDate')}:</p>
                                <p>{passenger.birthDate}</p>
                              </div>
                            )}
                            {passenger.email && (
                              <div>
                                <p className="text-gray-500">{t('common.email')}:</p>
                                <p className="truncate">{passenger.email}</p>
                              </div>
                            )}
                            {passenger.phoneNo && (
                              <div className="col-span-2">
                                <p className="text-gray-500">{t('ticketCheck.phoneNumber')}:</p>
                                <p>{passenger.phoneNo}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {ticketDetails.status.toLowerCase() === "confirmed" && (
                  <div className="bg-green-50 rounded-md p-4">
                    <p className="text-sm text-green-700 font-sans">
                      {t('ticketCheck.status.confirmed')}
                    </p>
                  </div>
                )}
                
                {ticketDetails.status.toLowerCase() === "upcoming" && (
                  <div className="bg-blue-50 rounded-md p-4">
                    <p className="text-sm text-blue-700 font-sans">
                      {t('ticketCheck.status.upcoming')}
                    </p>
                  </div>
                )}
                
                {ticketDetails.status.toLowerCase() === "completed" && (
                  <div className="bg-gray-50 rounded-md p-4">
                    <p className="text-sm text-gray-700 font-sans">
                      {t('ticketCheck.status.completed')}
                    </p>
                  </div>
                )}
                
                {ticketDetails.status.toLowerCase() === "canceled" && (
                  <div className="bg-red-50 rounded-md p-4">
                    <p className="text-sm text-red-700 font-sans">
                      {t('ticketCheck.status.canceled')}
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
                  {t('ticketCheck.goBack')}
                </Button>
                <Button 
                  onClick={handleDownloadTicket}
                  variant="primary"
                  size="lg"
                  loading={loading}
                  loadingText={t('common.loading')}
                  disabled={ticketDetails.status.toLowerCase() === "canceled"}
                  className="ticketcheck-button px-4 py-3 text-base w-full"
                >
                  {t('ticketCheck.downloadTicket')}
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center text-gray-600">
            <p className="font-sans">
              {t('ticketCheck.needHelp')}{" "}
              <span 
                onClick={navigateToContact} 
                className="text-[#0D3A73] font-medium hover:brightness-90 underline cursor-pointer transition-all duration-300 ease-in-out font-sans"
              >
                {t('ticketCheck.contactSupport')}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCheck;