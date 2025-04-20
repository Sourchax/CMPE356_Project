import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Phone, MapPin, User, Building, Home, AlertCircle, AlertTriangle, Loader, RefreshCw } from "lucide-react";
import {useSessionToken} from "../../utils/sessions";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const API_URL = "http://localhost:8080/api";

const AdminStations = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false); // New loading state for refresh

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({ title: "", personnel: "", phoneno: "", city: "", address: "", status: "active" });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  // For delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);
  const [hasActiveVoyages, setHasActiveVoyages] = useState(false);
  const [checkingVoyages, setCheckingVoyages] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // New loading state for delete operation

  const icons = [MapPin, User, Phone, Building, Home];
  
  // Fetch stations from backend
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    if (refreshing) return; // Prevent multiple calls

    try {
      setLoading(true);
      setRefreshing(true); // Set refreshing state to true
      const response = await axios.get(`${API_URL}/stations`);
      setStations(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching stations:", err);
      setError(t('admin.stations.error'));
    } finally {
      setLoading(false);
      setRefreshing(false); // Reset refreshing state
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
      newErrors.title = t('admin.stations.validation.stationNameRequired');
    } else if (formData.title.trim().length < 3) {
      newErrors.title = t('admin.stations.validation.stationNameMinLength');
    }
    
    // Contact person validation - allow letters, spaces, hyphens, and apostrophes
    if (!formData.personnel.trim()) {
      newErrors.personnel = t('admin.stations.validation.contactPersonRequired');
    } else if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s'-]+$/.test(formData.personnel.trim())){
      newErrors.personnel = t('admin.stations.validation.contactPersonInvalid');
    }
    
    if (!formData.phoneno.trim()) {
      newErrors.phoneno = t('admin.stations.validation.phoneRequired');
    } else if (!/^(\+?\d{1,3}[- ]?)?\d{3,}[- \d]*$/.test(formData.phoneno.trim()) || 
               formData.phoneno.replace(/[^\d]/g, '').length < 10 || 
               formData.phoneno.replace(/[^\d]/g, '').length > 16) {
      newErrors.phoneno = t('admin.stations.validation.phoneInvalid');
    }
    
    // City validation - allow only letters, spaces, hyphens, and apostrophes, including Turkish characters
    if (!formData.city.trim()) {
      newErrors.city = t('admin.stations.validation.cityRequired');
    } else if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s]+$/.test(formData.city.trim())) {
      newErrors.city = t('admin.stations.validation.cityInvalid');
    }
    
    // Address validation - more comprehensive
    if (!formData.address.trim()) {
      newErrors.address = t('admin.stations.validation.addressRequired');
    } else if (formData.address.trim().length < 5) {
      newErrors.address = t('admin.stations.validation.addressMinLength');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change with real-time validation for city field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Set the form data
    setFormData({ ...formData, [name]: value });
    
    // Clear previous error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
    
    // Real-time validation for city field
    if (name === "city" && value) {
      // Check if city contains only letters (including Turkish characters), spaces, hyphens, and apostrophes
      if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s'-]*$/.test(value)) {
        setErrors({ 
          ...errors, 
          [name]: t('admin.stations.validation.cityInvalid')
        });
      }
    }
  };

  const checkActiveVoyages = async (stationId) => {
    if (checkingVoyages) return false; // Prevent multiple calls
    
    setCheckingVoyages(true);
    const token = useSessionToken();
    try {
      // Check if there are active voyages associated with this station
      const response = await axios.get(`${API_URL}/voyages/by-station/${stationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data && response.data.length > 0;
    } catch (err) {
      console.error("Error checking active voyages:", err);
      return false;
    } finally {
      setCheckingVoyages(false);
    }
  };

  const openDeleteConfirmation = async (id) => {
    // Don't open delete confirmation if already checking voyages
    if (checkingVoyages) return;
    
    const station = stations.find(s => s.id === id);
    setStationToDelete(station);
    setDeleteModalOpen(true);
    
    // Check for active voyages after showing the modal
    const activeVoyagesExist = await checkActiveVoyages(id);
    setHasActiveVoyages(activeVoyagesExist);
  };

  const handleDelete = async () => {
    if (stationToDelete && !isDeleting) {
      setIsDeleting(true);
      const token = useSessionToken();
      try {
        await axios.delete(`${API_URL}/stations/${stationToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStations(stations.filter((station) => station.id !== stationToDelete.id));
        setDeleteModalOpen(false);
        setStationToDelete(null);
        setHasActiveVoyages(false);
      } catch (err) {
        console.error("Error deleting station:", err);
        setError(t('admin.stations.deleteError'));
      } finally {
        setIsDeleting(false);
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
    if (!validateForm() || isSaving) return;
    
    setIsSaving(true);
    const token = useSessionToken();
    
    try {
      if (editingStation) {
        // Update existing station
        const response = await axios.put(`${API_URL}/stations/${editingStation.id}`, {
          id: editingStation.id,
          ...formData
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setStations(stations.map((s) => (s.id === editingStation.id ? response.data : s)));
      } else {
        // Create new station
        const response = await axios.post(`${API_URL}/stations`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
        }});
        setStations([...stations, response.data]);
      }

      setIsModalOpen(false);
      setEditingStation(null);
      setFormData({ title: "", personnel: "", phoneno: "", city: "", address: "", status: "active" });
      setErrors({});
    } catch (err) {
      console.error("Error saving station:", err);
      setError(t('admin.stations.saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  const closeModal = () => {
    // Don't close modal if saving is in progress
    if (isSaving) return;
    
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
        <button 
          onClick={() => handleEdit(station)} 
          className="text-[#06AED5] hover:text-[#058aaa] transition disabled:opacity-50"
          disabled={isSaving || checkingVoyages}
        >
          <Edit size={18} />
        </button>
        <button 
          onClick={() => openDeleteConfirmation(station.id)} 
          className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
          disabled={checkingVoyages || isDeleting}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );

  if (loading && stations.length === 0) {
    return (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#06AED5] border-r-transparent"></div>
          <p className="mt-2 text-gray-600">{t('admin.stations.loading')}</p>
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
            disabled={refreshing}
            className="bg-[#06AED5] text-white px-4 py-2 rounded-md hover:bg-[#058aaa] transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {refreshing ? (
              <span className="flex items-center gap-2">
                <RefreshCw size={16} className="animate-spin" />
                {t('common.trying')}
              </span>
            ) : t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 sm:gap-0">
        <h1 className="text-xl sm:text-3xl font-semibold text-gray-800">{t('admin.stations.title')}</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchStations}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-md hover:bg-gray-200 transition w-1/2 sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed border border-gray-300"
          >
            <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? t('common.refreshing') : t('common.refresh')}
          </button>
          <button 
            onClick={openAddModal} 
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-[#06AED5] text-white px-4 py-2.5 rounded-md hover:bg-[#058aaa] transition w-1/2 sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Plus size={20} /> {t('admin.stations.addStation')}
          </button>
        </div>
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
                <th className="p-4 text-left font-semibold text-base">{t('admin.stations.stationName')}</th>
                <th className="p-4 text-left font-semibold text-base">{t('admin.stations.contactPerson')}</th>
                <th className="p-4 text-left font-semibold text-base">{t('admin.stations.phoneNumber')}</th>
                <th className="p-4 text-left font-semibold text-base">{t('admin.stations.city')}</th>
                <th className="p-4 text-left font-semibold text-base">{t('admin.stations.address')}</th>
                <th className="p-4 text-center font-semibold text-base">{t('common.actions')}</th>
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
                    <button 
                      onClick={() => handleEdit(station)} 
                      className="text-[#06AED5] hover:text-[#058aaa] transition disabled:opacity-50"
                      disabled={isSaving || checkingVoyages}
                    >
                      <Edit size={20} />
                    </button>
                    <button 
                      onClick={() => openDeleteConfirmation(station.id)} 
                      className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
                      disabled={checkingVoyages || isDeleting}
                    >
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
            <h2 className="text-lg sm:text-xl font-semibold mb-4">{editingStation ? t('admin.stations.editStation') : t('admin.stations.addStation')}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              {/* Station Title */}
              <div className="flex flex-col">
                <label htmlFor="title" className="text-sm text-gray-600 mb-1 ml-1">{t('admin.stations.stationName')}</label>
                <div className={`flex items-center border rounded-md overflow-hidden ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300 focus-within:border-[#06AED5] focus-within:ring-1 focus-within:ring-[#06AED5]'} transition-all`}>
                  <span className="bg-gray-50 p-2 border-r border-gray-200">
                    <MapPin size={20} className="text-gray-500" />
                  </span>
                  <input
                    id="title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder={t('admin.stations.stationName')}
                    className="w-full p-2.5 outline-none bg-transparent text-sm sm:text-base"
                    disabled={isSaving}
                  />
                </div>
                {errors.title && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.title}</p>}
              </div>

              {/* Contact Person */}
              <div className="flex flex-col">
                <label htmlFor="personnel" className="text-sm text-gray-600 mb-1 ml-1">{t('admin.stations.contactPerson')}</label>
                <div className={`flex items-center border rounded-md overflow-hidden ${errors.personnel ? 'border-red-500 bg-red-50' : 'border-gray-300 focus-within:border-[#06AED5] focus-within:ring-1 focus-within:ring-[#06AED5]'} transition-all`}>
                  <span className="bg-gray-50 p-2 border-r border-gray-200">
                    <User size={20} className="text-gray-500" />
                  </span>
                  <input
                    id="personnel"
                    type="text"
                    name="personnel"
                    value={formData.personnel}
                    onChange={handleInputChange}
                    placeholder={t('admin.stations.contactPerson')}
                    className="w-full p-2.5 outline-none bg-transparent text-sm sm:text-base"
                    disabled={isSaving}
                  />
                </div>
                {errors.personnel && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.personnel}</p>}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col">
                <label htmlFor="phoneno" className="text-sm text-gray-600 mb-1 ml-1">{t('admin.stations.phoneNumber')}</label>
                <div className={`flex items-center border rounded-md overflow-hidden ${errors.phoneno ? 'border-red-500 bg-red-50' : 'border-gray-300 focus-within:border-[#06AED5] focus-within:ring-1 focus-within:ring-[#06AED5]'} transition-all`}>
                  <span className="bg-gray-50 p-2 border-r border-gray-200">
                    <Phone size={20} className="text-gray-500" />
                  </span>
                  <input
                    id="phoneno"
                    type="text"
                    name="phoneno"
                    value={formData.phoneno}
                    onChange={handleInputChange}
                    placeholder={t('admin.stations.phoneNumber')}
                    className="w-full p-2.5 outline-none bg-transparent text-sm sm:text-base"
                    disabled={isSaving}
                  />
                </div>
                {errors.phoneno && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phoneno}</p>}
              </div>

              {/* City */}
              <div className="flex flex-col">
                <label htmlFor="city" className="text-sm text-gray-600 mb-1 ml-1">{t('admin.stations.city')}</label>
                <div className={`flex items-center border rounded-md overflow-hidden ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300 focus-within:border-[#06AED5] focus-within:ring-1 focus-within:ring-[#06AED5]'} transition-all`}>
                  <span className="bg-gray-50 p-2 border-r border-gray-200">
                    <Building size={20} className="text-gray-500" />
                  </span>
                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder={t('admin.stations.city')}
                    className="w-full p-2.5 outline-none bg-transparent text-sm sm:text-base"
                    disabled={isSaving}
                  />
                </div>
                {errors.city && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.city}</p>}
              </div>

              {/* Address */}
              <div className="flex flex-col">
                <label htmlFor="address" className="text-sm text-gray-600 mb-1 ml-1">{t('admin.stations.address')}</label>
                <div className={`flex items-center border rounded-md overflow-hidden ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 focus-within:border-[#06AED5] focus-within:ring-1 focus-within:ring-[#06AED5]'} transition-all`}>
                  <span className="bg-gray-50 p-2 border-r border-gray-200">
                    <Home size={20} className="text-gray-500" />
                  </span>
                  <input
                    id="address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder={t('admin.stations.address')}
                    className="w-full p-2.5 outline-none bg-transparent text-sm sm:text-base"
                    disabled={isSaving}
                  />
                </div>
                {errors.address && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="flex justify-between gap-2 mt-6">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="bg-gray-300 px-3 sm:px-4 py-2.5 rounded-md hover:bg-gray-400 transition text-sm sm:text-base flex-1 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  {t('admin.stations.cancel')}
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-[#06AED5] text-white px-3 sm:px-4 py-2.5 rounded-md hover:bg-[#058aaa] transition text-sm sm:text-base flex-1 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isSaving ? (
                    <>
                      <Loader size={18} className="animate-spin mr-2" />
                      {t('common.saving')}
                    </>
                  ) : (
                    t('admin.stations.save')
                  )}
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
                <p className="mt-2 text-gray-600">{t('admin.stations.checkingVoyages')}</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-4">
                  {hasActiveVoyages ? (
                    <AlertTriangle size={24} className="text-orange-500" />
                  ) : (
                    <AlertCircle size={24} className="text-red-600" />
                  )}
                  <h2 className="text-lg sm:text-xl font-semibold">{t('admin.stations.deleteConfirmation')}</h2>
                </div>
                
                <p className="mb-4">{t('admin.stations.deleteWarning')}</p>
                
                {hasActiveVoyages && (
                  <div className="p-3 mb-4 bg-orange-50 border-l-4 border-orange-500 text-orange-700 rounded">
                    <div className="flex items-start">
                      <AlertTriangle size={20} className="mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{t('admin.stations.activeVoyagesWarning')}</p>
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
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isDeleting}
                  >
                    {t('admin.stations.cancel')}
                  </button>
                  <button 
                    onClick={handleDelete} 
                    className={`px-4 py-2 ${hasActiveVoyages ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'} text-white rounded-md transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        {t('common.deleting')}
                      </>
                    ) : (
                      hasActiveVoyages ? t('admin.stations.deleteAnyway') : t('admin.stations.delete')
                    )}
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