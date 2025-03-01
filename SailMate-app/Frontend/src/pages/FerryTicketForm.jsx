import React, { useState, useEffect } from "react";
import JourneyCatagory from "../components/PlanningPhase/JourneyCatagory.jsx";
import TicketSum from "../components/seatSelectionPhase/TicketSum.jsx";
import PaymentConfirmation from "./PaymentConfirmation.jsx";
import { FaClock } from 'react-icons/fa';
import DepartureInfo from "../components/seatSelectionPhase/DepartureInfo.jsx";
import TicketPurchase from "../components/seatSelectionPhase/TicketPurchase.jsx";
import ThankYouPage from "../components/seatSelectionPhase/ThankYouPage.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const steps = [
  { label: "Select Voyage", icon: "📅" },
  { label: "Passenger Details", icon: "🧑" },
  { label: "Payment", icon: "💳" },
  { label: "Success", icon: "✅" },
];

const ProgressBar = ({ currentStep, width }) => {
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

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const location = useLocation();
  const [formData, setFormData] = useState({
    tripData: location.state?.tripData,
    planningData: null,
    selectedDeparture: undefined,
    selectedReturn: undefined,
    departureDetails: {
      passengerCount: location.state?.tripData.passengers,
      passengers: Array.from({ length: location.state?.tripData.passengers * (location.state?.tripData.returnDate === "" ? 1 : 2) }, () => ({
        PassengerType: "Adult",
        Name: "",
        Surname: "",
        Phone: "",
        BirthDate: "",
        Email: "",
        isValid: false,
      })),
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
  const handleSubmit = () => {
    setCurrentStep(4);
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

  const handleCCDataChange = (data) => {
    setFormData((prevData) => ({
      ...prevData,
      creditCardDetails: data,
    }));
    handleSubmit();
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
      if (formData.departureDetails.passengers.every(passenger => passenger.isValid)) {
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

  return (
    currentStep === 4 ? (
      <ThankYouPage />
    ) : (
      <div className="relative max-w-7xl mx-auto p-6 bg-white shadow-md rounded-lg min-h-[800px]">
        {currentStep !== 4 && (
          <button 
            onClick={() => navigate("/")} 
            className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Back to Homepage
          </button>
        )}

        <ProgressBar currentStep={currentStep - 1} width={formData.progress} />

        <div className="flex justify-between">
          {/* Left side: Form Steps */}
          <div className={`w-${currentStep === 3 ? "full" : "2/3"}`}>
            {currentStep === 1 && (
              <div>
                <JourneyCatagory tripData={formData.tripData} onSelectDeparture={handleSelectDeparture} onSelectReturn={handleSelectReturn} />
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
                        <span>{formData.tripData.departure}</span>
                        <span className="bg-blue-800 text-white p-1 rounded-sm">&#8652;</span>
                        <span>{formData.tripData.arrival}</span>
                      </div>
                    </div>
                  </div>

                  {formData.departureDetails.passengers.map((_, index) =>
                    index < formData.tripData.passengers ? (
                      <div key={index} className="bg-white rounded-md shadow-sm p-4 mb-4 border border-gray-300">
                        <DepartureInfo 
                          passengerIndex={index} 
                          departureDetails={formData.departureDetails} 
                          onPassengerChange={handlePassengerChange}
                          tripType="departure"
                        />
                      </div>
                    ) : null
                  )}

                  {formData.tripData.returnDate !== "" && (
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h2 className="text-red-800 text-xl font-bold">Return Travel Information</h2>
                        <div className="flex items-center gap-2">
                          <span>{formData.tripData.arrival}</span>
                          <span className="bg-red-800 text-white p-1 rounded-sm">&#8652;</span>
                          <span>{formData.tripData.departure}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.tripData.returnDate !== "" && formData.departureDetails.passengers.map((_, index) =>
                    index >= formData.tripData.passengers && index < formData.tripData.passengers * 2 ? (
                      <div key={index} className="bg-white rounded-md shadow-sm p-4 mb-4 border border-gray-300">
                        <DepartureInfo 
                          passengerIndex={index}
                          departureDetails={formData.departureDetails} 
                          onPassengerChange={handlePassengerChange}
                          tripType="return"
                        />
                      </div>
                    ) : null
                  )}

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

            {currentStep === 3 && (
              <div className="flex justify-center items-center w-full">
                <PaymentConfirmation onCCDataChange={handleCCDataChange} handleFormSubmit={handleSubmit} />
              </div>
            )}
          </div>

          <div className="w-1/3">
            <TicketSum ticketPlanningInfo={formData.planningData} ticketTripInfo={formData.tripData} />
          </div>
        </div>

        <div className="mt-4 flex justify-between">
          {currentStep > 1 && currentStep !== 4 && <button onClick={handleBack} className="bg-gray-300 px-4 py-2">Back</button>}
          
          {currentStep === 1 && (
            <button 
              onClick={handleNext} 
              className={`px-4 py-2 rounded-lg ${isNextDisabled() ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
              disabled={isNextDisabled()}
            >
              Next
            </button>
          )}
          
          {currentStep === 2 && (
            <button 
            onClick={handleNext} 
            className={`px-4 py-2 rounded-lg ${isNextDisabled() ? 'bg-gray-400' : 'bg-blue-500 text-white'}`}
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
