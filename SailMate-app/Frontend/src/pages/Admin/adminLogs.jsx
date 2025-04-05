import React, { useState, useEffect } from "react";
import { Trash2, Clock, User, Calendar, X, Search, Filter, ChevronDown, Tag, Activity } from "lucide-react";
import { useSessionToken } from "../../utils/sessions";
import axios from "axios";

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLogDetails, setSelectedLogDetails] = useState(null);
    
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filterOpen, setFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        roles: [],
        actionTypes: []
    });

    // Available roles for filtering
    const roles = ["user", "admin", "manager", "super"];
    
    // Available action types for filtering
    const actionTypes = ["CREATE", "UPDATE", "DELETE", "CANCEL", "BROADCAST", "BULK_CREATE"];

    // Fetch logs
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                
                const response = await axios.get(
                    `${'http://localhost:8080'}/api/activity-logs`,
                    {
                        headers: {
                            Authorization: `Bearer ${useSessionToken()}`
                        }
                    }
                );
                setLogs(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching activity logs:", err);
                setError("Failed to fetch activity logs. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, []);

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
                (log.fullName && log.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (log.userRole && log.userRole.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (log.actionType && log.actionType.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (log.entityType && log.entityType.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (log.description && log.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }
        
        // Apply role filters
        if (filters.roles.length > 0) {
            filteredLogs = filteredLogs.filter(log => 
                filters.roles.includes(log.userRole)
            );
        }
        
        // Apply action type filters
        if (filters.actionTypes.length > 0) {
            filteredLogs = filteredLogs.filter(log => 
                filters.actionTypes.includes(log.actionType)
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
            // Default sort by creation time (newest first)
            filteredLogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        return filteredLogs;
    };

    const handleDeleteRequest = (id) => {
        setDeleteConfirm({ show: true, id });
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(
                `${'http://localhost:8080'}/api/activity-logs/${deleteConfirm.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${useSessionToken()}`
                    }
                }
            );
            
            // Update local state after successful delete
            setLogs(logs.filter((log) => log.id !== deleteConfirm.id));
            setDeleteConfirm({ show: false, id: null });
        } catch (err) {
            console.error("Error deleting activity log:", err);
            alert("Failed to delete activity log. Please try again.");
        }
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

    const handleActionTypeFilter = (actionType) => {
        setFilters(prev => {
            const newActionTypes = prev.actionTypes.includes(actionType) 
                ? prev.actionTypes.filter(a => a !== actionType)
                : [...prev.actionTypes, actionType];
            
            return { ...prev, actionTypes: newActionTypes };
        });
    };

    const formatDateTime = (dateTimeStr) => {
        const date = new Date(dateTimeStr);
        return date.toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    // Get role badge styling
    const getRoleBadgeStyle = (role) => {
        switch(role?.toLowerCase()) {
            case 'admin':
                return 'bg-purple-100 text-purple-800 border border-purple-200';
            case 'manager':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'super':
                return 'bg-orange-100 text-orange-800 border border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };

    // Get action type badge styling
    const getActionTypeBadgeStyle = (actionType) => {
        switch(actionType) {
            case 'CREATE':
                return 'bg-green-100 text-green-800 border border-green-200';
            case 'UPDATE':
                return 'bg-blue-100 text-blue-800 border border-blue-200';
            case 'DELETE':
                return 'bg-red-100 text-red-800 border border-red-200';
            case 'CANCEL':
                return 'bg-orange-100 text-orange-800 border border-orange-200';
            case 'BROADCAST':
                return 'bg-purple-100 text-purple-800 border border-purple-200';
            case 'BULK_CREATE':
                return 'bg-cyan-100 text-cyan-800 border border-cyan-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };
    
    // Get entity type badge styling
    const getEntityTypeBadgeStyle = (entityType) => {
        switch(entityType) {
            case 'ANNOUNCEMENT':
                return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            case 'STATION':
                return 'bg-lime-100 text-lime-800 border border-lime-200';
            case 'PRICE':
                return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
            case 'COMPLAINT':
                return 'bg-rose-100 text-rose-800 border border-rose-200';
            case 'NOTIFICATION':
                return 'bg-indigo-100 text-indigo-800 border border-indigo-200';
            case 'VOYAGE':
                return 'bg-sky-100 text-sky-800 border border-sky-200';
            case 'TICKET':
                return 'bg-amber-100 text-amber-800 border border-amber-200';
            default:
                return 'bg-gray-100 text-gray-800 border border-gray-200';
        }
    };
    
    const sortedAndFilteredLogs = getSortedAndFilteredLogs();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-t-4 border-[#06AED5] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading activity logs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <X size={32} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-5 py-2.5 bg-[#06AED5] hover:bg-[#0599c2] text-white rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                            <button 
                                onClick={handleDeleteCancel}
                                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-1 transition"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-700">Are you sure you want to delete this log? This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleDeleteCancel}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition font-medium border border-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-sm font-medium border border-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#06AED5] mb-4 md:mb-0">Activity Logs</h1>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-[#06AED5] focus:border-[#06AED5] transition-colors"
                            />
                            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                        </div>
                        
                        {/* Filter Button */}
                        <div className="relative">
                            <button 
                                onClick={() => setFilterOpen(!filterOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                            >
                                <Filter size={18} className="text-[#06AED5]" />
                                <span>Filters</span>
                                <ChevronDown size={16} className={`transition-transform text-gray-500 ${filterOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {/* Filter Dropdown */}
                            {filterOpen && (
                                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                                    <div className="p-3 border-b border-gray-200 bg-[#E6F7FB]">
                                        <h3 className="font-semibold text-[#06AED5]">Filter Options</h3>
                                    </div>
                                    
                                    {/* Role Filters */}
                                    <div className="p-3 border-b border-gray-200">
                                        <h4 className="font-medium text-gray-700 mb-2">User Roles</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {roles.map(role => (
                                                <label 
                                                    key={role} 
                                                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border-2 transition-all ${
                                                        filters.roles.includes(role) 
                                                            ? `bg-[#E6F7FB] border-[#06AED5] shadow-sm` 
                                                            : 'bg-gray-100 border-transparent hover:bg-gray-200'
                                                    }`}
                                                    onClick={() => handleRoleFilter(role)}
                                                >
                                                    {role}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Action Type Filters */}
                                    <div className="p-3">
                                        <h4 className="font-medium text-gray-700 mb-2">Action Types</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {actionTypes.map(type => (
                                                <label 
                                                    key={type} 
                                                    className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border-2 transition-all ${
                                                        filters.actionTypes.includes(type) 
                                                            ? `bg-[#E6F7FB] border-[#06AED5] shadow-sm` 
                                                            : 'bg-gray-100 border-transparent hover:bg-gray-200'
                                                    }`}
                                                    onClick={() => handleActionTypeFilter(type)}
                                                >
                                                    {type}
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
                        <tbody className="divide-y divide-gray-100">
                            {sortedAndFilteredLogs.length > 0 ? (
                                sortedAndFilteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-9 h-9 rounded-full bg-[#06AED5] text-white flex items-center justify-center mr-3 shadow-sm">
                                                    {log.fullName ? log.fullName.charAt(0) : 'U'}
                                                </div>
                                                <span className="font-medium">{log.fullName || 'Unknown User'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyle(log.userRole)}`}>
                                                {log.userRole || 'user'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionTypeBadgeStyle(log.actionType)}`}>
                                                {log.actionType || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEntityTypeBadgeStyle(log.entityType)}`}>
                                                {log.entityType || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button 
                                                onClick={() => setSelectedLogDetails(log)}
                                                className="text-[#06AED5] hover:text-[#0599c2] font-medium transition-colors"
                                            >
                                                Show Details
                                            </button>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center">
                                                <Clock size={16} className="text-[#06AED5] mr-2" /> 
                                                <span>{formatDateTime(log.createdAt)}</span>
                                            </div>
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
                                    <td colSpan="7" className="p-8 text-center text-gray-500">
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
                                            <div className="w-9 h-9 rounded-full bg-[#06AED5] text-white flex items-center justify-center mr-3 shadow-sm">
                                                {log.fullName ? log.fullName.charAt(0) : 'U'}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-800">{log.fullName || 'Unknown User'}</span>
                                                <div className="mt-1">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyle(log.userRole)}`}>
                                                        {log.userRole || 'user'}
                                                    </span>
                                                </div>
                                            </div>
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
                                
                                <div className="flex gap-2 my-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getActionTypeBadgeStyle(log.actionType)}`}>
                                        {log.actionType || 'UNKNOWN'}
                                    </span>
                                    
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEntityTypeBadgeStyle(log.entityType)}`}>
                                        {log.entityType || 'UNKNOWN'}
                                    </span>
                                </div>
                                
                                <p className="text-sm mt-2">
                                    <button 
                                        onClick={() => setSelectedLogDetails(log)}
                                        className="text-[#06AED5] hover:text-[#0599c2] font-medium transition-colors"
                                    >
                                        Show Details
                                    </button>
                                </p>
                                
                                <div className="flex items-center justify-end text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
                                    <Clock size={14} className="mr-1" />
                                    {formatDateTime(log.createdAt)}
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
            
            {/* Log Details Modal */}
            {selectedLogDetails && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">Log Details</h3>
                            <button 
                                onClick={() => setSelectedLogDetails(null)}
                                className="text-gray-400 hover:text-gray-500 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Full Description</p>
                                <p className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    {selectedLogDetails.description}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">User</p>
                                    <p className="bg-gray-50 p-2 rounded-lg border border-gray-200">
                                        {selectedLogDetails.fullName || 'Unknown'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Role</p>
                                    <p className={`${getRoleBadgeStyle(selectedLogDetails.userRole)} p-2 rounded-lg text-center`}>
                                        {selectedLogDetails.userRole || 'user'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Action</p>
                                    <p className={`${getActionTypeBadgeStyle(selectedLogDetails.actionType)} p-2 rounded-lg text-center`}>
                                        {selectedLogDetails.actionType || 'UNKNOWN'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Entity</p>
                                    <p className={`${getEntityTypeBadgeStyle(selectedLogDetails.entityType)} p-2 rounded-lg text-center`}>
                                        {selectedLogDetails.entityType || 'UNKNOWN'}
                                    </p>
                                </div>
                            </div>
                            
                            <div>
                                <p className="text-sm font-medium text-gray-600">Timestamp</p>
                                <p className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex items-center">
                                    <Clock size={16} className="mr-2 text-[#06AED5]" />
                                    {formatDateTime(selectedLogDetails.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogs;