import React, { useState } from "react";
import { Trash2, Clock, User, Calendar, X, Search, Filter, ChevronDown } from "lucide-react";

const ManagerLogs = () => {
    const [logs, setLogs] = useState([
        { id: 1, user: "Alice Brown", loginTime: "2025-03-01 08:30:00", logoutTime: "2025-03-01 12:45:00", role: "User" },
        { id: 2, user: "Bob White", loginTime: "2025-03-01 09:15:00", logoutTime: "2025-03-01 13:30:00", role: "Admin" },
        { id: 3, user: "Charlie Green", loginTime: "2025-03-02 08:45:00", logoutTime: "2025-03-02 17:15:00", role: "Manager" },
        { id: 4, user: "Diana Miller", loginTime: "2025-03-02 09:30:00", logoutTime: "2025-03-02 18:00:00", role: "User" },
        { id: 5, user: "Edward Johnson", loginTime: "2025-03-03 07:55:00", logoutTime: "2025-03-03 16:40:00", role: "Manager" },
        { id: 6, user: "Fiona Smith", loginTime: "2025-03-03 08:20:00", logoutTime: "2025-03-03 17:30:00", role: "Admin" },
        { id: 7, user: "George Wilson", loginTime: "2025-03-04 09:10:00", logoutTime: "2025-03-04 18:25:00", role: "User" },
        { id: 8, user: "Hannah Davis", loginTime: "2025-03-04 08:30:00", logoutTime: "2025-03-04 17:45:00", role: "Manager" },
    ]);
    
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        roles: []
    });

    // Available roles for filtering
    const roles = ["User", "Admin", "Manager"];

    // Handle sorting
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Apply sorting and filtering
    const getSortedAndFilteredLogs = () => {
        let filteredLogs = [...logs];
        
        // Apply search
        if (searchTerm) {
            filteredLogs = filteredLogs.filter(log => 
                log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.role.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        // Apply role filters
        if (filters.roles.length > 0) {
            filteredLogs = filteredLogs.filter(log => 
                filters.roles.includes(log.role)
            );
        }
        
        // Apply sorting
        if (sortConfig.key) {
            filteredLogs.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        } else {
            // Default sort by login time (newest first)
            filteredLogs.sort((a, b) => new Date(b.loginTime) - new Date(a.loginTime));
        }
        
        return filteredLogs;
    };

    const handleDeleteRequest = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    const handleDeleteConfirm = () => {
        setLogs(logs.filter((log) => log.id !== deleteConfirm.id));
        setDeleteConfirm({ show: false, id: null });
    };

    const handleDeleteCancel = () => {
        setDeleteConfirm({ show: false, id: null });
    };

    const handleRoleFilter = (role) => {
        setFilters(prev => {
            const newRoles = prev.roles.includes(role) 
                ? prev.roles.filter(r => r !== role)
                : [...prev.roles, role];
            
            return { ...prev, roles: newRoles };
        });
    };

    // Format date/time for better display
    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate session duration
    const calculateDuration = (login, logout) => {
        const start = new Date(login);
        const end = new Date(logout);
        const diff = (end - start) / (1000 * 60); // in minutes
        
        const hours = Math.floor(diff / 60);
        const minutes = Math.floor(diff % 60);
        
        return `${hours}h ${minutes}m`;
    };
    
    const sortedAndFilteredLogs = getSortedAndFilteredLogs();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-semibold text-gray-900">Confirm Delete</h3>
                            <button 
                                onClick={handleDeleteCancel}
                                className="text-gray-400 hover:text-gray-500 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-600">Are you sure you want to delete this log entry? This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleDeleteCancel}
                                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-teal-600 mb-4 md:mb-0">Manager Logs</h1>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users or roles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                            />
                            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        
                        {/* Filter Button */}
                        <div className="relative">
                            <button 
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <Filter size={18} className="text-teal-500" />
                                <span>Filter Roles</span>
                                <ChevronDown size={16} className={`transition-transform text-gray-500 ${filterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {/* Filter Dropdown */}
                            {filterOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                                    <div className="p-3 border-b border-gray-200 bg-teal-100">
                                        <h3 className="font-semibold text-teal-800">User Roles</h3>
                                    </div>
                                    <div className="p-3">
                                        <div className="space-y-3">
                                            {roles.map(role => (
                                                <label key={role} className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={filters.roles.includes(role)}
                                                        onChange={() => handleRoleFilter(role)}
                                                        className="mr-3 h-4 w-4 text-teal-600 focus:ring-teal-500 rounded"
                                                    />
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                        role === 'Admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 
                                                        role === 'Manager' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                                                        'bg-gray-100 text-gray-800 border border-gray-200'
                                                    }`}>
                                                        {role}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Desktop table view (hidden on mobile) */}
                <div className="hidden sm:block bg-white shadow-xl rounded-xl overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                                <th className="p-4 text-left font-medium text-white">User</th>
                                <th className="p-4 text-left font-medium text-white">Role</th>
                                <th className="p-4 text-left font-medium text-white">Login Time</th>
                                <th className="p-4 text-left font-medium text-white">Logout Time</th>
                                <th className="p-4 text-left font-medium text-white">Duration</th>
                                <th className="p-4 text-center font-medium text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedAndFilteredLogs.length > 0 ? (
                                sortedAndFilteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center mr-3 shadow-sm">
                                                    {log.user.charAt(0)}
                                                </div>
                                                <span className="font-medium">{log.user}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                log.role === 'Admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 
                                                log.role === 'Manager' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                                                'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                                {log.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <Clock size={16} className="text-teal-500 mr-2" /> 
                                                <span>{formatDateTime(log.loginTime)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <Calendar size={16} className="text-teal-500 mr-2" /> 
                                                <span>{formatDateTime(log.logoutTime)}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-teal-600">
                                                {calculateDuration(log.loginTime, log.logoutTime)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button 
                                                onClick={() => handleDeleteRequest(log.id)} 
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                                aria-label="Delete log"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-gray-500">
                                        No logs found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile card view */}
                <div className="sm:hidden space-y-4">
                    {sortedAndFilteredLogs.length > 0 ? (
                        sortedAndFilteredLogs.map(log => (
                            <div key={log.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center">
                                            <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center mr-3 shadow-sm">
                                                {log.user.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-800">{log.user}</span>
                                        </div>
                                        <div className="mt-2 ml-12">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                log.role === 'Admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 
                                                log.role === 'Manager' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                                                'bg-gray-100 text-gray-800 border border-gray-200'
                                            }`}>
                                                {log.role}
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteRequest(log.id)} 
                                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                                        aria-label="Delete log"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="space-y-3 text-sm mt-5 border-t border-gray-100 pt-4">
                                    <div className="flex items-start">
                                        <Clock size={16} className="text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-gray-500 mb-1">Login Time</div>
                                            <div className="font-medium">{formatDateTime(log.loginTime)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Calendar size={16} className="text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="text-gray-500 mb-1">Logout Time</div>
                                            <div className="font-medium">{formatDateTime(log.logoutTime)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start bg-teal-50 p-3 rounded-lg mt-3">
                                        <div className="mr-3 flex-shrink-0 bg-white w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                                            <Clock size={14} className="text-teal-500" />
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1">Session Duration</div>
                                            <div className="font-semibold text-teal-700">{calculateDuration(log.loginTime, log.logoutTime)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow-lg text-center text-gray-500">
                            No logs found matching your criteria.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerLogs;