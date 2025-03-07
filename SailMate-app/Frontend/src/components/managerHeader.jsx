import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Clock, Bell, DollarSign, Menu, X } from 'lucide-react';
import { useClerk, useUser } from "@clerk/clerk-react";
import SailMateLogo from '../assets/images/SailMate_Logo.png';
import CustomUserButton from '../pages/customUserButton';

const ManagerHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { signOut } = useClerk();
    const { user } = useUser();
    const location = useLocation();

    // Update document title based on current route
    useEffect(() => {
        const path = location.pathname;
        let title = "Manager | SailMate";
        
        if (path === "/managerDashboard") {
            title = "Manager Dashboard | SailMate";
        } else if (path === "/managerLogs") {
            title = "Activity Logs | SailMate";
        } else if (path === "/managerUsers") {
            title = "User Management | SailMate";
        } else if (path === "/managerComplaints") {
            title = "Complaints | SailMate";
        } else if (path === "/managerFinance") {
            title = "Finance | SailMate";
        }
        
        document.title = title;
    }, [location.pathname]);

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

    // Function to check if a link is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <header className="bg-[#D1FFD7] text-gray-800 shadow-lg">
            <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 py-3 flex justify-between items-center gap-2 md:gap-3 lg:gap-4">
                {/* Left Side: Logo & Title */}
                <Link to="/managerDashboard" className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0 no-underline text-gray-800">
                    <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
                        <img 
                            src={SailMateLogo} 
                            alt="SailMate Logo" 
                            className="w-16 sm:w-20 md:w-24 lg:w-32 h-8 object-contain" 
                            width={128} 
                            height={32} 
                        />
                        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold whitespace-nowrap text-gray-800">Manager</h1>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex md:space-x-1 lg:space-x-4 overflow-x-auto">
                    <NavLink 
                        to="/managerLogs" 
                        icon={MapPin} 
                        text="Logs" 
                        className="md:text-xs lg:text-sm xl:text-base"
                        isActive={isActive('/managerLogs')}
                    />
                    <NavLink 
                        to="/managerUsers" 
                        icon={Clock} 
                        text="Users" 
                        className="md:text-xs lg:text-sm xl:text-base"
                        isActive={isActive('/managerUsers')}
                    />
                    <NavLink 
                        to="/managerComplaints" 
                        icon={Bell} 
                        text="Complaints" 
                        className="md:text-xs lg:text-sm xl:text-base"
                        isActive={isActive('/managerComplaints')}
                    />
                    <NavLink 
                        to="/managerFinance" 
                        icon={DollarSign} 
                        text="Finance" 
                        className="md:text-xs lg:text-sm xl:text-base"
                        isActive={isActive('/managerFinance')}
                    />
                </nav>

                {/* User Profile Button and Mobile Menu Button */}
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
                    <CustomUserButton user={user} handleSignOut={handleSignOut} />
                    
                    {/* Mobile Menu Button */}
                    <button
                        id="menu-button"
                        className="md:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300 rounded-md"
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
                <div className="flex flex-col px-4 py-2 gap-2 bg-[#B2EFB9] rounded-lg">
                    <NavLink 
                        to="/managerLogs" 
                        icon={MapPin} 
                        text="Logs" 
                        mobile={true} 
                        isActive={isActive('/managerLogs')}
                    />
                    <NavLink 
                        to="/managerUsers" 
                        icon={Clock} 
                        text="Users" 
                        mobile={true} 
                        isActive={isActive('/managerUsers')}
                    />
                    <NavLink 
                        to="/managerComplaints" 
                        icon={Bell} 
                        text="Complaints" 
                        mobile={true} 
                        isActive={isActive('/managerComplaints')}
                    />
                    <NavLink 
                        to="/managerFinance" 
                        icon={DollarSign} 
                        text="Finance" 
                        mobile={true} 
                        isActive={isActive('/managerFinance')}
                    />
                </div>
            </div>
        </header>
    );
};

const NavLink = ({ to, icon: Icon, text, mobile, className = '', isActive }) => {
    return (
        <Link 
            to={to} 
            className={`flex items-center gap-1 md:gap-1 lg:gap-2 px-2 md:px-2 lg:px-3 py-1 md:py-2 rounded-md text-gray-800 hover:bg-[#B2EFB9] transition-colors duration-200 no-underline relative ${
                mobile ? 'w-full' : ''
            } ${className}`}
            onClick={() => mobile && window.innerWidth < 768 ? setMenuOpen(false) : null}
        >
            <Icon size={16} className="text-gray-800 flex-shrink-0" strokeWidth={2.5} />
            <span className="whitespace-nowrap">{text}</span>
            
            {/* Active indicator - positioned absolute for better control */}
            {isActive && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800" />
            )}
        </Link>
    );
};

export default ManagerHeader;