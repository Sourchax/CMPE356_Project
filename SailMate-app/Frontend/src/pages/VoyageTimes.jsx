import React, { useState } from "react";
import { useClerk, useSession } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

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
      ? "bg-[#D1FFD7] text-[#0D3A73]" 
      : "bg-red-100 text-red-800";
    
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
      ? "bg-[#06AED5] text-white" 
      : "bg-[#F0C808] text-[#0D3A73]";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {fuel}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-[#0D3A73] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">SailMate Voyages</h1>
          <p className="text-[#06AED5]">Find and book your next sea journey</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b bg-[#D1FFD7]">
            <span className="font-medium text-[#0D3A73] flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Find Your Voyage
            </span>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                <select 
                  value={selectedFrom} 
                  onChange={(e) => setSelectedFrom(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-[#06AED5] focus:border-[#06AED5]"
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
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-[#06AED5] focus:border-[#06AED5]"
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
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-[#06AED5] focus:border-[#06AED5]"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Voyage List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-3 border-b bg-[#06AED5]">
            <h2 className="text-lg font-medium text-white">Available Voyages</h2>
          </div>
          
          {filteredVoyages.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No voyages found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
              <Button
                onClick={() => {
                  setSelectedFrom("");
                  setSelectedTo("");
                  setSelectedDate("2025-02-22");
                }}
                variant="primary"
                size="md"
                className="mt-4"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Mobile view (card-based) */}
              <div className="md:hidden px-4 py-4 space-y-4">
                {filteredVoyages.map((voyage, index) => (
                  <div 
                    key={index} 
                    className={`rounded-lg border p-4 ${voyage.status === "Voyage Cancel" ? "border-red-200 bg-red-50" : "border-gray-200"}`}
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
                        <Button
                          onClick={() => handleBuyTicket(voyage)}
                          variant="primary"
                          size="sm"
                        >
                          Buy Ticket
                        </Button>
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
                          <Button
                            onClick={() => handleBuyTicket(voyage)}
                            variant="primary"
                            size="sm"
                          >
                            Buy Ticket
                          </Button>
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