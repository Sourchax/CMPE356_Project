import { UserButton, useClerk, useUser } from "@clerk/clerk-react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LayoutDashboard, LogOut, Megaphone, X } from "lucide-react";
import axios from "axios";
import { useSessionToken } from "../utils/sessions";

const API_BASE_URL = 'http://localhost:8080/api';

// Broadcast Modal Component
const BroadcastModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const modalRef = useRef(null);

  // Handle outside click to close modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setMessage("");
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    
    if (!message.trim()) {
      setError("Please enter a message");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    
    try {
      const token = useSessionToken();
      await axios.post(`${API_BASE_URL}/notifications/broadcast`, {
        title: title.trim(),
        message: message.trim()
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setSuccess("Broadcast notification sent successfully!");
      setTitle("");
      setMessage("");
      
      // Auto close after 2 seconds on success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error sending broadcast:", err);
      setError("Failed to send broadcast. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden relative"
        style={{ maxHeight: "calc(100vh - 40px)" }}
      >
        <div className="flex justify-between items-center bg-[#0D3A73] text-white px-6 py-4 sticky top-0 z-10">
          <h3 className="text-lg font-medium flex items-center">
            <Megaphone size={20} className="mr-2" />
            Send Broadcast Notification
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-grow">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-100 border-l-4 border-green-500 text-green-700 text-sm">
                {success}
              </div>
            )}
            
            <div className="mb-4">
              <label 
                htmlFor="broadcast-title" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                id="broadcast-title"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0D3A73] focus:border-[#0D3A73]"
                placeholder="Enter notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={255}
              />
            </div>
            
            <div className="mb-4">
              <label 
                htmlFor="broadcast-message" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="broadcast-message"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0D3A73] focus:border-[#0D3A73]"
                placeholder="Enter notification message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={4}
                style={{ maxHeight: "150px" }}
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {message.length}/500 characters max
              </div>
            </div>
          </form>
        </div>
        
        <div className="bg-gray-50 px-6 py-3 flex justify-end sticky bottom-0 z-10 border-t">
          <button
            type="button"
            onClick={onClose}
            className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0D3A73] hover:bg-blue-800 rounded-md transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Broadcast"}
          </button>
        </div>
      </div>
    </div>
  );
};

const CustomUserButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const { signOut, openUserProfile } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const menuContentRef = useRef(null);

  // Custom hook for window dimensions
  const useWindowSize = () => {
    const [size, setSize] = useState({
      width: 0,
      height: 0,
      isMobile: true,
      isMaxZoom: true
    });
  
    useLayoutEffect(() => {
      function updateSize() {
        const width = window.innerWidth || 
                     document.documentElement.clientWidth || 
                     document.body.clientWidth;
        const height = window.innerHeight || 
                      document.documentElement.clientHeight || 
                      document.body.clientHeight;
        
        setSize({
          width,
          height,
          isMobile: width <= 640,
          isMaxZoom: width <= 320
        });
        
        setWindowHeight(height);
      }
      
      window.addEventListener('resize', updateSize);
      updateSize();
      
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    
    return size;
  };

  const { isMobile, isMaxZoom } = useWindowSize();

  // Update menu height when menu opens or window resizes
  useEffect(() => {
    if (menuOpen && menuContentRef.current) {
      const measureMenuHeight = () => {
        const height = menuContentRef.current.scrollHeight;
        setMenuHeight(height);
      };
      
      measureMenuHeight();
      
      // Re-measure if window resizes while menu is open
      window.addEventListener('resize', measureMenuHeight);
      return () => window.removeEventListener('resize', measureMenuHeight);
    }
  }, [menuOpen, user?.publicMetadata?.role]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  // Assume the user's role is stored in public metadata
  const userRole = user?.publicMetadata?.role || "user";
  const canBroadcast = ["admin", "manager", "super"].includes(userRole);

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const openBroadcastModal = () => {
    setIsBroadcastModalOpen(true);
    handleMenuClose();
  };

  const truncateName = (name) => {
    if (!name) return "User";
    return name;
  };

  // Calculate if the menu needs to be scrollable
  const needsScroll = menuHeight > (windowHeight * 0.8); // If menu height is greater than 80% of viewport

  // Calculate menu position (top or bottom aligned)
  const menuPosition = () => {
    if (!menuRef.current) return {};
    
    const buttonRect = menuRef.current.getBoundingClientRect();
    const spaceBelow = windowHeight - buttonRect.bottom;
    const spaceNeeded = Math.min(menuHeight, windowHeight * 0.8);
    
    // If not enough space below, position menu above the button
    if (spaceBelow < spaceNeeded && buttonRect.top > spaceNeeded) {
      return { bottom: '100%', top: 'auto', marginBottom: '8px' };
    }
    
    // Default: position menu below the button
    return { top: '100%', bottom: 'auto', marginTop: '8px' };
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button - Responsive with icon-only option at max zoom */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`flex items-center ${isMaxZoom ? 'p-1' : 'gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-2'} bg-[#f0c808] text-gray-900 text-xs sm:text-sm md:text-base font-medium rounded-lg shadow-md hover:bg-[#f05d5e] hover:text-white transition`}
        aria-expanded={menuOpen}
        aria-haspopup="true"
        title={user?.fullName || "User Profile"}
      >
        <img
          src={user?.imageUrl}
          alt="Profile"
          className={`${isMaxZoom ? 'w-6 h-6' : 'w-5 h-5 sm:w-6 sm:h-6'} rounded-full border border-white flex-shrink-0`}
        />
        {!isMaxZoom && (
          <span className="max-w-[80px] sm:max-w-none overflow-hidden text-ellipsis whitespace-nowrap">
            {truncateName(user?.fullName)}
          </span>
        )}
      </button>

      {/* Dropdown Menu - With dynamic positioning and scrolling */}
      {menuOpen && (
        <div 
          className="absolute right-0 w-48 sm:w-56 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
          style={{
            ...menuPosition(),
            maxHeight: needsScroll ? `${windowHeight * 0.8}px` : 'none',
            overflowY: needsScroll ? 'auto' : 'visible'
          }}
        >
          <ul className="list-none py-1 sm:py-2" ref={menuContentRef}>
            {/* Manage Account */}
            <li
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                openUserProfile();
                handleMenuClose();
              }}
            >
              <User size={isMobile ? 16 : 18} className="flex-shrink-0" />
              <span>Manage Account</span>
            </li>

            {/* Broadcast Option - Only for admin, manager, and super roles */}
            {canBroadcast && (
              <li
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={openBroadcastModal}
              >
                <Megaphone size={isMobile ? 16 : 18} className="flex-shrink-0" />
                <span>Send Broadcast</span>
              </li>
            )}

            {/* Admin Dashboard Access */}
            {(userRole === "admin" || userRole === "super") && (
              <li
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (location.pathname === "/admin/Stations" || 
                      location.pathname === "/admin/Announce" || 
                      location.pathname === "/admin/Voyage"   ||
                      location.pathname === "/admin") {
                    navigate("/");
                  } else {
                    navigate("/admin");
                  }
                  handleMenuClose();
                }}
              >
                <LayoutDashboard size={isMobile ? 16 : 18} className="flex-shrink-0" />
                <span>
                  {location.pathname === "/admin/Stations" || 
                   location.pathname === "/admin/Announce" || 
                   location.pathname === "/admin/Voyage"   ||
                   location.pathname === "/admin"
                    ? "Switch to User Mode" 
                    : "Switch to Admin Dashboard"}
                </span>
              </li>
            )}

            {/* Manager Dashboard Access */}
            {(userRole === "manager" || userRole === "super") && (
              <li
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (location.pathname === "/manager" || 
                      location.pathname === "/manager/Logs" || 
                      location.pathname === "/manager/Users" || 
                      location.pathname === "/manager/Complaints" || 
                      location.pathname === "/manager/Finance" ||
                      location.pathname === "/manager/Charts") {
                    navigate("/");
                  } else {
                    navigate("/manager");
                  }
                  handleMenuClose();
                }}
              >
                <LayoutDashboard size={isMobile ? 16 : 18} className="flex-shrink-0" />
                <span>
                  {location.pathname === "/manager/Logs" || 
                   location.pathname === "/manager/Users" || 
                   location.pathname === "/manager/Complaints" || 
                   location.pathname === "/manager/Finance" ||
                   location.pathname === "/manager/Charts" ||
                   location.pathname === "/manager"
                    ? "Switch to User Mode" 
                    : "Switch to Manager Dashboard"}
                </span>
              </li>
            )}

            {/* Sign Out */}
            <li
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-500 hover:bg-red-100 cursor-pointer"
              onClick={() => {
                signOut();
                handleMenuClose();
              }}
            >
              <LogOut size={isMobile ? 16 : 18} className="flex-shrink-0" />
              <span>Sign Out</span>
            </li>
          </ul>
        </div>
      )}

      {/* Broadcast Modal */}
      <BroadcastModal 
        isOpen={isBroadcastModalOpen} 
        onClose={() => setIsBroadcastModalOpen(false)} 
      />
    </div>
  );
};

export default CustomUserButton;