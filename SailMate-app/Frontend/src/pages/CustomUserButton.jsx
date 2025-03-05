import { UserButton, useClerk, useUser } from "@clerk/clerk-react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LayoutDashboard, LogOut } from "lucide-react";

const CustomUserButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHeight, setMenuHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
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

  const handleMenuClose = () => {
    setMenuOpen(false);
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

            {/* Admin Dashboard Access */}
            {(userRole === "admin" || userRole === "super") && (
              <li
                className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (location.pathname === "/adminStations" || 
                      location.pathname === "/adminAnnounce" || 
                      location.pathname === "/adminVoyage") {
                    navigate("/");
                  } else {
                    navigate("/adminStations");
                  }
                  handleMenuClose();
                }}
              >
                <LayoutDashboard size={isMobile ? 16 : 18} className="flex-shrink-0" />
                <span>
                  {location.pathname === "/adminStations" || 
                   location.pathname === "/adminAnnounce" || 
                   location.pathname === "/adminVoyage" 
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
                  if (location.pathname === "/managerLogs" || 
                      location.pathname === "/managerUsers" || 
                      location.pathname === "/managerComplaints" || 
                      location.pathname === "/managerFinance") {
                    navigate("/");
                  } else {
                    navigate("/managerLogs");
                  }
                  handleMenuClose();
                }}
              >
                <LayoutDashboard size={isMobile ? 16 : 18} className="flex-shrink-0" />
                <span>
                  {location.pathname === "/managerLogs" || 
                   location.pathname === "/managerUsers" || 
                   location.pathname === "/managerComplaints" || 
                   location.pathname === "/managerFinance" 
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
    </div>
  );
};

export default CustomUserButton;