import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MapPin, Clock, Bell, DollarSign, Menu, X, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { useClerk, useUser } from "@clerk/clerk-react";
import SailMateLogo from '../assets/images/SailMate_Logo.png';
import CustomUserButton from '../pages/customUserButton';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const ManagerHeader = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { signOut } = useClerk();
    const { user } = useUser();
    const location = useLocation();
    const { t } = useTranslation();

    // Update document title based on current route
    useEffect(() => {
        const path = location.pathname;
        let title = t("manager.header.titles.default");

        if (path === "/manager") {
            title = t("manager.header.titles.dashboard");
        } else if (path === "/manager/Users") {
            title = t("manager.header.titles.users");
        } else if (path === "/manager/Complaints") {
            title = t("manager.header.titles.complaints");
        } else if (path === "/manager/Finance") {
            title = t("manager.header.titles.finance");
        }
        else if (path === "/manager/Charts") {
            title = t("manager.header.titles.charts");
        }

        document.title = title;
    }, [location.pathname, t]);

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
                <Link to="/manager" className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0 no-underline text-gray-800">
                    <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-3 flex-shrink-0">
                        <img
                            src={SailMateLogo}
                            alt="SailMate Logo"
                            className="w-16 sm:w-20 md:w-24 lg:w-32 h-8 object-contain"
                            width={128}
                            height={32}
                        />
                        <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold whitespace-nowrap text-gray-800">{t("manager.title")}</h1>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex md:space-x-1 lg:space-x-4 overflow-x-auto">
                    <NavLink
                        to="/manager/Users"
                        icon={Users}
                        text={t("manager.header.nav.users")}
                        className="md:text-xs lg:text-sm xl:text-base"
                        isActive={isActive('/manager/Users')}
                    />
                    <NavLink
                        to="/manager/Complaints"
                        icon={AlertTriangle}
                        text={t("manager.header.nav.complaints")}
                        className="md:text-xs lg:text-sm xl:text-base"
                        isActive={isActive('/manager/Complaints')}
                    />
                    <NavLink
                        to="/manager/Finance"
                        icon={DollarSign}
                        text={t("manager.header.nav.finance")}
                        className="md:text-xs lg:text-sm xl:text-base"
                        isActive={isActive('/manager/Finance')}
                    />
                    <NavLink
                        to="/manager/Charts"
                        icon={TrendingUp}
                        text={t("manager.header.nav.charts")}
                        className="md:text-xs lg:text-sm xl:text-base"
                        isActive={isActive('/manager/Charts')}
                    />
                </nav>

                {/* User Profile Button and Mobile Menu Button */}
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
                        aria-label={t("common.toggleMenu")}
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation with improved transition */}
            <div
                id="mobile-menu"
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="flex flex-col px-4 py-2 gap-2 bg-[#B2EFB9] rounded-lg">
                    <NavLink
                        to="/manager/Users"
                        icon={Users}
                        text={t("manager.header.nav.users")}
                        mobile={true}
                        isActive={isActive('/manager/Users')}
                    />
                    <NavLink
                        to="/manager/Complaints"
                        icon={AlertTriangle}
                        text={t("manager.header.nav.complaints")}
                        mobile={true}
                        isActive={isActive('/manager/Complaints')}
                    />
                    <NavLink
                        to="/manager/Finance"
                        icon={DollarSign}
                        text={t("manager.header.nav.finance")}
                        mobile={true}
                        isActive={isActive('/manager/Finance')}
                    />
                    <NavLink
                        to="/manager/Charts"
                        icon={TrendingUp}
                        text={t("manager.header.nav.charts")}
                        mobile={true}
                        isActive={isActive('/manager/Charts')}
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
            className={`flex items-center gap-1 md:gap-1 lg:gap-2 px-2 md:px-2 lg:px-3 py-1 md:py-2 rounded-md text-gray-800 hover:bg-[#B2EFB9] transition-colors duration-200 no-underline relative ${mobile ? 'w-full' : ''
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