import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, X, Check, RefreshCcw, AlertCircle, Calendar } from 'lucide-react';
import { useSessionToken } from "../../utils/sessions";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

// API Service for interacting with the backend
const API_BASE_URL = 'http://localhost:8080/api';

// Constants for voyage statuses
const VOYAGE_STATUS = {
  ACTIVE: 'active',
  CANCEL: 'cancel',
  COMPLETED: 'completed'
};

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

  getSeatsSoldByVoyageId: async (voyageId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/seats-sold/voyage/${voyageId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching seats sold data:', error);
      return null;
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
    const token = useSessionToken();
    try {
      const response = await axios.post(`${API_BASE_URL}/voyages`, voyageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating voyage:', error);
      throw error;
    }
  },
  
  // Update an existing voyage
  updateVoyage: async (id, voyageData) => {
    const token = useSessionToken();
    try {
      const response = await axios.put(`${API_BASE_URL}/voyages/${id}`, voyageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating voyage:', error);
      throw error;
    }
  },
  
  // Delete a voyage
  deleteVoyage: async (id) => {
    const token = useSessionToken();
    try {
      const response = await axios.delete(`${API_BASE_URL}/voyages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting voyage:', error);
      throw error;
    }
  },
  
  // Cancel a voyage
  cancelVoyage: async (id) => {
    const token = useSessionToken();
    try {
      
      const response = await axios.put(`${API_BASE_URL}/voyages/${id}/cancel`,{}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling voyage:', error);
      throw error;
    }
  },
  
  // Create weekly schedule
  createWeeklySchedule: async (scheduleData) => {
    const token = useSessionToken();
    try {
      const response = await axios.post(`${API_BASE_URL}/voyages/bulk`, scheduleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating weekly schedule:', error);
      throw error;
    }
  }
};

const AdminVoyage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  // State management
  const [voyages, setVoyages] = useState([]);
  const [filteredVoyages, setFilteredVoyages] = useState([]);
  const [stations, setStations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [seatsSoldData, setSeatsSoldData] = useState({});
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isWeeklyScheduleModalOpen, setIsWeeklyScheduleModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const fetchSeatsSoldData = async (voyageIds) => {
    const seatsSoldMap = {};
    
    await Promise.all(
      voyageIds.map(async (voyageId) => {
        try {
          const data = await voyageService.getSeatsSoldByVoyageId(voyageId);
          if (data) {
            seatsSoldMap[voyageId] = data;
          }
        } catch (error) {
          console.error(`Error fetching seats sold for voyage ${voyageId}:`, error);
        }
      })
    );
    
    setSeatsSoldData(seatsSoldMap);
  };
  
  
  // Current voyage for editing/creating
  const [currentVoyage, setCurrentVoyage] = useState({
    id: null,
    fromStationId: '',
    toStationId: '',
    departureTime: '',
    arrivalTime: '',
    departureDate: '',
    status: VOYAGE_STATUS.ACTIVE,
    shipType: t('adminVoyage.shipTypes.fastFerry'),
    fuelType: false,
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
    shipType: t('adminVoyage.shipTypes.fastFerry'),
    fuelType: false,
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    status: 'normal',
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

  const fetchVoyages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await voyageService.getVoyages();
      
      // Process voyages to mark completed ones and set edit/delete permissions
      const processedData = processVoyagesStatus(data);
      
      setVoyages(processedData);
      
      // Apply the default filter (normal status)
      const normalVoyages = processedData.filter(voyage => 
        voyage.status === VOYAGE_STATUS.ACTIVE
      );
      setFilteredVoyages(normalVoyages);
      
      // Fetch seats sold data for all voyages
      const voyageIds = data.map(voyage => voyage.id);
      await fetchSeatsSoldData(voyageIds);
      
      setIsLoading(false);
    } catch (err) {
      setError(t('adminVoyage.alerts.failedToLoad'));
      setIsLoading(false);
      showAlert('error', t('adminVoyage.alerts.failedToLoad'));
    }
  };
  

  const processVoyagesStatus = (voyages) => {
    return voyages.map(voyage => {
      // Create a copy to avoid mutating the original
      const processedVoyage = {...voyage};
      
      // Check if voyage is completed
      if (isVoyageCompleted(voyage)) {
        processedVoyage.status = VOYAGE_STATUS.COMPLETED;
        processedVoyage.canEdit = false;
        processedVoyage.canDelete = false;
      } else if (voyage.status === VOYAGE_STATUS.ACTIVE) {
        processedVoyage.canEdit = true;
        processedVoyage.canDelete = false; // Active voyages can't be deleted directly
      } else if (voyage.status === VOYAGE_STATUS.CANCEL) {
        processedVoyage.canEdit = true;
        processedVoyage.canDelete = true; // Only cancelled voyages can be deleted
      }
      
      return processedVoyage;
    });
  };

  // Fetch stations for dropdowns
  const fetchStations = async () => {
    try {
      const data = await voyageService.getStations();
      setStations(data);
    } catch (err) {
      showAlert('error', t('adminVoyage.alerts.failedToLoadStations'));
    }
  };
  const isVoyageCompleted = (voyage) => {
    const voyageDate = new Date(voyage.departureDate);
    const currentDate = new Date();
    
    // If date is in the past
    if (voyageDate < currentDate && 
        !(voyageDate.getFullYear() === currentDate.getFullYear() &&
          voyageDate.getMonth() === currentDate.getMonth() &&
          voyageDate.getDate() === currentDate.getDate())) {
      return true;
    }
    
    // If it's today, check if the arrival time has passed
    if (voyageDate.getFullYear() === currentDate.getFullYear() &&
        voyageDate.getMonth() === currentDate.getMonth() &&
        voyageDate.getDate() === currentDate.getDate()) {
      
      const [arrivalHours, arrivalMinutes] = voyage.arrivalTime.split(':').map(Number);
      const [currentHours, currentMinutes] = [
        currentDate.getHours(), 
        currentDate.getMinutes()
      ];
      
      // Check if arrival time has passed
      if (currentHours > arrivalHours || 
          (currentHours === arrivalHours && currentMinutes > arrivalMinutes)) {
        return true;
      }
    }
    
    return false;
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
    let apiStatus;
    switch(filters.status) {
      case 'normal':
        apiStatus = VOYAGE_STATUS.ACTIVE;
        break;
      case 'cancelled':
        apiStatus = VOYAGE_STATUS.CANCEL;
        break;
      case 'completed':
        apiStatus = VOYAGE_STATUS.COMPLETED;
        break;
      default:
        apiStatus = filters.status;
    }
    
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
      status: 'normal',
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
      status: VOYAGE_STATUS.ACTIVE,
      shipType: t('adminVoyage.shipTypes.fastFerry'),
      fuelType: false,
    });
    setIsModalOpen(true);
    setValidationErrors({});
  };

  // Open modal for editing voyage
  const openEditModal = (voyage) => {
    // Don't allow editing of completed voyages
    if (voyage.status === VOYAGE_STATUS.COMPLETED) {
      showAlert('error', t('adminVoyage.alerts.cannotEditCompleted'));
      return;
    }
    
    setIsEditing(true);
    
    // Format the voyage data for the form
    const formattedVoyage = {
      ...voyage,
      departureDate: voyage.departureDate,
      // Convert API status to UI status
      status: voyage.status === VOYAGE_STATUS.ACTIVE ? VOYAGE_STATUS.ACTIVE : VOYAGE_STATUS.CANCEL
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
      shipType: t('adminVoyage.shipTypes.fastFerry'),
      fuelType: false,
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
  
  const indexOfLastVoyage = currentPage * rowsPerPage;
  const indexOfFirstVoyage = indexOfLastVoyage - rowsPerPage;
  const currentVoyages = filteredVoyages.slice(indexOfFirstVoyage, indexOfLastVoyage);
  const totalPages = Math.ceil(filteredVoyages.length / rowsPerPage);

  // Function to change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, stationFilters]);

  // Function to handle rows per page change
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to first page when changing rows per page
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
    } else if (name === 'numberOfWeeks') {
      // Handle number of weeks with validation
      let numValue = parseInt(value);
      
      // Enforce min and max limits
      if (isNaN(numValue)) {
        numValue = 1; // Default to 1 if not a number
      } else if (numValue < 1) {
        numValue = 1; // Enforce minimum of 1
      } else if (numValue > 52) {
        numValue = 52; // Enforce maximum of 52
      }
      
      setWeeklySchedule(prev => ({
        ...prev,
        numberOfWeeks: numValue
      }));
    } else {
      setWeeklySchedule(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
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
    const isFastFerry = voyage.shipType === t('adminVoyage.shipTypes.fastFerry');
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
      businessSeats: isFastFerry ? 50 : 30,
      promoSeats: isFastFerry ? 100 : 60,
      economySeats: isFastFerry ? 100 : 60,
    };
  };
  
  // Validate voyage data
  const validateVoyage = (voyage) => {
    const errors = {};
    
    // Required fields validation
    if (!voyage.fromStationId) {
      errors.fromStationId = t('adminVoyage.validation.departureRequired');
    }
    
    if (!voyage.toStationId) {
      errors.toStationId = t('adminVoyage.validation.arrivalRequired');
    }
    
    if (!voyage.departureTime) {
      errors.departureTime = t('adminVoyage.validation.departureTimeRequired');
    }
    
    if (!voyage.arrivalTime) {
      errors.arrivalTime = t('adminVoyage.validation.arrivalTimeRequired');
    }
    
    if (!voyage.departureDate) {
      errors.departureDate = t('adminVoyage.validation.dateRequired');
    }
    
    // Logical validations - convert IDs to numbers before comparing
    if (voyage.fromStationId && voyage.toStationId) {
      // Convert to numbers to ensure consistent comparison
      const fromId = parseInt(voyage.fromStationId);
      const toId = parseInt(voyage.toStationId);
      
      if (fromId === toId) {
        errors.toStationId = t('adminVoyage.validation.stationsSame');
      }
    }
    
    // Only continue with other validations if stations are different
    if (!errors.toStationId) {
      if (voyage.departureTime && voyage.arrivalTime) {
        // Check if arrival time is after departure time
        const depTime = new Date(`2000-01-01T${voyage.departureTime}`);
        const arrTime = new Date(`2000-01-01T${voyage.arrivalTime}`);
        
        // Check if arrival time is earlier in the day than departure time
        if (arrTime < depTime) {
          errors.arrivalTime = t('adminVoyage.validation.arrivalBeforeDeparture');
        } else {
          // Continue with existing validation...
          const timeDiffMinutes = (arrTime - depTime) / 60000; // Convert ms to minutes
          if (timeDiffMinutes < 40) {
            errors.arrivalTime = t('adminVoyage.validation.minVoyageTime');
          }
        }
      }
      
      // Date validation - ensure date is not in the past
      if (voyage.departureDate) {
        const voyageDate = new Date(voyage.departureDate);
        const today = new Date();
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        
        if (voyageDate < todayStart) {
          errors.departureDate = t('adminVoyage.validation.pastDate');
        }
  
        if (voyage.departureDate) {
          const voyageDate = new Date(voyage.departureDate);
          const today = new Date();
          const todayStart = new Date(today);
          todayStart.setHours(0, 0, 0, 0);
          
          // Get date one year from today
          const oneYearFromNow = new Date(todayStart);
          oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
          
          if (voyageDate < todayStart) {
            errors.departureDate = t('adminVoyage.validation.pastDate');
          } else if (voyageDate > oneYearFromNow) {
            errors.departureDate = t('adminVoyage.validation.futureTooFar');
          }
        }
  
        // If the voyage is today, validate that the time is not in the past
        if (voyageDate.getFullYear() === today.getFullYear() &&
            voyageDate.getMonth() === today.getMonth() &&
            voyageDate.getDate() === today.getDate()) {
          
          if (voyage.departureTime) {
            const [depHours, depMinutes] = voyage.departureTime.split(':').map(Number);
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();
            
            if (depHours < currentHour || (depHours === currentHour && depMinutes <= currentMinute)) {
              errors.departureTime = t('adminVoyage.validation.pastDepartureToday');
            }
          }
          
          if (voyage.arrivalTime) {
            const [arrHours, arrMinutes] = voyage.arrivalTime.split(':').map(Number);
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();
            
            if (arrHours < currentHour || (arrHours === currentHour && arrMinutes <= currentMinute)) {
              errors.arrivalTime = t('adminVoyage.validation.pastArrivalToday');
            }
          }
        }
      }
    }
    
    return errors;
  };

  // Validate weekly schedule data
  const validateWeeklySchedule = (schedule) => {
    const errors = {};
    
    // Required fields validation
    if (!schedule.fromStationId) {
      errors.fromStationId = t('adminVoyage.validation.departureRequired');
    }
    
    if (!schedule.toStationId) {
      errors.toStationId = t('adminVoyage.validation.arrivalRequired');
    }
    
    if (!schedule.departureTime) {
      errors.departureTime = t('adminVoyage.validation.departureTimeRequired');
    }
    
    if (!schedule.arrivalTime) {
      errors.arrivalTime = t('adminVoyage.validation.arrivalTimeRequired');
    }
    
    if (!schedule.startDate) {
      errors.startDate = t('adminVoyage.validation.startDateRequired');
    }
    
    if (schedule.daysOfWeek.length === 0) {
      errors.daysOfWeek = t('adminVoyage.validation.daysRequired');
    }
    
    if (!schedule.numberOfWeeks || schedule.numberOfWeeks < 1) {
      errors.numberOfWeeks = t('adminVoyage.validation.weeksRequired');
    }
    
    // Logical validations
    if (schedule.fromStationId && schedule.toStationId && schedule.fromStationId === schedule.toStationId) {
      errors.toStationId = t('adminVoyage.validation.stationsSame');
      return errors; // Return early to prevent additional validation and form submission with invalid stations
    }
    
    if (schedule.departureTime && schedule.arrivalTime) {
      // Check if arrival time is after departure time
      const depTime = new Date(`2000-01-01T${schedule.departureTime}`);
      const arrTime = new Date(`2000-01-01T${schedule.arrivalTime}`);
      
      // Check if arrival time is earlier in the day than departure time
      if (arrTime < depTime) {
        errors.arrivalTime = t('adminVoyage.validation.arrivalBeforeDeparture');
        return errors; // Return early to prevent additional logic on this invalid state
      }
      
      // Continue with existing validation...
      const timeDiffMinutes = (arrTime - depTime) / 60000; // Convert ms to minutes
      if (timeDiffMinutes < 40) {
        errors.arrivalTime = t('adminVoyage.validation.minVoyageTime');
      }
    }
    if (schedule.startDate) {
      const scheduleDate = new Date(schedule.startDate);
      const today = new Date();
      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);
      
      // Get date one year from today
      const oneYearFromNow = new Date(todayStart);
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      
      if (scheduleDate < todayStart) {
        errors.startDate = t('adminVoyage.validation.pastDate');
      } else if (scheduleDate > oneYearFromNow) {
        errors.startDate = t('adminVoyage.validation.futureTooFar');
      }
    }
    // Date validation - ensure start date is not in the past
    if (schedule.startDate) {
      const scheduleDate = new Date(schedule.startDate);
      const today = new Date();
      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);
      
      if (scheduleDate < todayStart) {
        errors.startDate = t('adminVoyage.validation.pastDate');
      }
      
      // If the schedule starts today, validate that the time is not in the past
      if (scheduleDate.getFullYear() === today.getFullYear() &&
          scheduleDate.getMonth() === today.getMonth() &&
          scheduleDate.getDate() === today.getDate()) {
        
        if (schedule.departureTime) {
          const [depHours, depMinutes] = schedule.departureTime.split(':').map(Number);
          const currentHour = today.getHours();
          const currentMinute = today.getMinutes();
          
          if (depHours < currentHour || (depHours === currentHour && depMinutes <= currentMinute)) {
            errors.departureTime = t('adminVoyage.validation.pastDepartureToday');
          }
        }
        
        if (schedule.arrivalTime) {
          const [arrHours, arrMinutes] = schedule.arrivalTime.split(':').map(Number);
          const currentHour = today.getHours();
          const currentMinute = today.getMinutes();
          
          if (arrHours < currentHour || (arrHours === currentHour && arrMinutes <= currentMinute)) {
            errors.arrivalTime = t('adminVoyage.validation.pastArrivalToday');
          }
        }
      }
    }
    
    return errors;
  };
  // Save voyage (add or update)
  const saveVoyage = async () => {
    // Validate first and ensure we always use the most up-to-date state
    const errors = validateVoyage(currentVoyage);
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    // Check if voyage might have become completed while editing
    if (isEditing) {
      try {
        const response = await voyageService.getVoyages({ id: currentVoyage.id });
        const serverVoyage = response.find(v => v.id === currentVoyage.id);
        
        if (serverVoyage && isVoyageCompleted(serverVoyage)) {
          showAlert('error', t('adminVoyage.alerts.cannotEditCompleted'));
          closeModal();
          await fetchVoyages(); // Refresh the list to show updated status
          return;
        }
      } catch (error) {
        console.error('Error checking voyage status:', error);
      }
    }
    
    setIsLoading(true);
    try {
      const formattedVoyage = formatVoyageForAPI(currentVoyage);
      
      if (isEditing) {
        await voyageService.updateVoyage(currentVoyage.id, formattedVoyage);
        showAlert('success', t('adminVoyage.alerts.voyageUpdated'));
      } else {
        await voyageService.createVoyage(formattedVoyage);
        showAlert('success', t('adminVoyage.alerts.voyageCreated'));
      }
      
      await fetchVoyages();
      setValidationErrors({});
      closeModal();
    } catch (error) {
      showAlert('error', t(isEditing ? 'adminVoyage.alerts.failedToUpdate' : 'adminVoyage.alerts.failedToCreate'));
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
      const isFastFerry = weeklySchedule.shipType === t('adminVoyage.shipTypes.fastFerry');
      
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
            status: VOYAGE_STATUS.ACTIVE,
            shipType: weeklySchedule.shipType,
            fuelType: weeklySchedule.fuelType,
            businessSeats: isFastFerry ? 50 : 30,
            promoSeats: isFastFerry ? 100 : 60,
            economySeats: isFastFerry ? 100 : 60,
          });
        }
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      // Send bulk create request
      const result = await voyageService.createWeeklySchedule(voyagesToCreate);
      showAlert('success', t('adminVoyage.alerts.weeklyCreated', { count: result.createdCount }));
      
      // Refresh voyages list
      await fetchVoyages();
      setValidationErrors({});
      closeModal();
    } catch (error) {
      showAlert('error', t('adminVoyage.alerts.failedToCreateWeekly'));
    } finally {
      setIsLoading(false);
    }
  };

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [voyageToCancel, setVoyageToCancel] = useState(null);

    const openCancelConfirmation = (voyage) => {
      setVoyageToCancel(voyage);
      setCancelModalOpen(true);
    };

    const cancelVoyage = async () => {
      if (!voyageToCancel) return;
      
      setIsLoading(true);
      try {
        await voyageService.cancelVoyage(voyageToCancel.id);
        showAlert('success', t('adminVoyage.alerts.voyageCancelled'));
        await fetchVoyages();
        setCancelModalOpen(false);
        setVoyageToCancel(null);
      } catch (error) {
        showAlert('error', t('adminVoyage.alerts.failedToCancel'));
      } finally {
        setIsLoading(false);
      }
    };

  // Open delete confirmation
  const openDeleteConfirmation = (voyage) => {
    // Only allow deletion of cancelled voyages, not completed ones
    if (voyage.status === VOYAGE_STATUS.CANCEL) {
      setVoyageToDelete(voyage);
      setDeleteModalOpen(true);
    } else if (voyage.status === VOYAGE_STATUS.COMPLETED) {
      showAlert('error', t('adminVoyage.alerts.cannotDeleteCompleted'));
    }
  };

  // Delete voyage
  const deleteVoyage = async () => {
    if (voyageToDelete) {
      setIsLoading(true);
      try {
        await voyageService.deleteVoyage(voyageToDelete.id);
        showAlert('success', t('adminVoyage.alerts.voyageDeleted'));
        await fetchVoyages();
        setDeleteModalOpen(false);
        setVoyageToDelete(null);
      } catch (error) {
        showAlert('error', t('adminVoyage.alerts.failedToDelete'));
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
    return t('adminVoyage.table.unknownStation');
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(i18next.language || 'en', options);
  };
  
  // Map status from API to UI display
  const mapStatusToUI = (status) => {
    switch(status) {
      case VOYAGE_STATUS.ACTIVE:
        return t('adminVoyage.filters.normal');
      case VOYAGE_STATUS.CANCEL:
        return t('adminVoyage.filters.cancelled');
      case VOYAGE_STATUS.COMPLETED:
        return t('adminVoyage.filters.completed');
      default:
        return status;
    }
  };
  
  // Generate days of week options for weekly schedule
  const daysOfWeek = [
    { value: '1', label: 'monday', shortLabel: 'mon' },
    { value: '2', label: 'tuesday', shortLabel: 'tue' },
    { value: '3', label: 'wednesday', shortLabel: 'wed' },
    { value: '4', label: 'thursday', shortLabel: 'thu' },
    { value: '5', label: 'friday', shortLabel: 'fri' },
    { value: '6', label: 'saturday', shortLabel: 'sat' },
    { value: '0', label: 'sunday', shortLabel: 'sun' }
  ];
  
  // Ship types
  const shipTypes = [t('adminVoyage.shipTypes.fastFerry'), t('adminVoyage.shipTypes.seaBus')];
  return (
     <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">{t('adminVoyage.title')}</h1>
        
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
            <h2 className="text-xl font-semibold mb-4 lg:mb-0">{t('adminVoyage.filters.title')}</h2>
            <div className="flex space-x-2">
              <button 
                onClick={openWeeklyScheduleModal}
                className="bg-[#06AED5] text-white px-4 py-2 rounded flex items-center justify-center hover:bg-[#058aaa] transition"
              >
                <Calendar size={18} className="mr-2" />
                {t('adminVoyage.buttons.addWeeklySchedule')}
              </button>
              <button 
                onClick={openAddModal}
                className="bg-[#06AED5] text-white px-4 py-2 rounded flex items-center justify-center hover:bg-[#058aaa] transition"
              >
                <Plus size={18} className="mr-2" />
                {t('adminVoyage.buttons.addNewVoyage')}
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
                <option value="">{t('adminVoyage.filters.allDepartureStations')}</option>
                {stations.map(station => (
                  <option key={`from-${station.id}`} value={station.id}>
                    {station.title}
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
                <option value="">{t('adminVoyage.filters.allArrivalStations')}</option>
                {stations.map(station => (
                  <option key={`to-${station.id}`} value={station.id}>
                    {station.title}
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
              <option value="">{t('adminVoyage.filters.allStatuses')}</option>
              <option value="normal">{t('adminVoyage.filters.normal')}</option>
              <option value="cancelled">{t('adminVoyage.filters.cancelled')}</option>
              <option value="completed">{t('adminVoyage.filters.completed')}</option>
            </select>
            </div>
            
            <div>
              <select
                name="shipType"
                value={filters.shipType}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
              >
                <option value="">{t('adminVoyage.filters.allShipTypes')}</option>
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
                <option value="">{t('adminVoyage.filters.allFuelTypes')}</option>
                <option value="true">{t('adminVoyage.filters.lpgAvailable')}</option>
                <option value="false">{t('adminVoyage.filters.noLPG')}</option>
              </select>
            </div>
            
            <button 
              onClick={resetFilters}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <RefreshCcw size={16} className="mr-1" />
              {t('adminVoyage.filters.resetFilters')}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{t('adminVoyage.table.route')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{t('adminVoyage.table.time')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{t('adminVoyage.table.date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{t('adminVoyage.table.status')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{t('adminVoyage.table.ticketsSold')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{t('adminVoyage.table.shipType')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{t('adminVoyage.table.lpg')}</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">{t('adminVoyage.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentVoyages.length > 0 ? (
                    currentVoyages.map((voyage) => (
                      <tr key={voyage.id} className={
                        voyage.status === VOYAGE_STATUS.CANCEL 
                          ? 'bg-red-50' 
                          : voyage.status === VOYAGE_STATUS.COMPLETED
                            ? 'bg-gray-50'
                            : ''
                      }>
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
                            ${voyage.status === VOYAGE_STATUS.ACTIVE 
                              ? 'bg-green-100 text-green-800' 
                              : voyage.status === VOYAGE_STATUS.CANCEL
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'}`}>
                            {mapStatusToUI(voyage.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {seatsSoldData[voyage.id] ? seatsSoldData[voyage.id].totalTicketsSold : '0'}
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
                            {voyage.status === VOYAGE_STATUS.ACTIVE && (
                              <button 
                                onClick={() => openCancelConfirmation(voyage)}
                                className="text-yellow-600 hover:text-yellow-900"
                                title={t('adminVoyage.buttons.cancelVoyage')}
                              >
                                <X size={18} />
                              </button>
                            )}
                            {(voyage.status === VOYAGE_STATUS.ACTIVE || voyage.status === VOYAGE_STATUS.CANCEL) && (
                              <button 
                                onClick={() => openEditModal(voyage)}
                                className="text-[#06AED5] hover:text-[#058aaa]"
                                title={t('adminVoyage.buttons.editVoyage')}
                                disabled={voyage.status === VOYAGE_STATUS.COMPLETED}
                              >
                                <Edit size={18} />
                              </button>
                            )}
                            {voyage.status === VOYAGE_STATUS.CANCEL && (
                              <button 
                                onClick={() => openDeleteConfirmation(voyage)}
                                className="text-red-600 hover:text-red-900"
                                title={t('adminVoyage.buttons.deleteVoyage')}
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                            {voyage.status === VOYAGE_STATUS.COMPLETED && (
                              <>
                                <span className="text-gray-400" title={t('adminVoyage.buttons.cannotEditCompleted')}>
                                  <Edit size={18} />
                                </span>
                                <span className="text-gray-400" title={t('adminVoyage.buttons.cannotDeleteCompleted')}>
                                  <Trash2 size={18} />
                                </span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        {t('adminVoyage.table.noVoyagesFound')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {filteredVoyages.length > 0 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        {t('adminVoyage.table.showing')} <span className="font-medium">{indexOfFirstVoyage + 1}</span> {t('adminVoyage.table.to')}{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastVoyage, filteredVoyages.length)}
                        </span>{" "}
                        {t('adminVoyage.table.of')} <span className="font-medium">{filteredVoyages.length}</span> {t('adminVoyage.table.results')}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4">
                        <select
                          className="border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-[#06AED5] focus:border-[#06AED5]"
                          value={rowsPerPage}
                          onChange={handleRowsPerPageChange}
                        >
                          <option value={10}>10 {t('adminVoyage.table.perPage')}</option>
                          <option value={25}>25 {t('adminVoyage.table.perPage')}</option>
                          <option value={50}>50 {t('adminVoyage.table.perPage')}</option>
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
                          <span className="sr-only">First</span>
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
                          <span className="sr-only">Previous</span>
                          <span className="h-5 w-5 flex justify-center items-center">‹</span>
                        </button>
                        
                        {/* Page number buttons - show current page and up to 2 pages on each side */}
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
                                  ? 'z-10 bg-[#06AED5] text-white focus:z-10'
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
                          <span className="sr-only">Next</span>
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
                          <span className="sr-only">Last</span>
                          <span className="h-5 w-5 flex justify-center items-center">»</span>
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
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
                {isEditing ? t('adminVoyage.addModal.editTitle') : t('adminVoyage.addModal.addTitle')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminVoyage.addModal.departureStation')}
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
                    <option value="">{t('adminVoyage.addModal.selectStation')}</option>
                    {stations.map(station => (
                      <option key={`modal-from-${station.id}`} value={station.id}>
                        {station.title}
                      </option>
                    ))}
                  </select>
                  {validationErrors.fromStationId && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.fromStationId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminVoyage.addModal.arrivalStation')}
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
                    <option value="">{t('adminVoyage.addModal.selectStation')}</option>
                    {stations.map(station => (
                      <option key={`modal-to-${station.id}`} value={station.id}>
                        {station.title}
                      </option>
                    ))}
                  </select>
                  {validationErrors.toStationId && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.toStationId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminVoyage.addModal.departureTime')}
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
                    {t('adminVoyage.addModal.arrivalTime')}
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
                    {t('adminVoyage.addModal.date')}
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
                    {t('adminVoyage.addModal.status')}
                  </label>
                  <select
                    name="status"
                    value={currentVoyage.status}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  >
                    <option value="active">{t('adminVoyage.filters.normal')}</option>
                    <option value="cancel">{t('adminVoyage.filters.cancelled')}</option>
                  </select>
                </div>
                
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('adminVoyage.addModal.shipType')} {isEditing && <span className="text-xs text-gray-500">({t('adminVoyage.addModal.cannotBeChanged')})</span>}
                </label>
                  <select
                    name="shipType"
                    value={currentVoyage.shipType}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#06AED5] focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                    disabled={isEditing}
                  >
                    {shipTypes.map(type => (
                      <option key={`ship-type-${type}`} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1 mr-2">
                    {t('adminVoyage.addModal.lpgAvailable')}
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
                  {t('adminVoyage.addModal.cancel')}
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
                      {t('adminVoyage.addModal.processing')}
                    </span>
                  ) : (
                    `${isEditing ? t('adminVoyage.addModal.updateVoyage') : t('adminVoyage.addModal.addVoyage')}`
                  )}
                </button>
              </div>
              
              {/* Summary of all validation errors */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1">{t('adminVoyage.addModal.fixErrors')}</p>
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
                {t('adminVoyage.weeklyModal.title')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminVoyage.weeklyModal.departureStation')}
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
                    <option value="">{t('adminVoyage.addModal.selectStation')}</option>
                    {stations.map(station => (
                      <option key={`weekly-from-${station.id}`} value={station.id}>
                        {station.title}
                      </option>
                    ))}
                  </select>
                  {validationErrors.fromStationId && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.fromStationId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminVoyage.weeklyModal.arrivalStation')}
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
                    <option value="">{t('adminVoyage.addModal.selectStation')}</option>
                    {stations.map(station => (
                      <option key={`weekly-to-${station.id}`} value={station.id}>
                        {station.title}
                      </option>
                    ))}
                  </select>
                  {validationErrors.toStationId && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.toStationId}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('adminVoyage.weeklyModal.departureTime')}
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
                    {t('adminVoyage.weeklyModal.arrivalTime')}
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
                    {t('adminVoyage.weeklyModal.startDate')}
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
                    {t('adminVoyage.weeklyModal.numberOfWeeks')}
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
                    {t('adminVoyage.weeklyModal.daysOfWeek')}
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
                          {t(`adminVoyage.weeklyModal.${day.shortLabel}`)}
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
                    {t('adminVoyage.weeklyModal.shipType')}
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
                    {t('adminVoyage.weeklyModal.lpgAvailable')}
                  </label>
                  <input
                    type="checkbox"
                    name="fuelType"
                    checked={weeklySchedule.fuelType}
                    onChange={handleWeeklyScheduleChange}
                    className="h-4 w-4 text-[#06AED5] border-gray-300 rounded focus:ring focus:ring-[#06AED5] focus:ring-opacity-50"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {t('adminVoyage.weeklyModal.cancel')}
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
                      {t('adminVoyage.weeklyModal.processing')}
                    </span>
                  ) : t('adminVoyage.weeklyModal.createWeeklySchedule')}
                </button>
              </div>
              
              {/* Summary of all validation errors */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="text-sm font-medium text-red-800 mb-1">{t('adminVoyage.weeklyModal.fixErrors')}</p>
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
              <h2 className="text-lg sm:text-xl font-semibold">{t('adminVoyage.deleteModal.title')}</h2>
            </div>
            
            <p className="mb-4">
              {t('adminVoyage.deleteModal.confirmMessage')} <span className="font-semibold">({voyageToDelete.fromStationTitle})</span> {t('adminVoyage.deleteModal.to')} <span className="font-semibold">({voyageToDelete.toStationTitle})</span> {t('adminVoyage.deleteModal.on')} <span className="font-semibold">{formatDate(voyageToDelete.departureDate)}</span>?
            </p>
            
            {seatsSoldData[voyageToDelete.id]?.totalTicketsSold > 0 && (
              <p className="mb-4 text-orange-600 font-medium">
                {t('adminVoyage.deleteModal.ticketsWarning', { count: seatsSoldData[voyageToDelete.id].totalTicketsSold })}
              </p>
            )}
            
            <p className="mb-4 text-red-600 font-medium">
              {t('adminVoyage.deleteModal.cannotUndo')}
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
                {t('adminVoyage.deleteModal.cancel')}
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
                    {t('adminVoyage.deleteModal.deleting')}
                  </span>
                ) : t('adminVoyage.deleteModal.delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && voyageToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-5 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-yellow-600" />
              <h2 className="text-lg sm:text-xl font-semibold">{t('adminVoyage.cancelModal.title')}</h2>
            </div>
            
            <p className="mb-4">
              {t('adminVoyage.cancelModal.confirmMessage')} <span className="font-semibold">{voyageToCancel.fromStationTitle}</span> {t('adminVoyage.cancelModal.to')} <span className="font-semibold">{voyageToCancel.toStationTitle}</span> {t('adminVoyage.cancelModal.on')} <span className="font-semibold">{formatDate(voyageToCancel.departureDate)}</span>?
            </p>
            
            {seatsSoldData[voyageToCancel.id]?.totalTicketsSold > 0 && (
              <p className="mb-4 text-orange-600 font-medium">
                {t('adminVoyage.cancelModal.ticketsWarning', { count: seatsSoldData[voyageToCancel.id].totalTicketsSold })}
              </p>
            )}
            
            <p className="mb-4 text-yellow-600 font-medium">
              {t('adminVoyage.cancelModal.serviceWarning')}
            </p>
            
            <div className="flex justify-end gap-3 mt-5">
              <button 
                onClick={() => {
                  setCancelModalOpen(false);
                  setVoyageToCancel(null);
                }} 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                disabled={isLoading}
              >
                {t('adminVoyage.cancelModal.back')}
              </button>
              <button 
                onClick={cancelVoyage} 
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('adminVoyage.cancelModal.canceling')}
                  </span>
                ) : t('adminVoyage.cancelModal.cancelVoyage')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVoyage;