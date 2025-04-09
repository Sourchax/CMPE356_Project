import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Phone, MapPin, User, Building, Home, AlertCircle, AlertTriangle, Loader } from "lucide-react";
import {useSessionToken} from "../../utils/sessions";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';

const API_URL = "http://localhost:8080/api";

const AdminStations = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      newErrors.title = t('admin.stations.validation.stationNameRequired');
    } else if (formData.title.trim().length < 3) {
      newErrors.title = t('admin.stations.validation.stationNameMinLength');
    }
    
    // Contact person validation
    if (!formData.personnel.trim()) {
      newErrors.personnel = t('admin.stations.validation.contactPersonRequired');
    } else if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s'-]+$/.test(formData.personnel.trim())){
      newErrors.personnel = t('admin.stations.validation.contactPersonInvalid');
    }
    
    // Phone validation
    if (!formData.phoneno.trim()) {
      newErrors.phoneno = t('admin.stations.validation.phoneRequired');
    } else if (!/^(\+?\d{1,3}[- ]?)?\d{3,}[- \d]*$/.test(formData.phoneno.trim()) || formData.phoneno.replace(/[^\d]/g, '').length < 10) {
      newErrors.phoneno = t('admin.stations.validation.phoneInvalid');
    }
    
    // City validation
    if (!formData.city.trim()) {
      newErrors.city = t('admin.stations.validation.cityRequired');
    } else if (!/^[a-zA-ZğüşöçıİĞÜŞÖÇ\s'-]+$/.test(formData.city.trim())) {
      newErrors.city = t('admin.stations.validation.cityInvalid');
    }
    
    // Address validation
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
          [name]: "City can only contain letters, spaces, hyphens, and apostrophes" 
        });
      }
    }
  };

  const checkActiveVoyages = async (stationId) => {
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
    const station = stations.find(s => s.id === id);
    setStationToDelete(station);
    
    // Check for active voyages before showing the modal
    const activeVoyagesExist = await checkActiveVoyages(id);
    setHasActiveVoyages(activeVoyagesExist);
    
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (stationToDelete) {
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
      setError("Failed to save station. Please check your input and try again.");
    } finally {
      setIsSaving(false);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-[#06AED5] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('admin.stations.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('admin.stations.error')}</h2>
          <button 
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 bg-[#06AED5] hover:bg-[#0599c2] text-white rounded-lg transition-colors"
          >
            {t('common.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{t('admin.stations.title')}</h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#06AED5] text-white rounded-lg hover:bg-[#0599c2] transition-colors"
          >
            <Plus size={20} />
            <span>{t('admin.stations.addStation')}</span>
          </button>
        </div>

        {/* Mobile view */}
        <div className="md:hidden space-y-4">
          {stations.map((station) => (
            <MobileStationCard key={station.id} station={station} />
          ))}
        </div>

        {/* Desktop view */}
        <div className="hidden md:block bg-white shadow-xl rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-r from-[#E6F7FB] to-[#F5FBFD] text-[#06AED5] border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">{t('admin.stations.stationName')}</th>
                  <th className="px-4 py-3 text-left font-medium">{t('admin.stations.contactPerson')}</th>
                  <th className="px-4 py-3 text-left font-medium">{t('admin.stations.phoneNumber')}</th>
                  <th className="px-4 py-3 text-left font-medium">{t('admin.stations.city')}</th>
                  <th className="px-4 py-3 text-left font-medium">{t('admin.stations.status')}</th>
                  <th className="px-4 py-3 text-center font-medium w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stations.map((station) => (
                  <tr key={station.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{station.title}</td>
                    <td className="px-4 py-3">{station.personnel}</td>
                    <td className="px-4 py-3">{station.phoneno}</td>
                    <td className="px-4 py-3">{station.city}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        station.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {station.status === 'active' ? t('admin.stations.active') : t('admin.stations.inactive')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(station)}
                          className="p-2 text-[#06AED5] hover:bg-[#06AED5] hover:text-white rounded-lg transition-colors"
                          title={t('admin.stations.edit')}
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => openDeleteConfirmation(station.id)}
                          className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                          title={t('admin.stations.delete')}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {editingStation ? t('admin.stations.editStation') : t('admin.stations.addStation')}
            </h2>
            <form onSubmit={handleSave}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.stations.stationName')}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AED5] ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.stations.contactPerson')}
                  </label>
                  <input
                    type="text"
                    name="personnel"
                    value={formData.personnel}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AED5] ${
                      errors.personnel ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.personnel && <p className="mt-1 text-sm text-red-500">{errors.personnel}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.stations.phoneNumber')}
                  </label>
                  <input
                    type="text"
                    name="phoneno"
                    value={formData.phoneno}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AED5] ${
                      errors.phoneno ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phoneno && <p className="mt-1 text-sm text-red-500">{errors.phoneno}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.stations.city')}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AED5] ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.stations.address')}
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AED5] ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('admin.stations.status')}
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#06AED5]"
                  >
                    <option value="active">{t('admin.stations.active')}</option>
                    <option value="inactive">{t('admin.stations.inactive')}</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {t('admin.stations.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#06AED5] text-white rounded-lg hover:bg-[#0599c2] transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <Loader className="animate-spin" size={16} />
                      <span>{t('common.saving')}</span>
                    </div>
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
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              {t('admin.stations.deleteConfirmation')}
            </h2>
            {hasActiveVoyages ? (
              <p className="text-gray-600 mb-6 text-center">
                {t('admin.stations.activeVoyagesWarning')}
              </p>
            ) : (
              <p className="text-gray-600 mb-6 text-center">
                {t('admin.stations.deleteWarning')}
              </p>
            )}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {t('admin.stations.cancel')}
              </button>
              {!hasActiveVoyages && (
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {t('admin.stations.delete')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStations;