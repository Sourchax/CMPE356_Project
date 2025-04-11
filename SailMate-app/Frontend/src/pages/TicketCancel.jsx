import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Ticket, MessageSquare, Calendar, Clock, Users, Map, Anchor, DollarSign } from 'lucide-react';
import Button from "../components/Button";
import axios from "axios";
import { useSessionToken } from "../utils/sessions.js";
import { useTranslation } from "react-i18next";
import { useAuth } from "@clerk/clerk-react"; // Import Clerk's useAuth hook
import '../assets/styles/ticketcancel.css';

const API_URL = "http://localhost:8080/api";

const TicketCancel = () => {
  const { t } = useTranslation();
  const [ticketId, setTicketId] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState("TRY");
  const [currencyRates, setCurrencyRates] = useState({
    TRY: 1,
    USD: 0.031,
    EUR: 0.028
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useAuth(); // Add Clerk authentication state

  // Currency symbols for display
  const currencySymbols = {
    TRY: '₺',
    USD: '$',
    EUR: '€'
  };

  // Helper function to display error
  const displayError = (message) => {
    setErrorMessage(message);
    setShowError(true);
    
    // Auto-hide after 6 seconds
    setTimeout(() => {
      setShowError(false);
    }, 6000);
  };

  // Error notification component
  const ErrorNotification = () => {
    if (!showError) return null;
    
    return (
      <div className="fixed inset-10 flex items-start justify-center z-50 animate-[fadeIn_0.3s_ease-out]">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-md">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setShowError(false)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-200 focus:outline-none"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Function to check if a voyage is expired/completed
  const isVoyageExpired = (ticket) => {
    if (!ticket || !ticket.departureDate || !ticket.departureTime) {
      return false; // Can't determine if invalid ticket data
    }
    
    const today = new Date();
    const voyageDate = new Date(ticket.departureDate);
    
    // If the voyage date is in the past (not today)
    if (voyageDate.getFullYear() < today.getFullYear() ||
        (voyageDate.getFullYear() === today.getFullYear() && 
         voyageDate.getMonth() < today.getMonth()) ||
        (voyageDate.getFullYear() === today.getFullYear() && 
         voyageDate.getMonth() === today.getMonth() && 
         voyageDate.getDate() < today.getDate())) {
      return true;
    }
    
    // If it's today, check if departure time has passed
    if (voyageDate.getFullYear() === today.getFullYear() &&
        voyageDate.getMonth() === today.getMonth() &&
        voyageDate.getDate() === today.getDate()) {
      
      const [hours, minutes] = ticket.departureTime.split(':').map(Number);
      const currentHours = today.getHours();
      const currentMinutes = today.getMinutes();
      
      // Check if time has passed
      if (currentHours > hours || (currentHours === hours && currentMinutes > minutes)) {
        return true;
      }
    }
    
    return false;
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

  // Extract ticket information from location state if available
  useEffect(() => {
    if (location.state && location.state.voyage) {
      // If we have the full ticket object already
      if (location.state.voyage.ticketID) {
        setTicketId(location.state.voyage.ticketID);
        setTicketDetails(location.state.voyage);
      }
    }
  }, [location]);

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

  // Check authentication before proceeding
  const checkAuthAndProceed = (callback) => {
    if (!isSignedIn) {
      // Redirect to sign-in page if not authenticated
      navigate("/sign-in", { 
        state: { returnUrl: location.pathname + location.search } 
      });
      return false;
    }
    // User is authenticated, proceed with the callback
    return callback();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication before proceeding
    checkAuthAndProceed(async () => {
      setLoading(true);
      
      // Fetch ticket details if not already available
      if (!ticketDetails) {
        try {
          setFetchingDetails(true);
          // Use the correct endpoint from your controller - "/ticketID/{ticketID}"
          const response = await axios.get(`${API_URL}/tickets/ticketID/${ticketId}`, {
            headers: {
              Authorization: `Bearer ${useSessionToken()}`
            }
          });
          
          if (response.data) {
            // Check if the voyage is expired/completed
            if (isVoyageExpired(response.data)) {
              setLoading(false);
              setFetchingDetails(false);
              displayError(t('ticketCancel.errorMessages.alreadyDeparted'));
              return;
            }
            
            setTicketDetails(response.data);
            setShowConfirmation(true);
          } else {
            throw new Error("Ticket not found");
          }
        } catch (error) {
          console.error("Error fetching ticket details:", error);
          displayError(t('ticketCancel.errorMessages.notFound'));
        } finally {
          setFetchingDetails(false);
          setLoading(false);
        }
      } else {
        // If we already have ticket details, check if voyage is expired
        if (isVoyageExpired(ticketDetails)) {
          setLoading(false);
          displayError(t('ticketCancel.errorMessages.alreadyDeparted'));
          return;
        }
        
        // If not expired, show confirmation
        setLoading(false);
        setShowConfirmation(true);
      }
    });
  };

  const handleConfirm = async () => {
    // Check authentication before proceeding
    checkAuthAndProceed(async () => {
      setLoading(true);
      
      try {
        // First, double-check if the voyage is expired (in case time passed during confirmation)
        if (isVoyageExpired(ticketDetails)) {
          setLoading(false);
          displayError(t('ticketCancel.errorMessages.alreadyDeparted'));
          setShowConfirmation(false);
          return;
        }
        
        // Use the correct endpoint for deletion - with numeric ID
        if (ticketDetails && ticketDetails.id) {
          await axios.delete(`${API_URL}/tickets/${ticketDetails.id}`, {
            headers: {
              Authorization: `Bearer ${useSessionToken()}`
            }
          });

          const seatSoldResponse2 = await axios.post(`${API_URL}/seats-sold/ticket-cancelled`, null, {
            params: {
              ticketData: ticketDetails.selectedSeats,
              voyageId: ticketDetails.voyageId
            },
            headers: {
              Authorization: `Bearer ${useSessionToken()}`
            }
          });
          
          setLoading(false);
          
          // Show success message before redirecting
          alert(t('ticketCancel.successMessage'));
          
          // Reset form and return to My Tickets
          setTicketId("");
          setReason("");
          setShowConfirmation(false);
          setTicketDetails(null);
          navigate("/my-tickets");
        } else {
          throw new Error("Missing ticket ID for cancellation");
        }
      } catch (error) {
        console.error("Error cancelling ticket:", error);
        setLoading(false);
        displayError(t('ticketCancel.errorMessages.cancelError'));
      }
    });
  };

  const navigateToContact = () => {
    navigate("/contact");
  };

  // Helper function to get location display text
  const getLocationDisplay = (ticket, type) => {
    if (type === 'from') {
      return ticket.fromStationTitle || "-";
    } else {
      return ticket.toStationTitle || "-";
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Helper function to format time
  const formatTime = (timeString) => {
    if (!timeString) return "-";
    return timeString.substring(0, 5); // Extract HH:MM from the time string
  };

  // Helper function to format seats display
  const formatSeats = (seatsString) => {
    if (!seatsString) return "-";
    // If the seats are already in a readable format, return as is
    // Otherwise, format them for better readability
    return seatsString.split(',').join(', ');
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

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-white font-sans">
      {/* Error Notification */}
      <ErrorNotification />
      
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
          <h1 className="text-4xl font-bold mb-1 font-sans">{t('ticketCancel.title')}</h1>
          <p className="text-base opacity-90 max-w-[600px] mx-auto font-sans">{t('ticketCancel.subtitle')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg w-full max-w-[500px] p-6 mb-8 animate-[fadeIn_1s_ease-out]">
          {!showConfirmation ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="ticket-id" className="block text-sm font-medium text-gray-700 font-sans">
                  {t('ticketCancel.ticketIdLabel')}
                </label>
                <div className="input-with-icon">
                  <input 
                    type="text" 
                    id="ticket-id" 
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    placeholder={t('ticketCancel.ticketIdPlaceholder')}
                    required 
                    className="w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:outline-none font-sans"
                  />
                  <Ticket className="input-icon" size={18} />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 font-sans">
                  {t('ticketCancel.enterReason')}
                </label>
                <div className="input-with-icon">
                  <textarea 
                    id="reason" 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder={t('ticketCancel.reasonPlaceholder')}
                    rows="3"
                    className="w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:outline-none resize-none font-sans"
                  ></textarea>
                  <MessageSquare className="input-icon" size={18} />
                </div>
              </div>
              
              <Button 
                type="submit" 
                variant="primary"
                fullWidth
                size="lg"
                loading={loading || fetchingDetails}
                disabled={loading || fetchingDetails}
                className="ticketcancel-button"
              >
                {fetchingDetails ? t('ticketCancel.retrievingDetails') : t('ticketCancel.continueButton')}
              </Button>
              
              <div className="bg-blue-50 text-blue-700 p-4 rounded-md mt-4">
                <p className="flex items-start text-sm text-gray-600 font-sans">
                  <i className="fas fa-info-circle mt-0.5 mr-2 text-[#0D3A73]"></i>
                  <span>{t('ticketCancel.cancelPolicy')}</span>
                </p>
              </div>
            </form>
          ) : (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="text-yellow-500 text-4xl mr-3">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 font-sans">{t('ticketCancel.confirmTitle')}</h2>
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
              
              <div className="py-4">
                <p className="text-center text-gray-600 mb-4 font-sans">{t('ticketCancel.confirmPrompt')}</p>
                
                {ticketDetails && (
                  <div className="bg-gray-50 rounded-md p-4 mb-4">
                    <div className="mb-3 pb-3 border-b border-gray-200">
                      <h3 className="font-bold text-gray-800 text-lg mb-1">
                        {getLocationDisplay(ticketDetails, 'from')} - {getLocationDisplay(ticketDetails, 'to')}
                      </h3>
                      <p className="text-sm text-gray-500">{t('ticketCancel.ferryTicket')}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <Ticket className="mr-2 text-gray-600 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">{t('ticketCancel.id')}</p>
                          <p className="font-medium">{ticketDetails.ticketID}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Calendar className="mr-2 text-gray-600 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">{t('ticketCancel.departureDate')}</p>
                          <p className="font-medium">{formatDate(ticketDetails.departureDate)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="mr-2 text-gray-600 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">{t('ticketCancel.departureTime')}</p>
                          <p className="font-medium">{formatTime(ticketDetails.departureTime)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Users className="mr-2 text-gray-600 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">{t('ticketCancel.passengerCount')}</p>
                          <p className="font-medium">{ticketDetails.passengerCount}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Map className="mr-2 text-gray-600 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">{t('ticketCancel.class')}</p>
                          <p className="font-medium">{ticketDetails.ticketClass}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Anchor className="mr-2 text-gray-600 mt-1 flex-shrink-0" size={16} />
                        <div>
                          <p className="text-sm text-gray-500">{t('ticketCancel.seats')}</p>
                          <p className="font-medium">{formatSeats(ticketDetails.selectedSeats)}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2 mt-2 border-t border-gray-200">
                        <div className="flex items-start">
                          <DollarSign className="mr-2 text-gray-600 mt-1 flex-shrink-0" size={16} />
                          <div>
                            <p className="text-sm text-gray-500">{t('ticketCancel.totalPrice')}</p>
                            <p className="font-medium text-lg">{formatPrice(ticketDetails.totalPrice)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <p className="text-red-600 text-sm italic font-sans">{t('ticketCancel.confirmWarning')}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Button 
                  onClick={() => setShowConfirmation(false)}
                  variant="outline"
                  size="lg"
                  className="ticketcancel-button px-4 py-3 text-base w-full"
                >
                  {t('ticketCancel.goBack')}
                </Button>
                <Button 
                  onClick={handleConfirm}
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                  className="ticketcancel-button px-4 py-3 text-base w-full"
                >
                  {t('ticketCancel.confirmButton')}
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center text-gray-600">
            <p className="font-sans">
              {t('ticketCancel.needHelp')}{" "}
              <span 
                onClick={navigateToContact} 
                className="text-[#0D3A73] font-medium hover:brightness-90 underline cursor-pointer transition-all duration-300 ease-in-out font-sans"
              >
                {t('ticketCancel.contactSupport')}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCancel;