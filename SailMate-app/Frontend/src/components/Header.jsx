import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/clerk-react';
import sailMatelogo from "../assets/images/SailMate_logo.png";
import { useSessionToken } from "../utils/sessions";
import { LogIn, Anchor, Menu, X, ChevronDown, User, Bell } from "lucide-react";
import CustomUserButton from "../pages/customUserButton";
import axios from "axios";
import NotificationModal from "./NotificationsModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';

const API_BASE_URL = 'http://localhost:8080/api';

// Define a custom hook for window dimensions
const useWindowSize = () => {
  // Initialize with mobile-first approach
  const [windowSize, setWindowSize] = useState({
    width: 0,
    isMobile: true,
    isMaxZoom: true
  });

  // useLayoutEffect runs synchronously before browser paint
  // This helps prevent flickering
  useLayoutEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Get window width
      const width = window.innerWidth || 
                   document.documentElement.clientWidth || 
                   document.body.clientWidth;
      
      // Update state
      setWindowSize({
        width,
        isMobile: width <= 940, // Changed from 862 to 912 to show burger menu 50px earlier
        isMaxZoom: width <= 400
      });
    }
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures effect runs only on mount and unmount
  
  return windowSize;
};

const AuthPlaceholder = ({ isMaxZoom }) => (
  <div className={`flex items-center ${isMaxZoom ? 'p-1' : 'gap-1 sm:gap-2 px-2 sm:px-3 md:px-5 py-2'} bg-gray-100 text-gray-400 font-medium rounded-lg text-xs sm:text-sm md:text-base`} title="Account">
    <User size={isMaxZoom ? 20 : 16} className="flex-shrink-0" />
    {!isMaxZoom && <span className="whitespace-nowrap">Account</span>}
  </div>
);

