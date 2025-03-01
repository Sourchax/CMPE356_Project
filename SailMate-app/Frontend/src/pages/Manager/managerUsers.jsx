import React, { useState } from "react";
import { Trash2, User, Edit } from "lucide-react";

const ManageUsers = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "Alice Brown", email: "alice@example.com", role: "Admin" },
        { id: 2, name: "Bob White", email: "bob@example.com", role: "User" },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", role: "" });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        if (!formData.name || formData.name.length < 3) newErrors.name = "User name must be at least 3 characters";
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address";
        if (!formData.role || formData.role.length < 3) newErrors.role = "Role must be at least 3 characters";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDelete = (id) => {
        setUsers(users.filter((user) => user.id !== id));
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, email: user.email, role: user.role });
        setErrors({});
        setIsModalOpen(true);
    };

    const handleSave = (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        if (editingUser) {
            setUsers(users.map((u) => (u.id === editingUser.id ? { ...formData, id: editingUser.id } : u)));
        } else {
            setUsers([...users, { ...formData, id: Date.now() }]);
        }

        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", role: "" });
        setErrors({});
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ name: "", email: "", role: "" });
        setErrors({});
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Manage Users</h1>

            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead className="bg-blue-600 text-white">
                        <tr>
                            <th className="p-3 text-left"><User size={18} className="inline-block mr-2" />Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-100 transition">
                                <td className="p-3"><User size={16} className="mr-2" /> {user.name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">{user.role}</td>
                                <td className="p-3 text-center flex justify-center gap-4">
                                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800 transition">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800 transition">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-semibold mb-4">{editingUser ? "Edit User" : "Add User"}</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            {Object.keys(formData).map((field) => (
                                <div key={field} className="flex flex-col">
                                    <input
                                        type="text"
                                        name={field}
                                        value={formData[field]}
                                        onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                                        className="w-full border p-2 rounded-md outline-none"
                                        required
                                    />
                                    {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
                                </div>
                            ))}
                            <div className="flex justify-between mt-4">
                                <button type="button" onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400 transition">Cancel</button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
