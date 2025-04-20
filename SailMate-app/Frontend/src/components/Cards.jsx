import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import placeholder from "../assets/images/placeholder.jpg";
import axios from "axios";
import { X } from "lucide-react";
import { useTranslation } from 'react-i18next';

// API URL
const API_BASE_URL = "http://localhost:8080/api/announcements";

// Utility function to truncate text
const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength 
    ? text.substring(0, maxLength) + '...' 
    : text;
};

export default function Announcements() {
  const { t } = useTranslation();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch announcements from backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_BASE_URL);
        setAnnouncements(Array.isArray(response.data) ? response.data : []);
        setError(null);
      } catch (err) {
        console.error("Error fetching announcements:", err);
        setError(t('announcements.errorMessage', 'Failed to load announcements. Please try again later.'));
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, [t]);

  // Open modal with selected announcement
  const openAnnouncementModal = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  // Loading State
  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block animate-pulse">
            <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">{t('announcements.loading', 'Loading announcements...')}</p>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error) {
    return (
      <section className="py-12 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Empty State
  if (announcements.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <p className="text-xl text-gray-600">{t('announcements.noAnnouncementsAvailable', 'No announcements available')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {announcements.map((announcement) => (
              <motion.div
                key={announcement.id}
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={announcement.imageBase64 
                      ? `data:image/jpeg;base64,${announcement.imageBase64}` 
                      : placeholder}
                    alt={announcement.title}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => { e.target.src = placeholder; }}
                  />
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4"
                    onClick={() => openAnnouncementModal(announcement)}
                  >
                    <div className="text-white text-center overflow-hidden">
                      <h3 className="text-xl font-bold mb-2 break-words">
                        {truncateText(announcement.title, 50)}
                      </h3>
                      <p className="text-sm line-clamp-3 break-words overflow-hidden text-ellipsis">
                        {announcement.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Announcement Modal */}
      {isModalOpen && selectedAnnouncement && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white max-w-6xl w-full rounded-xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900 bg-white bg-opacity-20 hover:bg-opacity-50 rounded-full p-2 transition"
              aria-label={t('announcements.closeModal', 'Close modal')}
            >
              <X size={24} />
            </button>

            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              <div className="w-full md:w-2/3 max-h-[70vh] flex items-center justify-center">
                <img
                  src={selectedAnnouncement.imageBase64 
                    ? `data:image/jpeg;base64,${selectedAnnouncement.imageBase64}` 
                    : placeholder}
                  alt={selectedAnnouncement.title}
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => { e.target.src = placeholder; }}
                />
              </div>
              <div className="w-full md:w-1/3 p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 break-words">
                  {selectedAnnouncement.title}
                </h2>
                <p className="text-gray-600 text-base leading-relaxed mb-4 break-words">
                  {selectedAnnouncement.description}
                </p>
                {selectedAnnouncement.details && (
                  <div className="text-gray-700">
                    <h3 className="font-semibold mb-2 break-words">{t('announcements.details', 'Details')}:</h3>
                    <p className="max-h-48 overflow-y-auto break-words">
                      {selectedAnnouncement.details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}