// Notification Bell Component
const NotificationBell = ({ userId, isMaxZoom }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    if (!userId) return;
    const token = useSessionToken();
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/count`,{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  // Fetch notifications for the dropdown
  const fetchNotifications = async () => {
    if (!userId) return;
    const token = useSessionToken();
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/notifications/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      // Only show up to 5 most recent notifications in the dropdown
      setNotifications(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a notification as read and navigate to /my-tickets
  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      try {
        const token = useSessionToken();
        await axios.put(`${API_BASE_URL}/notifications/${notification.id}/read`, { isRead: true }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        // Update the local state
        setNotifications(notifications.map(notif => 
          notif.id === notification.id ? { ...notif, isRead: true } : notif
        ));
        // Update unread count
        fetchUnreadCount();
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
    
    // Only navigate and close dropdown if not a broadcast notification
    if (notification.type !== 'BROADCAST') {
      // Close the dropdown
      setIsDropdownOpen(false);
      
      // Navigate to /my-tickets page
      navigate('/my-tickets');
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = useSessionToken();
      await axios.put(`${API_BASE_URL}/notifications/read-all`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      // Update the local state
      setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Toggle notification dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      fetchNotifications();
    }
  };

  // Open the notifications modal
  const openModal = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  // Close the notifications modal
  const closeModal = () => {
    setIsModalOpen(false);
    // Refresh count after closing modal
    fetchUnreadCount();
  };

  // Get notification color based on type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'TICKET_CREATED':
        return 'text-green-600';
      case 'TICKET_UPDATED':
        return 'text-blue-600';
      case 'VOYAGE_CANCELLED':
        return 'text-red-600';
      case 'VOYAGE_DELAYED':
        return 'text-yellow-600';
      case 'BROADCAST':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch initial data
  useEffect(() => {
    if (userId) {
      fetchUnreadCount();
      
      // Set up polling for new notifications (every 30 seconds)
      const interval = setInterval(fetchUnreadCount, 30000);
      
      return () => clearInterval(interval);
    }
  }, [userId]);

  return (
    <>
      <div className="relative" ref={dropdownRef} style={{ position: 'relative', zIndex: 60 }}>
        <button 
          className="text-[#0D3A73] hover:text-[#06AED5] focus:outline-none transition-colors" 
          onClick={toggleDropdown}
          aria-label={t('notifications.title')}
        >
          <Bell size={isMaxZoom ? 20 : 24} />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown panel */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
            <div className="py-2 px-4 bg-gray-50 border-b flex justify-between items-center">
              <span className="text-sm font-medium">{t('notifications.title')}</span>
              {unreadCount > 0 && (
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={markAllAsRead}
                >
                  {t('notifications.actions.markAllRead')}
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="py-4 px-4 text-center text-gray-500">{t('common.refreshing')}</div>
              ) : notifications.length === 0 ? (
                <div className="py-4 px-4 text-center text-gray-500">{t('notifications.empty')}</div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`py-2 px-4 border-b hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start">
                      <div className={`mr-3 mt-1 ${getNotificationColor(notification.type)}`}>
                        <Bell size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="py-2 px-4 bg-gray-50 border-t text-center">
              <button 
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={openModal}
              >
                {t('notifications.viewAll', 'View all notifications')}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Notification Modal */}
      <NotificationModal isOpen={isModalOpen} onClose={closeModal} userId={userId} />
    </>
  );
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { loaded } = useClerk();
  const { user, isLoaded } = useUser();
  const { t } = useTranslation();
  
  // Use our custom hook that returns current dimensions
  const { isMobile, isMaxZoom } = useWindowSize();

  // Close the menu when navigating to a new page
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLinkClick = () => {
    if (isMobile) {
      setMenuOpen(false);
    }
  };

  const handleLogoClick = () => {
    setMenuOpen(false);
  };

  return (
    <div className="w-full sticky top-0 z-40">
      <header className="bg-white shadow-md px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo - More significant size reduction at max zoom */}
          <div className="flex-shrink-0" onClick={handleLogoClick}>
            <Link to="/">
              <img 
                src={sailMatelogo} 
                alt="SailMate Logo" 
                className={isMaxZoom ? "h-6 w-auto" : (isMobile ? "h-10 w-auto" : "h-12 w-auto")} 
              />
            </Link>
          </div>

          {/* Mobile Menu Toggle - Only show when isMobile is true */}
          {isMobile && (
            <button 
              className="text-[#0D3A73] hover:text-[#06AED5] transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}

          {/* Desktop Navigation - Only show when isMobile is false */}
          {!isMobile && (
            <nav className="flex items-center space-x-1 flex-grow justify-center">
              <NavLink to="/stations" onClick={handleLinkClick}>
                {t('common.stations')}
              </NavLink>

              {/* Tickets Dropdown - Simple CSS-only solution */}
              <div className="group relative">
                <NavLink className="flex items-center">
                  {t('common.tickets')}
                  <ChevronDown size={16} className="ml-1" />
                </NavLink>
                
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                  <Link to="/ticket-cancel" 
                    className="block px-4 py-3 text-sm text-[#0D3A73] hover:bg-[#06AED5] hover:text-white transition-colors no-underline"
                    onClick={handleLinkClick}
                  >
                    {t('common.cancelTicket')}
                  </Link>
                  <Link to="/ticket-check" 
                    className="block px-4 py-3 text-sm text-[#0D3A73] hover:bg-[#06AED5] hover:text-white transition-colors no-underline"
                    onClick={handleLinkClick}
                  >
                    {t('common.checkTicket')}
                  </Link>
                  <Link to="/my-tickets" 
                    className="block px-4 py-3 text-sm text-[#0D3A73] hover:bg-[#06AED5] hover:text-white transition-colors no-underline"
                    onClick={handleLinkClick}
                  >
                    {t('common.myTickets')}
                  </Link>
                </div>
              </div>

              <NavLink to="/voyage-times" onClick={handleLinkClick}>
                {t('common.voyageTimes')}
              </NavLink>
              <NavLink to="/about" onClick={handleLinkClick}>
                {t('common.aboutUs')}
              </NavLink>
              <NavLink to="/contact" onClick={handleLinkClick}>
                {t('common.contact')}
              </NavLink>
            </nav>
          )}

          {/* Sign In / User Button / Notification Bell - Now with max zoom handling */}
          <div className="flex items-center space-x-2">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Notification Bell - Only show when signed in */}
            <SignedIn>
              {isLoaded && user && (
                <NotificationBell 
                  userId={user.id} 
                  isMaxZoom={isMaxZoom} 
                />
              )}
            </SignedIn>

            {/* Auth Section */}
            {!loaded ? (
              <AuthPlaceholder isMaxZoom={isMaxZoom} />
            ) : (
              <>
                <SignedOut>
                  <Link to="/sign-in" className="flex-shrink-0 no-underline">
                    <button 
                      className={`flex items-center ${isMaxZoom ? 'p-1' : 'gap-1 px-2 sm:px-3 md:px-5 py-2'} bg-[#F0C808] text-[#0D3A73] font-medium rounded-lg shadow-sm hover:bg-yellow-400 transition-colors duration-200 transform hover:scale-105 text-xs sm:text-sm md:text-base`}
                      title={t('common.login')}
                    >
                      <LogIn size={isMaxZoom ? 20 : (isMobile ? 16 : 18)} className="flex-shrink-0" />
                      {!isMaxZoom && <span className="whitespace-nowrap no-underline">{t('common.login')}</span>}
                    </button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="flex-shrink-0">
                    <CustomUserButton />
                  </div>
                </SignedIn>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu - Fixed to be contained within viewport */}
        {isMobile && menuOpen && (
          <div className="fixed inset-x-0 top-auto mt-2 bg-white border-t shadow-lg max-h-screen overflow-y-auto z-40">
            <div className="px-4 py-2 max-w-7xl mx-auto">
              <nav className="flex flex-col space-y-1">
                {/* Language Switcher for mobile */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[#0D3A73]">{t('common.language')}</span>
                    <LanguageSwitcher />
                  </div>
                </div>
                
                <MobileNavLink to="/stations" onClick={handleLinkClick}>
                  {t('common.stations')}
                </MobileNavLink>
                <MobileNavLink to="/ticket-cancel" onClick={handleLinkClick}>
                  {t('common.cancelTicket')}
                </MobileNavLink>
                <MobileNavLink to="/ticket-check" onClick={handleLinkClick}>
                  {t('common.checkTicket')}
                </MobileNavLink>
                <MobileNavLink to="/my-tickets" onClick={handleLinkClick}>
                  {t('common.myTickets')}
                </MobileNavLink>
                <MobileNavLink to="/voyage-times" onClick={handleLinkClick}>
                  {t('common.voyageTimes')}
                </MobileNavLink>
                <MobileNavLink to="/about" onClick={handleLinkClick}>
                  {t('common.aboutUs')}
                </MobileNavLink>
                <MobileNavLink to="/contact" onClick={handleLinkClick}>
                  {t('common.contact')}
                </MobileNavLink>
              </nav>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

const NavLink = ({ to, children, onClick, className }) => {
  const location = useLocation();
  const isActive = 
    (to === "/tickets" && location.pathname.includes("ticket")) || 
    (to !== "/tickets" && location.pathname === to);

  return (
    <Link 
      to={to}
      className={`px-3 py-2 font-medium rounded-md transition-colors no-underline ${
        isActive
          ? "bg-[#0D3A73] text-white"
          : "text-[#0D3A73] hover:bg-gray-100 hover:text-[#06AED5]"
      } ${className || ""}`}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children, onClick }) => {
  return (
    <Link 
      to={to}
      className="px-4 py-3 flex items-center text-[#0D3A73] hover:bg-gray-100 hover:text-[#06AED5] transition-colors no-underline"
      onClick={onClick}
    >
      <span className="mr-2">
        <Anchor size={16} />
      </span>
      {children}
    </Link>
  );
}

export default Header;