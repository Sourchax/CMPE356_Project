import React, { useState, useEffect } from "react";
import { Trash2, User, MessageSquare, Send, CheckCircle, Clock, AlertCircle, X, RefreshCw } from "lucide-react";
import axios from "axios";
import {useSessionToken} from "../../utils/sessions";

const ManageComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [replyData, setReplyData] = useState({ id: null, message: "" });
    const [expandedComplaint, setExpandedComplaint] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
    // Add loading states for reply and delete operations
    const [replyLoading, setReplyLoading] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch all complaints from the backend
    const fetchComplaints = async () => {
        try {
            setRefreshing(true);
            const token = useSessionToken();
            const response = await axios.get("http://localhost:8080/api/complaints", {
                headers: {
                    Authorization: `Bearer ${token}`
                  }
            });
            const formattedComplaints = response.data.map(complaint => ({
                ...complaint,
                // Map the status from the backend to the UI's status format
                status: complaint.status === "solved" ? "resolved" : "pending"
            }));
            setComplaints(formattedComplaints);
            applyFilter(activeFilter, formattedComplaints);
            setError(null);
        } catch (err) {
            console.error("Error fetching complaints:", err);
            setError("Failed to load complaints. Please try again later.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Apply filter to complaints
    const applyFilter = (filter, complaintsToFilter = complaints) => {
        setActiveFilter(filter);
        if (filter === "all") {
            setFilteredComplaints(complaintsToFilter);
        } else {
            setFilteredComplaints(complaintsToFilter.filter(complaint => 
                filter === "resolved" ? complaint.status === "resolved" : complaint.status === "pending"
            ));
        }
    };

    // Load complaints on component mount
    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleDeleteRequest = (id) => {
        // Show the delete confirmation popup
        setDeleteConfirm({ show: true, id });
    };

    const handleDeleteConfirm = async () => {
        if (deleteLoading) return; // Prevent multiple clicks
        
        try {
            setDeleteLoading(true);
            
            // Call the backend to delete the complaint
            await axios.delete(`http://localhost:8080/api/complaints/${deleteConfirm.id}`, {
                headers: {
                    Authorization: `Bearer ${useSessionToken()}`
                  }
            });
            
            // Update the UI by removing the deleted complaint
            const updatedComplaints = complaints.filter((complaint) => complaint.id !== deleteConfirm.id);
            setComplaints(updatedComplaints);
            applyFilter(activeFilter, updatedComplaints);
            
            // Hide the popup
            setDeleteConfirm({ show: false, id: null });
        } catch (err) {
            console.error("Error deleting complaint:", err);
            alert("Failed to delete complaint. Please try again.");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        // Hide the popup without deleting
        setDeleteConfirm({ show: false, id: null });
    };

    const handleReply = async (id) => {
        if (!replyData.message.trim() || replyLoading === id) return;
        
        try {
            setReplyLoading(id);
            
            // Update the complaint status to "solved" and add reply in the backend
            await axios.put(`http://localhost:8080/api/complaints/${id}`, {
                status: "solved",
                reply: replyData.message
            }, {
                headers: {
                    Authorization: `Bearer ${useSessionToken()}`
                  }
            });
            
            // Update the UI
            const updatedComplaints = complaints.map((complaint) =>
                complaint.id === id ? { 
                    ...complaint, 
                    reply: replyData.message, 
                    status: "resolved" 
                } : complaint
            );
            
            setComplaints(updatedComplaints);
            applyFilter(activeFilter, updatedComplaints);
            
            // Clear the reply form
            setReplyData({ id: null, message: "" });
        } catch (err) {
            console.error("Error updating complaint:", err);
            alert("Failed to send reply. Please try again.");
        } finally {
            setReplyLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "resolved":
                return (
                    <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <CheckCircle size={14} />
                        Resolved
                    </span>
                );
            case "pending":
                return (
                    <span className="flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                        <Clock size={14} />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        <AlertCircle size={14} />
                        {status}
                    </span>
                );
        }
    };

    const toggleExpandComplaint = (id) => {
        setExpandedComplaint(expandedComplaint === id ? null : id);
    };

    // Show loading state
    if (loading && complaints.length === 0) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading complaints...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && complaints.length === 0) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="bg-red-50 rounded-lg p-6 text-center max-w-md mx-auto">
                        <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Complaints</h3>
                        <p className="text-red-700 mb-4">{error}</p>
                        <button 
                            onClick={fetchComplaints}
                            disabled={refreshing}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition shadow-sm disabled:bg-red-400 disabled:cursor-not-allowed"
                        >
                            {refreshing ? (
                                <span className="flex items-center gap-2">
                                    <RefreshCw size={16} className="animate-spin" />
                                    Trying...
                                </span>
                            ) : "Try Again"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Get counts for status filters
    const pendingCount = complaints.filter(c => c.status === "pending").length;
    const resolvedCount = complaints.filter(c => c.status === "resolved").length;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full border border-gray-100 transform transition-all opacity-100 scale-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">Confirm Delete</h3>
                            <button 
                                onClick={handleDeleteCancel}
                                disabled={deleteLoading}
                                className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full p-1 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="mb-6">
                            <p className="text-gray-700">Are you sure you want to delete this complaint? This action cannot be undone.</p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleDeleteCancel}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition font-medium border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleteLoading}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow-sm font-medium border border-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
                            >
                                {deleteLoading ? (
                                    <span className="flex items-center gap-2">
                                        <RefreshCw size={16} className="animate-spin" />
                                        Deleting...
                                    </span>
                                ) : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <h1 className="text-2xl font-bold text-gray-800">Customer Complaints</h1>
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Status Filter */}
                            <div className="flex flex-wrap bg-gray-50 rounded-lg p-1 shadow-sm border border-gray-200">
                                <button 
                                    onClick={() => applyFilter('all')}
                                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${
                                        activeFilter === 'all' 
                                            ? 'bg-white text-blue-600 shadow-sm border border-gray-200' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    All ({complaints.length})
                                </button>
                                <button 
                                    onClick={() => applyFilter('pending')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition ${
                                        activeFilter === 'pending' 
                                            ? 'bg-white text-amber-600 shadow-sm border border-gray-200' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <Clock size={14} />
                                    Pending ({pendingCount})
                                </button>
                                <button 
                                    onClick={() => applyFilter('resolved')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-md transition ${
                                        activeFilter === 'resolved' 
                                            ? 'bg-white text-green-600 shadow-sm border border-gray-200' 
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    <CheckCircle size={14} />
                                    Resolved ({resolvedCount})
                                </button>
                            </div>
                            
                            <button 
                                onClick={fetchComplaints}
                                disabled={refreshing}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 transition px-4 py-2 rounded-lg font-medium text-sm border border-blue-200 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                <RefreshCw size={16} className={`${refreshing ? 'animate-spin' : ''}`} />
                                {refreshing ? 'Refreshing...' : 'Refresh'}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {filteredComplaints.map((complaint) => (
                        <div key={complaint.id} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-sm">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{complaint.sender}</h3>
                                        <p className="text-sm text-gray-500">{complaint.email}</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            {getStatusBadge(complaint.status)}
                                            <span className="text-xs text-gray-500">
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleDeleteRequest(complaint.id)} 
                                    className="text-gray-400 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-100"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            
                            <div className="mt-4">
                                <div className="text-sm font-semibold text-gray-700 mb-2">
                                    {complaint.subject}
                                </div>
                                <div 
                                    className="rounded-lg p-4 bg-gray-50 cursor-pointer border border-gray-100"
                                    onClick={() => toggleExpandComplaint(complaint.id)}
                                >
                                    <div className="flex items-start gap-3">
                                        <MessageSquare size={18} className="text-gray-500 mt-1 flex-shrink-0" />
                                        <div className={`${expandedComplaint === complaint.id ? '' : 'line-clamp-3'} text-gray-700`}>
                                            {complaint.message}
                                        </div>
                                    </div>
                                </div>
                                
                                {complaint.reply ? (
                                    <div className="mt-4 ml-6 rounded-lg p-4 bg-blue-50 border border-blue-100">
                                        <div className="flex items-start gap-3">
                                            <Send size={16} className="text-blue-500 mt-1 flex-shrink-0" />
                                            <div className="text-gray-700">
                                                <div className="text-xs text-blue-600 font-semibold mb-1">Your Reply:</div>
                                                {complaint.reply}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    complaint.status !== "resolved" ? (
                                        <div className="mt-4 ml-6">
                                            <div className="border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                                                <textarea
                                                    rows="3"
                                                    placeholder="Type your response..."
                                                    className="w-full p-3 outline-none resize-none text-gray-700"
                                                    value={replyData.id === complaint.id ? replyData.message : ""}
                                                    onChange={(e) => setReplyData({ id: complaint.id, message: e.target.value })}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setReplyData({ ...replyData, id: complaint.id });
                                                    }}
                                                    disabled={replyLoading === complaint.id}
                                                />
                                                <div className="bg-gray-50 p-2 flex justify-end border-t border-gray-200">
                                                    <button
                                                        onClick={() => handleReply(complaint.id)}
                                                        disabled={!replyData.message.trim() || replyData.id !== complaint.id || replyLoading === complaint.id}
                                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm text-sm font-medium border border-blue-700"
                                                    >
                                                        {replyLoading === complaint.id ? (
                                                            <span className="flex items-center gap-2">
                                                                <RefreshCw size={15} className="animate-spin" />
                                                                Sending...
                                                            </span>
                                                        ) : (
                                                            <>
                                                                <Send size={15} />
                                                                Send Reply
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                )}
                            </div>
                        </div>
                    ))}

                    {filteredComplaints.length === 0 && (
                        <div className="p-16 text-center">
                            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <MessageSquare size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Complaints</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {activeFilter !== "all" 
                                    ? `There are no ${activeFilter} complaints to display.` 
                                    : "There are no customer complaints to display at this time."}
                            </p>
                            {activeFilter !== "all" && complaints.length > 0 && (
                                <button
                                    onClick={() => applyFilter("all")}
                                    className="mt-4 px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition font-medium border border-blue-200"
                                >
                                    View all complaints
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageComplaints;