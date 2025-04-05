import React, { useState, useEffect } from "react";
import JourneyCatagory from "../components/ferry-ticket-form/JourneyCatagory.jsx";
import TicketSum from "../components/ferry-ticket-form/TicketSum.jsx";
import PaymentConfirmation from "../components/ferry-ticket-form/PaymentConfirmation.jsx";
import { FaClock } from 'react-icons/fa';
import axios from 'axios';
import DepartureInfo from "../components/ferry-ticket-form/DepartureInfo.jsx";
import TicketPurchase from "../components/ferry-ticket-form/TicketPurchase.jsx";
import ThankYouPage from "../components/ferry-ticket-form/ThankYouPage.jsx";
import SeatSelectionBox from '../components/ferry-ticket-form/seatSelectionBox.jsx';
import SeatSelectionModal from '../components/ferry-ticket-form/seatSelectionModal.jsx';
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

  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const { userId, isLoaded } = useAuth();
  const [isDepartureSeatModalOpen, setIsDepartureSeatModalOpen] = useState(false);
  const [isReturnSeatModalOpen, setIsReturnSeatModalOpen] = useState(false);
  const [departureSelectedSeats, setDepartureSelectedSeats] = useState([]);
  const [returnSelectedSeats, setReturnSelectedSeats] = useState([]);

  const [departurePrice, setDeparturePrice] = useState(0);
  const [returnPrice, setReturnPrice] = useState(0);
  
  const handlePriceCalculated = (prices) => {
    // Now you have access to just departure and return prices
    setDeparturePrice(prices.departure);
    setReturnPrice(prices.return);
  };

  const handleDepartureSeatSelection = (seats) => {
    setDepartureSelectedSeats(seats);
    
    // Update your form data with the selected seats
    setFormData((prevData) => ({
      ...prevData,
      selectedDeparture: {
        ...prevData.selectedDeparture,
        selectedSeats: seats.join(','),
      },
    }));
  };
  
  const handleReturnSeatSelection = (seats) => {
    setReturnSelectedSeats(seats);
    
    // Update your form data with the selected seats
    setFormData((prevData) => ({
      ...prevData,
      selectedReturn: {
        ...prevData.selectedReturn,
        selectedSeats: seats.join(','),
      },
    }));
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

  const handleNext = () => setCurrentStep((prev) => prev + 1);
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
  
      // Create the departure ticket request
      const departureTicketRequest = {
        voyageId: formData.selectedDeparture.voyageId,
        passengerCount: formData.departureDetails.passengerCount,
        totalPrice: departurePrice,
        ticketClass: formData.selectedDeparture.type ,
        selectedSeats: formData.selectedDeparture.selectedSeats || "auto",
        userId: userId, // From your Clerk authentication
        passengers: departurePassengers
      };
  
      // Create departure ticket
      console.log("Departure ticket request:", departureTicketRequest);
      const departureTicketResponse = await axios.post(`${API_URL}/tickets`, departureTicketRequest);
      
      // If round trip, create the return ticket as well
      let returnTicketResponse = null;
      if (formData.tripData.returnDate !== "" && formData.selectedReturn) {
        // Get return voyage passengers
        const returnPassengers = formatPassengers(
          formData.departureDetails.passengers.slice(formData.departureDetails.passengerCount),
          formData.departureDetails.passengerCount
        );
  
        // Create the return ticket request
        const returnTicketRequest = {
          voyageId: formData.selectedReturn.voyageId,
          passengerCount: formData.departureDetails.passengerCount,
          totalPrice: returnPrice,
          ticketClass: formData.selectedReturn.type,
          selectedSeats: formData.selectedReturn.selectedSeats || "auto",
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
        returnTicket: returnTicketResponse ? returnTicketResponse.data : null
      };
      
      // Could save this to state or localStorage for display on Thank You page
      localStorage.setItem('lastTicketInfo', JSON.stringify(ticketInfo));
      
      return true;
    } catch (error) {
      console.error("Error creating tickets:", error);
      alert("There was an error creating your tickets. Please try again.");
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
      if (formData.departureDetails.passengers.every(passenger => passenger.isValid) && 
        departureSelectedSeats.length !== 0 && 
        (formData.tripData.returnDate === "" || returnSelectedSeats.length !== 0)) {
        return false;
      }
      return true;
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
                  <SeatSelectionBox 
                      type="departure"
                      isSelected={departureSelectedSeats.length > 0}
                      onOpen={() => setIsDepartureSeatModalOpen(true)}
                      ticketClass={formData.selectedDeparture ? formData.selectedDeparture.type : null}
                      shipType={formData.selectedDeparture ? formData.selectedDeparture.shipType : null}
                      passengerCount={formData.departureDetails.passengerCount}
                      selectedSeats={departureSelectedSeats}
                    />

                    <SeatSelectionModal
                      type="departure"
                      isOpen={isDepartureSeatModalOpen}
                      onClose={() => setIsDepartureSeatModalOpen(false)}
                      passengerCount={formData.departureDetails.passengerCount}
                      onSeatSelection={handleDepartureSeatSelection}
                      ticketClass={formData.selectedDeparture ? formData.selectedDeparture.type : null}
                      shipType={formData.selectedDeparture ? formData.selectedDeparture.shipType : null}
                      voyageId= {formData.selectedDeparture ? formData.selectedDeparture.voyageId : null}
                      seatsInformation={location.state.availableVoyages.seatInformation}
                    />
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

                  {isRoundTrip && (
                    <>
                      <SeatSelectionBox 
                        type="return"
                        isSelected={returnSelectedSeats.length > 0}
                        onOpen={() => setIsReturnSeatModalOpen(true)}
                        ticketClass={formData.selectedReturn ? formData.selectedReturn.type : null}
                        shipType={formData.selectedReturn ? formData.selectedReturn.shipType : null}
                        passengerCount={formData.departureDetails.passengerCount}
                        selectedSeats= {returnSelectedSeats}
                      />

                      <SeatSelectionModal
                        type="return"
                        isOpen={isReturnSeatModalOpen}
                        onClose={() => setIsReturnSeatModalOpen(false)}
                        passengerCount={formData.departureDetails.passengerCount}
                        onSeatSelection={handleReturnSeatSelection}
                        ticketClass={formData.selectedReturn ? formData.selectedReturn.type : null}
                        shipType={formData.selectedReturn ? formData.selectedReturn.shipType : null}
                        voyageId= {formData.selectedReturn? formData.selectedReturn.voyageId : null}
                        seatsInformation={location.state.availableVoyages.seatInformation}
                      />
                    </>
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
              <PaymentConfirmation onCCDataChange={handleCCDataChange} handleFormSubmit={handleSubmit} />
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