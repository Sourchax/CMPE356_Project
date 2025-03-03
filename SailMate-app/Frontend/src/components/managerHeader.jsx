import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bell, Menu, X } from 'lucide-react';
import { useClerk, useUser } from "@clerk/clerk-react";
import SailMateLogo from '../assets/images/SailMate_Logo.png';
import CustomUserButton from '../pages/customUserButton';

const ManagerHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { signOut } = useClerk();
    const { user } = useUser();

    const handleSignOut = () => {
        signOut();
    };

    return (
        <header className="bg-blue-600 text-white p-4 shadow-lg">
            <div className="mx-auto w-full max-w-[80rem] px-4 flex justify-between items-center">
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

                {/* User Profile Button (Always visible) and Mobile Menu Button */}
                <div className="flex items-center space-x-4">
                    <CustomUserButton user={user} handleSignOut={handleSignOut} />
                    
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </div>




            {menuOpen && (
                <div className="md:hidden flex flex-col items-center gap-4 mt-2 pb-4 bg-blue-700 rounded-lg transition-all duration-300">
                    <NavLink to="/managerLogs" icon={MapPin} text="Log" />
                    <NavLink to="/managerUsers" icon={Clock} text="Users" />
                    <NavLink to="/managerComplaints" icon={Bell} text="Complaints" />
                    <NavLink to="/managerFinance" icon={Bell} text="Finance" />
                </div>
            )}
        </header>
    );
};

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