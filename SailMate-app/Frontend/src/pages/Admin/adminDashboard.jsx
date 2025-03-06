import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bell, ArrowRight, Plus } from 'lucide-react';

const AdminDashboard = () => {
  // Animation states
  const [loaded, setLoaded] = useState(false);
  
  // User information - in a real app, this would come from authentication context
  const user = {
    name: "Admin User",
    lastLogin: "March 6, 2025, 09:45 AM"
  };

  // Set loaded state after component mounts to trigger animations
  useEffect(() => {
    setLoaded(true);
  }, []);

  const cards = [
    {
      title: "Manage Stations",
      description: "Add, edit or remove stations and their contact information",
      icon: MapPin,
      path: "/adminStations",
      count: 5, // Example count of items
      color: "#06AED5"
    },
    {
      title: "Voyage Times",
      description: "Schedule and manage voyage routes, times and status",
      icon: Clock,
      path: "/adminVoyage",
      count: 3, // Example count of items
      color: "#06AED5"
    },
    {
      title: "Announcements",
      description: "Create and publish important announcements for users",
      icon: Bell,
      path: "/adminAnnounce",
      count: 2, // Example count of items
      color: "#06AED5"
    }
  ];

  // Summary statistics - would typically come from an API
  const stats = [
    { label: "Total Stations", value: 5 },
    { label: "Active Voyages", value: 12 },
    { label: "Current Announcements", value: 2 }
  ];

  // Add a subtle pulse animation to statistics on load
  const pulseAnimation = (index) => {
    if (!loaded) return {};
    
    return {
      animation: `pulse 2s ease-in-out`,
      animationDelay: `${300 + (index * 100)}ms`,
    };
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div 
          className={`bg-white rounded-lg shadow p-6 mb-6 transition-all duration-700 transform ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome, {user.name}</h1>
              <p className="text-gray-500 mt-1">Last login: {user.lastLogin}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-[#06AED5] font-medium">SailMate Administration Portal</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-500 ${
                  loaded ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ ...pulseAnimation(index) }}
              >
                <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
                <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
            ))}
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
                to: "/adminStations", 
                title: "Add New Station", 
                description: "Create a new station for voyages" 
              },
              { 
                to: "/adminVoyage", 
                title: "Schedule Voyage", 
                description: "Create a new voyage schedule" 
              },
              { 
                to: "/adminAnnounce", 
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