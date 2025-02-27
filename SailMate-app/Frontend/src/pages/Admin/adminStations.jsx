import React, { useState } from "react";
import { Plus, Trash2, Edit, Phone, MapPin, User, Building, Home } from "lucide-react";

const AdminStations = () => {
  const [stations, setStations] = useState([
    { id: 1, name: "Harbor City Terminal", person: "John Doe", phone: "+1234567890", city: "Harbor City", address: "123 Dock Street" },
    { id: 2, name: "Seaside Station", person: "Jane Smith", phone: "+9876543210", city: "Seaside", address: "456 Ocean Road" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [formData, setFormData] = useState({ name: "", person: "", phone: "", city: "", address: "" });
  const [errors, setErrors] = useState({});

  const icons = [MapPin, User, Phone, Building, Home];

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name || formData.name.length < 3) newErrors.name = "Station name must be at least 3 characters";
    if (!formData.person || !/^[a-zA-Z ]+$/.test(formData.person)) newErrors.person = "Contact person must contain only letters and spaces";
    if (!formData.phone || !/^\+?[0-9]{10,15}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
    if (!formData.city || !/^[a-zA-Z ]+$/.test(formData.city)) newErrors.city = "City must contain only letters and spaces";
    if (!formData.address || formData.address.length < 5) newErrors.address = "Address must be at least 5 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (id) => {
    setStations(stations.filter((station) => station.id !== id));
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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Manage Stations</h1>
        <button onClick={() => { setIsModalOpen(true); setEditingStation(null); setFormData({ name: "", person: "", phone: "", city: "", address: "" }); setErrors({}); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <Plus size={20} /> Add Station
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Contact Person</th>
              <th className="p-3 text-left">Phone No.</th>
              <th className="p-3 text-left">City</th>
              <th className="p-3 text-left">Address</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station.id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{station.name}</td>
                <td className="p-3">{station.person}</td>
                <td className="p-3">{station.phone}</td>
                <td className="p-3">{station.city}</td>
                <td className="p-3">{station.address}</td>
                <td className="p-3 flex justify-center gap-4">
                  <button onClick={() => handleEdit(station)} className="text-blue-600 hover:text-blue-800 transition"><Edit size={18} /></button>
                  <button onClick={() => handleDelete(station.id)} className="text-red-600 hover:text-red-800 transition"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{editingStation ? "Edit Station" : "Add Station"}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              {["name", "person", "phone", "city", "address"].map((field, index) => (
                <div key={index} className="flex flex-col">
                  <div className="flex items-center border p-2 rounded-md">
                    {React.createElement(icons[index], { size: 20, className: "text-gray-500 mr-2" })}
                    <input
                      type="text"
                      name={field}
                      value={formData[field]}
                      onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full outline-none"
                      required
                    />
                  </div>
                  {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button type="button" onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStations;
