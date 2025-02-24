import React, { useState, useEffect } from 'react';
import { FaClock, FaInfoCircle, FaShieldAlt } from 'react-icons/fa';
import DepartureInfo from '../components/seatSelectionPhase/DepartureInfo';
import TicketPurchase from '../components/seatSelectionPhase/TicketPurchase';
import TicketSum from '../components/seatSelectionPhase/TicketSum';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const [time, setTime] = useState(900);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" + secs : secs}`;
  };

  const navigate = useNavigate(); // Initialize navigation

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


  // Initialize departure details with passengers
  const [departureDetails, setDepartureDetails] = useState({
    from: "Bursa",
    to: "Yenikapi",
    tripType: "round",
    passengerCount: 2,
    passengers: [{ name: "", surname: "", phone: "", idNumber: "", birthDate: "", email: "", tripType: "departure" }],
  });

  const [seatNumbers, setSeatNumbers] = useState([315]);

  // Updates a passenger's information
  const handlePassengerChange = (index, field, value) => {
    setDepartureDetails((prevDetails) => {
      const updatedPassengers = [...prevDetails.passengers];

      // Ensure the passenger exists before updating
      if (!updatedPassengers[index]) {
        updatedPassengers[index] = { name: "", surname: "", phone: "", idNumber: "", birthDate: "", email: "" };
      }

      updatedPassengers[index] = {
        ...updatedPassengers[index],
        [field]: value,
      };

      return { ...prevDetails, passengers: updatedPassengers };
    });
  };

  useEffect(() => {
    setSeatNumbers(Array.from({ length: departureDetails.passengerCount }, (_, i) => 315 + i));

    setDepartureDetails((prevDetails) => {
      const newPassengers = Array.from({ length: departureDetails.passengerCount }, (_, i) => 
        prevDetails.passengers[i] || { name: "", surname: "", phone: "", idNumber: "", birthDate: "", email: "" }
      );
      return { ...prevDetails, passengers: newPassengers };
    });
  }, [departureDetails.passengerCount]);


  const [notifyBySMS, setNotifyBySMS] = useState(false);
  const [notifyByEmail, setNotifyByEmail] = useState(false);
  const [wantETicket, setWantETicket] = useState(false);
  const [seatSelectionMethod, setSeatSelectionMethod] = useState('automatic');

  return (
    <div className="w-4/5 mx-auto flex flex-col lg:flex-row gap-4 p-4 bg-gray-100 font-sans">
      <div className="w-full lg:w-2/3 bg-white rounded-md shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <button className="bg-blue-800 text-white px-4 py-2 rounded-md flex items-center">
            <span className="mr-2">&#8592;</span> Back
          </button>
          <div className="text-gray-600">
            Your remaining time to complete the ticket purchase... <FaClock className="inline text-amber-500" /> {formatTime(time)}

          </div>
        </div>

        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-blue-800 text-xl font-bold">Departure Travel Information</h2>
            <div className="flex items-center gap-2">
              <span>{departureDetails.from}</span>
              <span className="bg-blue-800 text-white p-1 rounded-sm">&#8652;</span>
              <span>{departureDetails.to}</span>
            </div>
          </div>
        </div>

        {/* Render DepartureInfo for each passenger */}
        {seatNumbers.map((seat, index) => (
          <div key={index} className="bg-white rounded-md shadow-sm p-4 mb-4 border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Passenger {index + 1}
            </h3>
            <DepartureInfo 
              seatNumber={seat} 
              passengerIndex={index} 
              departureDetails={departureDetails} 
              onPassengerChange={handlePassengerChange}
              tripType="departure"
            />
          </div>
        ))}

        {/* If it's round trip, show return information */}
        {departureDetails.tripType === "round" && (
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-red-800 text-xl font-bold">Return Travel Information</h2>
              <div className="flex items-center gap-2">
                <span>{departureDetails.to}</span>
                <span className="bg-red-800 text-white p-1 rounded-sm">&#8652;</span>
                <span>{departureDetails.from}</span>
              </div>
            </div>
          </div>
        )}

        {/* If it's round trip, render return DepartureInfo */}
        {departureDetails.tripType === "round" && seatNumbers.map((seat, index) => (
          <div key={index} className="bg-white rounded-md shadow-sm p-4 mb-4 border border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Passenger {index + 1}
            </h3>
            <DepartureInfo 
              seatNumber={seat} 
              passengerIndex={index} 
              departureDetails={departureDetails} 
              onPassengerChange={handlePassengerChange}
              tripType="return"
            />
          </div>
        ))}

        <TicketPurchase
          notifyBySMS={notifyBySMS}
          setNotifyBySMS={setNotifyBySMS}
          notifyByEmail={notifyByEmail}
          setNotifyByEmail={setNotifyByEmail}
          wantETicket={wantETicket}
          setWantETicket={setWantETicket}
        />
      </div>
      
      
      {/* Sidebar summary */}
      <div className="w-full lg:w-1/3">
        <TicketSum />

        <div className="bg-white rounded-md shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-600">SEAT SELECTION</div>
            <div className="text-green-500">EKONOMI</div>
          </div>

          <div className="mb-2">
            <div className="flex items-center mb-2">
              <input 
                type="radio" 
                id="auto-seat" 
                name="seatSelection" 
                checked={seatSelectionMethod === 'automatic'} 
                onChange={() => setSeatSelectionMethod('automatic')}
                className="mr-2" 
              />
              <label htmlFor="auto-seat" className="text-sm">I want to make seat selection automatically</label>
            </div>
            <div className="flex items-center">
              <input 
                type="radio" 
                id="manual-seat" 
                name="seatSelection" 
                checked={seatSelectionMethod === 'manual'} 
                onChange={() => setSeatSelectionMethod('manual')}
                className="mr-2" 
              />
              <label htmlFor="manual-seat" className="text-sm">I want to make seat selection manually</label>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <div className="border border-green-500 rounded-full px-4 py-1 text-green-500">
              {seatNumbers.join(', ')}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-gray-400">Amount to be Paid</div>
          </div>
          <div className="text-center text-2xl text-gray-700 mb-4">₺500,00</div>
          <button className="w-full bg-orange-500 text-white py-2 rounded-md">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
