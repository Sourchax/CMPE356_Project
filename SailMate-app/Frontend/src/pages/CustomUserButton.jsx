import { UserButton, useClerk, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, LayoutDashboard, LogOut } from "lucide-react";

const CustomUserButton = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut, openUserProfile } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation(); // to get current location

  // Assume the user's role is stored in public metadata
  const userRole = user?.publicMetadata?.role || "user";

  const handleMenuClose = () => {
    setMenuOpen(false); // Close the menu when an option is clicked
  };

  return (
    <div className="relative">
      {/* Profile Section */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-5 py-2 bg-[#f0c808] text-gray-900 font-medium rounded-lg shadow-md hover:bg-[#f05d5e] hover:text-white transition"
      >
        <img
          src={user?.imageUrl}
          alt="Profile"
          className="w-6 h-6 rounded-full border-2 border-white"
        />
        <span>{user?.fullName || "User"}</span>
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-lg border border-gray-200">
          <ul className="list-none py-2">
            {/* Manage Account */}
            <li
              className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                openUserProfile();
                handleMenuClose(); // Close menu after selecting option
              }}
            >
              <User size={18} />
              Manage Account
            </li>

            {/* Switch to Admin Dashboard (only for admins) */}
            {(userRole === "admin" || userRole === "super") && (
              <li
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (location.pathname === "/adminStations") {
                    // If already on /adminStations, switch to user mode
                    navigate("/");
                  } else if (location.pathname === "/adminAnnounce") {
                    // If already on /adminAnnounce, switch to user mode
                    navigate("/");
                  } else if (location.pathname === "/adminVoyage") {
                    // If already on /adminVoyage, switch to user mode
                    navigate("/");
                  } else {
                    // If not on any of the admin routes, switch to adminStations
                    navigate("/adminStations");
                  }
                  handleMenuClose(); // Close menu after selecting option
                }}
              >
                <LayoutDashboard size={18} />
                {location.pathname === "/adminStations" || location.pathname === "/adminAnnounce" || location.pathname === "/adminVoyage" 
                  ? "Switch to User Mode" 
                  : "Switch to Admin Dashboard"}
              </li>
            )}

            {(userRole === "manager" || userRole === "super") && (
              <li
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (location.pathname === "/managerLogs") {
                    // If already on /adminStations, switch to user mode
                    navigate("/");
                  } else if (location.pathname === "/managerUsers") {
                    // If already on /adminAnnounce, switch to user mode
                    navigate("/");
                  } else if (location.pathname === "/managerComplaints") {
                    // If already on /adminVoyage, switch to user mode
                    navigate("/");
                  } else if (location.pathname === "/managerFinance"){
                    navigate("/");
                  } else {
                    
                    navigate("/managerLogs");
                  }
                  handleMenuClose(); // Close menu after selecting option
                }}
              >
                <LayoutDashboard size={18} />
                {location.pathname === "/managerLogs" || location.pathname === "/managerUsers" || location.pathname === "/managerComplaints" || location.pathname === "/managerFinance" 
                  ? "Switch to User Mode" 
                  : "Switch to Manager Dashboard"}
              </li>
            )}

            {/* Sign Out */}
            <li
              className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-100 cursor-pointer"
              onClick={() => {
                signOut();
                handleMenuClose(); // Close menu after signing out
              }}
            >
              <LogOut size={18} />
              Sign Out
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomUserButton;
