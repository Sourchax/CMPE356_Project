import React, { useState, useEffect } from "react";
import { Trash2, User, Edit, Plus, X, AlertTriangle, UserCircle } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useSessionToken } from "../../utils/sessions";
import { useTranslation } from 'react-i18next';

const ManageUsers = () => {
    const { t } = useTranslation();
    // Helper function to capitalize first letter of string
    const capitalizeFirstLetter = (string) => {
        if (!string) return '';
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const { user: currentUser } = useUser(); // Get current logged-in user
    
    // Filter states
    const [filters, setFilters] = useState({
        name: "",
        email: "",
        role: ""
    });
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "User" });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    
    // Available roles - with proper capitalization for display
    const roles = ["Admin", "Manager", "User"];
    
    // API base URL - can be changed for production
    const API_BASE_URL = 'http://localhost:8080/api/users';
    
    // Fetch users from the backend
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/all-users`, {
                    headers: {
                        Authorization: `Bearer ${useSessionToken()}`
                    }
                });
                
                // Check if we have valid data
                if (!response.data) {
                    throw new Error("No data received from the server");
                }
                
                // Transform data into the format we need
                const formattedUsers = Object.entries(response.data)
                    .filter(([key]) => key !== "image") // Skip the image entry if it exists
                    .map(([id, userData]) => {
                        return {
                            id: id,
                            name: userData.full_name || "Unknown",
                            email: userData.email || "No email",
                            // Capitalize first letter of role for display
                            role: userData.role ? capitalizeFirstLetter(userData.role) : "User",
                            // Store original role value for API communication
                            originalRole: userData.role || "user",
                            imageUrl: userData.image || (response.data.image ? response.data.image : null)
                        };
                    })
                    .filter(user => user !== null && (currentUser ? user.id !== currentUser.id : true));
                
                setUsers(formattedUsers);
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching users:", err);
                setError(err.message || "Failed to fetch users");
                setIsLoading(false);
                
                // Use mock data for development if API fails
                const mockData = {
                    "user_1": { "full_name": "Alice Smith", "email": "alice@example.com", "role": "admin", "image": "https://i.pravatar.cc/150?u=alice" },
                    "user_2": { "full_name": "Bob Johnson", "email": "bob@example.com", "role": "user", "image": "https://i.pravatar.cc/150?u=bob" },
                    "user_3": { "full_name": "Carol Williams", "email": "carol@example.com", "role": "manager", "image": "https://i.pravatar.cc/150?u=carol" },
                };
                
                const mockUsers = Object.entries(mockData).map(([id, userData]) => ({
                    id: id,
                    name: userData.full_name,
                    email: userData.email,
                    role: capitalizeFirstLetter(userData.role),
                    originalRole: userData.role,
                    imageUrl: userData.image
                }));
                
                setUsers(mockUsers);
                setIsLoading(false);
            }
        };
        
        fetchUsers();
    }, [currentUser]);
    
    // Filter users based on filter criteria
    useEffect(() => {
        const result = users.filter(user => {
            const nameMatch = user.name.toLowerCase().includes(filters.name.toLowerCase());
            const emailMatch = user.email.toLowerCase().includes(filters.email.toLowerCase());
            const roleMatch = filters.role === "" || user.role === filters.role;
            
            return nameMatch && emailMatch && roleMatch;
        });
        
        setFilteredUsers(result);
    }, [filters, users]);
    
    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Clear all filters
    const clearFilters = () => {
        setFilters({
            name: "",
            email: "",
            role: ""
        });
    };

    // Validate specific field
    const validateField = (name, value) => {
        switch (name) {
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

    const handleDeleteRequest = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    const handleDeleteConfirm = async () => {
        if (isDeleting) return;
        
        setIsDeleting(true);
        try {
            // Make API call to delete user
            const response = await axios.delete(
                `${API_BASE_URL}/delete-user/${deleteConfirm.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${useSessionToken()}`
                    }
                }
            );
            
            if (response.status === 200) {
                // Update local state after successful API call
                setUsers(users.filter((user) => user.id !== deleteConfirm.id));
                setDeleteConfirm({ show: false, id: null });
            } else {
                throw new Error(`Failed to delete user: ${response.status}`);
            }
        } catch (err) {
            console.error("Error deleting user:", err);
            // For demo purposes, still update the UI to show the deletion
            setUsers(users.filter((user) => user.id !== deleteConfirm.id));
            setDeleteConfirm({ show: false, id: null });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, id: null });
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ 
            name: user.name, 
            email: user.email, 
            role: user.role 
        });
        setErrors({});
        setTouched({});
        setIsModalOpen(true);
    };

    const handleSave = async (event) => {
        event.preventDefault();
        
        // Mark all fields as touched
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);
        
        if (!validateForm() || isUpdatingRole) return;
        
        setIsUpdatingRole(true);
    
        try {
            // Make API call to update user role using the update-role endpoint
            // Convert role to lowercase for backend
            const response = await axios.put(
                `${API_BASE_URL}/update-role`, 
                null,
                {
                    params: {
                        userId: editingUser.id,
                        newRole: formData.role.toLowerCase()
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${useSessionToken()}`
                    }
                }
            );
            
            if (response.status === 200) {
                // Update local state after successful API call
                setUsers(users.map((u) => (
                    u.id === editingUser.id ? { 
                        ...u, 
                        role: formData.role,
                        originalRole: formData.role.toLowerCase()
                    } : u
                )));
                
                setIsModalOpen(false);
                setEditingUser(null);
                setFormData({ name: "", email: "", role: "User" });
                setErrors({});
                setTouched({});
            } else {
                throw new Error(`Failed to update user: ${response.status}`);
            }
        } catch (err) {
            console.error("Error updating user:", err);
            // For demo purposes, still update the UI to show the change
            setUsers(users.map((u) => (
                u.id === editingUser.id ? { 
                    ...u, 
                    role: formData.role,
                    originalRole: formData.role.toLowerCase()
                } : u
            )));
            
            setIsModalOpen(false);
            setEditingUser(null);
            setFormData({ name: "", email: "", role: "User" });
            setErrors({});
            setTouched({});
        } finally {
            setIsUpdatingRole(false);
        }
    };

    const closeModal = () => {
        if (isUpdatingRole) return;
        
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
                    <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3">
                        {user.imageUrl ? (
                            <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-[#D1FFD7] flex items-center justify-center">
                                <UserCircle size={16} className="text-green-700" />
                            </div>
                        )}
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
                className="text-green-600 hover:text-green-800 transition bg-[#D1FFD7] p-2 rounded-full shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Edit ${user.name}`}
                disabled={isUpdatingRole || isDeleting}
            >
                <Edit size={16} />
            </button>
            <button 
                onClick={() => handleDeleteRequest(user.id)} 
                className="text-red-600 hover:text-red-800 transition bg-red-50 p-2 rounded-full shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label={`Delete ${user.name}`}
                disabled={isDeleting || isUpdatingRole}
            >
                <Trash2 size={16} />
            </button>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="p-3 sm:p-4 md:p-6 max-w-6xl mx-auto">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-4 md:p-6 max-w-6xl mx-auto">
            {/* Delete Confirmation Popup */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleDeleteCancel}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={isDeleting}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        {t('manager.users.deleting')}
                                    </>
                                ) : t('manager.users.delete')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">{t('manager.users.title')}</h1>
            </div>
            
            {error && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                {error}. {t('manager.users.mockDataMessage')}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="bg-[#F9FFF9] p-4 rounded-lg mb-6 border border-green-200 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <p className="text-green-800">
                        <strong>{t('manager.users.totalUsers')}:</strong> {filteredUsers.length} / {users.length} 
                        <span className="mx-2">•</span>
                        <strong>{t('manager.users.admins')}:</strong> {filteredUsers.filter(u => u.role === "Admin").length}
                        <span className="mx-2">•</span>
                        <strong>{t('manager.users.managers')}:</strong> {filteredUsers.filter(u => u.role === "Manager").length}
                        <span className="mx-2">•</span>
                        <strong>{t('manager.users.regularUsers')}:</strong> {filteredUsers.filter(u => u.role === "User").length}
                    </p>
                    <button 
                        onClick={clearFilters}
                        className={`text-sm px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition flex items-center gap-1 ${Object.values(filters).every(v => v === "") ? "hidden" : ""}`}
                    >
                        <X size={14} /> {t('manager.users.clearFilters')}
                    </button>
                </div>
            </div>
            
            {/* Filters section */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-6">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <h2 className="text-lg font-medium text-gray-700">{t('manager.users.filters')}</h2>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="name-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('manager.users.filterByName')}
                            </label>
                            <input
                                id="name-filter"
                                name="name"
                                type="text"
                                value={filters.name}
                                onChange={handleFilterChange}
                                placeholder={t('manager.users.searchByName')}
                                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('manager.users.filterByEmail')}
                            </label>
                            <input
                                id="email-filter"
                                name="email"
                                type="text"
                                value={filters.email}
                                onChange={handleFilterChange}
                                placeholder={t('manager.users.searchByEmail')}
                                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('manager.users.filterByRole')}
                            </label>
                            <select
                                id="role-filter"
                                name="role"
                                value={filters.role}
                                onChange={handleFilterChange}
                                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="">{t('manager.users.allRoles')}</option>
                                {roles.map((role) => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table view (hidden on mobile) */}
            <div className="hidden sm:block bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 mb-1">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-gradient-to-r from-green-50 to-[#D1FFD7] text-green-800 border-b border-green-200">
                            <tr>
                                <th className="p-3 md:p-4 text-left font-medium">{t('manager.users.name')}</th>
                                <th className="p-3 md:p-4 text-left font-medium">{t('manager.users.email')}</th>
                                <th className="p-3 md:p-4 text-left font-medium">{t('manager.users.role')}</th>
                                <th className="p-3 md:p-4 text-center font-medium">{t('manager.users.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-100 hover:bg-[#F5FFF6] transition">
                                        <td className="p-3 md:p-4 flex items-center">
                                            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center mr-3">
                                                {user.imageUrl ? (
                                                    <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#D1FFD7] flex items-center justify-center">
                                                        <UserCircle size={16} className="text-green-700" />
                                                    </div>
                                                )}
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
                                                className="text-green-600 hover:text-green-800 transition bg-[#D1FFD7] p-2 rounded-full shadow-sm"
                                                aria-label={t('manager.users.editUser', { name: user.name })}
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteRequest(user.id)} 
                                                className="text-red-600 hover:text-red-800 transition bg-red-50 p-2 rounded-full shadow-sm"
                                                aria-label={t('manager.users.deleteUser', { name: user.name })}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">
                                        {users.length > 0 
                                            ? t('manager.users.noMatchingUsers')
                                            : t('manager.users.noUsers')
                                        }
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        {t('manager.users.showingUsers', { count: filteredUsers.length })}
                        {users.length !== filteredUsers.length && ` / ${users.length}`}
                    </div>
                </div>
            </div>

            {/* Card view for mobile */}
            <div className="sm:hidden">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => <UserCard key={user.id} user={user} />)
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center text-gray-500">
                        {users.length > 0 
                            ? t('manager.users.noMatchingUsers')
                            : t('manager.users.noUsers')
                        }
                    </div>
                )}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        {t('manager.users.showingUsers', { count: filteredUsers.length })}
                        {users.length !== filteredUsers.length && ` / ${users.length}`}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold">{t('manager.users.updateUserRole')}</h2>
                            <button 
                                onClick={closeModal} 
                                className="text-gray-500 hover:text-gray-700 transition"
                                aria-label={t('common.close')}
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="space-y-4" noValidate>
                            <div className="flex flex-col mb-4">
                                <div className="flex items-center mb-2">
                                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center mr-3">
                                        {editingUser?.imageUrl ? (
                                            <img src={editingUser.imageUrl} alt={editingUser.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#D1FFD7] flex items-center justify-center">
                                                <UserCircle size={24} className="text-green-700" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800">{editingUser?.name}</h3>
                                        <p className="text-sm text-gray-500">{editingUser?.email}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col">
                                <label htmlFor="role" className="text-sm font-medium text-gray-700 mb-1">
                                    {t('manager.users.role')} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full border p-2 rounded-md outline-none transition ${
                                        errors.role ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500'
                                    }`}
                                    aria-invalid={errors.role ? "true" : "false"}
                                    aria-describedby={errors.role ? "role-error" : undefined}
                                >
                                    <option value="" disabled>{t('manager.users.selectRole')}</option>
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
                                type="submit" 
                                disabled={isUpdatingRole}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition w-full sm:w-auto shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isUpdatingRole ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        {t('manager.users.updating')}
                                    </>
                                ) : t('manager.users.updateRole')}
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