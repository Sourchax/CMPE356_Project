import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Bell, DollarSign, Menu, X } from 'lucide-react';
import { useClerk, useUser } from "@clerk/clerk-react";
import SailMateLogo from '../assets/images/SailMate_Logo.png';
import CustomUserButton from '../pages/customUserButton';

const ManagerHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { signOut } = useClerk();
    const { user } = useUser();

    // Close mobile menu when screen size changes to desktop view
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && menuOpen) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [menuOpen]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        if (!menuOpen) return;
        
        const handleClickOutside = (e) => {
            const mobileMenu = document.getElementById('mobile-menu');
            const menuButton = document.getElementById('menu-button');
            
            if (mobileMenu && !mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const handleSignOut = () => {
        signOut();
    };

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 py-3 flex justify-between items-center gap-2 md:gap-3 lg:gap-4">
                {/* Left Side: Logo & Title */}
                <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
                    <img 
                        src={SailMateLogo} 
                        alt="SailMate Logo" 
                        className="w-16 sm:w-20 md:w-24 lg:w-32 h-8 object-contain" 
                        width={128} 
                        height={32} 
                    />
                    <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold whitespace-nowrap">Manager</h1>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex md:space-x-1 lg:space-x-4 overflow-x-auto">
                    <NavLink 
                        to="/managerLogs" 
                        icon={MapPin} 
                        text="Logs" 
                        className="md:text-xs lg:text-sm xl:text-base"
                    />
                    <NavLink 
                        to="/managerUsers" 
                        icon={Clock} 
                        text="Users" 
                        className="md:text-xs lg:text-sm xl:text-base"
                    />
                    <NavLink 
                        to="/managerComplaints" 
                        icon={Bell} 
                        text="Complaints" 
                        className="md:text-xs lg:text-sm xl:text-base"
                    />
                    <NavLink 
                        to="/managerFinance" 
                        icon={DollarSign} 
                        text="Finance" 
                        className="md:text-xs lg:text-sm xl:text-base"
                    />
                </nav>

                {/* User Profile Button and Mobile Menu Button */}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
                    <CustomUserButton user={user} handleSignOut={handleSignOut} />
                    
                    {/* Mobile Menu Button */}
                    <button
                        id="menu-button"
                        className="md:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-white focus:outline-none focus:ring-2 focus:ring-white rounded-md"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-menu"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation with improved transition */}
            <div 
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    menuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col px-4 py-2 gap-2 bg-blue-700 rounded-lg">
                    <NavLink to="/managerLogs" icon={MapPin} text="Logs" mobile={true} />
                    <NavLink to="/managerUsers" icon={Clock} text="Users" mobile={true} />
                    <NavLink to="/managerComplaints" icon={Bell} text="Complaints" mobile={true} />
                    <NavLink to="/managerFinance" icon={DollarSign} text="Finance" mobile={true} />
                </div>
            </div>
        </header>
    );
};

const NavLink = ({ to, icon: Icon, text, mobile, className = '' }) => {
    return (
        <Link 
            to={to} 
            className={`flex items-center gap-1 md:gap-1 lg:gap-2 px-2 md:px-2 lg:px-3 py-1 md:py-2 rounded-md text-white hover:bg-blue-700 transition-colors duration-200 ${
                mobile ? 'w-full' : ''
            } ${className}`}
            onClick={() => mobile && window.innerWidth < 768 ? setMenuOpen(false) : null}
        >
            <Icon size={16} className="text-white flex-shrink-0" strokeWidth={2.5} />
            <span className="whitespace-nowrap">{text}</span>
        </Link>
    );
};

export default ManagerHeader;