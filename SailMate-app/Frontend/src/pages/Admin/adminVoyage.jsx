import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, Search, X, Check, RefreshCcw } from 'lucide-react';

const adminVoyage = () => {
  // Sample initial data - in a real app, this would come from an API
  const initialVoyages = [
    {
      id: 1,
      departureCity: 'Istanbul',
      arrivalCity: 'Bursa',
      departureTime: '09:00',
      arrivalTime: '11:30',
      date: '2025-03-05',
      status: 'normal',
      shipType: 'ferry',
      lpg: true
    },
    {
      id: 2,
      departureCity: 'Izmir',
      arrivalCity: 'Bodrum',
      departureTime: '08:00',
      arrivalTime: '12:00',
      date: '2025-03-06',
      status: 'normal',
      shipType: 'sea bus',
      lpg: false
    },
    {
      id: 3,
      departureCity: 'Antalya',
      arrivalCity: 'Fethiye',
      departureTime: '10:30',
      arrivalTime: '14:00',
      date: '2025-03-07',
      status: 'cancelled',
      shipType: 'ferry',
      lpg: true
    }
  ];

  // State management
  const [voyages, setVoyages] = useState(initialVoyages);
  const [filteredVoyages, setFilteredVoyages] = useState(initialVoyages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [currentVoyage, setCurrentVoyage] = useState({
    id: null,
    departureCity: '',
    arrivalCity: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
    status: 'normal',
    shipType: 'ferry',
    lpg: false
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    status: '',
    shipType: '',
    lpg: ''
  });

  // Apply filters whenever filters or voyages change
  useEffect(() => {
    applyFilters();
  }, [filters, voyages]);

  // Filter function
  const applyFilters = () => {
    let result = [...voyages];
    
    // Search filter (searches across multiple fields)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(voyage => 
        voyage.departureCity.toLowerCase().includes(searchLower) ||
        voyage.arrivalCity.toLowerCase().includes(searchLower)
      );
    }
    
    // Date filter
    if (filters.date) {
      result = result.filter(voyage => voyage.date === filters.date);
    }
    
    // Status filter
    if (filters.status) {
      result = result.filter(voyage => voyage.status === filters.status);
    }
    
    // Ship type filter
    if (filters.shipType) {
      result = result.filter(voyage => voyage.shipType === filters.shipType);
    }
    
    // LPG filter
    if (filters.lpg !== '') {
      const lpgValue = filters.lpg === 'true';
      result = result.filter(voyage => voyage.lpg === lpgValue);
    }
    
    setFilteredVoyages(result);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      search: '',
      date: '',
      status: '',
      shipType: '',
      lpg: ''
    });
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open modal for adding new voyage
  const openAddModal = () => {
    setIsEditing(false);
    setCurrentVoyage({
      id: Date.now(), // Simple ID generation
      departureCity: '',
      arrivalCity: '',
      departureTime: '',
      arrivalTime: '',
      date: '',
      status: 'normal',
      shipType: 'ferry',
      lpg: false
    });
    setIsModalOpen(true);
  };

  // Open modal for editing voyage
  const openEditModal = (voyage) => {
    setIsEditing(true);
    setCurrentVoyage({...voyage});
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setValidationErrors({});
  };

  // Handle input changes in modal
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

  // Validate voyage data
  const validateVoyage = () => {
    const errors = {};
    
    // Required fields validation
    if (!currentVoyage.departureCity.trim()) {
      errors.departureCity = 'Departure city is required';
    }
    
    if (!currentVoyage.arrivalCity.trim()) {
      errors.arrivalCity = 'Arrival city is required';
    }
    
    if (!currentVoyage.departureTime) {
      errors.departureTime = 'Departure time is required';
    }
    
    if (!currentVoyage.arrivalTime) {
      errors.arrivalTime = 'Arrival time is required';
    }
    
    if (!currentVoyage.date) {
      errors.date = 'Date is required';
    }
    
    // Logical validations
    if (currentVoyage.departureCity.trim() && 
        currentVoyage.arrivalCity.trim() && 
        currentVoyage.departureCity.trim().toLowerCase() === currentVoyage.arrivalCity.trim().toLowerCase()) {
      errors.arrivalCity = 'Departure and arrival cities cannot be the same';
    }
    
    if (currentVoyage.departureTime && currentVoyage.arrivalTime) {
      const depTime = new Date(`2000-01-01T${currentVoyage.departureTime}`);
      const arrTime = new Date(`2000-01-01T${currentVoyage.arrivalTime}`);
      
      if (depTime >= arrTime) {
        errors.arrivalTime = 'Arrival time must be after departure time';
      }
    }
    
    // Date validation - ensure date is not in the past
    if (currentVoyage.date) {
      const voyageDate = new Date(currentVoyage.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (voyageDate < today) {
        errors.date = 'Voyage date cannot be in the past';
      }
    }
    
    return errors;
  };

  // Save voyage (add or update)
  const saveVoyage = () => {
    // Validate before saving
    const errors = validateVoyage();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    
    if (isEditing) {
      // Update existing voyage
      setVoyages(voyages.map(voyage => 
        voyage.id === currentVoyage.id ? currentVoyage : voyage
      ));
    } else {
      // Add new voyage
      setVoyages([...voyages, currentVoyage]);
    }
    setValidationErrors({});
    closeModal();
  };

  // Change voyage status to cancelled
  const cancelVoyage = (id) => {
    setVoyages(voyages.map(voyage => 
      voyage.id === id ? {...voyage, status: 'cancelled'} : voyage
    ));
  };

  // Delete voyage
  const deleteVoyage = (id) => {
    if (window.confirm('Are you sure you want to delete this voyage?')) {
      setVoyages(voyages.filter(voyage => voyage.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Voyage Times Admin</h1>
        
        {/* Filter and add section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between mb-4">
            <h2 className="text-xl font-semibold mb-4 lg:mb-0">Filters</h2>
            <button 
              onClick={openAddModal}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center"
            >
              <Plus size={18} className="mr-2" />
              Add New Voyage
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
            <div className="col-span-1 lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search cities..."
                  className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              </div>
            </div>
            
            <div>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
            </div>
            
            <div>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="">All Ship Types</option>
                <option value="ferry">Ferry</option>
                <option value="sea bus">Sea Bus</option>
              </select>
            </div>
            
            <div>
              <select
                name="lpg"
                value={filters.lpg}
                onChange={handleFilterChange}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value="">All LPG</option>
                <option value="true">LPG Available</option>
                <option value="false">No LPG</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={resetFilters}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <RefreshCcw size={16} className="mr-1" />
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Voyages table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ship Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LPG</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredVoyages.length > 0 ? (
                  filteredVoyages.map((voyage) => (
                    <tr key={voyage.id} className={voyage.status === 'cancelled' ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{voyage.departureCity} → {voyage.arrivalCity}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{voyage.departureTime} - {voyage.arrivalTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{voyage.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${voyage.status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {voyage.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {voyage.shipType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full 
                          ${voyage.lpg ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {voyage.lpg ? <Check size={14} /> : <X size={14} />}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {voyage.status !== 'cancelled' && (
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
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit Voyage"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteVoyage(voyage.id)}
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
      </div>
      
      {/* Add/Edit Modal */}
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
                    Departure City
                  </label>
                  <input
                    type="text"
                    name="departureCity"
                    value={currentVoyage.departureCity}
                    onChange={handleInputChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                      validationErrors.departureCity 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                  />
                  {validationErrors.departureCity && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.departureCity}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Arrival City
                  </label>
                  <input
                    type="text"
                    name="arrivalCity"
                    value={currentVoyage.arrivalCity}
                    onChange={handleInputChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                      validationErrors.arrivalCity 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                  />
                  {validationErrors.arrivalCity && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.arrivalCity}</p>
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
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                      validationErrors.departureTime 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
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
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                      validationErrors.arrivalTime 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
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
                    name="date"
                    value={currentVoyage.date}
                    onChange={handleInputChange}
                    className={`w-full rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                      validationErrors.date 
                        ? 'border-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    required
                  />
                  {validationErrors.date && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.date}</p>
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
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <option value="normal">Normal</option>
                    <option value="cancelled">Cancelled</option>
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
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  >
                    <option value="ferry">Ferry</option>
                    <option value="sea bus">Sea Bus</option>
                  </select>
                </div>
                
                <div className="flex items-center">
                  <label className="block text-sm font-medium text-gray-700 mb-1 mr-2">
                    LPG Available
                  </label>
                  <input
                    type="checkbox"
                    name="lpg"
                    checked={currentVoyage.lpg}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  disabled={Object.keys(validationErrors).length > 0 && Object.values(validationErrors).some(error => error !== null)}
                >
                  {isEditing ? 'Update' : 'Add'} Voyage
                </button>
              </div>
              
              {/* Summary of all validation errors */}
              {Object.keys(validationErrors).length > 0 && Object.values(validationErrors).some(error => error !== null) && (
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
    </div>
  );
};

export default adminVoyage;