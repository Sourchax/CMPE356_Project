import React, { useState } from "react";
import { Trash2, User, MessageSquare, Send, CheckCircle, Clock, AlertCircle } from "lucide-react";

const ManageComplaints = () => {
    const [complaints, setComplaints] = useState([
        { id: 1, name: "Alice Brown", email: "sailmatesup@hotmail.com", complaint: "System is running slow.", reply: "", status: "pending" },
        { id: 2, name: "Bob White", email: "sailmatesup@hotmail.com", complaint: "Unable to reset password.", reply: "", status: "pending" },
    ]);
    const [replyData, setReplyData] = useState({ id: null, message: "" });
    const [expandedComplaint, setExpandedComplaint] = useState(null);

    const handleDelete = (id) => {
        setComplaints(complaints.filter((complaint) => complaint.id !== id));
    };

    const handleReply = (id) => {
        if (!replyData.message.trim()) return;
        
        setComplaints(complaints.map((complaint) =>
            complaint.id === id ? { ...complaint, reply: replyData.message, status: "resolved" } : complaint
        ));
        setReplyData({ id: null, message: "" });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "resolved":
                return (
                    <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle size={14} />
                        Resolved
                    </span>
                );
            case "pending":
                return (
                    <span className="flex items-center gap-1 text-sm font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                        <Clock size={14} />
                        Pending
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded-full">
                        <AlertCircle size={14} />
                        {status}
                    </span>
                );
        }
    };

    const toggleExpandComplaint = (id) => {
        setExpandedComplaint(expandedComplaint === id ? null : id);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Customer Complaints</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{complaints.length} complaints</span>
                </div>
            </div>

            <div className="grid gap-6">
                {complaints.map((complaint) => (
                    <div key={complaint.id} className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
                        <div className="flex justify-between items-center p-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <User size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium">{complaint.name}</h3>
                                    <p className="text-sm text-gray-500">{complaint.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {getStatusBadge(complaint.status)}
                                <button 
                                    onClick={() => handleDelete(complaint.id)} 
                                    className="text-gray-400 hover:text-red-600 transition p-1 rounded-full hover:bg-red-50"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <div 
                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg mb-4"
                                onClick={() => toggleExpandComplaint(complaint.id)}
                            >
                                <MessageSquare size={18} className="text-gray-500 mt-1" />
                                <div className={`${expandedComplaint === complaint.id ? '' : 'line-clamp-2'} prose-sm`}>
                                    {complaint.complaint}
                                </div>
                            </div>
                            
                            {complaint.reply ? (
                                <div className="flex items-start gap-3 ml-6 p-3 bg-blue-50 rounded-lg">
                                    <Send size={16} className="text-blue-500 mt-1" />
                                    <div className="prose-sm text-gray-700">
                                        {complaint.reply}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Reply to complaint
                                    </label>
                                    <div className="flex gap-2">
                                        <textarea
                                            rows="3"
                                            placeholder="Type your response..."
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                                            value={replyData.id === complaint.id ? replyData.message : ""}
                                            onChange={(e) => setReplyData({ id: complaint.id, message: e.target.value })}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setReplyData({ ...replyData, id: complaint.id });
                                            }}
                                        />
                                    </div>
                                    <div className="flex justify-end mt-2">
                                        <button
                                            onClick={() => handleReply(complaint.id)}
                                            disabled={!replyData.message.trim() || replyData.id !== complaint.id}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            <Send size={16} />
                                            Send Reply
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {complaints.length === 0 && (
                    <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <MessageSquare size={48} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No Complaints</h3>
                        <p className="text-gray-500">There are no customer complaints to display.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageComplaints;