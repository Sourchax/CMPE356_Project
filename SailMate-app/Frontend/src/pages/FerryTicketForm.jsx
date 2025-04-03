import React, { useState, useEffect } from "react";
import JourneyCatagory from "../components/ferry-ticket-form/JourneyCatagory.jsx";
import TicketSum from "../components/ferry-ticket-form/TicketSum.jsx";
import PaymentConfirmation from "../components/ferry-ticket-form/PaymentConfirmation.jsx";
import { FaClock } from 'react-icons/fa';
import axios from 'axios';
import DepartureInfo from "../components/ferry-ticket-form/DepartureInfo.jsx";
import TicketPurchase from "../components/ferry-ticket-form/TicketPurchase.jsx";
import ThankYouPage from "../components/ferry-ticket-form/ThankYouPage.jsx";
import { SeatSelectionBox } from "../components/ferry-ticket-form/FerrySeatSelector.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
const steps = [
  { label: "Select Voyage", icon: "📅" },
  { label: "Passenger Details", icon: "🧑" },
  { label: "Payment", icon: "💳" },
  { label: "Success", icon: "✅" },
];

const API_URL = "http://localhost:8080/api";

const ProgressBar = ({ currentStep, width }) => {
  return (
    <div className="flex flex-col items-center justify-center mb-6">
      <div className="flex items-center justify-center w-full overflow-x-auto py-2 px-2 sm:px-0">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-white font-bold text-xs sm:text-base
                ${index <= currentStep ? "bg-blue-600" : "bg-gray-300"}`}
            >
              {step.icon}
            </div>
            <div className="hidden xs:block text-xs sm:text-sm ml-1 mr-1 font-medium">
              {step.label}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-4 sm:w-8 md:w-16 h-1 ${index < currentStep ? "bg-blue-600" : "bg-gray-300"}`} />
            )}
          </div>
        ))}
      </div>
      {currentStep === 3 && (
        <div className="w-full bg-gray-300 rounded-full mt-4">
          <div
            className={`h-1 bg-blue-600 rounded-full`}
            style={{ width: `${width}%`, transition: "width 3s" }}
          />
        </div>
      )}
    </div>
  );
};

