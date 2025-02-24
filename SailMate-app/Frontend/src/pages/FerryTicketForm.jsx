import React, { useState } from "react";

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

const AboutUs = ({ tripType }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    departureTime: "",
    returnTime: tripType === "round" ? "" : null,
    passengers: [{ name: "", surname: "", phone: "", idNumber: "", dob: "", email: "" }],
    purchaser: { name: "", surname: "", phone: "", email: "", notifyPhone: false, notifyEmail: false, eTicket: false },
    payment: { cardName: "", cardNumber: "", expMonth: "", expYear: "", cvv: "" },
  });

  const handleInputChange = (e, section, index = null) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      if (section === "passengers") {
        const updatedPassengers = [...prev.passengers];
        updatedPassengers[index][name] = value;
        return { ...prev, passengers: updatedPassengers };
      } else if (section === "purchaser") {
        return { ...prev, purchaser: { ...prev.purchaser, [name]: type === "checkbox" ? checked : value } };
      } else if (section === "payment") {
        return { ...prev, payment: { ...prev.payment, [name]: value } };
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const addPassenger = () => {
    setFormData((prev) => ({
      ...prev,
      passengers: [...prev.passengers, { name: "", surname: "", phone: "", idNumber: "", dob: "", email: "" }],
    }));
  };

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setCurrentStep(4);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Progress Bar */}
      <ProgressBar currentStep={currentStep - 1} />

      <h2 className="text-xl font-semibold">{steps[currentStep - 1].label}</h2>

      {currentStep === 1 && (
        <div>
          <label>Departure Time:</label>
          <input type="datetime-local" name="departureTime" value={formData.departureTime} onChange={(e) => handleInputChange(e, "general")} className="border p-2 w-full" />
          {tripType === "round" && (
            <div>
              <label>Return Time:</label>
              <input type="datetime-local" name="returnTime" value={formData.returnTime} onChange={(e) => handleInputChange(e, "general")} className="border p-2 w-full" />
            </div>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div>
          {formData.passengers.map((passenger, index) => (
            <div key={index} className="border p-2 mb-2">
              <label>Name:</label>
              <input type="text" name="name" value={passenger.name} onChange={(e) => handleInputChange(e, "passengers", index)} className="border p-2 w-full" />
              <label>Surname:</label>
              <input type="text" name="surname" value={passenger.surname} onChange={(e) => handleInputChange(e, "passengers", index)} className="border p-2 w-full" />
            </div>
          ))}
          <button onClick={addPassenger} className="bg-blue-500 text-white px-3 py-1 mt-2">Add Passenger</button>
        </div>
      )}

      {currentStep === 3 && (
        <div>
          <label>Card Holder Name:</label>
          <input type="text" name="cardName" value={formData.payment.cardName} onChange={(e) => handleInputChange(e, "payment")} className="border p-2 w-full" />
          <label>Card Number:</label>
          <input type="text" name="cardNumber" value={formData.payment.cardNumber} onChange={(e) => handleInputChange(e, "payment")} className="border p-2 w-full" />
        </div>
      )}

      {currentStep === 4 && (
        <div className="text-center">
          
          <h3 className="text-lg font-semibold">Booking Confirmed!</h3>
        </div>
      )}

      <div className="mt-4 flex justify-between">
        {currentStep > 1 && <button onClick={handleBack} className="bg-gray-300 px-4 py-2">Back</button>}
        {currentStep < 3 && <button onClick={handleNext} className="bg-blue-500 text-white px-4 py-2">Next</button>}
        {currentStep === 3 && <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2">Submit</button>}
      </div>
    </div>
  );
};

export default AboutUs;
