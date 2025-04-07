import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import {useSessionToken} from "../utils/sessions.js";
import { Filter, DollarSign } from 'lucide-react';

const API_URL = "http://localhost:8080/api";

// Helper function to get location display text
const getLocationDisplay = (ticket, type) => {
  if (type === 'from') {
    // Try city first, then fall back to title
    return ticket.fromStationTitle || "-";
  } else {
    return ticket.toStationTitle || "-";
  }
};

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
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
      fetchUserTickets();
    }
  }, [isLoaded, isSignedIn, userId, navigate]);

  // Apply filters when tickets or statusFilter changes
  useEffect(() => {
    filterTickets();
  }, [tickets, statusFilter]);

  const fetchUserTickets = async () => {
    try {
      setLoading(true);
      console.log("Fetching tickets for user:", userId);
      
      // Call the API endpoint to get tickets for the current user
      const response = await axios.get(`${API_URL}/tickets/by-user`, {
        headers: {
          Authorization: `Bearer ${useSessionToken()}`
        }
      });
      
      // Ensure response.data is an array
      const ticketsData = Array.isArray(response.data) ? response.data : [];
      console.log("Tickets data received:", ticketsData);
      
      // Sort tickets by createdAt date, newest first
      const sortedTickets = sortTicketsByCreationDate(ticketsData);
      setTickets(sortedTickets);
      setError(null);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load tickets. Please try again.");
      setTickets([]);
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
      setFilteredTickets(tickets);
    } else if (statusFilter === "active") {
      setFilteredTickets(tickets.filter(ticket => !isTicketCompleted(ticket)));
    } else if (statusFilter === "completed") {
      setFilteredTickets(tickets.filter(ticket => isTicketCompleted(ticket)));
    }
  };

  const handleViewDetails = async (ticketId) => {
    try {
      setLoading(true);
      
      // Get detailed ticket information when user clicks "View Details"
      const response = await axios.get(`${API_URL}/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${useSessionToken()}`
        }
      });
      
      // Verify we got a valid response
      if (response.data) {
        console.log("Selected ticket data:", response.data);
        setSelectedTicket(response.data);
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

  const handleDownloadTicket = async (ticketId) => {
    try {
      alert(`Downloading ticket ${ticketId}`);
      
      // Implementation for actual ticket download
      // This would typically generate a PDF or similar document
      
      // Example of how you might implement a ticket download:
      // const response = await axios.get(`${API_URL}/tickets/${ticketId}/download`, {
      //   responseType: 'blob'
      // });
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `ticket-${ticketId}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
    } catch (err) {
      console.error("Error downloading ticket:", err);
      alert("Failed to download ticket. Please try again.");
    }
  };

  const handleCancelTicket = (ticket) => {
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

  // Helper function to check if a ticket is completed (departure time has passed)
  const isTicketCompleted = (ticket) => {
    if (!ticket.departureDate || !ticket.departureTime) return false;
    
    const now = new Date();
    const departureDate = new Date(ticket.departureDate);
    
    // Set departure time on the departure date
    const timeParts = ticket.departureTime.split(':');
    departureDate.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
    
    return now > departureDate;
  };

  // Get ticket status display
  const getTicketStatus = (ticket) => {
    return isTicketCompleted(ticket) ? "Completed" : "Active";
  };

  // Get count of active tickets for the filter badge
  const activeTicketsCount = tickets.filter(ticket => !isTicketCompleted(ticket)).length;
  
  // Get count of completed tickets for the filter badge
  const completedTicketsCount = tickets.filter(ticket => isTicketCompleted(ticket)).length;

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
          <h1 className="text-4xl font-bold mb-1">My Tickets</h1>
          <p className="text-base opacity-90 max-w-[600px] mx-auto">View and manage all your purchased tickets</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg w-full max-w-[950px] p-6 mb-8 animate-[fadeIn_1s_ease-out]">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="text-gray-600 mt-4">Loading your tickets...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p className="text-gray-600 mb-8">{error}</p>
              <Button 
                onClick={fetchUserTickets} 
                variant="primary"
                size="lg"
                className="reload-button mytickets-button"
              >
                Try Again
              </Button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-gray-600 mb-4">You don't have any tickets yet.</p>
              <Button 
                onClick={() => navigate("/")} 
                variant="primary"
                size="lg"
                className="cta-button mytickets-button"
              >
                Book a Ferry
              </Button>
            </div>
          ) : (
            <>
              {/* Top filter and currency options */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center text-gray-700 font-medium">
                    <Filter size={18} className="mr-2" />
                    <span>Filter by status:</span>
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
                      All ({tickets.length})
                    </button>
                    <button
                      onClick={() => setStatusFilter("active")}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                        statusFilter === "active" 
                          ? "bg-green-600 text-white" 
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      Active ({activeTicketsCount})
                    </button>
                    <button
                      onClick={() => setStatusFilter("completed")}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                        statusFilter === "completed" 
                          ? "bg-blue-600 text-white" 
                          : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                      }`}
                    >
                      Completed ({completedTicketsCount})
                    </button>
                  </div>
                </div>
                
                {/* Currency Selector */}
                <div className="flex items-center">
                  <div className="flex items-center text-gray-700 font-medium mr-2">
                    <span>Currency:</span>
                  </div>
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="bg-gray-100 border border-gray-300 text-gray-700 rounded-md px-3 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0D3A73] focus:border-[#0D3A73]"
                  >
                    <option value="TRY">Turkish Lira (₺)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>

              {filteredTickets.length === 0 ? (
                <div className="text-center py-8 px-4 border-2 border-dashed border-gray-200 rounded-lg">
                  <p className="text-gray-600 mb-2">No {statusFilter} tickets found.</p>
                  <button 
                    onClick={() => setStatusFilter("all")}
                    className="text-[#0D3A73] font-medium hover:underline"
                  >
                    Show all tickets
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {filteredTickets.map((ticket) => (
                    <div key={ticket.id} 
                        className="rounded-lg shadow-sm overflow-hidden border border-[#f0f0f0] transition-all duration-300 hover:translate-y-[-3px] hover:shadow-lg">
                      <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-[#eaeaea]">
                        <h3 className="text-lg font-medium text-gray-800">
                          {getLocationDisplay(ticket, 'from')} - {getLocationDisplay(ticket, 'to')}
                        </h3>
                        <span className={`${
                          getTicketStatus(ticket) === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        } px-3 py-1 rounded-full text-sm font-medium`}>
                          {getTicketStatus(ticket)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row justify-between p-4">
                        <div className="space-y-2 md:flex-1">
                          <p className="text-gray-600"><span className="font-medium text-gray-700">Ticket ID:</span> {ticket.ticketID}</p>
                          <p className="text-gray-600">
                            <span className="font-medium text-gray-700">Departure:</span> {formatDate(ticket.departureDate)}, {formatTime(ticket.departureTime)}
                          </p>
                          <p className="text-gray-600"><span className="font-medium text-gray-700">Class:</span> {ticket.ticketClass}</p>
                          <p className="text-gray-600"><span className="font-medium text-gray-700">Passenger Count:</span> {ticket.passengerCount}</p>
                          <p className="text-gray-600"><span className="font-medium text-gray-700">Price:</span> {formatPrice(ticket.totalPrice)}</p>
                          {ticket.createdAt && (
                            <p className="text-gray-600"><span className="font-medium text-gray-700">Booked on:</span> {formatDateTime(ticket.createdAt)}</p>
                          )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0 md:items-center">
                          <Button
                            onClick={() => handleViewDetails(ticket.id)}
                            variant="primary"
                            size="sm"
                            className="view-button mytickets-button"
                          >
                            View Details
                          </Button>
                          <Button
                            onClick={() => handleDownloadTicket(ticket.id)}
                            variant="outline"
                            size="sm"
                            className="download-button mytickets-button"
                          >
                            Download Ticket
                          </Button>
                          {/* Only show cancel button for active tickets */}
                          {getTicketStatus(ticket) === 'Active' && (
                            <Button
                              onClick={() => handleCancelTicket(ticket)}
                              variant="outline"
                              size="sm"
                              className="cancel-button mytickets-button text-red-600 border-red-300 hover:bg-red-50"
                            >
                              Cancel Ticket
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
              Having trouble with your tickets?{" "}
              <span 
                onClick={navigateToContact} 
                className="text-[#0D3A73] font-medium hover:text-[#06AED5] underline cursor-pointer transition-colors duration-300"
              >
                Contact our support team
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
              <h2 className="text-2xl font-bold text-gray-800">Ticket Details</h2>
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
                <p className="text-sm text-gray-500">Ferry Ticket</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ticket ID</p>
                  <p className="font-medium">{selectedTicket.ticketID}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${
                    getTicketStatus(selectedTicket) === 'Active' ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    {getTicketStatus(selectedTicket)}
                  </p>
                </div>
                {selectedTicket.createdAt && (
                  <div>
                    <p className="text-sm text-gray-500">Booked on</p>
                    <p className="font-medium">{formatDateTime(selectedTicket.createdAt)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Departure City</p>
                  <p className="font-medium">{getLocationDisplay(selectedTicket, 'from')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Arrival City</p>
                  <p className="font-medium">{getLocationDisplay(selectedTicket, 'to')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="font-medium">{selectedTicket.ticketClass}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formatDate(selectedTicket.departureDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{formatTime(selectedTicket.departureTime)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seats</p>
                  <p className="font-medium">{selectedTicket.selectedSeats}</p>
                </div>
                <div className="md:col-span-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium text-lg">{formatPrice(selectedTicket.totalPrice)}</p>
                  </div>
                  
                  {/* Currency Selector in Modal */}
                  <div className="flex items-center">
                    <label className="text-sm text-gray-600 mr-2">View in:</label>
                    <select
                      value={selectedCurrency}
                      onChange={(e) => setSelectedCurrency(e.target.value)}
                      className="bg-gray-100 border border-gray-300 text-gray-700 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D3A73]"
                    >
                      <option value="TRY">₺ TRY</option>
                      <option value="USD">$ USD</option>
                      <option value="EUR">€ EUR</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Passengers Information */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-3">Passengers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedTicket.passengers && selectedTicket.passengers.map((passenger, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded border border-gray-100">
                      <p className="font-medium">{passenger.name} {passenger.surname}</p>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <p className="text-gray-500">Birth Date</p>
                          <p>{passenger.birthDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Type</p>
                          <p>{passenger.passengerType || "Adult"}</p>
                        </div>
                        
                        {/* Only show email and phone for non-child passengers */}
                        {passenger.passengerType?.toLowerCase() !== "child" && (
                          <>
                            {passenger.email && (
                              <div>
                                <p className="text-gray-500">Email</p>
                                <p className="truncate">{passenger.email}</p>
                              </div>
                            )}
                            {passenger.phoneNo && (
                              <div>
                                <p className="text-gray-500">Phone</p>
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
                  onClick={() => handleDownloadTicket(selectedTicket.id)}
                  variant="primary"
                  size="md"
                  className="flex-1"
                >
                  Download Ticket
                </Button>
                
                {/* Add Cancel button in the modal for active tickets */}
                {getTicketStatus(selectedTicket) === 'Active' && (
                  <Button
                    onClick={() => {
                      handleCloseModal();
                      handleCancelTicket(selectedTicket);
                    }}
                    variant="outline"
                    size="md"
                    className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Cancel Ticket
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