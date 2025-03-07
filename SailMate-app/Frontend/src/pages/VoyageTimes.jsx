import React, { useState, useEffect } from "react";
import { useClerk, useSession } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../assets/styles/voyageTimes.css";

const VoyageTimes = () => {
  // Set up viewport and document title
  useEffect(() => {
    // Set page title
    document.title = "Voyage Times | SailMate";
    
    // Ensure proper viewport settings for responsive scaling
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.content = "width=device-width, initial-scale=1.0, viewport-fit=cover";
    }
  }, []);

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
      <span className={`status-badge ${colorClass}`}>
        {status === "Normal" && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
        {status !== "Normal" && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <span className={`fuel-badge ${colorClass}`}>
        {fuel}
      </span>
    );
  };

  return (
    <div className="voyage-page bg-gray-50">
      {/* Header */}
      <div className="voyage-header bg-[#0D3A73]">
        <div className="voyage-container">
          <h1 className="text-white">SailMate Voyages</h1>
          <p className="text-[#06AED5]">Find and book your next sea journey</p>
        </div>
      </div>
      
      <div className="voyage-container">
        {/* Filter Section */}
        <section className="voyage-section">
          <div className="filter-card">
            <div className="filter-header bg-[#D1FFD7]">
              <svg className="h-5 w-5 text-[#0D3A73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span className="font-medium text-[#0D3A73]">Find Your Voyage</span>
            </div>
            
            <div className="filter-body">
              <div className="filter-row">
                <div className="filter-group">
                  <label className="filter-label text-gray-700">Departure</label>
                  <select 
                    value={selectedFrom} 
                    onChange={(e) => setSelectedFrom(e.target.value)}
                    className="filter-select focus:ring-[#06AED5] focus:border-[#06AED5]"
                  >
                    <option value="">All Departures</option>
                    <option value="Yalova">Yalova</option>
                    <option value="Bandırma">Bandırma</option>
                    <option value="Yenikapı">Yenikapı</option>
                    <option value="Bursa">Bursa</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label text-gray-700">Arrival</label>
                  <select 
                    value={selectedTo} 
                    onChange={(e) => setSelectedTo(e.target.value)}
                    className="filter-select focus:ring-[#06AED5] focus:border-[#06AED5]"
                  >
                    <option value="">All Arrivals</option>
                    <option value="Yalova">Yalova</option>
                    <option value="Bandırma">Bandırma</option>
                    <option value="Yenikapı">Yenikapı</option>
                    <option value="Bursa">Bursa</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label text-gray-700">Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="filter-input focus:ring-[#06AED5] focus:border-[#06AED5]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Voyage List */}
        <section className="voyage-section">
          <div className="voyages-card">
            <div className="voyages-header bg-[#06AED5]">
              <h2 className="text-lg font-medium text-white">Available Voyages</h2>
            </div>
            
            {filteredVoyages.length === 0 ? (
              <div className="voyages-empty">
                <svg className="voyages-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-900">No voyages found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria</p>
                <Button
                  onClick={() => {
                    setSelectedFrom("");
                    setSelectedTo("");
                    setSelectedDate("2025-03-10");
                  }}
                  variant="primary"
                  size="md"
                  className="mt-4 voyage-button"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Mobile view (card-based) */}
                <div className="md:hidden p-4 space-y-3">
                  {filteredVoyages.map((voyage, index) => (
                    <div 
                      key={index} 
                      className={`voyage-card ${voyage.status === "Voyage Cancel" ? "border-red-200 bg-red-50" : "border border-gray-200"}`}
                    >
                      <div className="voyage-row">
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
                      
                      <div className="voyage-row">
                        <div>{voyage.departure} - {voyage.arrival}</div>
                        {voyage.available ? (
                          <Button
                            onClick={() => handleBuyTicket(voyage)}
                            variant="primary"
                            size="sm"
                            className="voyage-button"
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
                <div className="voyage-table-container hidden md:block">
                  <table className="voyage-table">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col">Voyage</th>
                        <th scope="col">Times</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col">Ship Type</th>
                        <th scope="col">Fuel</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVoyages.map((voyage, index) => (
                        <tr 
                          key={index} 
                          className={`${voyage.status === "Voyage Cancel" ? "bg-red-50" : "hover:bg-gray-50"}`}
                        >
                          <td className="font-medium text-[#0D3A73]">
                            {voyage.from} - {voyage.to}
                          </td>
                          <td className="text-gray-700">
                            <div>Dep: {voyage.departure}</div>
                            <div>Arr: {voyage.arrival}</div>
                          </td>
                          <td className="text-gray-700">
                            {new Date(voyage.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td>
                            <StatusBadge status={voyage.status} />
                          </td>
                          <td className="text-gray-700">
                            {voyage.type}
                          </td>
                          <td>
                            <FuelBadge fuel={voyage.fuel} />
                          </td>
                          <td>
                            {voyage.available ? (
                              <Button
                                onClick={() => handleBuyTicket(voyage)}
                                variant="primary"
                                size="sm"
                                className="voyage-button"
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
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VoyageTimes;