import React, { useState } from "react";
import { User, DollarSign, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const ManagerFinance = () => {
    const [admins, setAdmins] = useState([
        {
            id: 1, name: "Captain Jack Sparrow", email: "alice@example.com", finances: [
                { month: "Jan", revenue: 5000, expenses: 2000 },
                { month: "Feb", revenue: 6000, expenses: 2500 },
                { month: "Mar", revenue: 5500, expenses: 2300 },
            ]
        },
        {
            id: 2, name: "Ege Kaptan", email: "egekaptan@example.com", finances: [
                { month: "Jan", revenue: 7000, expenses: 3000 },
                { month: "Feb", revenue: 7500, expenses: 3200 },
                { month: "Mar", revenue: 7200, expenses: 3100 },
            ]
        },
    ]);

    const handleDelete = (id) => {
        setAdmins(admins.filter((admin) => admin.id !== id));
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Finance</h1>

            {admins.map((admin) => (
                <div key={admin.id} className="mb-8 bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">{admin.name}</h2>
                    <p className="text-gray-600 mb-4">{admin.email}</p>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={admin.finances}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="revenue" fill="#4CAF50" name="Revenue ($)" />
                            <Bar dataKey="expenses" fill="#F44336" name="Expenses ($)" />
                        </BarChart>
                    </ResponsiveContainer>

                    <button onClick={() => handleDelete(admin.id)} className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                        <Trash2 size={18} className="inline-block mr-2" /> Remove Admin
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ManagerFinance;