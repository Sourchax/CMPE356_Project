import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSessionToken } from "../utils/sessions";
import placeholder from "../assets/images/placeholder.jpg";
import axios from "axios";

// API URL
const API_BASE_URL = "http://localhost:8080/api/announcements";

export default function Cards() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const token = useSessionToken();
  

  // Fetch announcements from backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        // For published/active announcements, you might want to create a specific endpoint
        // like /api/announcements/active if you implement status in the backend
        const response = await axios.get(API_BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnnouncements(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleOpen = (announcement) => {
    setSelectedAnnouncement(announcement);
    setOpen(true);
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-6 flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#06AED5] border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Loading announcements...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Handle empty announcements
  if (announcements.length === 0) {
    return (
      <div className="max-w-screen-lg mx-auto px-4 py-6">
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No announcements available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <motion.div
            key={announcement.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="relative cursor-pointer overflow-hidden rounded-2xl shadow-lg bg-white"
            onClick={() => handleOpen(announcement)}
          >
            <img
              src={announcement.imageBase64 
                ? `data:image/jpeg;base64,${announcement.imageBase64}` 
                : placeholder}
              alt={announcement.title}
              className="w-full h-52 object-cover"
              onError={(e) => {
                console.log("Image failed to load, using placeholder");
                e.target.src = placeholder;
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center text-white p-4"
              >
                <h3 className="text-lg md:text-xl font-bold">{announcement.title}</h3>
                <p className="text-sm mt-2">{announcement.description}</p>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {open && selectedAnnouncement && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl" 
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-lg md:text-xl font-bold">{selectedAnnouncement.title}</h2>
            <img
              src={selectedAnnouncement.imageBase64 
                ? `data:image/jpeg;base64,${selectedAnnouncement.imageBase64}` 
                : placeholder}
              alt={selectedAnnouncement.title}
              className="w-full h-48 object-cover rounded-md mt-4"
              onError={(e) => {
                e.target.src = placeholder;
              }}
            />
            <p className="mt-4 text-gray-700">
              {selectedAnnouncement.details || selectedAnnouncement.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}