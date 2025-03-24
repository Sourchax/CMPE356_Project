import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bell, ArrowRight, Plus, Calendar, Compass } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";

const AdminDashboard = () => {
  const [loaded, setLoaded] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useUser();
  
  // States for API data
  const [stationCount, setStationCount] = useState(0);
  const [voyageCount, setVoyageCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);

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

  useEffect(() => {
    const fetchStationCount = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/stations/count');
        if (response.ok) {
          const count = await response.json();
          setStationCount(count);
        } else {
          console.error('Failed to fetch announcement count');
        }
      } catch (error) {
        console.error('Error fetching announcement count:', error);
      }
    };
  
    fetchStationCount();
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
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const cards = [
    {
      title: "Manage Stations",
      description: "Add, edit or remove stations and their contact information",
      icon: MapPin,
      path: "/admin/Stations",
      count: stationCount || 0, // Use API count when available, fallback to example count
      color: "#06AED5"
    },
    {
      title: "Voyage Times",
      description: "Schedule and manage voyage routes, times and status",
      icon: Clock,
      path: "/admin/Voyage",
      count: voyageCount || 3, // Use API count when available, fallback to example count
      color: "#06AED5"
    },
    {
      title: "Announcements",
      description: "Create and publish important announcements for users",
      icon: Bell,
      path: "/admin/Announce",
      count: announcementCount || 0, // Use API count when available, fallback to example count
      color: "#06AED5"
    }
  ];

  // Summary statistics - using API data with fallbacks
  const stats = [
    { label: "Total Stations", value: stationCount || 5 },
    { label: "Active Voyages", value: voyageCount || 12 },
    { label: "Current Announcements", value: announcementCount || 2 }
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
              {getCurrentGreeting()}, {user?.firstName || "Manager"}
            </h1>
              <p className="text-gray-600 mt-2">
                Welcome to your administration portal. Here's an overview of your system.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-gray-50 p-3 rounded-lg shadow-sm flex items-center">
                <Compass className="text-[#06AED5] mr-2" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Current Date</p>
                  <p className="font-medium text-sm">
                    {currentTime.toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg shadow-sm flex items-center">
                <Clock className="text-[#06AED5] mr-2" size={20} />
                <div>
                  <p className="text-xs text-gray-500">Current Time</p>
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
              <h2 className="text-lg font-semibold text-gray-800">Quick Overview</h2>
              <span className="text-xs text-gray-500">Last updated: Today at {currentTime.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                      style={{ backgroundColor: `${card.color}15` }} // 15% opacity of the color
                    >
                      <Icon size={24} color={card.color} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{card.count}</div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h2>
                  <p className="text-gray-500 mb-4">{card.description}</p>
                  <div className="flex items-center text-[#06AED5] text-sm font-medium mt-auto">
                    <span>Manage</span>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { 
                to: "/admin/Stations", 
                title: "Add New Station", 
                description: "Create a new station for voyages" 
              },
              { 
                to: "/admin/Voyage", 
                title: "Schedule Voyage", 
                description: "Create a new voyage schedule" 
              },
              { 
                to: "/admin/Announce", 
                title: "Create Announcement", 
                description: "Publish a new announcement" 
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
