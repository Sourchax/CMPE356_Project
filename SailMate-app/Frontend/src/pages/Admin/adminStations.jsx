import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Phone, MapPin, User, Building, Home, AlertCircle, AlertTriangle } from "lucide-react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8080/api";

const AdminStations = () => {
  const location = useLocation();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({ title: "", personnel: "", phoneno: "", city: "", address: "", status: "active" });
  const [errors, setErrors] = useState({});
  
  // For delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);
  const [hasActiveVoyages, setHasActiveVoyages] = useState(false);
  const [checkingVoyages, setCheckingVoyages] = useState(false);

  const icons = [MapPin, User, Phone, Building, Home];
  
  // Fetch stations from backend
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/stations`);
      setStations(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError("Failed to load stations. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  // Check for openAddModal in location state (from quick action)
  useEffect(() => {
    if (location.state?.openAddModal) {
      openAddModal();
      // Clean up the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
      location.state.openAddModal = false;
    }
  }, [location]);
  
  // Function to open add modal
  const openAddModal = () => {
    setIsModalOpen(true);
    setEditingStation(null);
    setFormData({ title: "", personnel: "", phoneno: "", city: "", address: "", status: "active" });
    setErrors({});
  };

  const validateForm = () => {
    let newErrors = {};
    
    // Station title validation
    if (!formData.title.trim()) {
      newErrors.title = "Station name is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Station name must be at least 3 characters";
    }
    
    // Contact person validation - allow letters, spaces, hyphens, and apostrophes
    if (!formData.personnel.trim()) {
      newErrors.personnel = "Contact person is required";
    } else if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s'-]+$/.test(formData.personnel.trim())){
      newErrors.personnel = "Contact person can only contain letters, spaces, hyphens, and apostrophes";
    }
    
    // Phone validation - more flexible to allow different formats
    if (!formData.phoneno.trim()) {
      newErrors.phoneno = "Phone number is required";
    } else if (!/^(\+?\d{1,3}[- ]?)?\d{3,}[- \d]*$/.test(formData.phoneno.trim()) || formData.phoneno.replace(/[^\d]/g, '').length < 10) {
      newErrors.phoneno = "Please enter a valid phone number with at least 10 digits";
    }
    
    // City validation - allow letters, spaces, hyphens, and common punctuation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s'-]+$/.test(formData.personnel.trim())) {
      newErrors.city = "City can only contain letters, spaces, and basic punctuation";
    }
    
    // Address validation - more comprehensive
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Address must be at least 5 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkActiveVoyages = async (stationId) => {
    setCheckingVoyages(true);
    try {
      // Check if there are active voyages associated with this station
      const response = await axios.get(`${API_URL}/voyages/by-station/${stationId}`);
      return response.data && response.data.length > 0;
    } catch (err) {
      console.error("Error checking active voyages:", err);
      return false;
    } finally {
      setCheckingVoyages(false);
    }
  };

  const openDeleteConfirmation = async (id) => {
    const station = stations.find(s => s.id === id);
    setStationToDelete(station);
    
    // Check for active voyages before showing the modal
    const activeVoyagesExist = await checkActiveVoyages(id);
    setHasActiveVoyages(activeVoyagesExist);
    
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (stationToDelete) {
      try {
        await axios.delete(`${API_URL}/stations/${stationToDelete.id}`);
        setStations(stations.filter((station) => station.id !== stationToDelete.id));
        setDeleteModalOpen(false);
        setStationToDelete(null);
        setHasActiveVoyages(false);
      } catch (err) {
        console.error("Error deleting station:", err);
        setError("Failed to delete station. Please try again.");
      }
    }
  };

  const handleEdit = (station) => {
    // Map backend field names to form fields
    setEditingStation(station);
    setFormData({
      title: station.title,
      personnel: station.personnel,
      phoneno: station.phoneno,
      city: station.city,
      address: station.address,
      status: station.status
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingStation) {
        // Update existing station
        const response = await axios.put(`${API_URL}/stations/${editingStation.id}`, {
          id: editingStation.id,
          ...formData
        });
        setStations(stations.map((s) => (s.id === editingStation.id ? response.data : s)));
      } else {
        // Create new station
        const response = await axios.post(`${API_URL}/stations`, formData);
        setStations([...stations, response.data]);
      }

      setIsModalOpen(false);
      setEditingStation(null);
      setFormData({ title: "", personnel: "", phoneno: "", city: "", address: "", status: "active" });
      setErrors({});
    } catch (err) {
      console.error("Error saving station:", err);
      setError("Failed to save station. Please check your input and try again.");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStation(null);
    setFormData({ title: "", personnel: "", phoneno: "", city: "", address: "", status: "active" });
    setErrors({});
  };

  // Card view for mobile screens
  const MobileStationCard = ({ station }) => (
    <div className="bg-white p-4 rounded-md shadow-md mb-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">{station.title}</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <User size={16} className="text-gray-500 mr-2" />
          <span>{station.personnel}</span>
        </div>
        <div className="flex items-center">
          <Phone size={16} className="text-gray-500 mr-2" />
          <span>{station.phoneno}</span>
        </div>
        <div className="flex items-center">
          <Building size={16} className="text-gray-500 mr-2" />
          <span>{station.city}</span>
        </div>
        <div className="flex items-center">
          <Home size={16} className="text-gray-500 mr-2" />
          <span>{station.address}</span>
        </div>
      </div>
      <div className="flex justify-end gap-4 mt-3">
        <button onClick={() => handleEdit(station)} className="text-[#06AED5] hover:text-[#058aaa] transition">
          <Edit size={18} />
        </button>
        <button onClick={() => openDeleteConfirmation(station.id)} className="text-red-600 hover:text-red-800 transition">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#06AED5] border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading Stations...</p>
        </div>
    );
  }

  if (error && stations.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchStations}
            className="bg-[#06AED5] text-white px-4 py-2 rounded-md hover:bg-[#058aaa] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-3xl font-semibold text-gray-800">Manage Stations</h1>
        <button 
          onClick={openAddModal} 
          className="flex items-center gap-2 bg-[#06AED5] text-white px-4 py-2.5 rounded-md hover:bg-[#058aaa] transition w-full sm:w-auto justify-center sm:justify-start"
        >
          <Plus size={20} /> Add Station
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="hidden md:block bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#06AED5] text-white">
              <tr>
                <th className="p-4 text-left font-semibold text-base">Title</th>
                <th className="p-4 text-left font-semibold text-base">Contact Person</th>
                <th className="p-4 text-left font-semibold text-base">Phone No.</th>
                <th className="p-4 text-left font-semibold text-base">City</th>
                <th className="p-4 text-left font-semibold text-base">Address</th>
                <th className="p-4 text-center font-semibold text-base">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station.id} className="border-b hover:bg-gray-100 transition">
                  <td className="p-4 text-base">{station.title}</td>
                  <td className="p-4 text-base">{station.personnel}</td>
                  <td className="p-4 text-base">{station.phoneno}</td>
                  <td className="p-4 text-base">{station.city}</td>
                  <td className="p-4 text-base">{station.address}</td>
                  <td className="p-4 flex justify-center gap-5">
                    <button onClick={() => handleEdit(station)} className="text-[#06AED5] hover:text-[#058aaa] transition">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => openDeleteConfirmation(station.id)} className="text-red-600 hover:text-red-800 transition">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Card view for mobile screens */}
      <div className="md:hidden">
        {stations.map((station) => (
          <MobileStationCard key={station.id} station={station} />
        ))}
      </div>

      {/* Edit/Add Station Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">{editingStation ? "Edit Station" : "Add Station"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              {[
                { field: "title", placeholder: "Station Name" },
                { field: "personnel", placeholder: "Contact Person" },
                { field: "phoneno", placeholder: "Phone Number" },
                { field: "city", placeholder: "City" },
                { field: "address", placeholder: "Address" }
              ].map((item, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center border p-2 rounded-md">
                    {React.createElement(icons[index], { size: 20, className: "text-gray-500 mr-2 flex-shrink-0" })}
                    <input
                      type="text"
                      name={item.field}
                      value={formData[item.field]}
                      onChange={(e) => setFormData({ ...formData, [item.field]: e.target.value })}
                      placeholder={item.placeholder}
                      className="w-full outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                  {errors[item.field] && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[item.field]}</p>}
                </div>
              ))}
              <div className="flex justify-between gap-2 mt-4">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="bg-gray-300 px-3 sm:px-4 py-2 rounded-md hover:bg-gray-400 transition text-sm sm:text-base flex-1"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-[#06AED5] text-white px-3 sm:px-4 py-2 rounded-md hover:bg-[#058aaa] transition text-sm sm:text-base flex-1"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && stationToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-5 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            {checkingVoyages ? (
              <div className="text-center py-4">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-[#06AED5] border-r-transparent"></div>
                <p className="mt-2 text-gray-600">Checking for active voyages...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  {hasActiveVoyages ? (
                    <AlertTriangle size={24} className="text-orange-500" />
                  ) : (
                    <AlertCircle size={24} className="text-red-600" />
                  )}
                  <h2 className="text-lg sm:text-xl font-semibold">Confirm Delete</h2>
                </div>
                
                <p className="mb-4">Are you sure you want to delete the station <span className="font-semibold">{stationToDelete.title}</span>? This action cannot be undone.</p>
                
                {hasActiveVoyages && (
                  <div className="p-3 mb-4 bg-orange-50 border-l-4 border-orange-500 text-orange-700 rounded">
                    <div className="flex items-start">
                      <AlertTriangle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Warning: Active Voyages Detected</p>
                        <p className="text-sm mt-1">This station has active voyages assigned to it. Deleting it may cause issues with scheduled trips.</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 mt-5">
                  <button 
                    onClick={() => {
                      setDeleteModalOpen(false);
                      setStationToDelete(null);
                      setHasActiveVoyages(false);
                    }} 
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className={`px-4 py-2 ${hasActiveVoyages ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'} text-white rounded-md transition`}
                  >
                    {hasActiveVoyages ? "Delete Anyway" : "Delete"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStations;