import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bell, Menu, X } from 'lucide-react';
import { useClerk, useUser } from "@clerk/clerk-react"; // Import necessary functions from Clerk
import SailMateLogo from '../assets/images/SailMate_Logo.png';
import CustomUserButton from '../pages/CustomUserButton';  // Import CustomUserButton

const ManagerHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { signOut } = useClerk();  // Get signOut function from Clerk
    const { user } = useUser(); // Get user details from Clerk

    const handleSignOut = () => {
        signOut();
    };

    return (
        <header className="bg-blue-600 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                {/* Left Side: Logo & Title */}
                <div className="flex items-center space-x-4">
                    <img src={SailMateLogo} alt="SailMate Logo" className="w-32 h-10 object-contain" />
                    <h1 className="text-2xl font-semibold">Manager</h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-6">
                    <NavLink to="/managerLogs" icon={MapPin} text="Log" />
                    <NavLink to="/managerUsers" icon={Clock} text="Users" />
                    <NavLink to="/managerComplaints" icon={Bell} text="Complaints" />
                    <NavLink to="/managerFinance" icon={Bell} text="Finance" />
                </nav>

                {/* User Profile Button (Desktop) */}
                <div className="hidden md:flex relative">
                    {/* Replaced UserProfileDropdown with CustomUserButton */}
                    <CustomUserButton user={user} handleSignOut={handleSignOut} />
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Navigation (Slide Down) */}
            {menuOpen && (
                <div className="md:hidden flex flex-col items-center gap-4 mt-4 pb-4 bg-blue-700 rounded-lg transition-all duration-300">
                    <NavLink to="/managerLogs" icon={MapPin} text="Log" />
                    <NavLink to="/managerUsers" icon={Clock} text="Users" />
                    <NavLink to="/managerComplaints" icon={Bell} text="Complaints" />
                    <NavLink to="/managerFinance" icon={Bell} text="Finance" />
                    {/* Replaced UserProfileDropdown with CustomUserButton */}
                    <CustomUserButton user={user} handleSignOut={handleSignOut} />
                </div>
            )}
        </header>
    );
};

// Keep the NavLink component as it is
const NavLink = ({ to, icon: Icon, text }) => (
    <Link
        to={to}
        className="flex items-center gap-2 transition-colors duration-200 px-3 py-2 rounded-md text-white hover:bg-blue-700"
    >
        <Icon size={18} className="text-white" strokeWidth={2.5} />
        <span>{text}</span>
    </Link>
);

export default ManagerHeader;
