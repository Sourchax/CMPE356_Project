import React, { useState } from "react";
import { Trash2, User, Edit, Plus, X } from "lucide-react";

const ManageUsers = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "Alice Brown", email: "alice@example.com", role: "Admin" },
        { id: 2, name: "Bob White", email: "bob@example.com", role: "User" },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "User" });
    const [errors, setErrors] = useState({});
    
    // Available roles
    const roles = ["Admin", "Manager", "User"];

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name || formData.name.length < 3) newErrors.name = "User name must be at least 3 characters";
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address";
        if (!formData.role) newErrors.role = "Please select a role";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDelete = (id) => {
        setUsers(users.filter((user) => user.id !== id));
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setFormData({ name: "", email: "", role: "User" });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleSave = (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        if (editingUser) {
            setUsers(users.map((u) => (u.id === editingUser.id ? { ...formData, id: editingUser.id } : u)));
        } else {
            setUsers([...users, { ...formData, id: Date.now() }]);
        }

        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", role: "User" });
        setErrors({});
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", role: "User" });
        setErrors({});
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case "Admin":
                return "bg-purple-100 text-purple-800";
            case "Manager":
                return "bg-blue-100 text-blue-800";
            case "User":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Manage Users</h1>
                <button 
                    onClick={handleAddUser}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition shadow-sm"
                >
                    <Plus size={18} /> Add User
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-left font-medium">Name</th>
                            <th className="p-4 text-left font-medium">Email</th>
                            <th className="p-4 text-left font-medium">Role</th>
                            <th className="p-4 text-center font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                <td className="p-4 flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                        <User size={16} className="text-gray-500" />
                                    </div>
                                    <span className="font-medium">{user.name}</span>
                                </td>
                                <td className="p-4 text-gray-600">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeClass(user.role)}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-center flex justify-center gap-3">
                                    <button 
                                        onClick={() => handleEdit(user)} 
                                        className="text-blue-600 hover:text-blue-800 transition bg-blue-50 p-2 rounded-full"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)} 
                                        className="text-red-600 hover:text-red-800 transition bg-red-50 p-2 rounded-full"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">{editingUser ? "Edit User" : "Add User"}</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700 transition">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter name"
                                    className="w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Enter email"
                                    className="w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                            
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full border border-gray-300 p-2 rounded-md outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                                >
                                    {editingUser ? "Update" : "Add"} User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;