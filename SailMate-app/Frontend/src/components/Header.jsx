import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useClerk } from '@clerk/clerk-react';
import sailMatelogo from "../assets/images/SailMate_logo.png";
import { LogIn, Anchor, Menu, X, ChevronDown, User } from "lucide-react";
import CustomUserButton from "../pages/customUserButton";

// Static placeholder component for Clerk authentication
const AuthPlaceholder = () => (
  <div className="flex items-center gap-2 px-5 py-2 bg-gray-100 text-gray-400 font-medium rounded-lg">
    <User size={18} />
    <span>Account</span>
  </div>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 862);
  const location = useLocation();
  const { loaded } = useClerk();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 862);
      if (window.innerWidth > 862) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
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
          {/* Logo */}
          <div className="flex-shrink-0" onClick={handleLogoClick}>
            <Link to="/">
              <img src={sailMatelogo} alt="SailMate Logo" className="h-12" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-[#0D3A73] hover:text-[#06AED5] transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 flex-grow justify-center">
            <NavLink to="/stations" onClick={handleLinkClick}>
              Stations
            </NavLink>

            {/* Tickets Dropdown - Simple CSS-only solution */}
            <div className="group relative">
              <NavLink 
                className="flex items-center"
              >
                Tickets
                <ChevronDown size={16} className="ml-1" />
              </NavLink>
              
              <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
                <Link to="/ticket-cancel" 
                  className="block px-4 py-3 text-sm text-[#0D3A73] hover:bg-[#06AED5] hover:text-white transition-colors"
                  onClick={handleLinkClick}
                >
                  Cancel Ticket
                </Link>
                <Link to="/ticket-check" 
                  className="block px-4 py-3 text-sm text-[#0D3A73] hover:bg-[#06AED5] hover:text-white transition-colors"
                  onClick={handleLinkClick}
                >
                  Check Ticket
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

          {/* Sign In / User Button with Static Placeholder */}
          <div className="flex items-center">
            {!loaded ? (
              <AuthPlaceholder />
            ) : (
              <>
                <SignedOut>
                  <Link to="/sign-in">
                    <button className="flex items-center gap-2 px-5 py-2 bg-[#F0C808] text-[#0D3A73] font-medium rounded-lg shadow-sm hover:bg-yellow-400 transition-colors duration-200 transform hover:scale-105">
                      <LogIn size={18} />
                      <span>Sign In</span>
                    </button>
                  </Link>
                </SignedOut>
                <SignedIn>
                  <div className="ml-4">
                    <CustomUserButton />
                  </div>
                </SignedIn>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden ${menuOpen ? "block" : "hidden"}`}>
          <div className="bg-white border-t mt-2 py-2">
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
      className={`px-3 py-2 font-medium rounded-md transition-colors ${
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
      className="px-4 py-3 flex items-center text-[#0D3A73] hover:bg-gray-100 hover:text-[#06AED5] transition-colors"
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