import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import JourneyCatagory from "../components/PlanningPhase/JourneyCatagory.jsx";
import TicketSum from "../components/seatSelectionPhase/TicketSum.jsx";
import PaymentConfirmation from "./PaymentConfirmation.jsx";
import { FaClock } from 'react-icons/fa';
import { useLocation } from "react-router-dom";
import DepartureInfo from "../components/seatSelectionPhase/DepartureInfo.jsx";
import TicketPurchase from "../components/seatSelectionPhase/TicketPurchase.jsx";

const steps = [
  { label: "Select Voyage", icon: "📅" },
  { label: "Passenger Details", icon: "🧑" },
  { label: "Payment", icon: "💳" },
  { label: "Success", icon: "✅" },
];

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center mb-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold 
              ${index <= currentStep ? "bg-blue-600" : "bg-gray-300"}`}
          >
            {step.icon}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-1 ${index < currentStep ? "bg-blue-600" : "bg-gray-300"}`} />
          )}
        </div>
      ))}
    </div>
  );
};

const FerryTicketForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const [tripData, setTripData] = useState(location.state?.tripData);
  const [planningData, setPlanningData] = useState();
  const [selectedDeparture, setSelectedDeparture] = useState(undefined);
  const [selectedReturn, setSelectedReturn] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("TripData:", tripData);
  }, [location.state, tripData]);

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:");
    setCurrentStep(4);
  };

  const handleSelectDeparture = (selectedDeparture) => {
    setSelectedDeparture(selectedDeparture);
    setPlanningData((prev) => ({
      ...prev,
      departure: selectedDeparture,
    }));
    console.log("PlanningData:", planningData);
  };

  const handleSelectReturn = (selectedReturn) => {
    setSelectedReturn(selectedReturn);
    setPlanningData((prev) => ({
      ...prev,
      return: selectedReturn,
    }));
    console.log("PlanningData:", planningData);
  };

  const handleDepartureDetailsChange = (updatedDetails) => {
    console.log("Updated departure details:", updatedDetails);
    // You can now use updatedDetails in the parent component
  };

  const handleGoBack = () => {
    navigate("/"); 
  };

  const isNextDisabled = () => {
    if (tripData.returnDate === "") {
      // If returnDate is empty, check if selectedDeparture is undefined
      return selectedDeparture === undefined;
    } else {
      // If returnDate is not empty, check if both selectedDeparture and selectedReturn are undefined
      return selectedDeparture === undefined || selectedReturn === undefined;
    }
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

  const passengerCountA = tripData.passengers * (tripData.returnDate === "" ? 1 : 2);

  const [departureDetails, setDepartureDetails] = useState({
    passengerCount: tripData.passengers,
    passengers: Array.from({ length: passengerCountA }, () => ({
      Name: "",
      Surname: "",
      Phone: "",
      BirthDate: "",
      Email: "",
    })),
  });

  const handlePassengerChange = (index, field, value) => {
    setDepartureDetails((prevDetails) => {
      const updatedPassengers = prevDetails.passengers.map((passenger, i) =>
        i === index ? { ...passenger, [field]: value } : passenger
      );
      return { ...prevDetails, passengers: updatedPassengers };
    });
  };

  // This effect is now only used to check if all fields are filled and not to update the state constantly.
  useEffect(() => {
    const allFieldsFilled = departureDetails.passengers.every(passenger => 
      passenger.Name && passenger.Surname && passenger.Phone && passenger.BirthDate && passenger.Email
    );
  
    if (allFieldsFilled) {
      handleDepartureDetailsChange(departureDetails); // Only call this once when the fields are fully filled
    }
  }, [departureDetails]);

  const [notifyBySMS, setNotifyBySMS] = useState(false);
  const [notifyByEmail, setNotifyByEmail] = useState(false);
  const [wantETicket, setWantETicket] = useState(false);

  return (
    <div className="relative max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg min-h-[800px]">
      {/* Back to Homepage Button */}
      <button 
        onClick={handleGoBack} 
        className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg"
      >
        Back to Homepage
      </button>

      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep - 1} />

      <div className="flex justify-between">
        {/* Left side: Form Steps */}
        <div className={`w-${currentStep === 3 ? "full" : "2/3"}`}>
          {currentStep === 1 && (
            <div>
              <JourneyCatagory tripData={tripData} onSelectDeparture={handleSelectDeparture} onSelectReturn={handleSelectReturn}/>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="w-full bg-white rounded-md shadow-sm">
                <div className="flex justify-between items-center p-4 border-b">
                  <div className="text-gray-600">
                    Your remaining time to complete the ticket purchase... <FaClock className="inline text-amber-500" /> {formatTime(time)}
                  </div>
                </div>

                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-blue-800 text-xl font-bold">Departure Travel Information</h2>
                    <div className="flex items-center gap-2">
                      <span>{tripData.departure}</span>
                      <span className="bg-blue-800 text-white p-1 rounded-sm">&#8652;</span>
                      <span>{tripData.arrival}</span>
                    </div>
                  </div>
                </div>

                {departureDetails.passengers.map((_, index) =>
                  index < tripData.passengers ? (
                    <div key={index} className="bg-white rounded-md shadow-sm p-4 mb-4 border border-gray-300">
                      <DepartureInfo 
                        passengerIndex={index} 
                        departureDetails={departureDetails} 
                        onPassengerChange={handlePassengerChange}
                        tripType="departure"
                      />
                    </div>
                  ) : null
                )}

                {tripData.returnDate !== "" && (
                  <div className="p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h2 className="text-red-800 text-xl font-bold">Return Travel Information</h2>
                      <div className="flex items-center gap-2">
                        <span>{tripData.arrival}</span>
                        <span className="bg-red-800 text-white p-1 rounded-sm">&#8652;</span>
                        <span>{tripData.departure}</span>
                      </div>
                    </div>
                  </div>
                )}

                {tripData.returnDate !== "" && departureDetails.passengers.map((_, index) =>
                  index >= tripData.passengers && index < tripData.passengers * 2 ? (
                    <div key={index} className="bg-white rounded-md shadow-sm p-4 mb-4 border border-gray-300">
                      <DepartureInfo 
                        passengerIndex={index}
                        departureDetails={departureDetails} 
                        onPassengerChange={handlePassengerChange}
                        tripType="return"
                      />
                    </div>
                  ) : null
                )}

                <TicketPurchase
                  notifyBySMS={notifyBySMS}
                  setNotifyBySMS={setNotifyBySMS}
                  notifyByEmail={notifyByEmail}
                  setNotifyByEmail={setNotifyByEmail}
                  wantETicket={wantETicket}
                  setWantETicket={setWantETicket}
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="flex justify-center items-center w-full">
              <PaymentConfirmation />
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center">
              <h3 className="text-lg font-semibold">Booking Confirmed!</h3>
            </div>
          )}
        </div>

        {/* Right side: TicketSum (Hidden on step 3) */}
        {currentStep !== 3 && (
          <div className="w-1/3">
            <TicketSum ticketPlanningInfo={planningData} ticketTripInfo={tripData}/>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-between">
        {currentStep > 1 && <button onClick={handleBack} className="bg-gray-300 px-4 py-2">Back</button>}
        
        {/* Disable Next Button Only on Step 1 */}
        {currentStep === 1 && (
          <button 
            onClick={handleNext} 
            className="bg-blue-500 text-white px-4 py-2"
            disabled={isNextDisabled()}
          >
            Next
          </button>
        )}
        
        {currentStep === 2 && (
          <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2">
            Next
          </button>
        )}
        
        {currentStep === 3 && <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2">Purchase</button>}
      </div>
    </div>
  );
};

export default FerryTicketForm;
