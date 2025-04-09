import { useState, useEffect } from "react";
import { MapPin, Phone, User, ExternalLink } from "lucide-react";
import axios from "axios";
import { useTranslation } from 'react-i18next';

export default function StationCard() {
  const { t, i18n } = useTranslation();
  const [stations, setStations] = useState([]);
  const [filter, setFilter] = useState(t('common.all'));
  const [animateCards, setAnimateCards] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Update filter when language changes
  useEffect(() => {
    setFilter(t('common.all'));
  }, [i18n.language, t]);
  
  // Fetch stations from API
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/stations");
        setStations(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stations:", error);
        setLoading(false);
      }
    };
    
    fetchStations();
  }, []);
  
  useEffect(() => {
    // Trigger animation after filter change
    setAnimateCards(false);
    setTimeout(() => setAnimateCards(true), 50);
  }, [filter]);

  const filteredStations = filter === t('common.all') ? stations : stations.filter((s) => s.city === filter);
  const cities = [t('common.all'), ...new Set(stations.map(station => station.city))];

  return (
    <div className="flex flex-col items-center px-4 py-12 min-h-screen bg-gradient-to-b from-white to-[#D1FFD7]">
      {/* Header with wave */}
      <div className="relative w-full max-w-6xl mb-16">
        <div className="absolute inset-0 bg-[#0D3A73] rounded-3xl opacity-10"></div>
        <div className="relative z-10 flex flex-col items-center py-10 px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0D3A73] mb-2">{t('stationsPage.title')}</h1>
          <p className="text-[#06AED5] text-lg md:text-xl max-w-2xl text-center">
            {t('stationsPage.subtitle')}
          </p>
          
          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-8 overflow-hidden">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
              <path 
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C115.39,33.9,195.72,60.15,321.39,56.44Z" 
                className="fill-white"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-12 flex flex-wrap justify-center gap-3">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setFilter(city)}
            className={`px-6 py-3 text-base font-medium rounded-full transition-all duration-300 transform 
              ${
                filter === city
                  ? "bg-[#0D3A73] text-white shadow-lg scale-105"
                  : "bg-white text-[#0D3A73] border border-[#0D3A73] hover:bg-[#06AED5] hover:text-white hover:border-[#06AED5]"
              }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Station Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {filteredStations.map((station, index) => (
          <div
            key={station.id}
            className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 transform 
              ${animateCards ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
              hover:shadow-2xl`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Card Header */}
            <div className="bg-[#0D3A73] py-4 px-6 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F0C808] rounded-full opacity-20 transform translate-x-8 -translate-y-10"></div>
              <h2 className="text-xl font-bold text-white relative z-10">{station.title}</h2>
              <p className="text-[#D1FFD7] text-sm relative z-10">{station.city}, {t('stationsPage.turkeyText')}</p>
            </div>
            
            {/* Card Content */}
            <div className="p-6">
              <div className="flex items-center mb-3">
                <User size={18} className="text-[#06AED5] mr-3" />
                <p className="text-gray-700">{station.personnel}</p>
              </div>
              <div className="flex items-center mb-3">
                <Phone size={18} className="text-[#06AED5] mr-3" />
                <p className="text-gray-700">{station.phoneno}</p>
              </div>
              <div className="flex items-start mb-6">
                <MapPin size={18} className="text-[#06AED5] mr-3 mt-1" />
                <p className="text-gray-600">{station.address}</p>
              </div>
              
              {/* Action Button */}
              <button 
                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.address)}`, "_blank")}
                className="w-full mt-2 bg-[#F0C808] hover:bg-[#e5bd08] text-[#0D3A73] font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <span>{t('common.viewOnMap')}</span>
                <ExternalLink size={16} className="ml-2" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredStations.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-[#D1FFD7] rounded-full flex items-center justify-center mb-6">
            <MapPin size={36} className="text-[#0D3A73]" />
          </div>
          <h3 className="text-xl font-bold text-[#0D3A73] mb-2">{t('stationsPage.emptyStateTitle')}</h3>
          <p className="text-gray-600 max-w-md">{t('stationsPage.emptyStateMessage')}</p>
          <button 
            onClick={() => setFilter(t('common.all'))}
            className="mt-6 bg-[#06AED5] hover:bg-[#059cc0] text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            {t('stationsPage.viewAllStations')}
          </button>
        </div>
      )}
    </div>
  );
}