const FerryTicketForm = () => {

  const [prices, setPrices] = useState([]);
  const [seatSelectorOpen, setSeatSelectorOpen] = useState(false);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [currentTripType, setCurrentTripType] = useState("departure");

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        // First try to get data from the API
        const response = await axios.get(`${API_URL}/prices`);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setPrices(response.data);
        } else {
          console.log("API returned empty array!");
        }
      } catch (err) {
        console.error("Error fetching stations:", err);
      }
    };
    
    fetchPrices();
  }, []);

  // Toggle seat selector modal
  const toggleSeatSelector = (tripType = "departure") => {
    setCurrentTripType(tripType);
    setSeatSelectorOpen(!seatSelectorOpen);
  };

  // Handle seat selection
  const handleSeatSelected = (seat) => {
    // Clear the warning if the user selects a seat
    if (seat) {
      setShowSeatWarning(false);
    }
    
    setFormData((prevData) => ({
      ...prevData,
      creditCardDetails: {
        ...prevData.creditCardDetails,
        selectedSeat: seat,
      },
    }));
  };
  
  // New handlers for separate departure and return seat selections
  const handleDepartureSeatSelected = (seat) => {
    // Clear the warning if the user selects a seat
    if (seat) {
      setShowSeatWarning(false);
    }
    
    setFormData((prevData) => ({
      ...prevData,
      creditCardDetails: {
        ...prevData.creditCardDetails,
        departureSeat: seat,
      },
    }));
  };
  
  const handleReturnSeatSelected = (seat) => {
    setFormData((prevData) => ({
      ...prevData,
      creditCardDetails: {
        ...prevData.creditCardDetails,
        returnSeat: seat,
      },
    }));
  };

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const { userId, isLoaded } = useAuth();

  const [departurePrice, setDeparturePrice] = useState(0);
  const [returnPrice, setReturnPrice] = useState(0);
  
  const handlePriceCalculated = (prices) => {
    // Now you have access to just departure and return prices
    setDeparturePrice(prices.departure);
    setReturnPrice(prices.return);
  };
  
  // Check authentication and redirect if needed
  useEffect(() => {
    if (isLoaded && !userId) {
      navigate('/sign-in', { replace: true });
    }
  }, [isLoaded, userId, navigate]);
  
  useEffect(() => {
    // Extra protection: verify valid navigation on component mount
    const isValidNavigation = location.state && 
                             location.state.from === 'homepage' && 
                             location.state.tripData && 
                             location.state.availableVoyages;
                             
    if (!isValidNavigation) {
      // Redirect to homepage if accessed improperly
      navigate('/', { replace: true });
    }
    
    // Block browser back button functionality while on this page
    const blockBackNavigation = (e) => {
      // This may not work in all browsers but provides an additional layer
      e.preventDefault();
      navigate('/', { replace: true });
    };
    
    // Listen for attempts to navigate away using history
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', blockBackNavigation);
    
    return () => {
      window.removeEventListener('popstate', blockBackNavigation);
    };
  }, [navigate, location]);
  
  // Calculate total number of passengers based on passenger types
  const calculateTotalPassengers = (passengerTypes) => {
    if (!passengerTypes) return 0;
    return (passengerTypes.adult || 0) + (passengerTypes.student || 0) + (passengerTypes.senior || 0) + (passengerTypes.child || 0);
  };
  
  const [formData, setFormData] = useState({
    tripData: location.state?.tripData || {},
    planningData: null,
    selectedDeparture: undefined,
    selectedReturn: undefined,
    departureDetails: {
      passengerCount: location.state?.tripData?.passengerTypes ? 
        calculateTotalPassengers(location.state.tripData.passengerTypes) : 0,
      passengers: (() => {
        const tripData = location.state?.tripData;
        if (!tripData || !tripData.passengerTypes) return [];
        
        const isRoundTrip = tripData.returnDate !== "";
        const passengerTypes = tripData.passengerTypes;
        const passengerList = [];
        
        // Add adult passengers
        for (let i = 0; i < (passengerTypes.adult || 0); i++) {
          passengerList.push({
            PassengerType: "Adult",
            Name: "",
            Surname: "",
            Phone: "",
            BirthDate: "",
            Email: "",
            isValid: false,
          });
        }
        
        // Add student passengers
        for (let i = 0; i < (passengerTypes.student || 0); i++) {
          passengerList.push({
            PassengerType: "Student",
            Name: "",
            Surname: "",
            Phone: "",
            BirthDate: "",
            Email: "",
            isValid: false,
          });
        }
        
        // Add senior passengers
        for (let i = 0; i < (passengerTypes.senior || 0); i++) {
          passengerList.push({
            PassengerType: "Senior",
            Name: "",
            Surname: "",
            Phone: "",
            BirthDate: "",
            Email: "",
            isValid: false,
          });
        }

        // Add child passengers
        for (let i = 0; i < (passengerTypes.child || 0); i++) {
          passengerList.push({
            PassengerType: "Child",
            Name: "",
            Surname: "",
            BirthDate: "",
            isValid: false,
          });
        }
        
        // For round trips, duplicate the passenger list
        return isRoundTrip ? [...passengerList, ...passengerList] : passengerList;
      })(),
    },
    creditCardDetails: {
      name: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      termsAccepted: false,
      selectedSeat: "",
      departureSeat: "",
      returnSeat: ""
    },
    notifyBySMS: false,
    notifyByEmail: false,
    wantETicket: false,
    progress: 0,
  });

  useEffect(() => {
    console.log("TripData:", formData.tripData);
    console.log("Passengers:", formData.departureDetails.passengers);
  }, [location.state, formData.tripData]);

  const [showSeatWarning, setShowSeatWarning] = useState(false);
  
  const handleNext = () => {
    if (currentStep === 2) {
      // Check if seats are selected
      if (isRoundTrip) {
        // For round trips, check both departure and return seats
        if (!formData.creditCardDetails.departureSeat || !formData.creditCardDetails.returnSeat) {
          setShowSeatWarning(true);
          return; // Don't proceed
        }
      } else {
        // For one-way trips, check only departure seat
        if (!formData.creditCardDetails.departureSeat) {
          setShowSeatWarning(true);
          return; // Don't proceed
        }
      }
    }
    setCurrentStep((prev) => prev + 1);
  };
  const handleBack = () => {
    if (currentStep === 2) {
      setFormData((prevData) => ({
        ...prevData,
        planningData: null,  // Reset planningData when going back from step 2
        selectedDeparture: undefined,
        selectedReturn: undefined,
      }));
    }
    setCurrentStep((prev) => prev - 1);
  }
  const handleSubmit = async () => {
    const ticketsCreated = await createTickets();
    
    if (ticketsCreated) {
      // If tickets were created successfully, show the Thank You page
      setCurrentStep(4);
    }
  };

  const createTickets = async () => {
    try {
      // Validate required data
      if (!formData.selectedDeparture?.voyageId) {
        alert("No departure voyage selected");
        return false;
      }

      if (!formData.departureDetails?.passengerCount) {
        alert("No passengers specified");
        return false;
      }

      if (!userId) {
        alert("User not authenticated");
        return false;
      }

      // Format the passenger data for the API
      const formatPassengers = (passengers, count) => {
        return passengers.slice(0, count).map(passenger => ({
          name: passenger.Name,
          surname: passenger.Surname,
          birthDate: passenger.BirthDate,
          email: passenger.Email || "",
          phoneNo: passenger.Phone || "",
          passengerType: passenger.PassengerType
        }));
      };
  
      // Get departure voyage passengers
      const departurePassengers = formatPassengers(
        formData.departureDetails.passengers,
        formData.departureDetails.passengerCount
      );
      
      // Get the selected departure seat
      const departureSeat = formData.creditCardDetails?.departureSeat || "auto";
  
      // Create the departure ticket request
      const departureTicketRequest = {
        voyageId: formData.selectedDeparture.voyageId,
        passengerCount: formData.departureDetails.passengerCount,
        totalPrice: departurePrice,
        ticketClass: formData.selectedDeparture.type,
        selectedSeats: departureSeat || "auto",
        userId: userId,
        passengers: departurePassengers
      };
  
      // Create departure ticket
      console.log("Departure ticket request:", departureTicketRequest);
      const departureTicketResponse = await axios.post(`${API_URL}/tickets`, departureTicketRequest);
      
      // If round trip, create the return ticket as well
      let returnTicketResponse = null;
      if (formData.tripData.returnDate !== "" && formData.selectedReturn) {
        // Validate return voyage data
        if (!formData.selectedReturn?.voyageId) {
          alert("No return voyage selected");
          return false;
        }

        // Get return voyage passengers
        const returnPassengers = formatPassengers(
          formData.departureDetails.passengers.slice(formData.departureDetails.passengerCount),
          formData.departureDetails.passengerCount
        );
        
        // Get the selected return seat
        const returnSeat = formData.creditCardDetails?.returnSeat || "auto";
  
        // Create the return ticket request
        const returnTicketRequest = {
          voyageId: formData.selectedReturn.voyageId,
          passengerCount: formData.departureDetails.passengerCount,
          totalPrice: returnPrice,
          ticketClass: formData.selectedReturn.type,
          selectedSeats: returnSeat || "auto",
          userId: userId,
          passengers: returnPassengers
        };
  
        // Create return ticket
        returnTicketResponse = await axios.post(`${API_URL}/tickets`, returnTicketRequest);
        console.log("Return ticket created:", returnTicketResponse.data);
      }
  
      // Store ticket information in state or localStorage for the Thank You page
      const ticketInfo = {
        departureTicket: departureTicketResponse.data,
        returnTicket: returnTicketResponse ? returnTicketResponse.data : null,
        departureSeat: departureSeat,
        returnSeat: formData.creditCardDetails?.returnSeat || null
      };
      
      // Save to localStorage for display on Thank You page
      localStorage.setItem('lastTicketInfo', JSON.stringify(ticketInfo));
      
      return true;
    } catch (error) {
      console.error("Error creating tickets:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        alert(`Error creating tickets: ${error.response.data || 'Please try again.'}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert("Network error. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        alert("Error creating tickets. Please try again.");
      }
      return false;
    }
  };

  const handleSelectDeparture = (selectedDeparture) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedDeparture,
      planningData: {
        ...prevData.planningData,
        departure: selectedDeparture,
      },
    }));
  };

  const handleSelectReturn = (selectedReturn) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedReturn,
      planningData: {
        ...prevData.planningData,
        return: selectedReturn,
      },
    }));
  };

  const handlePassengerChange = (index, field, value) => {
    setFormData((prevData) => {
      const updatedPassengers = prevData.departureDetails.passengers.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      );
      return {
        ...prevData,
        departureDetails: {
          ...prevData.departureDetails,
          passengers: updatedPassengers,
        },
      };
    });
  };

  const handleCCDataChange = async (data) => {
    setFormData((prevData) => ({
      ...prevData,
      creditCardDetails: data,
    }));
    await handleSubmit();
  };

  const handleNotifyChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const isNextDisabled = () => {
    if(currentStep === 1){
      if (formData.tripData.returnDate === "") {
        return formData.selectedDeparture === undefined;
      } else {
        return formData.selectedDeparture === undefined || formData.selectedReturn === undefined;
      }
    };
    if(currentStep === 2){
      // Check if all passengers are valid
      const passengersValid = formData.departureDetails.passengers.every(passenger => passenger.isValid);
      
      // Return true (disabled) if not all conditions are met
      return !passengersValid;
    }
    return false;
  };

  const [time, setTime] = useState(900);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  useEffect(() => {
    if (time === 0) {
      alert("Time is up! You are being redirected to the homepage.");
      navigate('/');
      return;
    }

    const timer = setInterval(() => {
      setTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [time, navigate]);

  useEffect(() => {
    if (currentStep === 4) {
      const progressTimer = setInterval(() => {
        setFormData((prevData) => {
          if (prevData.progress < 100) {
            return { ...prevData, progress: prevData.progress + 1 };
          } else {
            clearInterval(progressTimer);
            setTimeout(() => {
              navigate('/');
            }, 500);
            return { ...prevData, progress: 100 };
          }
        });
      }, 30);
      console.log("Form Submitted:", formData); // To fill the bar over 3 seconds
    }
  }, [currentStep, navigate]);

  // Get the total count of passengers (one way)
  const totalPassengers = formData.departureDetails.passengerCount || 0;
  const isRoundTrip = formData.tripData && formData.tripData.returnDate !== "";

  return (
    currentStep === 4 ? (
      <ThankYouPage />
    ) : (
      <div className="relative max-w-7xl mx-auto p-3 sm:p-6 bg-white shadow-md rounded-lg min-h-[80vh]">
        {currentStep !== 4 && (
          <button 
            onClick={() => navigate("/")} 
            className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base"
          >
            Back to Homepage
          </button>
        )}

        <div className="pt-8 sm:pt-4">
          <ProgressBar currentStep={currentStep - 1} width={formData.progress} />
        </div>

        {/* Use the same flex layout for all steps - just customize the inside */}
        <div className="flex flex-col md:flex-row md:justify-between">
          {/* Left Side - Changes based on step */}
          <div className={`w-full ${currentStep === 3 ? 'md:w-2/3' : 'md:w-2/3'} mb-6 md:mb-0 ${currentStep === 3 ? 'md:pr-6' : ''}`}>
            {currentStep === 1 && (
              <div>
                <JourneyCatagory tripData={formData.tripData} availableVoyages={location.state.availableVoyages} onSelectDeparture={handleSelectDeparture} onSelectReturn={handleSelectReturn} prices={prices} />
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <div className="w-full bg-white rounded-md shadow-sm">
                  <div className="flex justify-between items-center p-2 sm:p-4 border-b flex-wrap gap-2">
                    <div className="text-gray-600 text-sm sm:text-base">
                      Your remaining time to complete the ticket purchase... <FaClock className="inline text-amber-500" /> {formatTime(time)}
                    </div>
                  </div>

                  <div className="p-2 sm:p-4 border-b">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h2 className="text-blue-800 text-lg sm:text-xl font-bold">Departure Travel Information</h2>
                      <div className="flex items-center gap-2 text-sm sm:text-base">
                        <span>{formData.tripData.departure}</span>
                        <span className="bg-blue-800 text-white p-1 rounded-sm">&#8652;</span>
                        <span>{formData.tripData.arrival}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-b">
                    <h3 className="text-blue-700 font-medium mb-3">Select Your Departure Seat</h3>
                    <SeatSelectionBox 
                      tripType="departure" 
                      onSeatSelected={handleDepartureSeatSelected}
                      selectedSeat={formData.creditCardDetails.departureSeat}
                      ticketClass={formData.selectedDeparture?.type === 'business' 
                        ? 'business' 
                        : formData.selectedDeparture?.type === 'promo' 
                          ? 'promo' 
                          : 'econ'}
                      ferryType={formData.tripData?.ferryType || 'fastFerry'}
                      passengerCount={formData.departureDetails.passengerCount || 1}
                    />
                    
                    {showSeatWarning && !formData.creditCardDetails.departureSeat && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
                        <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                        <span>Please select seats for your departure journey</span>
                      </div>
                    )}
                  </div>

                  {formData.departureDetails.passengers.map((passenger, index) => (
                    index < totalPassengers ? (
                      <div key={index} className="bg-white rounded-md shadow-sm p-3 sm:p-4 mb-4 border border-gray-300">
                        <div className="mb-3 text-base sm:text-lg font-semibold text-blue-600">
                          Passenger {index + 1} - {passenger.PassengerType}
                        </div>
                        <DepartureInfo 
                          passengerIndex={index} 
                          departureDetails={formData.departureDetails} 
                          onPassengerChange={handlePassengerChange}
                          tripType="departure"
                        />
                      </div>
                    ) : null
                  ))}

                  {isRoundTrip && (
                    <div className="p-2 sm:p-4 border-b">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <h2 className="text-red-800 text-lg sm:text-xl font-bold">Return Travel Information</h2>
                        <div className="flex items-center gap-2 text-sm sm:text-base">
                          <span>{formData.tripData.arrival}</span>
                          <span className="bg-red-800 text-white p-1 rounded-sm">&#8652;</span>
                          <span>{formData.tripData.departure}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Add seat selection for return journey when it's a round trip */}
                  {isRoundTrip && (
                    <div className="p-4 border-b">
                      <h3 className="text-red-700 font-medium mb-3">Select Your Return Seat</h3>
                      <SeatSelectionBox 
                        tripType="return" 
                        onSeatSelected={handleReturnSeatSelected}
                        selectedSeat={formData.creditCardDetails.returnSeat}
                        ticketClass={formData.selectedReturn?.type === 'business' 
                          ? 'business' 
                          : formData.selectedReturn?.type === 'promo' 
                            ? 'promo' 
                            : 'econ'}
                        ferryType={formData.tripData?.ferryType || 'fastFerry'}
                        passengerCount={formData.departureDetails.passengerCount || 1}
                      />
                      
                      {showSeatWarning && !formData.creditCardDetails.returnSeat && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700">
                          <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
                          <span>Please select seats for your return journey</span>
                        </div>
                      )}
                    </div>
                  )}

                  {isRoundTrip && formData.departureDetails.passengers.map((passenger, index) => (
                    index >= totalPassengers && index < totalPassengers * 2 ? (
                      <div key={index} className="bg-white rounded-md shadow-sm p-3 sm:p-4 mb-4 border border-gray-300">
                        <div className="mb-3 text-base sm:text-lg font-semibold text-red-600">
                          Passenger {index - totalPassengers + 1} - {passenger.PassengerType}
                        </div>
                        <DepartureInfo 
                          passengerIndex={index}
                          departureDetails={formData.departureDetails} 
                          onPassengerChange={handlePassengerChange}
                          tripType="return"
                        />
                      </div>
                    ) : null
                  ))}

                  <TicketPurchase
                    notifyBySMS={formData.notifyBySMS}
                    setNotifyBySMS={(value) => handleNotifyChange('notifyBySMS', value)}
                    notifyByEmail={formData.notifyByEmail}
                    setNotifyByEmail={(value) => handleNotifyChange('notifyByEmail', value)}
                    wantETicket={formData.wantETicket}
                    setWantETicket={(value) => handleNotifyChange('wantETicket', value)}
                  />
                </div>
              </div>
            )}

            {/* Payment form - now displayed in left column when on step 3 */}
            {currentStep === 3 && (
              <PaymentConfirmation 
                onCCDataChange={handleCCDataChange} 
                handleFormSubmit={handleSubmit}
                departureSeat={formData.creditCardDetails.departureSeat}
                returnSeat={formData.creditCardDetails.returnSeat}
                isRoundTrip={isRoundTrip}
              />
            )}
          </div>

          {/* Right Side - Ticket Summary */}
          <div className="w-full md:w-1/3 md:pl-6">
            <TicketSum ticketPlanningInfo={formData.planningData} ticketTripInfo={formData.tripData} prices= {prices} onPriceCalculated={handlePriceCalculated}/>
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          {currentStep > 1 && currentStep !== 4 && 
            <button 
              onClick={handleBack} 
              className="bg-gray-300 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base"
            >
              Back
            </button>
          }
          
          {currentStep === 1 && (
            <button 
              onClick={handleNext} 
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base ${isNextDisabled() ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
              disabled={isNextDisabled()}
            >
              Next
            </button>
          )}
          
          {currentStep === 2 && (
            <button 
              onClick={handleNext} 
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base ${isNextDisabled() ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
              disabled={isNextDisabled()}
            >
              Next
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default FerryTicketForm;