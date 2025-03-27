import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, X, Check, RefreshCcw, AlertCircle, Calendar } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// API Service for interacting with the backend
const API_BASE_URL = 'http://localhost:8080/api';

const voyageService = {
  // Get all voyages with optional filters
  getVoyages: async (filters = {}) => {
    try {
      let url = `${API_BASE_URL}/voyages`;
      
      // Add query parameters for filtering
      if (Object.keys(filters).length > 0) {
        const queryParams = new URLSearchParams();
        
        if (filters.fromStationId) queryParams.append('fromStationId', filters.fromStationId);
        if (filters.toStationId) queryParams.append('toStationId', filters.toStationId);
        if (filters.date) queryParams.append('departureDate', filters.date);
        if (filters.status) queryParams.append('status', filters.status === 'normal' ? 'active' : 'cancel');
        
        url += `?${queryParams.toString()}`;
      }
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching voyages:', error);
      throw error;
    }
  },
  
  // Get all stations for dropdown menus
  getStations: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw error;
    }
  },
  
  // Create a new voyage
  createVoyage: async (voyageData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/voyages`, voyageData);
      return response.data;
    } catch (error) {
      console.error('Error creating voyage:', error);
      throw error;
    }
  },
  
  // Update an existing voyage
  updateVoyage: async (id, voyageData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/voyages/${id}`, voyageData);
      return response.data;
    } catch (error) {
      console.error('Error updating voyage:', error);
      throw error;
    }
  },
  
  // Delete a voyage
  deleteVoyage: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/voyages/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting voyage:', error);
      throw error;
    }
  },
  
  // Cancel a voyage
  cancelVoyage: async (id) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/voyages/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling voyage:', error);
      throw error;
    }
  },
  
  // Create weekly schedule
  createWeeklySchedule: async (scheduleData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/voyages/bulk`, scheduleData);
      return response.data;
    } catch (error) {
      console.error('Error creating weekly schedule:', error);
      throw error;
    }
  }
};

const AdminVoyage = () => {
  const location = useLocation();
  
  // State management
  const [voyages, setVoyages] = useState([]);
  const [filteredVoyages, setFilteredVoyages] = useState([]);
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isWeeklyScheduleModalOpen, setIsWeeklyScheduleModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  // Current voyage for editing/creating
  const [currentVoyage, setCurrentVoyage] = useState({
    id: null,
    fromStationId: '',
    toStationId: '',
    departureTime: '',
    arrivalTime: '',
    departureDate: '',
    status: 'active',
    shipType: 'Fast Ferry',
    fuelType: false,
    businessSeats: 30,
    promoSeats: 10,
    economySeats: 100
  });
  
  // Weekly schedule state
  const [weeklySchedule, setWeeklySchedule] = useState({
    fromStationId: '',
    toStationId: '',
    departureTime: '',
    arrivalTime: '',
    daysOfWeek: [],
    numberOfWeeks: 4,
    startDate: new Date().toISOString().substr(0, 10),
    shipType: 'Fast Ferry',
    fuelType: false,
    businessSeats: 30,
    promoSeats: 10,
    economySeats: 100
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    status: '',
    shipType: '',
    fuelType: ''
  });
  
  // Station filters
  const [stationFilters, setStationFilters] = useState({
    fromStationId: '',
    toStationId: ''
  });

  // Delete confirmation states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [voyageToDelete, setVoyageToDelete] = useState(null);
  
  // Alert state for notifications
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Fetch data on component mount
  useEffect(() => {
    fetchVoyages();
    fetchStations();
    
    // Check for openAddModal in location state (from quick action)
    if (location.state?.openAddModal) {
      openAddModal();
      // Clean up the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  // Apply filters whenever filters change
  useEffect(() => {
    applyFilters();
  }, [filters, voyages, stationFilters]);

  // Fetch voyages from API
  const fetchVoyages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await voyageService.getVoyages();
      setVoyages(data);
      setFilteredVoyages(data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to fetch voyages');
      setIsLoading(false);
      showAlert('error', 'Failed to load voyages. Please try again.');
    }
  };
  
  // Fetch stations for dropdowns
  const fetchStations = async () => {
    try {
      const data = await voyageService.getStations();
      setStations(data);
    } catch (err) {
      showAlert('error', 'Failed to load stations. Please try again.');
    }
  };
  
  // Show alert message
  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };
// Apply filters to voyages
  const applyFilters = () => {
    let result = [...voyages];
    
    // Date filter
    if (filters.date) {
      result = result.filter(voyage => voyage.departureDate === filters.date);
    }
    
    // Status filter
    if (filters.status) {
      // Convert between UI status and API status
      const apiStatus = filters.status === 'normal' ? 'active' : 'cancel';
      result = result.filter(voyage => voyage.status === apiStatus);
    }
    
    // Ship type filter
    if (filters.shipType) {
      result = result.filter(voyage => voyage.shipType === filters.shipType);
    }
    
    // Fuel type filter
    if (filters.fuelType !== '') {
      const fuelTypeValue = filters.fuelType === 'true';
      result = result.filter(voyage => voyage.fuelType === fuelTypeValue);
    }
    
    // Station filters
    if (stationFilters.fromStationId) {
      result = result.filter(voyage => voyage.fromStationId === parseInt(stationFilters.fromStationId));
    }
    
    if (stationFilters.toStationId) {
      result = result.filter(voyage => voyage.toStationId === parseInt(stationFilters.toStationId));
    }
    
    setFilteredVoyages(result);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      date: '',
      status: '',
      shipType: '',
      fuelType: ''
    });
    
    setStationFilters({
      fromStationId: '',
      toStationId: ''
    });
  };

  // Format time for display (without seconds)
  const formatTime = (timeString) => {
    if (!timeString) return '';
    
    // If timeString includes seconds (HH:MM:SS), strip them off
    if (timeString.length > 5) {
      return timeString.substring(0, 5);
    }
    
    return timeString;
  };
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle station filter changes
  const handleStationFilterChange = (e) => {
    const { name, value } = e.target;
    setStationFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal for adding new voyage
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentVoyage({
      id: null,
      fromStationId: '',
      toStationId: '',
      departureTime: '',
      arrivalTime: '',
      departureDate: new Date().toISOString().substr(0, 10),
      status: 'active',
      shipType: 'Fast Ferry',
      fuelType: false,
      businessSeats: 30,
      promoSeats: 10,
      economySeats: 100
    });
    setIsModalOpen(true);
    setValidationErrors({});
  };

  // Open modal for editing voyage
  const openEditModal = (voyage) => {
    setIsEditing(true);
    
    // Format the voyage data for the form
    const formattedVoyage = {
      ...voyage,
      departureDate: voyage.departureDate,
      // Convert API status to UI status
      status: voyage.status === 'active' ? 'active' : 'cancel'
    };
    
    setCurrentVoyage(formattedVoyage);
    setIsModalOpen(true);
    setValidationErrors({});
  };
  
  // Open weekly schedule modal
  const openWeeklyScheduleModal = () => {
    setWeeklySchedule({
      fromStationId: '',
      toStationId: '',
      departureTime: '',
      arrivalTime: '',
      daysOfWeek: [],
      numberOfWeeks: 4,
      startDate: new Date().toISOString().substr(0, 10),
      shipType: 'Fast Ferry',
      fuelType: false,
      businessSeats: 30,
      promoSeats: 10,
      economySeats: 100
    });
    setIsWeeklyScheduleModalOpen(true);
    setValidationErrors({});
  };

  // Close modals
  const closeModal = () => {
    setIsModalOpen(false);
    setIsWeeklyScheduleModalOpen(false);
    setValidationErrors({});
  };

  // Handle input changes in voyage modal
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentVoyage(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle input changes in weekly schedule modal
  const handleWeeklyScheduleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'daysOfWeek') {
      // Handle multiple checkboxes for days of week
      const dayValue = e.target.value;
      const updatedDays = [...weeklySchedule.daysOfWeek];
      
      if (checked) {
        updatedDays.push(dayValue);
      } else {
        const index = updatedDays.indexOf(dayValue);
        if (index > -1) {
          updatedDays.splice(index, 1);
        }
      }
      
      setWeeklySchedule(prev => ({
        ...prev,
        daysOfWeek: updatedDays
      }));
    } else {
      setWeeklySchedule(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : 
               name === 'numberOfWeeks' ? parseInt(value) : value
      }));
    }
    
    // Clear validation error for this field when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Format voyage data for API
  const formatVoyageForAPI = (voyage) => {
    return {
      id: voyage.id,
      fromStationId: parseInt(voyage.fromStationId),
      toStationId: parseInt(voyage.toStationId),
      departureDate: voyage.departureDate,
      departureTime: voyage.departureTime,
      arrivalTime: voyage.arrivalTime,
      status: voyage.status,
      shipType: voyage.shipType,
      fuelType: voyage.fuelType,
      businessSeats: parseInt(voyage.businessSeats) || 30,
      promoSeats: parseInt(voyage.promoSeats) || 10,
      economySeats: parseInt(voyage.economySeats) || 100
    };
  };
  
  // Validate voyage data
  const validateVoyage = (voyage) => {
    const errors = {};
    
    // Required fields validation
    if (!voyage.fromStationId) {
      errors.fromStationId = 'Departure station is required';
    }
    
    if (!voyage.toStationId) {
      errors.toStationId = 'Arrival station is required';
    }
    
    if (!voyage.departureTime) {
      errors.departureTime = 'Departure time is required';
    }
    
    if (!voyage.arrivalTime) {
      errors.arrivalTime = 'Arrival time is required';
    }
    
    if (!voyage.departureDate) {
      errors.departureDate = 'Date is required';
    }
    
    // Logical validations
    if (voyage.fromStationId && voyage.toStationId && voyage.fromStationId === voyage.toStationId) {
      errors.toStationId = 'Departure and arrival stations cannot be the same';
    }
    
    if (voyage.departureTime && voyage.arrivalTime) {
      const depTime = new Date(`2000-01-01T${voyage.departureTime}`);
      const arrTime = new Date(`2000-01-01T${voyage.arrivalTime}`);
      
      if (depTime >= arrTime) {
        errors.arrivalTime = 'Arrival time must be after departure time';
      }
    }
    
    // Date validation - ensure date is not in the past
    if (voyage.departureDate) {
      const voyageDate = new Date(voyage.departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (voyageDate < today) {
        errors.departureDate = 'Voyage date cannot be in the past';
      }
    }
    
    return errors;
  };
  
  // Validate weekly schedule data
  const validateWeeklySchedule = (schedule) => {
    const errors = {};
    
    // Required fields validation
    if (!schedule.fromStationId) {
      errors.fromStationId = 'Departure station is required';
    }
    
    if (!schedule.toStationId) {
      errors.toStationId = 'Arrival station is required';
    }
    
    if (!schedule.departureTime) {
      errors.departureTime = 'Departure time is required';
    }
    
    if (!schedule.arrivalTime) {
      errors.arrivalTime = 'Arrival time is required';
    }
    
    if (!schedule.startDate) {
      errors.startDate = 'Start date is required';
    }
    
    if (schedule.daysOfWeek.length === 0) {
      errors.daysOfWeek = 'At least one day of week must be selected';
    }
    
    if (!schedule.numberOfWeeks || schedule.numberOfWeeks < 1) {
      errors.numberOfWeeks = 'Number of weeks must be at least 1';
    }
    
    // Logical validations
    if (schedule.fromStationId && schedule.toStationId && schedule.fromStationId === schedule.toStationId) {
      errors.toStationId = 'Departure and arrival stations cannot be the same';
    }
    
    if (schedule.departureTime && schedule.arrivalTime) {
      const depTime = new Date(`2000-01-01T${schedule.departureTime}`);
      const arrTime = new Date(`2000-01-01T${schedule.arrivalTime}`);
      
      if (depTime >= arrTime) {
        errors.arrivalTime = 'Arrival time must be after departure time';
      }
    }
    
    // Date validation - ensure start date is not in the past
    if (schedule.startDate) {
      const scheduleDate = new Date(schedule.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (scheduleDate < today) {
        errors.startDate = 'Start date cannot be in the past';
      }
    }
    
    return errors;
  };
  // Save voyage (add or update)
  const saveVoyage = async () => {
    // Validate before saving
    const errors = validateVoyage(currentVoyage);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsLoading(true);
    try {
      const formattedVoyage = formatVoyageForAPI(currentVoyage);
      
      if (isEditing) {
        // Update existing voyage
        await voyageService.updateVoyage(currentVoyage.id, formattedVoyage);
        showAlert('success', 'Voyage updated successfully');
      } else {
        // Add new voyage
        await voyageService.createVoyage(formattedVoyage);
        showAlert('success', 'Voyage created successfully');
      }
      
      // Refresh voyages list
      await fetchVoyages();
      setValidationErrors({});
      closeModal();
    } catch (error) {
      showAlert('error', `Failed to ${isEditing ? 'update' : 'create'} voyage. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Save weekly schedule
  const saveWeeklySchedule = async () => {
    // Validate before saving
    const errors = validateWeeklySchedule(weeklySchedule);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    setIsLoading(true);
    try {
      // Generate voyages for each selected day for the specified number of weeks
      const voyagesToCreate = [];
      const startDate = new Date(weeklySchedule.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + (weeklySchedule.numberOfWeeks * 7));
      
      // Loop through each day between start and end date
      let currentDate = new Date(startDate);
      while (currentDate < endDate) {
        // Check if this day of week is selected
        const dayOfWeek = currentDate.getDay().toString();
        if (weeklySchedule.daysOfWeek.includes(dayOfWeek)) {
          // Create a voyage for this date
          voyagesToCreate.push({
            fromStationId: parseInt(weeklySchedule.fromStationId),
            toStationId: parseInt(weeklySchedule.toStationId),
            departureDate: currentDate.toISOString().split('T')[0],
            departureTime: weeklySchedule.departureTime,
            arrivalTime: weeklySchedule.arrivalTime,
            status: 'active',
            shipType: weeklySchedule.shipType,
            fuelType: weeklySchedule.fuelType,
            businessSeats: parseInt(weeklySchedule.businessSeats) || 30,
            promoSeats: parseInt(weeklySchedule.promoSeats) || 10,
            economySeats: parseInt(weeklySchedule.economySeats) || 100
          });
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Send bulk create request
      const result = await voyageService.createWeeklySchedule(voyagesToCreate);
      showAlert('success', `Created ${result.createdCount} voyages successfully`);
      
      // Refresh voyages list
      await fetchVoyages();
      setValidationErrors({});
      closeModal();
    } catch (error) {
      showAlert('error', 'Failed to create weekly schedule. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Change voyage status to cancelled
  const cancelVoyage = async (id) => {
    setIsLoading(true);
    try {
      await voyageService.cancelVoyage(id);
      showAlert('success', 'Voyage cancelled successfully');
      await fetchVoyages();
    } catch (error) {
      showAlert('error', 'Failed to cancel voyage. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Open delete confirmation
  const openDeleteConfirmation = (voyage) => {
    setVoyageToDelete(voyage);
    setDeleteModalOpen(true);
  };

  // Delete voyage
  const deleteVoyage = async () => {
    if (voyageToDelete) {
      setIsLoading(true);
      try {
        await voyageService.deleteVoyage(voyageToDelete.id);
        showAlert('success', 'Voyage deleted successfully');
        await fetchVoyages();
        setDeleteModalOpen(false);
        setVoyageToDelete(null);
      } catch (error) {
        showAlert('error', 'Failed to delete voyage. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Get station name by id
  const getStationName = (stationId) => {
    const station = stations.find(s => s.id === stationId);
    if (station) {
      return `${station.city} - ${station.title}`;
    }
    return 'Unknown Station';
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Map status from API to UI display
  const mapStatusToUI = (status) => {
    return status === 'active' ? 'normal' : 'cancelled';
  };
  
  // Generate days of week options for weekly schedule
  const daysOfWeek = [
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' }
  ];
  
  // Ship types
  const shipTypes = ['Fast Ferry', 'Sea Bus'];
  return (
     <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Voyage Management</h1>
        
        {/* Alert notification */}
        {alert.show && (
          <div className={`mb-4 p-4 rounded ${
            alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {alert.message}
          </div>
        )}
        
        {/* Filter and add section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between mb-4">
            <h2 className="text-xl font-semibold mb-4 lg:mb-0">Filters</h2>
            <div className="flex space-x-2">
              <button 
                onClick={openWeeklyScheduleModal}
                className="bg-[#06AED5] text-white px-4 py-2 rounded flex items-center justify-center hover:bg-[#058aaa] transition"
              >
                <Calendar size={18} className="mr-2" />
                Weekly Schedule
              </button>
              <button 
                onClick={openAddModal}
                className="bg-[#06AED5] text-white px-4 py-2 rounded flex items-center justify-center hover:bg-[#058aaa] transition"
              >
                <Plus size={18} className="mr-2" />
                Add New Voyage
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div>
              <select
                name="fromStationId"
                value={stationFilters.fromStationId}
                onChange={handleStationFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
              >
                <option value="">All Departure Stations</option>
                {stations.map(station => (
                  <option key={`from-${station.id}`} value={station.id}>
                    {station.city} - {station.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                name="toStationId"
                value={stationFilters.toStationId}
                onChange={handleStationFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
              >
                <option value="">All Arrival Stations</option>
                {stations.map(station => (
                  <option key={`to-${station.id}`} value={station.id}>
                    {station.city} - {station.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
              />
            </div>
            
            <div>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
              >
                <option value="">All Statuses</option>
                <option value="normal">Normal</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            
            <div>
              <select
                name="shipType"
                value={filters.shipType}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
              >
                <option value="">All Ship Types</option>
                {shipTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <select
                name="fuelType"
                value={filters.fuelType}
                onChange={handleFilterChange}
                className="rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
              >
                <option value="">All Fuel Types</option>
                <option value="true">LPG Available</option>
                <option value="false">No LPG</option>
              </select>
            </div>
            
            <button 
              onClick={resetFilters}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <RefreshCcw size={16} className="mr-1" />
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#06AED5]"></div>
          </div>
        )}
        
        {/* Error message */}
        {error && !isLoading && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg my-4">
            {error}
          </div>
        )}
        
        {/* Voyages table */}
        {!isLoading && !error && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#06AED5]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Ship Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">LPG</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVoyages.length > 0 ? (
                    filteredVoyages.map((voyage) => (
                      <tr key={voyage.id} className={voyage.status === 'cancel' ? 'bg-red-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {voyage.fromStationTitle} → {voyage.toStationTitle}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatTime(voyage.departureTime)} - {formatTime(voyage.arrivalTime)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(voyage.departureDate)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${voyage.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {mapStatusToUI(voyage.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {voyage.shipType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full 
                            ${voyage.fuelType ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {voyage.fuelType ? <Check size={14} /> : <X size={14} />}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {voyage.status !== 'cancel' && (
                              <button 
                                onClick={() => cancelVoyage(voyage.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title="Cancel Voyage"
                              >
                                <X size={18} />
                              </button>
                            )}
                            <button 
                              onClick={() => openEditModal(voyage)}
                              className="text-[#06AED5] hover:text-[#058aaa]"
                              title="Edit Voyage"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => openDeleteConfirmation(voyage)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Voyage"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        No voyages found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {/* Add/Edit Voyage Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                {isEditing ? 'Edit Voyage' : 'Add New Voyage'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Station
                  </label>
                  <select
                    name="fromStationId"
                    value={currentVoyage.fromStationId}
                    onChange={handleInputChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.fromStationId 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  >
                    <option value="">Select a station</option>
                    {stations.map(station => (
                      <option key={`modal-from-${station.id}`} value={station.id}>
                        {station.city} - {station.title}
                      </option>
                    ))}
                  </select>
                  {validationErrors.fromStationId && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.fromStationId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrival Station
                  </label>
                  <select
                    name="toStationId"
                    value={currentVoyage.toStationId}
                    onChange={handleInputChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.toStationId 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  >
                    <option value="">Select a station</option>
                    {stations.map(station => (
                      <option key={`modal-to-${station.id}`} value={station.id}>
                        {station.city} - {station.title}
                      </option>
                    ))}
                  </select>
                  {validationErrors.toStationId && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.toStationId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    name="departureTime"
                    value={currentVoyage.departureTime}
                    onChange={handleInputChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.departureTime 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  />
                  {validationErrors.departureTime && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.departureTime}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={currentVoyage.arrivalTime}
                    onChange={handleInputChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.arrivalTime 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  />
                  {validationErrors.arrivalTime && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.arrivalTime}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    name="departureDate"
                    value={currentVoyage.departureDate}
                    onChange={handleInputChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.departureDate 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  />
                  {validationErrors.departureDate && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.departureDate}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={currentVoyage.status}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  >
                    <option value="active">Normal</option>
                    <option value="cancel">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ship Type
                  </label>
                  <select
                    name="shipType"
                    value={currentVoyage.shipType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  >
                    {shipTypes.map(type => (
                      <option key={`ship-type-${type}`} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Seats
                  </label>
                  <input
                    type="number"
                    name="businessSeats"
                    value={currentVoyage.businessSeats}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Seats
                  </label>
                  <input
                    type="number"
                    name="promoSeats"
                    value={currentVoyage.promoSeats}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Economy Seats
                  </label>
                  <input
                    type="number"
                    name="economySeats"
                    value={currentVoyage.economySeats}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1 mr-2">
                    LPG Available
                  </label>
                  <input
                    type="checkbox"
                    name="fuelType"
                    checked={currentVoyage.fuelType}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-[#06AED5] border-gray-300 rounded focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveVoyage}
                  className="px-4 py-2 bg-[#06AED5] text-white rounded-md hover:bg-[#058aaa]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    `${isEditing ? 'Update' : 'Add'} Voyage`
                  )}
                </button>
              </div>
              
              {/* Summary of all validation errors */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1">Please fix the following errors:</p>
                  <ul className="list-disc ml-5 text-xs text-red-700">
                    {Object.values(validationErrors)
                      .filter(error => error !== null)
                      .map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Weekly Schedule Modal */}
      {isWeeklyScheduleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">
                Create Weekly Schedule
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Station
                  </label>
                  <select
                    name="fromStationId"
                    value={weeklySchedule.fromStationId}
                    onChange={handleWeeklyScheduleChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.fromStationId 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  >
                    <option value="">Select a station</option>
                    {stations.map(station => (
                      <option key={`weekly-from-${station.id}`} value={station.id}>
                        {station.city} - {station.title}
                      </option>
                    ))}
                  </select>
                  {validationErrors.fromStationId && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.fromStationId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrival Station
                  </label>
                  <select
                    name="toStationId"
                    value={weeklySchedule.toStationId}
                    onChange={handleWeeklyScheduleChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.toStationId 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  >
                    <option value="">Select a station</option>
                    {stations.map(station => (
                      <option key={`weekly-to-${station.id}`} value={station.id}>
                        {station.city} - {station.title}
                      </option>
                    ))}
                  </select>
                  {validationErrors.toStationId && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.toStationId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departure Time
                  </label>
                  <input
                    type="time"
                    name="departureTime"
                    value={weeklySchedule.departureTime}
                    onChange={handleWeeklyScheduleChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.departureTime 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  />
                  {validationErrors.departureTime && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.departureTime}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrival Time
                  </label>
                  <input
                    type="time"
                    name="arrivalTime"
                    value={weeklySchedule.arrivalTime}
                    onChange={handleWeeklyScheduleChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.arrivalTime 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  />
                  {validationErrors.arrivalTime && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.arrivalTime}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={weeklySchedule.startDate}
                    onChange={handleWeeklyScheduleChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.startDate 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  />
                  {validationErrors.startDate && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.startDate}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Weeks
                  </label>
                  <input
                    type="number"
                    name="numberOfWeeks"
                    value={weeklySchedule.numberOfWeeks}
                    onChange={handleWeeklyScheduleChange}
                    min="1"
                    max="52"
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-[#06AED5] focus:ring-opacity-50 ${
                      validationErrors.numberOfWeeks 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-[#06AED5]'
                    }`}
                    required
                  />
                  {validationErrors.numberOfWeeks && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.numberOfWeeks}</p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Days of Week
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map(day => (
                      <div key={`day-${day.value}`} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`day-${day.value}`}
                          name="daysOfWeek"
                          value={day.value}
                          checked={weeklySchedule.daysOfWeek.includes(day.value)}
                          onChange={handleWeeklyScheduleChange}
                          className="h-4 w-4 text-[#06AED5] border-gray-300 rounded focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                        />
                        <label htmlFor={`day-${day.value}`} className="ml-2 text-sm text-gray-700">
                          {day.label.substr(0, 3)}
                        </label>
                      </div>
                    ))}
                  </div>
                  {validationErrors.daysOfWeek && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.daysOfWeek}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ship Type
                  </label>
                  <select
                    name="shipType"
                    value={weeklySchedule.shipType}
                    onChange={handleWeeklyScheduleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  >
                    {shipTypes.map(type => (
                      <option key={`weekly-ship-${type}`} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1 mr-2">
                    LPG Available
                  </label>
                  <input
                    type="checkbox"
                    name="fuelType"
                    checked={weeklySchedule.fuelType}
                    onChange={handleWeeklyScheduleChange}
                    className="h-4 w-4 text-[#06AED5] border-gray-300 rounded focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Seats
                  </label>
                  <input
                    type="number"
                    name="businessSeats"
                    value={weeklySchedule.businessSeats}
                    onChange={handleWeeklyScheduleChange}
                    min="0"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Promo Seats
                  </label>
                  <input
                    type="number"
                    name="promoSeats"
                    value={weeklySchedule.promoSeats}
                    onChange={handleWeeklyScheduleChange}
                    min="0"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Economy Seats
                  </label>
                  <input
                    type="number"
                    name="economySeats"
                    value={weeklySchedule.economySeats}
                    onChange={handleWeeklyScheduleChange}
                    min="0"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveWeeklySchedule}
                  className="px-4 py-2 bg-[#06AED5] text-white rounded-md hover:bg-[#058aaa]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Create Weekly Schedule'}
                </button>
              </div>
              
              {/* Summary of all validation errors */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1">Please fix the following errors:</p>
                  <ul className="list-disc ml-5 text-xs text-red-700">
                    {Object.values(validationErrors)
                      .filter(error => error !== null)
                      .map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && voyageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-5 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold">Confirm Delete</h2>
            </div>
            
            <p className="mb-4">
              Are you sure you want to delete the voyage from <span className="font-semibold">{voyageToDelete.fromStationCity} ({voyageToDelete.fromStationTitle})</span> to <span className="font-semibold">{voyageToDelete.toStationCity} ({voyageToDelete.toStationTitle})</span> on <span className="font-semibold">{formatDate(voyageToDelete.departureDate)}</span>?
            </p>
            <p className="mb-4 text-red-600 font-medium">
              This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3 mt-5">
              <button 
                onClick={() => {
                  setDeleteModalOpen(false);
                  setVoyageToDelete(null);
                }} 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button 
                onClick={deleteVoyage} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </span>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVoyage;