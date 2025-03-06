import React, { useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useClerk } from '@clerk/clerk-react';
import sailMatelogo from "../assets/images/SailMate_logo.png";
import { LogIn, Anchor, Menu, X, ChevronDown, User } from "lucide-react";
import CustomUserButton from "../pages/customUserButton";

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

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { loaded } = useClerk();
  
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
    <div className="w-full sticky top-0 z-50">
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
                Stations
              </NavLink>

              {/* Tickets Dropdown - Simple CSS-only solution */}
              <div className="group relative">
                <NavLink className="flex items-center">
                  Tickets
                  <ChevronDown size={16} className="ml-1" />
                </NavLink>
                
                <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                  <Link to="/ticket-cancel" 
                    className="block px-4 py-3 text-sm text-[#0D3A73] hover:bg-[#06AED5] hover:text-white transition-colors no-underline"
                    onClick={handleLinkClick}
                  >
                    Cancel Ticket
                  </Link>
                  <Link to="/ticket-check" 
                    className="block px-4 py-3 text-sm text-[#0D3A73] hover:bg-[#06AED5] hover:text-white transition-colors no-underline"
                    onClick={handleLinkClick}
                  >
                    Check Ticket
                  </Link>
                  <Link to="/my-tickets" 
                    className="block px-4 py-3 text-sm text-[#0D3A73] hover:bg-[#06AED5] hover:text-white transition-colors no-underline"
                    onClick={handleLinkClick}
                  >
                    My Tickets
                  </Link>
                </div>
              </div>

              <NavLink to="/voyage-times" onClick={handleLinkClick}>
                Voyage Times
              </NavLink>
              <NavLink to="/about" onClick={handleLinkClick}>
                About Us
              </NavLink>
              <NavLink to="/contact" onClick={handleLinkClick}>
                Contact
              </NavLink>
            </nav>
          )}

          {/* Sign In / User Button with Static Placeholder - Now with max zoom handling */}
          <div className="flex items-center">
            {!loaded ? (
              <AuthPlaceholder isMaxZoom={isMaxZoom} />
            ) : (
              <>
                <SignedOut>
                  <Link to="/sign-in" className="flex-shrink-0 no-underline">
                    <button 
                      className={`flex items-center ${isMaxZoom ? 'p-1' : 'gap-1 px-2 sm:px-3 md:px-5 py-2'} bg-[#F0C808] text-[#0D3A73] font-medium rounded-lg shadow-sm hover:bg-yellow-400 transition-colors duration-200 transform hover:scale-105 text-xs sm:text-sm md:text-base`}
                      title="Sign In"
                    >
                      <LogIn size={isMaxZoom ? 20 : (isMobile ? 16 : 18)} className="flex-shrink-0" />
                      {!isMaxZoom && <span className="whitespace-nowrap no-underline">Sign In</span>}
                    </button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="ml-2 md:ml-4 flex-shrink-0">
                    <CustomUserButton />
                  </div>
                </SignedIn>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu - Fixed to be contained within viewport */}
        {isMobile && menuOpen && (
          <div className="fixed inset-x-0 top-auto mt-2 bg-white border-t shadow-lg max-h-screen overflow-y-auto z-50">
            <div className="px-4 py-2 max-w-7xl mx-auto">
              <nav className="flex flex-col space-y-1">
                <MobileNavLink to="/stations" onClick={handleLinkClick}>
                  Stations
                </MobileNavLink>
                <MobileNavLink to="/ticket-cancel" onClick={handleLinkClick}>
                  Cancel Ticket
                </MobileNavLink>
                <MobileNavLink to="/ticket-check" onClick={handleLinkClick}>
                  Check Ticket
                </MobileNavLink>
                <MobileNavLink to="/my-tickets" onClick={handleLinkClick}>
                  My Tickets
                </MobileNavLink>
                <MobileNavLink to="/voyage-times" onClick={handleLinkClick}>
                  Voyage Times
                </MobileNavLink>
                <MobileNavLink to="/about" onClick={handleLinkClick}>
                  About Us
                </MobileNavLink>
                <MobileNavLink to="/contact" onClick={handleLinkClick}>
                  Contact
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