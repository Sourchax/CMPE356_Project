import React, { useState, useEffect } from "react";
import { useClerk, useSession } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../assets/styles/voyageTimes.css";
import axios from "axios";

const VoyageTimes = () => {
  useEffect(() => {
    document.title = "Voyage Times | SailMate";
    
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.content = "width=device-width, initial-scale=1.0, viewport-fit=cover";
    }
  }, []);

  const { isSignedIn } = useSession();
  const navigate = useNavigate();

  const [voyages, setVoyages] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");

  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/stations/active`);
        setStations(response.data);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError("Failed to load stations. Please try again later.");
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    const fetchVoyages = async () => {
      setLoading(true);
      try {
        let url;
        
        if (selectedFrom && selectedTo) {
          const fromStation = stations.find(station => station.title === selectedFrom);
          const toStation = stations.find(station => station.title === selectedTo);
          
          if (fromStation && toStation) {
            url = `${API_BASE_URL}/api/voyages/future`;
          } else {
            url = `${API_BASE_URL}/api/voyages/future`;
          }
        } else {
          url = `${API_BASE_URL}/api/voyages/future`;
        }
        
        const response = await axios.get(url);
        setVoyages(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching voyages:", err);
        setError("Failed to load voyages. Please try again later.");
        setLoading(false);
      }
    };

    if (stations.length > 0) {
      fetchVoyages();
    }
  }, [selectedFrom, selectedTo, stations]);

  const handleDateChange = (e, setter) => {
    const newDate = e.target.value;
    setter(newDate);
    
    // Ensure end date is not before start date
    if (setter === setStartDate && newDate > endDate) {
      setEndDate(newDate);
    }
    
    // Ensure start date is not after end date
    if (setter === setEndDate && newDate < startDate) {
      setStartDate(newDate);
    }
  };

  const filteredVoyages = voyages.filter((voyage) => {
    // Filter by date range
    const voyageDate = voyage.departureDate;
    const dateInRange = voyageDate >= startDate && voyageDate <= endDate;
    
    // Filter by from station if selected
    const fromMatch = !selectedFrom || voyage.fromStationTitle === selectedFrom;
    
    // Filter by to station if selected
    const toMatch = !selectedTo || voyage.toStationTitle === selectedTo;
    
    return dateInRange && fromMatch && toMatch;
  });

  const handleBuyTicket = (voyage) => {
    if (!isSignedIn) {
      navigate("/sign-in");
    } else {
      navigate("/", { 
        state: { 
          voyage,
          from: 'voyage-times'
        }
      });
    }
  };

  const StatusBadge = ({ status }) => {
    const isActive = status === "active";
    const colorClass = isActive 
      ? "bg-[#D1FFD7] text-[#0D3A73]" 
      : "bg-red-100 text-red-800";
    
    const statusText = isActive ? "Normal" : "Voyage Cancel";
    
    return (
      <span className={`status-badge ${colorClass}`}>
        {isActive && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        )}
        {!isActive && (
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        )}
        {statusText}
      </span>
    );
  };

  const FuelBadge = ({ fuel }) => {
    const fuelText = fuel ? "LPG" : "No LPG";
    const colorClass = fuel 
      ? "bg-[#06AED5] text-white" 
      : "bg-[#F0C808] text-[#0D3A73]";
    
    return (
      <span className={`fuel-badge ${colorClass}`}>
        {fuelText}
      </span>
    );
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time.substring(0, 5);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="voyage-page bg-gray-50">
      <div className="voyage-header bg-[#0D3A73]">
        <div className="voyage-container">
          <h1 className="text-white">SailMate Voyages</h1>
          <p className="text-[#06AED5]">Find and book your next sea journey</p>
        </div>
      </div>
      
      <div className="voyage-container">
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
                    {stations.map(station => (
                      <option key={`from-${station.id}`} value={station.title}>{station.title}</option>
                    ))}
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
                    {stations.map(station => (
                      <option key={`to-${station.id}`} value={station.title}>{station.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="filter-row mt-3">
                <div className="filter-group">
                  <label className="filter-label text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange(e, setStartDate)}
                    min={new Date().toISOString().split('T')[0]}
                    className="filter-input focus:ring-[#06AED5] focus:border-[#06AED5]"
                  />
                </div>
                
                <div className="filter-group">
                  <label className="filter-label text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => handleDateChange(e, setEndDate)}
                    min={startDate}
                    className="filter-input focus:ring-[#06AED5] focus:border-[#06AED5]"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="voyage-section">
          <div className="voyages-card">
            <div className="voyages-header bg-[#06AED5]">
              <h2 className="text-lg font-medium text-white">Available Voyages</h2>
            </div>
            
            {loading ? (
              <div className="voyages-empty">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06AED5]"></div>
                <p className="mt-4 text-gray-600">Loading voyages...</p>
              </div>
            ) : error ? (
              <div className="voyages-empty">
                <svg className="voyages-empty-icon text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-900">Error loading voyages</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="primary"
                  size="md"
                  className="mt-4 voyage-button"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredVoyages.length === 0 ? (
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
                    const today = new Date().toISOString().split('T')[0];
                    setStartDate(today);
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    setEndDate(nextWeek.toISOString().split('T')[0]);
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
                <div className="md:hidden p-4 space-y-3">
                  {filteredVoyages.map((voyage, index) => (
                    <div 
                      key={index} 
                      className={`voyage-card ${voyage.status !== "active" ? "border-red-200 bg-red-50" : "border border-gray-200"}`}
                    >
                      <div className="voyage-row">
                        <div>
                          <div className="font-medium text-[#0D3A73]">{voyage.fromStationTitle} to {voyage.toStationTitle}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(voyage.departureDate)}
                          </div>
                        </div>
                        <StatusBadge status={voyage.status} />
                      </div>
                      
                      <div className="voyage-row">
                        <div>{formatTime(voyage.departureTime)} - {formatTime(voyage.arrivalTime)}</div>
                        {voyage.status === "active" ? (
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
                          className={`${voyage.status !== "active" ? "bg-red-50" : "hover:bg-gray-50"}`}
                        >
                          <td className="font-medium text-[#0D3A73]">
                            {voyage.fromStationTitle} - {voyage.toStationTitle}
                          </td>
                          <td className="text-gray-700">
                            <div>Dep: {formatTime(voyage.departureTime)}</div>
                            <div>Arr: {formatTime(voyage.arrivalTime)}</div>
                          </td>
                          <td className="text-gray-700">
                            {formatDate(voyage.departureDate)}
                          </td>
                          <td>
                            <StatusBadge status={voyage.status} />
                          </td>
                          <td className="text-gray-700">
                            {voyage.shipType || "Fast Ferry FC"}
                          </td>
                          <td>
                            <FuelBadge fuel={voyage.fuelType} />
                          </td>
                          <td>
                            {voyage.status === "active" ? (
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