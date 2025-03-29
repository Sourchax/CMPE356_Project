import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  MapPin, 
  Clock, 
  Bell, 
  DollarSign, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  Activity,
  Calendar,
  ArrowRight,
  Plus
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";

const ManagerDashboard = () => {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loaded, setLoaded] = useState(false);

  // Set loaded to true when component mounts
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Get current time to display personalized greeting
  const getCurrentGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Fake stats for the dashboard
  const stats = {
    activeUsers: 42,
    pendingComplaints: 3,
    totalLogs: 156,
    ticketTypes: 8,
    charts: 2
  };

  // Summary stats array
  const statItems = [
    { label: "Active Users", value: stats.activeUsers, icon: Users },
    { label: "Pending Complaints", value: stats.pendingComplaints, icon: AlertTriangle },
    { label: "Total Logs", value: stats.totalLogs, icon: Activity },
    { label: "Ticket Types", value: stats.ticketTypes, icon: DollarSign },
    { label: "Charts", value: stats.charts, icon: TrendingUp }
  ];

  // Card data
  const cards = [
    {
      title: "User Management",
      description: "Manage user accounts, roles and permissions",
      icon: Users,
      iconColor: "#8B5CF6",
      bgColor: "#F5F3FF",
      borderColor: "border-purple-200",
      path: "//Users",
      count: stats.activeUsers
    },
    {
      title: "Complaint Center",
      description: "Review and respond to customer complaints",
      icon: Bell,
      iconColor: "#F59E0B",
      bgColor: "#FFF7ED",
      borderColor: "border-amber-200",
      path: "/manager/Complaints",
      count: stats.pendingComplaints
    },
    {
      title: "Activity Logs",
      description: "Track user activity and system events",
      icon: MapPin,
      iconColor: "#3B82F6",
      bgColor: "#EFF6FF",
      borderColor: "border-blue-200",
      path: "/manager/Logs",
      count: stats.totalLogs
    },
    {
      title: "Ticket Pricing",
      description: "Manage and update ticket prices and types",
      icon: DollarSign,
      iconColor: "#10B981",
      bgColor: "#ECFDF5",
      borderColor: "border-green-200",
      path: "/manager/Finance",
      count: stats.ticketTypes
    },
    {
        title: "Charts",
        description: "View visual analytics and trends",
        icon: TrendingUp,
        iconColor: "#6366F1",
        bgColor: "#EEF2FF",
        borderColor: "border-indigo-200",
        path: "/manager/Charts",
        count: stats.charts
      }

  ];

  // Quick actions
  const quickActions = [
    {
      title: "Add New User",
      description: "Create a new user account",
      path: "/manager/Users",
      state: { openAddModal: true }
    },
    {
      title: "Process Complaint",
      description: "Handle a pending customer complaint",
      path: "/manager/Complaints",
      state: { openQueue: true }
    },
    {
      title: "Update Pricing",
      description: "Modify ticket pricing structure",
      path: "/manager/Finance",
      state: { openPriceEditor: true }
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
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
                Welcome to your management dashboard. Here's an overview of your system.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-gray-50 p-3 rounded-lg shadow-sm flex items-center">
                <Calendar className="text-green-600 mr-2" size={20} />
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
                <Clock className="text-green-600 mr-2" size={20} />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {statItems.map((stat, index) => {
                const Icon = stat.icon;
                return (
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
                      <div className="bg-green-100 p-2 rounded-full">
                        <Icon size={18} className="text-green-700" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Navigation Cards */}
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
                  style={{ backgroundColor: card.iconColor }}
                ></div>
                <div className="p-6 flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: card.bgColor }}
                    >
                      <Icon size={24} color={card.iconColor} />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{card.count}</div>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h2>
                  <p className="text-gray-500 mb-4">{card.description}</p>
                  <div className="flex items-center text-green-600 text-sm font-medium mt-auto">
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
            {quickActions.map((action, index) => (
              <Link 
                key={index}
                to={action.path} 
                state={action.state} 
                className={`p-3 border border-gray-200 rounded-lg text-left transition-all duration-500 no-underline flex items-center transform ${
                  loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: `${700 + (index * 100)}ms` }}
              >
                <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-3 flex-shrink-0">
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

export default ManagerDashboard;