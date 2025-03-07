import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Phone, MapPin, User, Building, Home, AlertCircle } from "lucide-react";
import { useLocation } from "react-router-dom";

const AdminStations = () => {
  const location = useLocation();
  const [stations, setStations] = useState([
    { id:1, name: "İzmir Marina", person: "Ali Kaya", phone: "+90 232 123 4567", address: "Bahçelerarası, 35330 Balçova/İzmir, Turkey", city: "Izmir" },
    { id:2, name: "Yenikapı Terminal", person: "Mehmet Yilmaz", phone: "+90 212 987 6543", address: "Katip Kasım, Kennedy Cad., 34131 Fatih/İstanbul, Turkey", city: "Istanbul" },
    { id:3, name: "Mudanya Hub", person: "Zeynep Demir", phone: "+90 224 321 7654", address: "Güzelyalı Eğitim, 16940 Mudanya/Bursa, Turkey", city: "Bursa" },
    { id:4, name: "Foça Station", person: "Fatma Aydin", phone: "+90 232 555 7890", address: "Aşıklar Cd., 35680 Foça/İzmir, Turkey", city: "Izmir" },
    { id:5, name: "Kadıköy Station", person: "Hasan Koc", phone: "+90 212 888 1122", address: "Caferağa, 34710 Kadıköy/İstanbul, Turkey", city: "Istanbul" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({ name: "", person: "", phone: "", city: "", address: "" });
  const [errors, setErrors] = useState({});
  
  // For delete confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [stationToDelete, setStationToDelete] = useState(null);

  const icons = [MapPin, User, Phone, Building, Home];
  
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
    setFormData({ name: "", person: "", phone: "", city: "", address: "" });
    setErrors({});
  };

  const validateForm = () => {
    let newErrors = {};
    
    // Station name validation
    if (!formData.name.trim()) {
      newErrors.name = "Station name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Station name must be at least 3 characters";
    }
    
    // Contact person validation - allow letters, spaces, hyphens, and apostrophes
    if (!formData.person.trim()) {
      newErrors.person = "Contact person is required";
    } else if (!/^[a-zA-Z\s'-]+$/.test(formData.person.trim())) {
      newErrors.person = "Contact person can only contain letters, spaces, hyphens, and apostrophes";
    }
    
    // Phone validation - more flexible to allow different formats
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^(\+?\d{1,3}[- ]?)?\d{3,}[- \d]*$/.test(formData.phone.trim()) || formData.phone.replace(/[^\d]/g, '').length < 10) {
      newErrors.phone = "Please enter a valid phone number with at least 10 digits";
    }
    
    // City validation - allow letters, spaces, hyphens, and common punctuation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    } else if (!/^[a-zA-Z\s'-.,]+$/.test(formData.city.trim())) {
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

  const openDeleteConfirmation = (id) => {
    const station = stations.find(s => s.id === id);
    setStationToDelete(station);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (stationToDelete) {
      setStations(stations.filter((station) => station.id !== stationToDelete.id));
      setDeleteModalOpen(false);
      setStationToDelete(null);
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData(station);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    if (editingStation) {
      setStations(stations.map((s) => (s.id === editingStation.id ? { ...formData, id: editingStation.id } : s)));
    } else {
      setStations([...stations, { ...formData, id: Date.now() }]);
    }

    setIsModalOpen(false);
    setEditingStation(null);
    setFormData({ name: "", person: "", phone: "", city: "", address: "" });
    setErrors({});
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStation(null);
    setFormData({ name: "", person: "", phone: "", city: "", address: "" });
    setErrors({});
  };

  // Card view for mobile screens
  const MobileStationCard = ({ station }) => (
    <div className="bg-white p-4 rounded-md shadow-md mb-4 border border-gray-200">
      <h3 className="text-lg font-semibold mb-2">{station.name}</h3>
      <div className="space-y-2">
        <div className="flex items-center">
          <User size={16} className="text-gray-500 mr-2" />
          <span>{station.person}</span>
        </div>
        <div className="flex items-center">
          <Phone size={16} className="text-gray-500 mr-2" />
          <span>{station.phone}</span>
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
                <td className="p-4 text-base">{station.name}</td>
                <td className="p-4 text-base">{station.person}</td>
                <td className="p-4 text-base">{station.phone}</td>
                <td className="p-4 text-base">{station.city}</td>
                <td className="p-4 text-base">{station.address}</td>
                <td className="p-4 flex justify-center gap-5">
                  {/* Increased padding from p-3 to p-4, increased text size with text-base, increased gap from gap-4 to gap-5 */}
                  <button onClick={() => handleEdit(station)} className="text-[#06AED5] hover:text-[#058aaa] transition">
                    <Edit size={20} />
                    {/* Increased icon size from 18 to 20 */}
                  </button>
                  <button onClick={() => openDeleteConfirmation(station.id)} className="text-red-600 hover:text-red-800 transition">
                    <Trash2 size={20} />
                    {/* Increased icon size from 18 to 20 */}
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
              {["name", "person", "phone", "city", "address"].map((field, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center border p-2 rounded-md">
                    {React.createElement(icons[index], { size: 20, className: "text-gray-500 mr-2 flex-shrink-0" })}
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full outline-none text-sm sm:text-base"
                      required
                    />
                  </div>
                  {errors[field] && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors[field]}</p>}
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
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold">Confirm Delete</h2>
            </div>
            
            <p className="mb-4">Are you sure you want to delete the station <span className="font-semibold">{stationToDelete.name}</span>? This action cannot be undone.</p>
            
            <div className="flex justify-end gap-3 mt-5">
              <button 
                onClick={() => {
                  setDeleteModalOpen(false);
                  setStationToDelete(null);
                }} 
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStations;