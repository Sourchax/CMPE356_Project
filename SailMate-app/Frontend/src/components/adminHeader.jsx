import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bell, Menu, X } from 'lucide-react';
import { useClerk, useUser } from "@clerk/clerk-react";
import SailMateLogo from '../assets/images/SailMate_Logo.png';
import CustomUserButton from '../pages/customUserButton';

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="mx-auto w-full max-w-[80rem] px-4 flex justify-between items-center">
        {/* Left Side: Logo & Title */}
        <div className="flex items-center space-x-4">
          <img src={SailMateLogo} alt="SailMate Logo" className="w-32 h-10 object-contain" />
          <h1 className="text-2xl font-bold">Admin</h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <NavLink to="/adminStations" icon={MapPin} text="Edit Stations" />
          <NavLink to="/adminVoyage" icon={Clock} text="Voyage Times" />
          <NavLink to="/adminAnnounce" icon={Bell} text="Announcements" />
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

      {/* Mobile Navigation (Slide Down) */}
      {menuOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 mt-2 pb-4 bg-blue-700 rounded-md transition-all duration-300">
          <NavLink to="/adminStations" icon={MapPin} text="Edit Stations" />
          <NavLink to="/adminVoyage" icon={Clock} text="Voyage Times" />
          <NavLink to="/adminAnnounce" icon={Bell} text="Announcements" />
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, icon: Icon, text }) => (
  <Link 
    to={to} 
    className="flex items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition-colors duration-200"
  >
    <Icon size={18} className="text-white" strokeWidth={2.5} />
    <span>{text}</span>
  </Link>
);

export default AdminHeader;