import React, { useState, useEffect } from "react";
import axios from "axios";
import { Ship, Users, DollarSign, TrendingUp, Layers, Navigation, Calendar, Flag, Clock, Award } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import {useSessionToken} from "../../utils/sessions.js";


const API_BASE_URL = "http://localhost:8080/api";

// Format currency for display
const formatCurrency = (value) => {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
};

const COLORS = ['#0D3A73', '#06AED5', '#F0C809', '#DD614A'];

const ManagerCharts = () => {
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
        const [ticketsResponse, voyagesResponse, stationsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/tickets`, { headers }),
          axios.get(`${API_BASE_URL}/voyages`, { headers }),
          axios.get(`${API_BASE_URL}/stations`, { headers })
        ]);
        
        // Process the data to create dashboard metrics
        const processedData = processApiData(ticketsResponse.data, voyagesResponse.data, stationsResponse.data);
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
  const processApiData = (tickets, voyages, stations) => {
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
    
    // Filter tickets for the active year
    const yearTickets = tickets.filter(ticket => {
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
        const ticketClass = ticket.ticketClass;
        
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
      // Skip tickets without voyage info
      if (!ticket.voyageId || !voyageMap[ticket.voyageId]) return;
      
      const voyage = voyageMap[ticket.voyageId];
      const fromStation = voyage.fromStation;
      const toStation = voyage.toStation;
      
      // Skip if station info is missing
      if (!fromStation || !toStation) return;
      
      const routeKey = `${fromStation.id}-${toStation.id}`;
      
      // Count routes
      routeCounts[routeKey] = (routeCounts[routeKey] || 0) + 1;
      
      // Sum revenue by route
      routeRevenue[routeKey] = (routeRevenue[routeKey] || 0) + ticket.totalPrice;
    });
    
    // Create popular routes array
    const popularRoutes = Object.keys(routeCounts).map(routeKey => {
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
    }).sort((a, b) => b.count - a.count);
    
    // Calculate ticket class performance
    const classTotals = {
      promo: { totalSold: 0, totalRevenue: 0 },
      economy: { totalSold: 0, totalRevenue: 0 },
      business: { totalSold: 0, totalRevenue: 0 }
    };
    
    yearTickets.forEach(ticket => {
      const ticketClass = ticket.ticketClass;
      classTotals[ticketClass].totalSold++;
      classTotals[ticketClass].totalRevenue += ticket.totalPrice;
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
    
    const summaryStats = {
      totalTickets,
      totalRevenue,
      totalPassengers,
      averageTicketPrice: Math.round(avgTicketPrice),
      mostPopularRoute: popularRoutes.length > 0 ? popularRoutes[0] : null,
      mostProfitableClass: classPerformance.sort((a, b) => b.totalRevenue - a.totalRevenue)[0]
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
          Retry
        </button>
      </div>
    );
  }
  
  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-500">No data available</div>
      </div>
    );
  }
  
  const { summaryStats, monthlyChartData, popularRoutes, classPerformance } = dashboardData;
  
  // Prepare data for pie chart
  const ticketClassData = classPerformance.map(item => ({
    name: item.class,
    value: item.totalSold
  }));
  
  // Prepare data for popular routes
  const routeData = popularRoutes.slice(0, 5).map(route => ({
    name: `${route.fromCity} → ${route.toCity}`,
    value: route.count
  }));
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">SailMate Ticket Statistics</h1>
            
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
            <p>Comprehensive analysis of ticket sales and routes</p>
          </div>
        </header>
        
        {/* Summary Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tickets */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Tickets Sold</p>
                <h3 className="text-3xl font-bold mt-1">{summaryStats.totalTickets.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Layers className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Year {activeYear}</span>
            </div>
          </div>
          
          {/* Total Revenue */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                <h3 className="text-3xl font-bold mt-1">{formatCurrency(summaryStats.totalRevenue)}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Year {activeYear}</span>
            </div>
          </div>
          
          {/* Total Passengers */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Passengers</p>
                <h3 className="text-3xl font-bold mt-1">{summaryStats.totalPassengers.toLocaleString()}</h3>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Year {activeYear}</span>
            </div>
          </div>
          
          {/* Average Ticket Price */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg. Ticket Price</p>
                <h3 className="text-3xl font-bold mt-1">{formatCurrency(summaryStats.averageTicketPrice)}</h3>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Year {activeYear}</span>
            </div>
          </div>
        </div>
        
        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Monthly Revenue by Ticket Class</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₺${value}K`} />
                  <Tooltip formatter={(value) => `₺${value.toLocaleString()}K`} />
                  <Legend />
                  <Bar dataKey="Promo Revenue" stackId="a" name="Promo" fill="#F0C809" />
                  <Bar dataKey="Economy Revenue" stackId="a" name="Economy" fill="#06AED5" />
                  <Bar dataKey="Business Revenue" stackId="a" name="Business" fill="#0D3A73" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Tickets Chart */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Monthly Tickets Sold by Class</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Promo Tickets" name="Promo" stroke="#F0C809" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Economy Tickets" name="Economy" stroke="#06AED5" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Business Tickets" name="Business" stroke="#0D3A73" strokeWidth={2} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Ticket Distribution and Popular Routes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ticket Class Distribution */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Ticket Class Distribution</h2>
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
                        {ticketClassData.filter(item => item.value > 0).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                        <Tooltip formatter={(value) => value.toLocaleString()} />
                        
                        {/* Custom legend below the chart */}
                        <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        payload={
                            ticketClassData.filter(item => item.value > 0).map((entry, index) => ({
                            value: `${entry.name} ${((entry.value / ticketClassData.reduce((sum, item) => sum + (item.value > 0 ? item.value : 0), 0)) * 100).toFixed(0)}%`,
                            type: 'circle',
                            color: COLORS[index % COLORS.length],
                            }))
                        }
                        />
                    </PieChart>
                    </ResponsiveContainer>
                </div>
                </div>
                <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
                <h3 className="text-lg font-medium mb-3">Class Statistics</h3>
                <div className="space-y-4">
                    {classPerformance.map((cls, index) => (
                    <div key={cls.class}>
                        <div className="flex justify-between mb-1">
                        <span className="font-medium">{cls.class}</span>
                        <span>{cls.totalSold.toLocaleString()} tickets</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className="h-2 rounded-full" 
                            style={{ 
                            width: cls.percentOfTotal > 0 ? `${cls.percentOfTotal}%` : '0%', 
                            backgroundColor: COLORS[index % COLORS.length] 
                            }}
                        ></div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                        {formatCurrency(cls.totalRevenue)} total revenue
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>
          
          {/* Popular Routes */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Most Popular Routes</h2>
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
                        <span className="mr-2">{route.from}</span> to <span className="ml-2">{route.to}</span>
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
                    <h4 className="font-medium">Most Profitable Route</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {`${summaryStats.mostPopularRoute.fromCity} to ${summaryStats.mostPopularRoute.toCity} generated ${formatCurrency(summaryStats.mostPopularRoute.revenue)} in revenue`}
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