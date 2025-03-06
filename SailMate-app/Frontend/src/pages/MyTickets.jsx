import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Remove CSS import as we'll be using Tailwind
import "../assets/styles/mytickets.css";
// Add import for Button component
import Button from "../components/Button";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate API call to fetch user's tickets
    setLoading(true);
    setTimeout(() => {
      // Mock data - in a real app, this would come from an API
      const mockTickets = [
        {
          id: "TKT-2023-001",
          route: "Istanbul - Bursa",
          departureDate: "2023-07-15",
          departureTime: "09:30",
          passenger: "John Doe",
          seat: "A12",
          status: "Active",
          price: "$25.00"
        },
        {
          id: "TKT-2023-002",
          route: "Bursa - Istanbul",
          departureDate: "2023-07-20",
          departureTime: "14:45",
          passenger: "John Doe",
          seat: "B08",
          status: "Active",
          price: "$25.00"
        },
        {
          id: "TKT-2023-003",
          route: "Istanbul - Yalova",
          departureDate: "2023-06-10",
          departureTime: "10:15",
          passenger: "John Doe",
          seat: "C04",
          status: "Completed",
          price: "$18.50"
        }
      ];
      
      setTickets(mockTickets);
      setLoading(false);
    }, 1500);
  }, []);

  const handleViewDetails = (ticketId) => {
    // In a real app, this would navigate to a ticket details page
    alert(`Viewing details for ticket ${ticketId}`);
  };

  const handleDownloadTicket = (ticketId) => {
    // In a real app, this would trigger a ticket download
    alert(`Downloading ticket ${ticketId}`);
  };

  const navigateToContact = () => {
    navigate("/contact");
  };

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
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="inline-block w-[50px] h-[50px] border-4 border-[rgba(0,47,108,0.1)] rounded-full border-t-[#0D3A73] animate-spin mb-4"></div>
              <p className="text-gray-600">Loading your tickets...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              <p className="text-gray-600 mb-8">There was an error loading your tickets. Please try again.</p>
              <Button 
                onClick={() => window.location.reload()} 
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
            <div className="flex flex-col gap-6">
              {tickets.map((ticket) => (
                <div key={ticket.id} 
                     className="rounded-lg shadow-sm overflow-hidden border border-[#f0f0f0] transition-all duration-300 hover:translate-y-[-3px] hover:shadow-lg">
                  <div className="bg-gray-50 p-4 flex justify-between items-center border-b border-[#eaeaea]">
                    <h3 className="text-lg font-medium text-gray-800">{ticket.route}</h3>
                    <span className={`${
                      ticket.status.toLowerCase() === 'active' ? 'bg-green-100 text-green-800' :
                      ticket.status.toLowerCase() === 'completed' ? 'bg-blue-100 text-blue-800' : 
                      'bg-gray-100 text-gray-800'
                    } px-3 py-1 rounded-full text-sm font-medium`}>
                      {ticket.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between p-4">
                    <div className="space-y-2 md:flex-1">
                      <p className="text-gray-600"><span className="font-medium text-gray-700">Ticket ID:</span> {ticket.id}</p>
                      <p className="text-gray-600"><span className="font-medium text-gray-700">Departure:</span> {ticket.departureDate}, {ticket.departureTime}</p>
                      <p className="text-gray-600"><span className="font-medium text-gray-700">Passenger:</span> {ticket.passenger}</p>
                      <p className="text-gray-600"><span className="font-medium text-gray-700">Seat:</span> {ticket.seat}</p>
                      <p className="text-gray-600"><span className="font-medium text-gray-700">Price:</span> {ticket.price}</p>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
};

export default MyTickets; 