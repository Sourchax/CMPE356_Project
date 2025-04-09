import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Clock, Bell, Menu, X, Activity } from 'lucide-react';
import { useClerk, useUser } from "@clerk/clerk-react";
import SailMateLogo from '../assets/images/SailMate_Logo.png';
import CustomUserButton from '../pages/customUserButton';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
  const location = useLocation();
  const { t } = useTranslation();
  
  // Get current path for active link highlighting
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Update document title based on current route
  useEffect(() => {
    const path = location.pathname;
    let title = "Admin | SailMate";
    
    if (path === "/admin") {
      title = "Admin Dashboard | SailMate";
    } else if (path === "/admin/Stations") {
      title = "Stations | SailMate";
    } else if (path === "/admin/Voyage") {
      title = "Voyage Times | SailMate";
    } else if (path === "/admin/Announce") {
      title = "Announcements | SailMate";
    } else if (path === "/admin/Logs") {
      title = "Activity Logs | SailMate";
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

  return (
    <header className="bg-[#06AED5] text-white shadow-md">
      <div className="mx-auto w-full max-w-7xl px-2 sm:px-4 py-3 flex justify-between items-center gap-2 md:gap-3 lg:gap-4">
        {/* Left Side: Logo & Title */}
        <Link to="/admin" className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0 no-underline">
          <img 
            src={SailMateLogo} 
            alt="SailMate Logo" 
            className="w-16 sm:w-20 md:w-24 lg:w-32 h-8 object-contain" 
            width={128} 
            height={32} 
          />
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white whitespace-nowrap">{t('admin.menu.dashboard')}</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:space-x-1 lg:space-x-4">
          <NavLink 
            to="/admin/Stations" 
            icon={MapPin} 
            text={t('admin.menu.stations')}
            className="md:text-xs lg:text-sm xl:text-base"
            isActive={isActive("/admin/Stations")}
          />
          <NavLink 
            to="/admin/Voyage" 
            icon={Clock} 
            text={t('admin.menu.voyages')}
            className="md:text-xs lg:text-sm xl:text-base"
            isActive={isActive("/admin/Voyage")}
          />
          <NavLink 
            to="/admin/Announce" 
            icon={Bell} 
            text={t('admin.menu.announcements')}
            className="md:text-xs lg:text-sm xl:text-base"
            isActive={isActive("/admin/Announce")}
          />
          <NavLink 
            to="/admin/Logs" 
            icon={Activity} 
            text={t('admin.menu.logs')}
            className="md:text-xs lg:text-sm xl:text-base"
            isActive={isActive("/admin/Logs")}
          />
        </nav>

        {/* User Profile Button, Language Switcher and Mobile Menu Button */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
          <LanguageSwitcher />
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

      {/* Mobile Navigation */}
      <div 
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col px-4 py-2 gap-2 bg-[#0599bc]">
          <NavLink 
            to="/admin/Stations" 
            icon={MapPin} 
            text={t('admin.menu.stations')}
            mobile={true} 
            isActive={isActive("/admin/Stations")}
          />
          <NavLink 
            to="/admin/Voyage" 
            icon={Clock} 
            text={t('admin.menu.voyages')}
            mobile={true} 
            isActive={isActive("/admin/Voyage")}
          />
          <NavLink 
            to="/admin/Announce" 
            icon={Bell} 
            text={t('admin.menu.announcements')}
            mobile={true} 
            isActive={isActive("/admin/Announce")}
          />
          <NavLink 
            to="/admin/Logs" 
            icon={Activity} 
            text={t('admin.menu.logs')}
            mobile={true} 
            isActive={isActive("/admin/Logs")}
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
      className={`flex items-center gap-1 md:gap-1 lg:gap-2 px-2 md:px-2 lg:px-3 py-1 md:py-2 rounded-md text-white hover:bg-[#0599bc] transition-colors duration-200 relative no-underline ${
        mobile ? 'w-full' : ''
      } ${className}`}
    >
      <Icon size={16} className="text-white flex-shrink-0" strokeWidth={2.5} />
      <span className="whitespace-nowrap">{text}</span>
      
      {/* Active indicator - positioned absolute for better control */}
      {isActive && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#F0C808]" />
      )}
    </Link>
  );
};

export default AdminHeader;