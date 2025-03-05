import React, { useState, useEffect } from "react";
import { Trash2, User, Edit, Plus, X, AlertTriangle } from "lucide-react";

const ManageUsers = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "Alice Brown", email: "alice@example.com", role: "Admin" },
        { id: 2, name: "Bob White", email: "bob@example.com", role: "User" },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "User" });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    
    // Available roles
    const roles = ["Admin", "Manager", "User"];

    // Validate specific field
    const validateField = (name, value) => {
        switch (name) {
            case "name":
                if (!value.trim()) return "Name is required";
                if (value.trim().length < 3) return "Name must be at least 3 characters";
                if (value.trim().length > 50) return "Name must be less than 50 characters";
                if (!/^[a-zA-Z\s'-]+$/.test(value)) return "Name can only contain letters, spaces, hyphens and apostrophes";
                return "";
            
            case "email":
                if (!value.trim()) return "Email is required";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
                if (value.length > 100) return "Email must be less than 100 characters";
                // Check for duplicate email (excluding the current user being edited)
                const isDuplicate = users.some(user => 
                    user.email.toLowerCase() === value.toLowerCase() && 
                    (!editingUser || user.id !== editingUser.id)
                );
                if (isDuplicate) return "This email is already in use";
                return "";
            
            case "role":
                if (!value) return "Role is required";
                if (!roles.includes(value)) return "Invalid role selected";
                return "";
            
            default:
                return "";
        }
    };

    // Validate all form fields
    const validateForm = () => {
        const newErrors = {};
        
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input change with real-time validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        
        // If field has been touched, validate it
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    // Mark field as touched on blur and validate
    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched({ ...touched, [name]: true });
        
        const error = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter((user) => user.id !== id));
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
        setErrors({});
        setTouched({});
        setIsModalOpen(true);
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setFormData({ name: "", email: "", role: "User" });
        setErrors({});
        setTouched({});
        setIsModalOpen(true);
    };

    const handleSave = (event) => {
        event.preventDefault();
        
        // Mark all fields as touched
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);
        
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
        setTouched({});
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", role: "User" });
        setErrors({});
        setTouched({});
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

    // User card component for mobile view
    const UserCard = ({ user }) => (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <User size={16} className="text-gray-500" />
                    </div>
                    <span className="font-medium">{user.name}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
                    {user.role}
                </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 truncate">{user.email}</p>
            
            <div className="flex justify-end gap-2">
                <button 
                    onClick={() => handleEdit(user)} 
                    className="text-blue-600 hover:text-blue-800 transition bg-blue-50 p-2 rounded-full"
                    aria-label={`Edit ${user.name}`}
                >
                    <Edit size={16} />
                </button>
                <button 
                    onClick={() => handleDelete(user.id)} 
                    className="text-red-600 hover:text-red-800 transition bg-red-50 p-2 rounded-full"
                    aria-label={`Delete ${user.name}`}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">Manage Users</h1>
                <button 
                    onClick={handleAddUser}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition shadow-sm"
                >
                    <Plus size={18} /> Add User
                </button>
            </div>

            {/* Table view (hidden on mobile) */}
            <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                            <tr>
                                <th className="p-3 md:p-4 text-left font-medium">Name</th>
                                <th className="p-3 md:p-4 text-left font-medium">Email</th>
                                <th className="p-3 md:p-4 text-left font-medium">Role</th>
                                <th className="p-3 md:p-4 text-center font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                        <td className="p-3 md:p-4 flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                <User size={16} className="text-gray-500" />
                                            </div>
                                            <span className="font-medium">{user.name}</span>
                                        </td>
                                        <td className="p-3 md:p-4 text-gray-600">{user.email}</td>
                                        <td className="p-3 md:p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getRoleBadgeClass(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-3 md:p-4 text-center flex justify-center gap-3">
                                            <button 
                                                onClick={() => handleEdit(user)} 
                                                className="text-blue-600 hover:text-blue-800 transition bg-blue-50 p-2 rounded-full"
                                                aria-label={`Edit ${user.name}`}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(user.id)} 
                                                className="text-red-600 hover:text-red-800 transition bg-red-50 p-2 rounded-full"
                                                aria-label={`Delete ${user.name}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">
                                        No users found. Click "Add User" to create a new user.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Card view for mobile */}
            <div className="sm:hidden">
                {users.length > 0 ? (
                    users.map(user => <UserCard key={user.id} user={user} />)
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center text-gray-500">
                        No users found. Click "Add User" to create a new user.
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold">{editingUser ? "Edit User" : "Add User"}</h2>
                            <button 
                                onClick={closeModal} 
                                className="text-gray-500 hover:text-gray-700 transition"
                                aria-label="Close modal"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4" noValidate>
                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter full name"
                                    className={`w-full border p-2 rounded-md outline-none transition ${
                                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    aria-invalid={errors.name ? "true" : "false"}
                                    aria-describedby={errors.name ? "name-error" : undefined}
                                />
                                {errors.name && (
                                    <p id="name-error" className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                                        <AlertTriangle size={14} className="flex-shrink-0" /> <span className="break-words">{errors.name}</span>
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder="Enter email address"
                                    className={`w-full border p-2 rounded-md outline-none transition ${
                                        errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    aria-invalid={errors.email ? "true" : "false"}
                                    aria-describedby={errors.email ? "email-error" : undefined}
                                />
                                {errors.email && (
                                    <p id="email-error" className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                                        <AlertTriangle size={14} className="flex-shrink-0" /> <span className="break-words">{errors.email}</span>
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex flex-col">
                                <label htmlFor="role" className="text-sm font-medium text-gray-700 mb-1">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border p-2 rounded-md outline-none transition ${
                                        errors.role ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                    }`}
                                    aria-invalid={errors.role ? "true" : "false"}
                                    aria-describedby={errors.role ? "role-error" : undefined}
                                >
                                    <option value="" disabled>Select a role</option>
                                    {roles.map((role) => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                                {errors.role && (
                                    <p id="role-error" className="text-red-500 text-xs sm:text-sm mt-1 flex items-center gap-1">
                                        <AlertTriangle size={14} className="flex-shrink-0" /> <span className="break-words">{errors.role}</span>
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition w-full sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition w-full sm:w-auto"
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