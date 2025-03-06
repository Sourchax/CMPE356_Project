import React, { useState } from "react";
import { Trash2, Clock, User, Calendar, X } from "lucide-react";

const ManagerLogs = () => {
    const [logs, setLogs] = useState([
        { id: 1, user: "Alice Brown", loginTime: "2025-03-01 08:30:00", logoutTime: "2025-03-01 12:45:00" },
        { id: 2, user: "Bob White", loginTime: "2025-03-01 09:15:00", logoutTime: "2025-03-01 13:30:00" },
    ]);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

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

    // Mobile card component
    const LogCard = ({ log }) => (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    <User size={18} className="text-green-600 mr-2" />
                    <span className="font-medium">{log.user}</span>
                </div>
                <button 
                    onClick={() => handleDeleteRequest(log.id)} 
                    className="text-red-600 hover:text-red-800 transition p-1"
                    aria-label="Delete log"
                >
                    <Trash2 size={18} />
                </button>
            </div>
            <div className="space-y-2 text-sm">
                <div className="flex items-start">
                    <Clock size={16} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-gray-600">Login Time</div>
                        <div>{formatDateTime(log.loginTime)}</div>
                    </div>
                </div>
                <div className="flex items-start">
                    <Calendar size={16} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                        <div className="text-gray-600">Logout Time</div>
                        <div>{formatDateTime(log.logoutTime)}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-3 sm:p-4 md:p-6 max-w-4xl mx-auto">
            {/* Delete Confirmation Popup */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Confirm Delete</h3>
                            <button 
                                onClick={handleDeleteCancel}
                                className="text-gray-400 hover:text-gray-500"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-5">
                            <p className="text-gray-700">Are you sure you want to delete this log entry? This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleDeleteCancel}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Manager Logs</h1>

            {/* Desktop table view (hidden on mobile) */}
            <div className="hidden sm:block bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead className="bg-[#D1FFD7] text-green-800">
                            <tr>
                                <th className="p-3 text-left whitespace-nowrap">
                                    <User size={18} className="inline-block mr-2" />User
                                </th>
                                <th className="p-3 text-left whitespace-nowrap">
                                    <Clock size={18} className="inline-block mr-2" />Login Time
                                </th>
                                <th className="p-3 text-left whitespace-nowrap">
                                    <Calendar size={18} className="inline-block mr-2" />Logout Time
                                </th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length > 0 ? (
                                logs.map((log) => (
                                    <tr key={log.id} className="border-b hover:bg-[#F5FFF6] transition">
                                        <td className="p-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <User size={16} className="text-green-600 mr-2" /> 
                                                <span>{log.user}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Clock size={16} className="text-green-600 mr-2" /> 
                                                <span>{formatDateTime(log.loginTime)}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Calendar size={16} className="text-green-600 mr-2" /> 
                                                <span>{formatDateTime(log.logoutTime)}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-center">
                                            <button 
                                                onClick={() => handleDeleteRequest(log.id)} 
                                                className="text-red-600 hover:text-red-800 transition p-1 rounded-full hover:bg-red-50"
                                                aria-label="Delete log"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-4 text-center text-gray-500">
                                        No logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile card view */}
            <div className="sm:hidden">
                {logs.length > 0 ? (
                    logs.map(log => <LogCard key={log.id} log={log} />)
                ) : (
                    <div className="bg-white p-4 rounded-lg shadow text-center text-gray-500">
                        No logs found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManagerLogs;