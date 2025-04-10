import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bell, ArrowRight, Plus, Calendar, Compass, Activity } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import { useTranslation } from 'react-i18next';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useUser();
  
  // States for API data
  const [stationCount, setStationCount] = useState(0);
  const [voyageCount, setVoyageCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [logCount, setLogCount] = useState(0);
  

  // Fetch announcement count from API
  useEffect(() => {
    const fetchAnnouncementCount = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/announcements/count');
        if (response.ok) {
          const count = await response.json();
          setAnnouncementCount(count);
        } else {
          console.error('Failed to fetch announcement count');
        }
      } catch (error) {
        console.error('Error fetching announcement count:', error);
      }
    };
  
    fetchAnnouncementCount();
  }, []);

  // Fetch station count from API
  useEffect(() => {
    const fetchStationCount = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/stations/count');
        if (response.ok) {
          const count = await response.json();
          setStationCount(count);
        } else {
          console.error('Failed to fetch station count');
        }
      } catch (error) {
        console.error('Error fetching station count:', error);
      }
    };
  
    fetchStationCount();
  }, []);

  // Fetch voyage count from API
  useEffect(() => {
    const fetchVoyageCount = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/voyages/count-active');
        if (response.ok) {
          const count = await response.json();
          setVoyageCount(count);
        } else {
          console.error('Failed to fetch voyage count');
        }
      } catch (error) {
        console.error('Error fetching voyage count:', error);
      }
    };
  
    fetchVoyageCount();
  }, []);

  // Fetch activity logs count from API
  useEffect(() => {
    const fetchLogCount = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/activity-logs/count');
        if (response.ok) {
          const count = await response.json();
          setLogCount(count);
        } else {
          console.error('Failed to fetch activity logs count');
          // Fallback value if API fails
          setLogCount(156);
        }
      } catch (error) {
        console.error('Error fetching activity logs count:', error);
        // Fallback value if API fails
        setLogCount(156);
      }
    };
  
    fetchLogCount();
  }, []);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const getCurrentGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t('admin.dashboard.greetings.morning');
    if (hour < 18) return t('admin.dashboard.greetings.afternoon');
    return t('admin.dashboard.greetings.evening');
  };

  const cards = [
    {
      title: t('admin.dashboard.cards.stations.title'),
      description: t('admin.dashboard.cards.stations.description'),
      icon: MapPin,
      path: "/admin/Stations",
      count: stationCount || 0,
      color: "#06AED5"
    },
    {
      title: t('admin.dashboard.cards.voyage.title'),
      description: t('admin.dashboard.cards.voyage.description'),
      icon: Clock,
      path: "/admin/Voyage",
      count: voyageCount || 0,
      color: "#06AED5"
    },
    {
      title: t('admin.dashboard.cards.announcements.title'),
      description: t('admin.dashboard.cards.announcements.description'),
      icon: Bell,
      path: "/admin/Announce",
      count: announcementCount || 0,
      color: "#06AED5"
    },
    {
      title: t('admin.dashboard.cards.logs.title'),
      description: t('admin.dashboard.cards.logs.description'),
      icon: Activity,
      path: "/admin/Logs",
      count: logCount || 0,
      color: "#06AED5"
    }
  ];

  // Summary statistics - using API data with fallbacks
  const stats = [
    { label: t('admin.dashboard.stats.totalStations'), value: stationCount || 0 },
    { label: t('admin.dashboard.stats.activeVoyages'), value: voyageCount || 0 },
    { label: t('admin.dashboard.stats.currentAnnouncements'), value: announcementCount || 0 },
    { label: t('admin.dashboard.stats.systemLogs'), value: logCount || 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section - Updated Style */}
        <div 
          className={`bg-white rounded-lg shadow p-6 mb-6 transition-all duration-700 transform ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
              {getCurrentGreeting()}, {user?.firstName || t('admin.dashboard.manager')}
            </h1>
              <p className="text-gray-600 mt-2">
                {t('admin.dashboard.welcomeMessage')}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-gray-50 p-3 rounded-lg shadow-sm flex items-center">
                <Compass className="text-[#06AED5] mr-2" size={20} />
                <div>
                  <p className="text-xs text-gray-500">{t('admin.dashboard.currentDate')}</p>
                  <p className="font-medium text-sm">
                    {currentTime.toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg shadow-sm flex items-center">
                <Clock className="text-[#06AED5] mr-2" size={20} />
                <div>
                  <p className="text-xs text-gray-500">{t('admin.dashboard.currentTime')}</p>
                  <p className="font-medium text-sm">
                    {currentTime.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm p-4 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">{t('admin.dashboard.quickOverview')}</h2>
              <span className="text-xs text-gray-500">{t('admin.dashboard.lastUpdated')} {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`bg-gray-50 p-3 rounded-lg border border-gray-200 transition-all duration-500 ${
                    loaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className="bg-[#06AED5] bg-opacity-15 p-2 rounded-full">
                      {index === 0 && <MapPin size={18} className="text-[#06AED5]" />}
                      {index === 1 && <Clock size={18} className="text-[#06AED5]" />}
                      {index === 2 && <Bell size={18} className="text-[#06AED5]" />}
                      {index === 3 && <Activity size={18} className="text-[#06AED5]" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Link 
                key={index}
                to={card.path}
                className={`bg-white rounded-lg shadow overflow-hidden transition-all duration-700 transform flex flex-col no-underline ${
                  loaded 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div 
                  className="p-1" 
                  style={{ backgroundColor: card.color }}
                ></div>
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <Icon size={24} color={card.color} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{card.count}</div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h2>
                  <p className="text-gray-500 mb-4">{card.description}</p>
                  <div className="flex items-center text-[#06AED5] text-sm font-medium mt-auto">
                    <span>{t('admin.dashboard.manage')}</span>
                    <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Quick Actions Section */}
        <div 
          className={`bg-white rounded-lg shadow p-6 transition-all duration-700 transform ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{t('admin.dashboard.quickActionsTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                to: "/admin/Stations", 
                title: t('admin.dashboard.quickActions.addStation.title'), 
                description: t('admin.dashboard.quickActions.addStation.description')
              },
              { 
                to: "/admin/Voyage", 
                title: t('admin.dashboard.quickActions.scheduleVoyage.title'), 
                description: t('admin.dashboard.quickActions.scheduleVoyage.description')
              },
              { 
                to: "/admin/Announce", 
                title: t('admin.dashboard.quickActions.createAnnouncement.title'), 
                description: t('admin.dashboard.quickActions.createAnnouncement.description')
              },
              { 
                to: "/admin/Logs", 
                title: t('admin.dashboard.quickActions.viewLogs.title'), 
                description: t('admin.dashboard.quickActions.viewLogs.description')
              }
            ].map((action, index) => (
              <Link 
                key={index}
                to={action.to} 
                state={{ openAddModal: true }} 
                className={`p-3 border border-gray-200 rounded-lg text-left transition-all duration-500 no-underline flex items-center transform ${
                  loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: `${700 + (index * 100)}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-[#06AED5] flex items-center justify-center mr-3 flex-shrink-0">
                  <Plus size={18} color="white" />
                </div>
                <div>
                  <span className="font-medium text-gray-800 block">{action.title}</span>
                  <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;