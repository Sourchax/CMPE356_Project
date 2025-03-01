import { useState } from "react";
import { motion } from "framer-motion";
import placeholder from "../assets/images/placeholder.jpg";

const announcements = [
  {
    id: 1,
    title: "Schedule Update",
    image: placeholder,
    description: "We have updated our ferry schedules for the upcoming season.",
    details: "Our new schedule includes additional trips on weekends...",
  },
  {
    id: 2,
    title: "New Route Added",
    image: placeholder,
    description: "Introducing a new route connecting more destinations.",
    details: "Starting next month, we will operate a new route...",
  },
  {
    id: 3,
    title: "Schedule Update",
    image: placeholder,
    description: "We have updated our ferry schedules for the upcoming season.",
    details: "Our new schedule includes additional trips on weekends...",
  },
  {
    id: 4,
    title: "New Route Added",
    image: placeholder,
    description: "Introducing a new route connecting more destinations.",
    details: "Starting next month, we will operate a new route...",
  },
  {
    id: 5,
    title: "Schedule Update",
    image: placeholder,
    description: "We have updated our ferry schedules for the upcoming season.",
    details: "Our new schedule includes additional trips on weekends...",
  },
  {
    id: 6,
    title: "New Route Added",
    image: placeholder,
    description: "Introducing a new route connecting more destinations.",
    details: "Starting next month, we will operate a new route...",
  },
];

export default function Cards() {
  const [open, setOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const handleOpen = (announcement) => {
    setSelectedAnnouncement(announcement);
    setOpen(true);
  };

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
              src={announcement.image}
              alt={announcement.title}
              className="w-full h-52 object-cover"
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
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
            <button 
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl" 
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
            <h2 className="text-lg md:text-xl font-bold">{selectedAnnouncement?.title}</h2>
            <img
              src={selectedAnnouncement?.image}
              alt={selectedAnnouncement?.title}
              className="w-full h-48 object-cover rounded-md mt-4"
            />
            <p className="mt-4 text-gray-700">{selectedAnnouncement?.details}</p>
          </div>
        </div>
      )}
    </div>
  );
}
