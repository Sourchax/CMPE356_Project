import React, { useState, useEffect } from "react";
import { useClerk, useSession } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import "../assets/styles/voyageTimes.css";
import axios from "axios";
import { useTranslation } from "react-i18next";

const VoyageTimes = () => {
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    document.title = t('pageTitle.voyageTimes');
    
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.content = "width=device-width, initial-scale=1.0, viewport-fit=cover";
    }
  }, [t]);

  const { isSignedIn } = useSession();
  const navigate = useNavigate();

  const [voyages, setVoyages] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
    
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });

  const isVoyageExpired = (voyage) => {
    const voyageDate = new Date(voyage.departureDate);
    const currentDate = new Date();
    const voyageTime = voyage.departureTime;
  
    // Check if the voyage date is today
    const isToday = 
      voyageDate.getFullYear() === currentDate.getFullYear() &&
      voyageDate.getMonth() === currentDate.getMonth() &&
      voyageDate.getDate() === currentDate.getDate();
  
    // If it's today, check if the time has passed
    if (isToday) {
      const [voyageHours, voyageMinutes] = voyageTime.split(':').map(Number);
      const [currentHours, currentMinutes] = [
        currentDate.getHours(), 
        currentDate.getMinutes()
      ];
  
      // Compare time
      return (
        currentHours > voyageHours || 
        (currentHours === voyageHours && currentMinutes > voyageMinutes)
      );
    }
  
    // If not today, return false
    return false;
  };
  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");

  const API_BASE_URL = "http://localhost:8080";

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/stations/active`);
        setStations(response.data || []);
      } catch (err) {
        console.error("Error fetching stations:", err);
        setError(t("voyagePage.voyagesList.error"));
        setStations([]);
      }
    };

    fetchStations();
  }, [t]);

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
        // Handle empty array or undefined response
        setVoyages(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching voyages:", err);
        setError(t("voyagePage.voyagesList.error"));
        setVoyages([]);
        setLoading(false);
      }
    };

    if (stations.length > 0) {
      fetchVoyages();
    } else {
      // If there are no stations, don't try to fetch voyages
      setVoyages([]);
      setLoading(false);
    }
  }, [selectedFrom, selectedTo, stations, t]);

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

  const indexOfLastVoyage = currentPage * rowsPerPage;
  const indexOfFirstVoyage = indexOfLastVoyage - rowsPerPage;
  const paginatedVoyages = filteredVoyages.slice(indexOfFirstVoyage, indexOfLastVoyage);
  const totalPages = Math.ceil(filteredVoyages.length / rowsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); 
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFrom, selectedTo, startDate, endDate]);

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
    
    const statusText = isActive ? t("voyagePage.voyageTable.normal") : t("voyagePage.voyageTable.voyageCancel");
    
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
    const fuelText = fuel ? t("voyagePage.fuelType.lpg") : t("voyagePage.fuelType.noLpg");
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
    
    const options = {
      month: 'short',
      day: 'numeric'
    };
    
    const date = new Date(dateString);
    const locale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';
    
    return date.toLocaleDateString(locale, options);
  };

  return (
    <div className="voyage-page bg-gray-50">
      <div className="voyage-header bg-[#0D3A73]">
        <div className="voyage-container">
          <h1 className="text-white">{t("voyagePage.title")}</h1>
          <p className="text-[#06AED5]">{t("voyagePage.subtitle")}</p>
        </div>
      </div>
      
      <div className="voyage-container">
        <section className="voyage-section">
          <div className="filter-card">
            <div className="filter-header bg-[#D1FFD7]">
              <svg className="h-5 w-5 text-[#0D3A73]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              <span className="font-medium text-[#0D3A73]">{t("voyagePage.filterSection.title")}</span>
            </div>
            
            <div className="filter-body">
              <div className="filter-row">
                <div className="filter-group">
                  <label className="filter-label text-gray-700">{t("voyagePage.filterSection.departure")}</label>
                  <select 
                    value={selectedFrom} 
                    onChange={(e) => setSelectedFrom(e.target.value)}
                    className="filter-select focus:ring-[#06AED5] focus:border-[#06AED5]"
                  >
                    <option value="">{t("voyagePage.filterSection.allDepartures")}</option>
                    {stations.map(station => (
                      <option key={`from-${station.id}`} value={station.title}>{station.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label className="filter-label text-gray-700">{t("voyagePage.filterSection.arrival")}</label>
                  <select 
                    value={selectedTo} 
                    onChange={(e) => setSelectedTo(e.target.value)}
                    className="filter-select focus:ring-[#06AED5] focus:border-[#06AED5]"
                  >
                    <option value="">{t("voyagePage.filterSection.allArrivals")}</option>
                    {stations.map(station => (
                      <option key={`to-${station.id}`} value={station.title}>{station.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="filter-row mt-3">
                <div className="filter-group">
                  <label className="filter-label text-gray-700">{t("voyagePage.filterSection.startDate")}</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => handleDateChange(e, setStartDate)}
                    min={new Date().toISOString().split('T')[0]}
                    className="filter-input focus:ring-[#06AED5] focus:border-[#06AED5]"
                  />
                </div>
                
                <div className="filter-group">
                  <label className="filter-label text-gray-700">{t("voyagePage.filterSection.endDate")}</label>
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
              <h2 className="text-lg font-medium text-white">{t("voyagePage.voyagesList.title")}</h2>
            </div>
            
            {loading ? (
              <div className="voyages-empty">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06AED5]"></div>
                <p className="mt-4 text-gray-600">{t("voyagePage.voyagesList.loading")}</p>
              </div>
            ) : error ? (
              <div className="voyages-empty">
                <svg className="voyages-empty-icon text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-900">{t("voyagePage.voyagesList.error")}</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="primary"
                  size="md"
                  className="mt-4 voyage-button"
                >
                  {t("voyagePage.voyagesList.tryAgain")}
                </Button>
              </div>
            ) : filteredVoyages.length === 0 ? (
              <div className="voyages-empty">
                <svg className="voyages-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-sm font-medium text-gray-900">{t("voyagePage.voyagesList.noVoyages")}</h3>
                <p className="mt-1 text-sm text-gray-500">{t("voyagePage.voyagesList.adjustSearch")}</p>
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
                  {t("voyagePage.voyagesList.resetFilters")}
                </Button>
              </div>
            ) : (
              <>
                <div className="md:hidden p-4 space-y-3">
                  {paginatedVoyages.map((voyage, index) => (
                    <div 
                      key={index} 
                      className={`voyage-card ${voyage.status !== "active" ? "border-red-200 bg-red-50" : "border border-gray-200"}`}
                    >
                      {/* Keep the existing card content */}
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
                        {voyage.status === "active" && !isVoyageExpired(voyage) ? (
                          <Button
                            onClick={() => handleBuyTicket(voyage)}
                            variant="primary"
                            size="sm"
                            className="voyage-button"
                          >
                            {t("voyagePage.voyageTable.buyTicket")}
                          </Button>
                        ) : (
                          <span className="text-gray-400 text-sm">{t("voyagePage.voyageTable.notAvailable")}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="voyage-table-container hidden md:block">
                  <table className="voyage-table">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col">{t("voyagePage.voyageTable.voyage")}</th>
                        <th scope="col">{t("voyagePage.voyageTable.times")}</th>
                        <th scope="col">{t("voyagePage.voyageTable.date")}</th>
                        <th scope="col">{t("voyagePage.voyageTable.status")}</th>
                        <th scope="col">{t("voyagePage.voyageTable.shipType")}</th>
                        <th scope="col">{t("voyagePage.voyageTable.fuel")}</th>
                        <th scope="col">{t("voyagePage.voyageTable.action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedVoyages.map((voyage, index) => (
                        <tr 
                          key={index} 
                          className={`${voyage.status !== "active" ? "bg-red-50" : "hover:bg-gray-50"}`}
                        >
                          <td className="font-medium text-[#0D3A73]">
                            {voyage.fromStationTitle} - {voyage.toStationTitle}
                          </td>
                          <td className="text-gray-700">
                            <div>{t("voyagePage.voyageTable.dep")}: {formatTime(voyage.departureTime)}</div>
                            <div>{t("voyagePage.voyageTable.arr")}: {formatTime(voyage.arrivalTime)}</div>
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
                          {voyage.status === "active" && !isVoyageExpired(voyage) ? (
                            <Button
                              onClick={() => handleBuyTicket(voyage)}
                              variant="primary"
                              size="sm"
                              className="voyage-button"
                            >
                              {t("voyagePage.voyageTable.buyTicket")}
                            </Button>
                          ) : (
                            <span className="text-gray-400 text-sm">{t("voyagePage.voyageTable.notAvailable")}</span>
                          )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {filteredVoyages.length > 0 && (
              <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex flex-col sm:flex-row items-center justify-between w-full">
                  <div className="mb-4 sm:mb-0">
                    <p className="text-sm text-gray-700">
                      {t("voyagePage.pagination.showing")} <span className="font-medium">{indexOfFirstVoyage + 1}</span> {t("voyagePage.pagination.to")}{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastVoyage, filteredVoyages.length)}
                      </span>{" "}
                      {t("voyagePage.pagination.of")} <span className="font-medium">{filteredVoyages.length}</span> {t("voyagePage.pagination.results")}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center">
                    <div className="mb-4 sm:mb-0 sm:mr-4">
                      <select
                        className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#06AED5] focus:border-[#06AED5]"
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                      >
                        <option value={5}>5 {t("voyagePage.pagination.perPage")}</option>
                        <option value={10}>10 {t("voyagePage.pagination.perPage")}</option>
                        <option value={20}>20 {t("voyagePage.pagination.perPage")}</option>
                      </select>
                    </div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => paginate(1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">{t("voyagePage.pagination.first")}</span>
                        <span className="h-5 w-5 flex justify-center items-center">«</span>
                      </button>
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === 1 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">{t("voyagePage.pagination.previous")}</span>
                        <span className="h-5 w-5 flex justify-center items-center">‹</span>
                      </button>
                      
                      {/* Dynamic page buttons based on total pages */}
                      {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                        // Calculate page number to display based on current page
                        let pageNum;
                        if (totalPages <= 5) {
                          // If we have 5 or fewer pages, show all page numbers
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          // If we're near the start, show first 5 pages
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          // If we're near the end, show last 5 pages
                          pageNum = totalPages - 4 + i;
                        } else {
                          // Otherwise show current page with 2 pages on each side
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                              currentPage === pageNum
                                ? 'z-10 bg-[#06AED5] text-white'
                                : 'text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">{t("voyagePage.pagination.next")}</span>
                        <span className="h-5 w-5 flex justify-center items-center">›</span>
                      </button>
                      <button
                        onClick={() => paginate(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === totalPages 
                            ? 'text-gray-300 cursor-not-allowed' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">{t("voyagePage.pagination.last")}</span>
                        <span className="h-5 w-5 flex justify-center items-center">»</span>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default VoyageTimes;