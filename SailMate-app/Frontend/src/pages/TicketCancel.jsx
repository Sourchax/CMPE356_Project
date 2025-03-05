import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const TicketCancel = () => {
  const [ticketId, setTicketId] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowConfirmation(true);
    }, 1500);
  };

  const handleConfirm = () => {
    setLoading(true);
    
    // Simulate API call for actual cancellation
    setTimeout(() => {
      setLoading(false);
      alert("Your ticket has been successfully cancelled. A confirmation email will be sent shortly.");
      // Reset form
      setTicketId("");
      setEmail("");
      setReason("");
      setShowConfirmation(false);
    }, 1500);
  };

  const navigateToContact = () => {
    navigate("/contact");
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
          <h1 className="text-4xl font-bold mb-1 font-sans">Cancel Your Ticket</h1>
          <p className="text-base opacity-90 max-w-[600px] mx-auto font-sans">We're sorry you need to cancel. Please enter your ticket details below.</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg w-full max-w-[500px] p-6 mb-8 animate-[fadeIn_1s_ease-out]">
          {!showConfirmation ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="ticket-id" className="block text-sm font-medium text-gray-700 font-sans">
                  Ticket ID / Reservation Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-ticket-alt text-gray-400"></i>
                  </div>
                  <input 
                    type="text" 
                    id="ticket-id" 
                    value={ticketId}
                    onChange={(e) => setTicketId(e.target.value)}
                    placeholder="Enter your ticket ID" 
                    required 
                    className="pl-10 w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:outline-none font-sans"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400"></i>
                  </div>
                  <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter the email used for booking" 
                    required 
                    className="pl-10 w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:outline-none font-sans"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 font-sans">
                  Reason for Cancellation (Optional)
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 text-gray-400">
                    <i className="fas fa-comment-alt"></i>
                  </div>
                  <textarea 
                    id="reason" 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please let us know why you're cancelling" 
                    rows="3"
                    className="pl-10 w-full py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:outline-none resize-none font-sans"
                  ></textarea>
                </div>
              </div>
              
              <button 
                type="submit" 
                className={`w-full bg-[#0D3A73] hover:bg-[#06AED5] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-sans ${loading ? 'relative' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  </div>
                ) : (
                  'Continue to Cancel'
                )}
              </button>
              
              <div className="bg-blue-50 text-blue-700 p-4 rounded-md mt-4">
                <p className="flex items-start text-sm text-gray-600 font-sans">
                  <i className="fas fa-info-circle mt-0.5 mr-2 text-[#0D3A73]"></i>
                  <span>Please note: Cancellation fees may apply depending on your ticket type and how close to departure you are cancelling.</span>
                </p>
              </div>
            </form>
          ) : (
            <div className="animate-[fadeIn_0.5s_ease-out]">
              <div className="flex flex-col items-center pb-4 border-b border-gray-200">
                <div className="text-yellow-500 text-4xl mb-3">
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 font-sans">Confirm Cancellation</h2>
              </div>
              
              <div className="py-4">
                <p className="text-center text-gray-600 mb-4 font-sans">Are you sure you want to cancel your ticket?</p>
                <div className="bg-gray-50 rounded-md p-4 space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-sans">Ticket ID:</span>
                    <span className="font-medium text-gray-700 font-sans">{ticketId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-sans">Email:</span>
                    <span className="font-medium text-gray-700 font-sans">{email}</span>
                  </div>
                </div>
                <p className="text-red-600 text-sm italic font-sans">This action cannot be undone. Refund policies will apply according to your ticket terms.</p>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={() => setShowConfirmation(false)} 
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 transition-all duration-300 font-sans"
                  disabled={loading}
                >
                  Go Back
                </button>
                <button 
                  onClick={handleConfirm} 
                  className={`flex-1 bg-[#0D3A73] hover:bg-[#06AED5] text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg font-medium transition-all duration-300 font-sans ${loading ? 'relative' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    'Confirm Cancellation'
                  )}
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center text-gray-600">
            <p className="font-sans">
              Need help?{" "}
              <span 
                onClick={navigateToContact} 
                className="text-[#0D3A73] font-medium hover:text-[#06AED5] underline cursor-pointer transition-colors duration-300 font-sans"
              >
                Contact our support team
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCancel;