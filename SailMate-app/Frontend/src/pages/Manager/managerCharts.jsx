import React, { useState, useEffect } from "react";
import axios from "axios";
import { Ship, Users, DollarSign, TrendingUp, Layers, Navigation, Calendar, Flag, Clock, Award } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {useSessionToken} from "../../utils/sessions.js";
import { useTranslation } from 'react-i18next';


const API_BASE_URL = "http://localhost:8080/api";

// Format currency for display
const formatCurrency = (value) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
};

const COLORS = ['#DD614A', '#06AED5', '#F0C809', '#0D3A73'];
const BUSINESS_COLOR = '#DD614A';
const ECONOMY_COLOR = '#06AED5';
const PROMO_COLOR = '#F0C809';

const ManagerCharts = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeYear, setActiveYear] = useState(new Date().getFullYear());
  const [error, setError] = useState(null);
  
  // Fetch all required data for the dashboard
  useEffect(() => {
    const fetchDashboardData = async () => { 
      setIsLoading(true);
      setError(null);
      const nbr = useSessionToken();
      
      try {
        // Create header with authorization token
        const headers = {
          'Authorization': nbr
        };
        
        // Make parallel API calls to get all the data we need
        const [
          ticketsResponse, 
          completedTicketsResponse,
          voyagesResponse, 
          stationsResponse
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/tickets`, { headers }),
          axios.get(`${API_BASE_URL}/completed-tickets`, { headers }),
          axios.get(`${API_BASE_URL}/voyages`, { headers }),
          axios.get(`${API_BASE_URL}/stations`, { headers })
        ]);
        
        // Process the data to create dashboard metrics
        const processedData = processApiData(
          ticketsResponse.data, 
          completedTicketsResponse.data, 
          voyagesResponse.data, 
          stationsResponse.data
        );
        setDashboardData(processedData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [activeYear]);
  
  // Process the API data to create dashboard metrics
  const processApiData = (tickets, completedTickets, voyages, stations) => {
    // Create a station lookup map for easy access
    const stationMap = {};
    stations.forEach(station => {
      stationMap[station.id] = station;
    });
    
    // Create a voyage lookup map for easy access
    const voyageMap = {};
    voyages.forEach(voyage => {
      voyageMap[voyage.id] = {
        ...voyage,
        fromStation: stationMap[voyage.fromStationId],
        toStation: stationMap[voyage.toStationId]
      };
    });
    
    // Combine active and completed tickets
    // First, normalize completed tickets to match the structure of active tickets
    const normalizedCompletedTickets = completedTickets.map(ticket => {
      return {
        ...ticket,
        ticketID: ticket.ticketId, // Map ticketId to ticketID for consistency
        voyageId: ticket.voyageId,
        // For completed tickets, use the stored static data
        fromStationCity: ticket.depCity,
        fromStationTitle: ticket.depStationTitle,
        toStationCity: ticket.arrCity,
        toStationTitle: ticket.arrStationTitle,
        departureDate: ticket.depDate,
        departureTime: ticket.depTime,
        arrivalTime: ticket.arrTime,
        // These fields should already be the same
        passengerCount: ticket.passengerCount,
        totalPrice: ticket.totalPrice,
        ticketClass: ticket.ticketClass,
        selectedSeats: ticket.selectedSeats,
        userId: ticket.userId,
        // Time fields
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        // Flag to identify completed tickets
        isCompletedTicket: true
      };
    });
    
    // Add flag to active tickets
    const normalizedActiveTickets = tickets.map(ticket => ({
      ...ticket,
      isCompletedTicket: false
    }));
    
    // Combine both types of tickets
    const allTickets = [...normalizedActiveTickets, ...normalizedCompletedTickets];
    
    // Filter tickets for the active year
    const yearTickets = allTickets.filter(ticket => {
      const ticketDate = new Date(ticket.createdAt);
      return ticketDate.getFullYear() === activeYear;
    });
    
    // Group tickets by month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = months.map((month, monthIndex) => {
      // Filter tickets for this month
      const monthTickets = yearTickets.filter(ticket => {
        const ticketDate = new Date(ticket.createdAt);
        return ticketDate.getMonth() === monthIndex;
      });
      
      // Count tickets by class
      const ticketsByClass = {
        promo: 0,
        economy: 0,
        business: 0
      };
      
      // Calculate revenue by class
      const revenueByClass = {
        promo: 0,
        economy: 0,
        business: 0
      };
      
      // Calculate passengers by class
      const passengersByClass = {
        promo: 0,
        economy: 0,
        business: 0
      };
      
      // Process each ticket for this month
      monthTickets.forEach(ticket => {
        const ticketClass = ticket.ticketClass.toLowerCase();
        
        // Count tickets by class
        ticketsByClass[ticketClass]++;
        
        // Add revenue by class
        revenueByClass[ticketClass] += ticket.totalPrice;
        
        // Add passengers by class
        passengersByClass[ticketClass] += ticket.passengerCount;
      });
      
      // Calculate totals
      const totalTickets = Object.values(ticketsByClass).reduce((sum, count) => sum + count, 0);
      const totalRevenue = Object.values(revenueByClass).reduce((sum, amount) => sum + amount, 0);
      const totalPassengers = Object.values(passengersByClass).reduce((sum, count) => sum + count, 0);
      
      return {
        month,
        totalTickets,
        totalPassengers,
        totalRevenue,
        ticketsByClass,
        revenueByClass,
        passengersByClass
      };
    });
    
    // Calculate route popularity
    const routeCounts = {};
    const routeRevenue = {};
    
    yearTickets.forEach(ticket => {
      // Skip tickets without voyage info for active tickets
      if (!ticket.isCompletedTicket && (!ticket.voyageId || !voyageMap[ticket.voyageId])) return;
      
      let fromStationId, toStationId, fromStation, toStation;
      
      if (ticket.isCompletedTicket) {
        // For completed tickets, we already have the station info stored
        fromStationId = 0; // Use placeholder IDs for completed tickets
        toStationId = 1;
        fromStation = {
          id: fromStationId,
          title: ticket.fromStationTitle || ticket.depStationTitle,
          city: ticket.fromStationCity || ticket.depCity
        };
        toStation = {
          id: toStationId,
          title: ticket.toStationTitle || ticket.arrStationTitle,
          city: ticket.toStationCity || ticket.arrCity
        };
      } else {
        // For active tickets, get info from the voyage
        const voyage = voyageMap[ticket.voyageId];
        fromStation = voyage.fromStation;
        toStation = voyage.toStation;
        
        // Skip if station info is missing
        if (!fromStation || !toStation) return;
        
        fromStationId = fromStation.id;
        toStationId = toStation.id;
      }
      
      // Create a unique route key - for completed tickets, use a city+title based key
      const routeKey = ticket.isCompletedTicket ?
        `${fromStation.city}-${fromStation.title}-${toStation.city}-${toStation.title}` :
        `${fromStationId}-${toStationId}`;
      
      // Count routes
      routeCounts[routeKey] = (routeCounts[routeKey] || 0) + 1;
      
      // Sum revenue by route
      routeRevenue[routeKey] = (routeRevenue[routeKey] || 0) + ticket.totalPrice;
    });
    
    // Create popular routes array
    const popularRoutes = Object.keys(routeCounts).map(routeKey => {
      let from, fromCity, to, toCity;
      
      if (routeKey.split('-').length > 2) {
        // This is a completed ticket route key (city-title-city-title)
        const [fromCity, fromTitle, toCity, toTitle] = routeKey.split('-');
        return {
          from: fromTitle,
          fromCity: fromCity,
          to: toTitle,
          toCity: toCity,
          count: routeCounts[routeKey],
          revenue: routeRevenue[routeKey]
        };
      } else {
        // This is an active ticket route key (fromId-toId)
        const [fromId, toId] = routeKey.split('-');
        const fromStation = stationMap[fromId];
        const toStation = stationMap[toId];
        
        return {
          from: fromStation.title,
          fromCity: fromStation.city,
          to: toStation.title,
          toCity: toStation.city,
          count: routeCounts[routeKey],
          revenue: routeRevenue[routeKey]
        };
      }
    }).sort((a, b) => b.count - a.count);
    
    // Calculate ticket class performance
    const classTotals = {
      promo: { totalSold: 0, totalRevenue: 0 },
      economy: { totalSold: 0, totalRevenue: 0 },
      business: { totalSold: 0, totalRevenue: 0 }
    };
    
    yearTickets.forEach(ticket => {
      const ticketClass = ticket.ticketClass.toLowerCase();
      if (classTotals[ticketClass]) {
        classTotals[ticketClass].totalSold++;
        classTotals[ticketClass].totalRevenue += ticket.totalPrice;
      }
    });
    
    // Calculate average prices
    Object.keys(classTotals).forEach(className => {
      if (classTotals[className].totalSold > 0) {
        classTotals[className].avgPrice = Math.round(
          classTotals[className].totalRevenue / classTotals[className].totalSold
        );
      } else {
        classTotals[className].avgPrice = 0;
      }
    });
    
    // Calculate percentages
    const totalTickets = yearTickets.length;
    
    const classPerformance = Object.keys(classTotals).map(className => ({
      class: className,
      totalSold: classTotals[className].totalSold,
      totalRevenue: classTotals[className].totalRevenue,
      avgPrice: classTotals[className].avgPrice,
      percentOfTotal: totalTickets > 0 
        ? (classTotals[className].totalSold / totalTickets * 100).toFixed(1)
        : 0
    }));
    
    // Calculate summary statistics
    const totalRevenue = yearTickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0);
    const totalPassengers = yearTickets.reduce((sum, ticket) => sum + ticket.passengerCount, 0);
    const avgTicketPrice = totalTickets > 0 ? (totalRevenue / totalTickets) : 0;
    
    // Count active vs completed tickets
    const activeTicketsCount = yearTickets.filter(ticket => !ticket.isCompletedTicket).length;
    const completedTicketsCount = yearTickets.filter(ticket => ticket.isCompletedTicket).length;
    
    const summaryStats = {
      totalTickets,
      totalRevenue,
      totalPassengers,
      averageTicketPrice: Math.round(avgTicketPrice),
      mostPopularRoute: popularRoutes.length > 0 ? popularRoutes[0] : null,
      mostProfitableClass: classPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue)[0],
      activeTicketsCount,
      completedTicketsCount
    };
    
    // Create chart data
    const monthlyChartData = monthlyData.map(month => ({
      month: month.month,
      "Promo Tickets": month.ticketsByClass.promo,
      "Economy Tickets": month.ticketsByClass.economy,
      "Business Tickets": month.ticketsByClass.business,
      "Promo Revenue": month.revenueByClass.promo / 1000, // In thousands
      "Economy Revenue": month.revenueByClass.economy / 1000, // In thousands
      "Business Revenue": month.revenueByClass.business / 1000, // In thousands
      "Total Tickets": month.totalTickets,
      "Total Revenue": month.totalRevenue / 1000 // In thousands
    }));
    
    return {
      monthlyData,
      popularRoutes,
      classPerformance,
      summaryStats,
      monthlyChartData
    };
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">Error: {error}</div>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => window.location.reload()}
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }
  
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-500">{t('manager.charts.noData')}</div>
      </div>
    );
  }
  
  const { summaryStats, monthlyChartData, popularRoutes, classPerformance } = dashboardData;
  
  // Prepare data for pie chart
  const ticketClassData = classPerformance.map(item => ({
    name: item.class,
    value: item.totalSold
  }));
  
  // Prepare data for ticket status distribution
  const ticketStatusData = [
    { name: 'Active', value: summaryStats.activeTicketsCount },
    { name: 'Completed', value: summaryStats.completedTicketsCount }
  ].filter(item => item.value > 0);
  
  // Prepare data for popular routes
  const routeData = popularRoutes.slice(0, 5).map(route => ({
    name: `${route.fromCity} → ${route.toCity}`,
    value: route.count
  }));

  const getTicketClassColor = (className) => {
    switch(className.toLowerCase()) {
      case 'business':
        return BUSINESS_COLOR;
      case 'economy':
        return ECONOMY_COLOR;
      case 'promo':
        return PROMO_COLOR;
      default:
        return '#0D3A73';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{t('manager.charts.title')}</h1>
            
            <div className="flex items-center space-x-2">
              <button 
                className={`px-4 py-2 rounded ${activeYear === 2024 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                onClick={() => setActiveYear(2024)}
              >
                2024
              </button>
              <button 
                className={`px-4 py-2 rounded ${activeYear === 2025 ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
                onClick={() => setActiveYear(2025)}
              >
                2025
              </button>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <div className="h-1 w-10 bg-blue-600 mr-3"></div>
            <p>{t('manager.charts.subtitle')}</p>
          </div>
        </header>
        
        {/* Summary Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tickets */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{t('manager.charts.metrics.totalTickets')}</p>
                <h3 className="text-3xl font-bold mt-1">{summaryStats.totalTickets.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">{t('manager.charts.year')} {activeYear}</span>
              {summaryStats.completedTicketsCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded text-xs">
                  {summaryStats.completedTicketsCount} {t('manager.charts.metrics.completed')}
                </span>
              )}
            </div>
          </div>
          
          {/* Total Revenue */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{t('manager.charts.metrics.totalRevenue')}</p>
                <h3 className="text-3xl font-bold mt-1">{formatCurrency(summaryStats.totalRevenue)}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">{t('manager.charts.year')} {activeYear}</span>
            </div>
          </div>
          
          {/* Total Passengers */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{t('manager.charts.metrics.totalPassengers')}</p>
                <h3 className="text-3xl font-bold mt-1">{summaryStats.totalPassengers.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">{t('manager.charts.year')} {activeYear}</span>
            </div>
          </div>
          
          {/* Average Ticket Price */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{t('manager.charts.metrics.avgTicketPrice')}</p>
                <h3 className="text-3xl font-bold mt-1">{formatCurrency(summaryStats.averageTicketPrice)}</h3>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">{t('manager.charts.year')} {activeYear}</span>
            </div>
          </div>
        </div>
        
        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('manager.charts.monthlyRevenueByClass')}</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₺${value}K`} />
                  <Tooltip formatter={(value) => `₺${value.toLocaleString()}K`} />
                  <Legend />
                  <Bar dataKey="Promo Revenue" stackId="a" name={t('manager.charts.ticketClasses.promo')} fill={PROMO_COLOR} />
                  <Bar dataKey="Economy Revenue" stackId="a" name={t('manager.charts.ticketClasses.economy')} fill={ECONOMY_COLOR} />
                  <Bar dataKey="Business Revenue" stackId="a" name={t('manager.charts.ticketClasses.business')} fill={BUSINESS_COLOR} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Tickets Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('manager.charts.monthlyTicketsByClass')}</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Promo Tickets" name={t('manager.charts.ticketClasses.promo')} stroke={PROMO_COLOR} strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Economy Tickets" name={t('manager.charts.ticketClasses.economy')} stroke={ECONOMY_COLOR} strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Business Tickets" name={t('manager.charts.ticketClasses.business')} stroke={BUSINESS_COLOR} strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Ticket Distribution and Popular Routes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ticket Class Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">{t('manager.charts.ticketClassDistribution')}</h2>
            <div className="flex flex-col lg:flex-row">
              <div className="h-80 w-full lg:w-1/2 relative">
                <div className="absolute inset-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ticketClassData.filter(item => item.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        // No label, we'll add a custom legend
                        labelLine={false}
                        isAnimationActive={false}
                      >
                        {ticketClassData.filter(item => item.value > 0).map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={getTicketClassColor(entry.name)} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => value.toLocaleString()} />
                      
                      {/* Custom legend below the chart */}
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        payload={
                          ticketClassData.filter(item => item.value > 0).map((entry) => ({
                            value: `${t(`manager.charts.ticketClasses.${entry.name}`)} ${((entry.value / ticketClassData.reduce((sum, item) => sum + (item.value > 0 ? item.value : 0), 0)) * 100).toFixed(0)}%`,
                            type: 'circle',
                            color: getTicketClassColor(entry.name),
                          }))
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                <h3 className="text-lg font-medium mb-3">{t('manager.charts.classStatistics')}</h3>
                <div className="space-y-4">
                  {classPerformance.map((cls, index) => (
                    <div key={cls.class}>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{t(`manager.charts.ticketClasses.${cls.class}`)}</span>
                        <span>{cls.totalSold.toLocaleString()} {t('manager.charts.tickets')}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ 
                          width: cls.percentOfTotal > 0 ? `${cls.percentOfTotal}%` : '0%', 
                          backgroundColor: getTicketClassColor(cls.class) 
                        }}
                      ></div>
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {formatCurrency(cls.totalRevenue)} {t('manager.charts.totalRevenue')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Ticket Status Distribution and Popular Routes */}
          <div className="bg-white p-6 rounded-xl shadow-md">     
            <h2 className="text-xl font-semibold mb-4">{t('manager.charts.popularRoutes')}</h2>
            <div className="space-y-4 mb-4">
              {popularRoutes.slice(0, 3).map((route, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg hover:bg-gray-50">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-blue-100 text-blue-600' : index === 1 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    <span className="font-bold text-lg">{index + 1}</span>
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="flex items-center text-sm">
                      <span className="font-medium text-gray-700">{route.fromCity}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium text-gray-700">{route.toCity}</span>
                    </div>
                    <div className="flex mt-1">
                      <div className="text-xs text-gray-500">
                        <span className="mr-2">{route.from}</span> - <span className="ml-2">{route.to}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{route.count.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">{formatCurrency(route.revenue)}</div>
                  </div>
                </div>
              ))}
            </div>
            {summaryStats.mostPopularRoute && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium">{t('manager.charts.profitableRoute')}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('manager.charts.routeRevenue', {
                        from: summaryStats.mostPopularRoute.fromCity,
                        to: summaryStats.mostPopularRoute.toCity,
                        revenue: formatCurrency(summaryStats.mostPopularRoute.revenue)
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerCharts;