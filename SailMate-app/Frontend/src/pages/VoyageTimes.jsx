import React, { useState } from "react";
import { useClerk, useSession } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const VoyageTimes = () => {
  const allVoyages = [
    { departure: "07:00", arrival: "07:45", date: "2025-03-10", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Yenikapı" },
    { departure: "08:00", arrival: "08:45", date: "2025-03-10", status: "Voyage Cancel", type: "Sea Bus", fuel: "No LPG", available: false, from: "Bandırma", to: "Yenikapı" },
    { departure: "09:00", arrival: "09:45", date: "2025-03-10", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Bursa", to: "Yalova" },
    { departure: "11:00", arrival: "11:45", date: "2025-03-10", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Yenikapı", to: "Yalova" },
    { departure: "13:00", arrival: "13:45", date: "2025-03-10", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Bandırma", to: "Bursa" },
    { departure: "15:00", arrival: "15:45", date: "2025-03-10", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Yenikapı", to: "Bandırma" },
    { departure: "07:00", arrival: "07:45", date: "2025-03-11", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Bursa" },
    { departure: "08:00", arrival: "08:45", date: "2025-03-11", status: "Voyage Cancel", type: "Sea Bus", fuel: "No LPG", available: false, from: "Bursa", to: "Yenikapı" },
    { departure: "09:00", arrival: "09:45", date: "2025-03-11", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Bandırma", to: "Yalova" },
    { departure: "11:00", arrival: "11:45", date: "2025-03-11", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Yenikapı", to: "Bandırma" },
    { departure: "13:00", arrival: "13:45", date: "2025-03-11", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Yenikapı" },
    { departure: "15:00", arrival: "15:45", date: "2025-03-11", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Bursa", to: "Yenikapı" },
    { departure: "15:00", arrival: "15:45", date: "2025-03-12", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Bandırma", to: "Bursa" },
    { departure: "07:00", arrival: "07:45", date: "2025-03-12", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Yenikapı" },
    { departure: "08:00", arrival: "08:45", date: "2025-03-12", status: "Voyage Cancel", type: "Sea Bus", fuel: "No LPG", available: false, from: "Bandırma", to: "Yenikapı" },
    { departure: "09:00", arrival: "09:45", date: "2025-03-12", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Bursa", to: "Yalova" },
    { departure: "11:00", arrival: "11:45", date: "2025-03-12", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Yenikapı", to: "Yalova" },
    { departure: "13:00", arrival: "13:45", date: "2025-03-12", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Bandırma", to: "Bursa" },
    { departure: "15:00", arrival: "15:45", date: "2025-03-12", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Yenikapı", to: "Bandırma" },
  ];

  const { isSignedIn } = useSession();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("2025-03-10");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");

  const filteredVoyages = allVoyages.filter((voyage) =>
    (selectedDate === "" || voyage.date === selectedDate) &&
    (selectedFrom === "" || voyage.from === selectedFrom) &&
    (selectedTo === "" || voyage.to === selectedTo)
  );

  const handleBuyTicket = (voyage) => {
    if (!isSignedIn) {
      navigate("/sign-in");
    } else {
      // Navigate to homepage with voyage data in state
      navigate("/", { 
        state: { 
          voyage,
          from: 'voyage-times' // For route protection
        }
      });
    }
  };

  // Status badge component with new color scheme
  const StatusBadge = ({ status }) => {
    const colorClass = status === "Normal" 
      ? "bg-white/90 text-[#0D3A73] border border-[#0D3A73]" 
      : "bg-red-100 text-red-800 border border-red-200";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass} inline-flex items-center`}>
        {status === "Normal" && (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
        {status !== "Normal" && (
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        )}
        {status}
      </span>
    );
  };

  // Fuel badge component with new color scheme
  const FuelBadge = ({ fuel }) => {
    const colorClass = fuel === "LPG" 
      ? "bg-[#0D3A73] text-white" 
      : "bg-[#F0C808] text-[#0D3A73]";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {fuel}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-white">
      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-cover bg-center z-0" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
      </div>
      
      {/* Wave Transition */}
      <div className="absolute top-[35vh] left-0 w-full h-[10vh] z-[1] overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"
             className="absolute w-full h-full fill-white">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="relative z-10 mt-[20vh] px-4 container mx-auto">
        {/* Header */}
        <div className="text-center text-white mb-5 animate-[fadeIn_0.8s_ease-out]">
          <h1 className="text-4xl font-bold mb-1">SailMate Voyages</h1>
          <p className="text-base opacity-90 max-w-[600px] mx-auto">Find and book your next sea journey</p>
        </div>
      
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-5 mb-6 animate-[fadeIn_1s_ease-out]">
          <div className="border-b border-[#0D3A73]/20 pb-3 mb-4">
            <span className="font-medium text-[#0D3A73] flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Find Your Voyage
            </span>
          </div>
          
          <div className="p-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                <select 
                  value={selectedFrom} 
                  onChange={(e) => setSelectedFrom(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-[#0D3A73] focus:border-[#0D3A73]"
                >
                  <option value="">All Departures</option>
                  <option value="Yalova">Yalova</option>
                  <option value="Bandırma">Bandırma</option>
                  <option value="Yenikapı">Yenikapı</option>
                  <option value="Bursa">Bursa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Arrival</label>
                <select 
                  value={selectedTo} 
                  onChange={(e) => setSelectedTo(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-[#0D3A73] focus:border-[#0D3A73]"
                >
                  <option value="">All Arrivals</option>
                  <option value="Yalova">Yalova</option>
                  <option value="Bandırma">Bandırma</option>
                  <option value="Yenikapı">Yenikapı</option>
                  <option value="Bursa">Bursa</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-[#0D3A73] focus:border-[#0D3A73]"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Voyage List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8 animate-[fadeIn_1.2s_ease-out]">
          <div className="px-4 py-3 border-b bg-[#0D3A73]">
            <h2 className="text-lg font-medium text-white">Available Voyages</h2>
          </div>
          
          {filteredVoyages.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No voyages found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
              <button
                onClick={() => {
                  setSelectedFrom("");
                  setSelectedTo("");
                  setSelectedDate("2025-03-10");
                }}
                className="mt-4 px-4 py-2 rounded-md bg-white text-[#0D3A73] border border-[#0D3A73] hover:bg-[#0D3A73] hover:text-white transition-colors duration-300"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile view (card-based) */}
              <div className="md:hidden px-4 py-4 space-y-4">
                {filteredVoyages.map((voyage, index) => (
                  <div 
                    key={index} 
                    className={`rounded-lg border p-4 ${voyage.status === "Voyage Cancel" ? "border-red-200 bg-red-50" : "border-gray-200 hover:border-[#0D3A73]/50"}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-[#0D3A73]">{voyage.from} to {voyage.to}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(voyage.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <StatusBadge status={voyage.status} />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>{voyage.departure} - {voyage.arrival}</div>
                      {voyage.available ? (
                        <button
                          onClick={() => handleBuyTicket(voyage)}
                          className="px-3 py-1 rounded-md text-white bg-[#0D3A73] hover:bg-[#06AED5] transition-colors duration-300 shadow-sm"
                        >
                          Buy Ticket
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">Not Available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Desktop view (table-based) */}
              <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Voyage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Times
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ship Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fuel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVoyages.map((voyage, index) => (
                    <tr 
                      key={index} 
                      className={`${voyage.status === "Voyage Cancel" ? "bg-red-50" : "hover:bg-gray-50"}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#0D3A73]">
                        {voyage.from} - {voyage.to}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>Dep: {voyage.departure}</div>
                        <div>Arr: {voyage.arrival}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {new Date(voyage.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={voyage.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {voyage.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <FuelBadge fuel={voyage.fuel} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {voyage.available ? (
                          <button
                            onClick={() => handleBuyTicket(voyage)}
                            className="px-3 py-2 rounded-md text-white bg-[#0D3A73] hover:bg-[#06AED5] transition-colors duration-300 shadow-sm"
                          >
                            Buy Ticket
                          </button>
                        ) : (
                          <span className="text-gray-400">Not Available</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoyageTimes;