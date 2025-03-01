import React, { useState } from "react";
import { useClerk, useSession } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const VoyageTimes = () => {
  const allVoyages = [
    { departure: "07:00", arrival: "07:45", date: "2025-02-22", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "08:00", arrival: "08:45", date: "2025-02-22", status: "Voyage Cancel", type: "Sea Bus", fuel: "No LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "09:00", arrival: "09:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Yalova", to: "Pendik" },
    { departure: "11:00", arrival: "11:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Istanbul", to: "Yalova" },
    { departure: "13:00", arrival: "13:45", date: "2025-02-22", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "15:00", arrival: "15:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Istanbul", to: "Pendik" },
    { departure: "07:00", arrival: "07:45", date: "2025-02-22", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "08:00", arrival: "08:45", date: "2025-02-22", status: "Voyage Cancel", type: "Sea Bus", fuel: "No LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "09:00", arrival: "09:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Yalova", to: "Pendik" },
    { departure: "11:00", arrival: "11:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Istanbul", to: "Yalova" },
    { departure: "13:00", arrival: "13:45", date: "2025-02-22", status: "Voyage Cancel", type: "Fast Ferry FC", fuel: "LPG", available: false, from: "Yalova", to: "Pendik" },
    { departure: "15:00", arrival: "15:45", date: "2025-02-22", status: "Normal", type: "Fast Ferry FC", fuel: "LPG", available: true, from: "Istanbul", to: "Pendik" },
  ];

  const { isSignedIn } = useSession();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState("2025-02-22");
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");

  const filteredVoyages = allVoyages.filter((voyage) =>
    (selectedDate === "" || voyage.date === selectedDate) &&
    (selectedFrom === "" || voyage.from === selectedFrom) &&
    (selectedTo === "" || voyage.to === selectedTo)
  );

  const handleBuyTicket = () => {
    if (!isSignedIn) {
      navigate("/sign-in");
    } else {
      navigate("/homepage");
    }
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const colorClass = status === "Normal" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {status}
      </span>
    );
  };

  // Fuel badge component
  const FuelBadge = ({ fuel }) => {
    const colorClass = fuel === "LPG" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-yellow-100 text-yellow-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {fuel}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SailMate Voyages</h1>
        <p className="mt-2 text-sm text-gray-500">Find and book your next sea journey</p>
      </div>
      
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center p-4 border-b border-gray-200 bg-blue-50 rounded-t-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium text-blue-900">Voyage Filter</span>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
              <select 
                value={selectedFrom} 
                onChange={(e) => setSelectedFrom(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Departures</option>
                <option value="Yalova">Yalova</option>
                <option value="Istanbul">Istanbul</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Arrival</label>
              <select 
                value={selectedTo} 
                onChange={(e) => setSelectedTo(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Arrivals</option>
                <option value="Pendik">Pendik</option>
                <option value="Yalova">Yalova</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Voyage List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Voyage List</h2>
        </div>
        
        {filteredVoyages.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No voyages found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
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
                    className={voyage.status === "Voyage Cancel" ? "bg-red-50" : ""}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <div className="flex items-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5 text-blue-500 mr-2" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M6 3.5A3.5 3.5 0 019.5 0h1A3.5 3.5 0 0114 3.5v.5h1.5a3 3 0 013 3v10a3 3 0 01-3 3h-9a3 3 0 01-3-3V7a3 3 0 013-3H6v-.5zm7 0a2 2 0 00-2-2h-1a2 2 0 00-2 2v.5h5v-.5z" clipRule="evenodd" />
                        </svg>
                        {voyage.from} - {voyage.to}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          <span>Dep: {voyage.departure}</span>
                        </div>
                        <div className="flex items-center mt-1">
                          <svg className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          <span>Arr: {voyage.arrival}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(voyage.date).toLocaleDateString('en-US', {
                        year: 'numeric',
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
                          onClick={handleBuyTicket}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                          </svg>
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
  );
};

export default VoyageTimes;