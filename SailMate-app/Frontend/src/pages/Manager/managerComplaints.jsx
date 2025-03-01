import React, { useState } from "react";
import { Trash2, User, MessageSquare, Reply } from "lucide-react";

const ManageComplaints = () => {
    const [complaints, setComplaints] = useState([
        { id: 1, name: "Alice Brown", email: "alice@example.com", complaint: "System is running slow.", reply: "" },
        { id: 2, name: "Bob White", email: "bob@example.com", complaint: "Unable to reset password.", reply: "" },
    ]);
    const [replyData, setReplyData] = useState({ id: null, message: "" });

    const handleDelete = (id) => {
        setComplaints(complaints.filter((complaint) => complaint.id !== id));
    };

    const handleReply = (id) => {
        setComplaints(complaints.map((complaint) =>
            complaint.id === id ? { ...complaint, reply: replyData.message } : complaint
        ));
        setReplyData({ id: null, message: "" });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Complaints</h1>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-3 text-left"><User size={18} className="inline-block mr-2" />Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left"><MessageSquare size={18} className="inline-block mr-2" />Complaint</th>
                            <th className="p-3 text-left">Reply</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints.map((complaint) => (
                            <tr key={complaint.id} className="border-b hover:bg-gray-100 transition">
                                <td className="p-3">{complaint.name}</td>
                                <td className="p-3">{complaint.email}</td>
                                <td className="p-3 max-w-xs overflow-hidden break-words">
                                    <div className="max-h-32 overflow-y-auto p-2 border rounded bg-gray-50">
                                        {complaint.complaint}
                                    </div>
                                </td>
                                <td className="p-3">
                                    {complaint.reply ? (
                                        <div className="p-2 border rounded bg-gray-100">{complaint.reply}</div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Type reply..."
                                                className="border p-2 rounded-md w-full"
                                                value={replyData.id === complaint.id ? replyData.message : ""}
                                                onChange={(e) => setReplyData({ id: complaint.id, message: e.target.value })}
                                            />
                                            <button
                                                onClick={() => handleReply(complaint.id)}
                                                className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition">
                                                <Reply size={18} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                                <td className="p-3 text-center">
                                    <button onClick={() => handleDelete(complaint.id)} className="text-red-600 hover:text-red-800 transition">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageComplaints;