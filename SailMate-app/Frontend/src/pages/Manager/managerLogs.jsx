import React, { useState } from "react";
import { Trash2, Clock, User, Calendar } from "lucide-react";

const ManagerLogs = () => {
    const [logs, setLogs] = useState([
        { id: 1, user: "Alice Brown", loginTime: "2025-03-01 08:30:00", logoutTime: "2025-03-01 12:45:00" },
        { id: 2, user: "Bob White", loginTime: "2025-03-01 09:15:00", logoutTime: "2025-03-01 13:30:00" },
    ]);

    const handleDelete = (id) => {
        setLogs(logs.filter((log) => log.id !== id));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manager Logs</h1>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-3 text-left"><User size={18} className="inline-block mr-2" />User</th>
                            <th className="p-3 text-left"><Clock size={18} className="inline-block mr-2" />Login Time</th>
                            <th className="p-3 text-left"><Calendar size={18} className="inline-block mr-2" />Logout Time</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.id} className="border-b hover:bg-gray-100 transition">
                                <td className="p-3"><User size={16} className="mr-2" /> {log.user}</td>
                                <td className="p-3"><Clock size={16} className="mr-2" /> {log.loginTime}</td>
                                <td className="p-3"><Calendar size={16} className="mr-2" /> {log.logoutTime}</td>
                                <td className="p-3 text-center">
                                    <button onClick={() => handleDelete(log.id)} className="text-red-600 hover:text-red-800 transition">
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

export default ManagerLogs;
