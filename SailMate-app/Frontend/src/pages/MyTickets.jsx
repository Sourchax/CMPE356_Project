import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useSessionToken } from "../utils/sessions.js";
import { Filter, DollarSign } from 'lucide-react';
import { useTranslation } from "react-i18next";

const API_URL = "http://localhost:8080/api";

// Helper function to get location display text
const getLocationDisplay = (ticket, type) => {
  if (type === 'from') {
    return ticket.fromStationTitle || ticket.depStationTitle || "-";
  } else {
    return ticket.toStationTitle || ticket.arrStationTitle || "-";
  }
};

const MyTickets = () => {
  const { t } = useTranslation();
  const [activeTickets, setActiveTickets] = useState([]);
  const [completedTickets, setCompletedTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "active", or "completed"
  const [selectedCurrency, setSelectedCurrency] = useState("TRY");
  const [currencyRates, setCurrencyRates] = useState({
    TRY: 1,
    USD: 0.031,
    EUR: 0.028
  });
  const navigate = useNavigate();

  // Currency symbols for display
  const currencySymbols = {
    TRY: '₺',
    USD: '$',
    EUR: '€'
  };

  const translatePassengerType = (type) => {
    if (!type) return t('passengerTypes.adult'); // Default to adult if not specified
    
    // Convert to lowercase for case-insensitive comparison
    const lowerType = type.toLowerCase();
    
    if (lowerType === 'adult') return t('passengerTypes.adult');
    if (lowerType === 'student') return t('passengerTypes.student');
    if (lowerType === 'child') return t('passengerTypes.child');
    if (lowerType === 'senior') return t('passengerTypes.senior');
    
    // Return the original if no match (fallback)
    return type;
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

  // Convert price from TRY to selected currency
  const convertPrice = (priceTRY) => {
    if (selectedCurrency === 'TRY') return priceTRY;
    return (priceTRY * currencyRates[selectedCurrency]).toFixed(2);
  };
  
  // Format price with currency symbol
  const formatPrice = (price) => {
    if (!price) return "";
    const symbol = currencySymbols[selectedCurrency] || '₺';
    return `${symbol}${convertPrice(price)}`;
  };

  // Get user ID from Clerk
  const { userId, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in', { state: { returnUrl: '/my-tickets' } });
      return;
    }

    // Fetch tickets when component mounts and user is authenticated
    if (isLoaded && userId) {
      fetchAllUserTickets();
    }
  }, [isLoaded, isSignedIn, userId, navigate]);

  // Apply filters when tickets or statusFilter changes
  useEffect(() => {
    filterTickets();
  }, [activeTickets, completedTickets, statusFilter]);

  const fetchAllUserTickets = async () => {
    try {
      setLoading(true);
      console.log("Fetching all tickets for user:", userId);
      
      // Fetch both active and completed tickets in parallel
      const [activeResponse, completedResponse] = await Promise.all([
        axios.get(`${API_URL}/tickets/by-user`, {
          headers: {
            Authorization: `Bearer ${useSessionToken()}`
          }
        }),
        axios.get(`${API_URL}/completed-tickets/by-user`, {
          headers: {
            Authorization: `Bearer ${useSessionToken()}`
          }
        })
      ]);
      
      // Process active tickets
      const activeTicketsData = Array.isArray(activeResponse.data) ? activeResponse.data : [];
      console.log("Active tickets data received:", activeTicketsData);
      
      // Process completed tickets
      const completedTicketsData = Array.isArray(completedResponse.data) ? completedResponse.data : [];
      console.log("Completed tickets data received:", completedTicketsData);
      
      // Sort tickets by createdAt date, newest first
      const sortedActiveTickets = sortTicketsByCreationDate(activeTicketsData);
      const sortedCompletedTickets = sortTicketsByCreationDate(completedTicketsData);
      
      // Add a flag to identify the ticket type
      const processedActiveTickets = sortedActiveTickets.map(ticket => ({
        ...ticket,
        isCompleted: false
      }));
      
      const processedCompletedTickets = sortedCompletedTickets.map(ticket => ({
        ...ticket,
        isCompleted: true,
        // Map completed ticket properties to match active ticket schema
        ticketID: ticket.ticketId,
        depDate: ticket.depDate,
        depTime: ticket.depTime,
        arrTime: ticket.arrTime,
        // Note: We already have properties named properly in our JSX
      }));
      
      setActiveTickets(processedActiveTickets);
      setCompletedTickets(processedCompletedTickets);
      setError(null);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets. Please try again.");
      setActiveTickets([]);
      setCompletedTickets([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to sort tickets by createdAt date (newest first)
  const sortTicketsByCreationDate = (ticketsData) => {
    return [...ticketsData].sort((a, b) => {
      // Parse the createdAt dates
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      
      // Sort in descending order (newest first)
      return dateB - dateA;
    });
  };

  const filterTickets = () => {
    if (statusFilter === "all") {
      // Show active tickets first, then completed tickets
      setFilteredTickets([...activeTickets, ...completedTickets]);
    } else if (statusFilter === "active") {
      setFilteredTickets(activeTickets);
    } else if (statusFilter === "completed") {
      setFilteredTickets(completedTickets);
    }
  };

  const handleViewDetails = async (ticket) => {
    try {
      setLoading(true);
      
      // No need to fetch if it's already a completed ticket
      if (ticket.isCompleted) {
        setSelectedTicket(ticket);
        setShowModal(true);
        setLoading(false);
        return;
      }
      
      // Get detailed ticket information when user clicks "View Details"
      const response = await axios.get(`${API_URL}/tickets/${ticket.id}`, {
        headers: {
          Authorization: `Bearer ${useSessionToken()}`
        }
      });
      
      // Verify we got a valid response
      if (response.data) {
        console.log("Selected ticket data:", response.data);
        setSelectedTicket({...response.data, isCompleted: false});
        setShowModal(true);
      } else {
        throw new Error("Empty response received");
      }
    } catch (err) {
      console.error("Error fetching ticket details:", err);
      alert("Failed to load ticket details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTicket(null);
  };

  const handleDownloadTicket = async (ticket) => {
    try {
      // Show loading indicator
      setLoading(true);
      
      // We need to use the string ticketID (not the numeric id) based on the controller endpoint
      const ticketID = ticket.ticketID || ticket.ticketId; 
      
      console.log(`Downloading ticket with ID: ${ticketID}`);
      
      // Different endpoints for active vs completed tickets
      const endpoint = ticket.isCompleted 
        ? `${API_URL}/completed-tickets/${ticketID}/download`
        : `${API_URL}/tickets/${ticketID}/download`;
      
      // Call the API endpoint to download the ticket
      const response = await axios.get(endpoint, {
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
  };

  const handleCancelTicket = (ticket) => {
    // Only active tickets can be cancelled
    if (ticket.isCompleted) {
      alert(t('myTickets.cannotCancelCompleted'));
      return;
    }
    
    // Navigate to the ticket-cancel route with the ticket info in location state
    navigate("/ticket-cancel", {
      state: {
        voyage: ticket,
        from: 'my-tickets'
      }
    });
  };

  const navigateToContact = () => {
    navigate("/contact");
  };

  // Helper function to format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString.substring(0, 5); // Extract HH:MM from the time string
  };

  // Helper function to format datetime for display
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Get ticket status display
  const getTicketStatus = (ticket) => {
    return ticket.isCompleted ? t('myTickets.completed') : t('myTickets.active');
  };

  // Get count of active tickets for the filter badge
  const activeTicketsCount = activeTickets.length;
  
  // Get count of completed tickets for the filter badge
  const completedTicketsCount = completedTickets.length;

  // Get the total tickets count
  const totalTicketsCount = activeTicketsCount + completedTicketsCount;

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-white">
      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-cover bg-center z-0" 
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
          <h1 className="text-4xl font-bold mb-1">{t('myTickets.title')}</h1>
          <p className="text-base opacity-90 max-w-[600px] mx-auto">{t('myTickets.subtitle')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg w-full max-w-[950px] p-6 mb-8 animate-[fadeIn_1s_ease-out]">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">{t('myTickets.loading')}</span>
              </div>
              <p className="text-gray-600 mt-4">{t('myTickets.loading')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p className="text-gray-600 mb-8">{error}</p>
              <Button 
                onClick={fetchAllUserTickets} 
                variant="primary"
                size="lg"
                className="reload-button mytickets-button"
              >
                {t('common.tryAgain')}
              </Button>
            </div>
          ) : totalTicketsCount === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-gray-600 mb-4">{t('myTickets.noTickets')}</p>
              <Button 
                onClick={() => navigate("/")} 
                variant="primary"
                size="lg"
                className="cta-button mytickets-button"
              >
                {t('myTickets.bookFerry')}
              </Button>
            </div>
          ) : (
            <>
              {/* Top filter and currency options */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center text-gray-700 font-medium">
                    <Filter size={18} className="mr-2" />
                    <span>{t('myTickets.filterByStatus')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setStatusFilter("all")}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                        statusFilter === "all" 
                          ? "bg-[#0D3A73] text-white" 
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {t('myTickets.all')} ({totalTicketsCount})
                    </button>
                    <button
                      onClick={() => setStatusFilter("active")}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                        statusFilter === "active" 
                          ? "bg-green-600 text-white" 
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      {t('myTickets.active')} ({activeTicketsCount})
                    </button>
                    <button
                      onClick={() => setStatusFilter("completed")}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                        statusFilter === "completed" 
                          ? "bg-blue-600 text-white" 
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      {t('myTickets.completed')} ({completedTicketsCount})
                    </button>
                  </div>
                </div>
                
                {/* Currency Selector */}
                <div className="flex items-center">
                  <div className="flex items-center text-gray-700 font-medium mr-2">
                    <span>{t('myTickets.currency')}:</span>
                  </div>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="bg-gray-100 border border-gray-300 text-gray-700 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D3A73] focus:border-[#0D3A73]"
                  >
                    <option value="TRY">{t('currencies.turkishLira')} (₺)</option>
                    <option value="USD">{t('currencies.usDollar')} ($)</option>
                    <option value="EUR">{t('currencies.euro')} (€)</option>
                  </select>
                </div>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-600 mb-2">{t('myTickets.noFilteredTickets', { status: t(`myTickets.${statusFilter}`) })}</p>
                  <button 
                    onClick={() => setStatusFilter("all")}
                    className="text-[#0D3A73] font-medium hover:underline"
                  >
                    {t('myTickets.showAllTickets')}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {filteredTickets.map((ticket, index) => (
                    <div key={`${ticket.isCompleted ? 'comp-' : 'active-'}${ticket.id || index}`} 
                        className="rounded-lg shadow-sm overflow-hidden border border-[#f0f0f0] transition-all duration-300 hover:translate-y-[-3px] hover:shadow-lg">
                      <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-[#eaeaea]">
                        <h3 className="text-lg font-medium text-gray-800">
                          {getLocationDisplay(ticket, 'from')} - {getLocationDisplay(ticket, 'to')}
                        </h3>
                        <span className={`${
                          ticket.isCompleted ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        } px-3 py-1 rounded-full text-sm font-medium`}>
                          {getTicketStatus(ticket)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between p-4">
                        <div className="space-y-2 md:flex-1">
                          <p className="text-gray-600"><span className="font-medium text-gray-700">{t('myTickets.ticketId')}:</span> {ticket.ticketID || ticket.ticketId}</p>
                          <p className="text-gray-600">
                            <span className="font-medium text-gray-700">{t('myTickets.departure')}:</span> {formatDate(ticket.departureDate || ticket.depDate)}, {formatTime(ticket.departureTime || ticket.depTime)}
                          </p>
                          <p className="text-gray-600"><span className="font-medium text-gray-700">{t('myTickets.class')}:</span> {ticket.ticketClass}</p>
                          <p className="text-gray-600"><span className="font-medium text-gray-700">{t('myTickets.passengerCount')}:</span> {ticket.passengerCount}</p>
                          <p className="text-gray-600"><span className="font-medium text-gray-700">{t('myTickets.price')}:</span> {formatPrice(ticket.totalPrice)}</p>
                          {ticket.createdAt && (
                            <p className="text-gray-600"><span className="font-medium text-gray-700">{t('myTickets.bookedOn')}:</span> {formatDateTime(ticket.createdAt)}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 md:items-center">
                          <Button
                            onClick={() => handleViewDetails(ticket)}
                            variant="primary"
                            size="sm"
                            className="view-button mytickets-button"
                          >
                            {t('myTickets.viewDetails')}
                          </Button>
                          <Button
                            onClick={() => handleDownloadTicket(ticket)}
                            variant="outline"
                            size="sm"
                            className="download-button mytickets-button"
                          >
                            {t('myTickets.downloadTicket')}
                          </Button>
                          {/* Only show cancel button for active tickets */}
                          {!ticket.isCompleted && (
                            <Button
                              onClick={() => handleCancelTicket(ticket)}
                              variant="outline"
                              size="sm"
                              className="cancel-button mytickets-button text-red-600 border-red-300 hover:bg-red-50"
                            >
                              {t('myTickets.cancelTicket')}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          
          <div className="text-center mt-8">
            <p className="text-gray-600">
              {t('myTickets.needHelp')}{" "}
              <span 
                onClick={navigateToContact} 
                className="text-[#0D3A73] font-medium hover:text-[#06AED5] underline cursor-pointer transition-colors duration-300"
              >
                {t('myTickets.contactSupport')}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Ticket Details Modal - Wider version with converted currency */}
      {showModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 selectable">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 animate-[fadeIn_0.3s_ease-out] max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{t('myTickets.ticketDetails')}</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 mb-1">
                  {getLocationDisplay(selectedTicket, 'from')} - {getLocationDisplay(selectedTicket, 'to')}
                </h3>
                <p className="text-sm text-gray-500">{t('ticketCancel.ferryTicket')}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">{t('myTickets.ticketId')}</p>
                  <p className="font-medium">{selectedTicket.ticketID || selectedTicket.ticketId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('myTickets.status')}</p>
                  <p className={`font-medium ${
                    selectedTicket.isCompleted ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {getTicketStatus(selectedTicket)}
                  </p>
                </div>
                {selectedTicket.createdAt && (
                  <div>
                    <p className="text-sm text-gray-500">{t('myTickets.bookedOn')}</p>
                    <p className="font-medium">{formatDateTime(selectedTicket.createdAt)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">{t('myTickets.departureCity')}</p>
                  <p className="font-medium">{getLocationDisplay(selectedTicket, 'from')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('myTickets.arrivalCity')}</p>
                  <p className="font-medium">{getLocationDisplay(selectedTicket, 'to')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('myTickets.class')}</p>
                  <p className="font-medium">{selectedTicket.ticketClass}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('myTickets.date')}</p>
                  <p className="font-medium">{formatDate(selectedTicket.departureDate || selectedTicket.depDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('myTickets.time')}</p>
                  <p className="font-medium">{formatTime(selectedTicket.departureTime || selectedTicket.depTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">{t('myTickets.seats')}</p>
                  <p className="font-medium">{selectedTicket.selectedSeats}</p>
                </div>
                <div className="md:col-span-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">{t('myTickets.price')}</p>
                    <p className="font-medium text-lg">{formatPrice(selectedTicket.totalPrice)}</p>
                  </div>
                  
                  {/* Currency Selector in Modal */}
                  <div className="flex items-center">
                    <label className="text-sm text-gray-600 mr-2">{t('myTickets.viewIn')}</label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="bg-gray-100 border border-gray-300 text-gray-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3A73]"
                    >
                      <option value="TRY">₺ {t('currencies.shortTRY')}</option>
                      <option value="USD">$ {t('currencies.shortUSD')}</option>
                      <option value="EUR">€ {t('currencies.shortEUR')}</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Passengers Information */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-3">{t('myTickets.passengers')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTicket.passengers && selectedTicket.passengers.map((passenger, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border border-gray-100">
                      <p className="font-medium">{passenger.name} {passenger.surname}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <p className="text-gray-500">{t('myTickets.birthDate')}</p>
                          <p>{passenger.birthDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{t('myTickets.type')}</p>
                          <p>{translatePassengerType(passenger.passengerType)}</p>
                        </div>
                        
                        {/* Only show email and phone for non-child passengers */}
                        {passenger.passengerType?.toLowerCase() !== "child" && (
                          <>
                            {passenger.email && (
                              <div>
                                <p className="text-gray-500">{t('myTickets.email')}</p>
                                <p className="truncate">{passenger.email}</p>
                              </div>
                            )}
                            {passenger.phoneNo && (
                              <div>
                                <p className="text-gray-500">{t('myTickets.phone')}</p>
                                <p>{passenger.phoneNo}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 flex flex-col sm:flex-row justify-between gap-3">
                <Button
                  onClick={() => handleDownloadTicket(selectedTicket)}
                  variant="primary"
                  size="md"
                  className="flex-1"
                >
                  {t('myTickets.downloadTicket')}
                </Button>
                
                {/* Add Cancel button in the modal for active tickets */}
                {getTicketStatus(selectedTicket) === t('myTickets.active') && (
                  <Button
                    onClick={() => {
                      handleCloseModal();
                      handleCancelTicket(selectedTicket);
                    }}
                    variant="outline"
                    size="md"
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    {t('myTickets.cancelTicket')}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;