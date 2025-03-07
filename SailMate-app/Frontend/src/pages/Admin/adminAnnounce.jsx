import { useState, useEffect } from "react";
import { Edit, Trash, AlertCircle } from "lucide-react";
import placeholder from "../../assets/images/placeholder.jpg";
import { useLocation } from "react-router-dom";

const initialAnnouncements = [
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
];

export default function AdminAnnounce() {
  const location = useLocation();
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ id: null, title: "", image: "placeholder", description: "", details: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  
  // Check for openAddModal in location state (from quick action)
  useEffect(() => {
    if (location.state?.openAddModal) {
      openEdit({ id: null, title: "", image: "placeholder", description: "", details: "" });
      // Clean up the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
      location.state.openAddModal = false;
    }
  }, [location]);

  const openEdit = (announcement) => {
    setErrors({});
    setTouched({});
    setForm(announcement);
    setSelected(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Validate field on change
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, form[name]);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    // Reset image error when user selects a file
    setErrors({ ...errors, image: "" });
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({ ...errors, image: "Please select a valid image file (JPEG, PNG, GIF, WEBP)" });
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 2MB" });
        return;
      }
      
      setForm({ ...form, image: URL.createObjectURL(file) });
      setTouched({ ...touched, image: true });
    }
  };

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "title":
        if (!value.trim()) {
          error = "Title is required";
        } else if (value.trim().length < 3) {
          error = "Title must be at least 3 characters";
        } else if (value.trim().length > 50) {
          error = "Title must be less than 50 characters";
        }
        break;
        
      case "description":
        if (!value.trim()) {
          error = "Description is required";
        } else if (value.trim().length < 10) {
          error = "Description must be at least 10 characters";
        } else if (value.trim().length > 200) {
          error = "Description must be less than 200 characters";
        }
        break;
        
      case "details":
        if (value.trim().length > 1000) {
          error = "Details must be less than 1000 characters";
        }
        break;
        
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  const validateForm = () => {
    let formErrors = {};
    
    // Validate all fields
    formErrors.title = validateField("title", form.title);
    formErrors.description = validateField("description", form.description);
    
    // Special validation for image
    if (form.image === "placeholder") {
      formErrors.image = "Image is required";
    }
    
    // Remove empty error messages
    Object.keys(formErrors).forEach(key => {
      if (!formErrors[key]) {
        delete formErrors[key];
      }
    });
    
    setErrors(formErrors);
    
    // Mark all fields as touched
    setTouched({
      title: true,
      image: true,
      description: true,
      details: true
    });
    
    return formErrors;
  };

  const saveAnnouncement = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    
    setAnnouncements(announcements.map(a => a.id === form.id ? form : a));
    setSelected(null);
    setErrors({});
    setTouched({});
  };

  const openDeleteConfirmation = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteModalOpen(true);
  };

  const deleteAnnouncement = () => {
    if (announcementToDelete) {
      setAnnouncements(announcements.filter(a => a.id !== announcementToDelete.id));
      setDeleteModalOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  const addAnnouncement = () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    
    const newAnnouncement = { ...form, id: Date.now() };
    setAnnouncements([...announcements, newAnnouncement]);
    setForm({ id: null, title: "", image: "placeholder", description: "", details: "" });
    setSelected(null);
    setErrors({});
    setTouched({});
  };

  const getFieldClassName = (fieldName) => {
    // Define resize behavior based on field type
    let resizeClass = "";
    if (fieldName === "description") {
      resizeClass = "resize-y min-h-[80px] max-h-[160px] "; // Vertical resize with limits
    } else if (fieldName === "details") {
      resizeClass = "resize-y min-h-[120px] max-h-[300px] "; // Vertical resize with limits
    } else {
      resizeClass = "resize-none "; // No resize for other inputs
    }
    
    const baseClass = `w-full p-3 border rounded-lg mb-1 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#06AED5] ${resizeClass}`;
    return baseClass + (touched[fieldName] && errors[fieldName] ? "border-red-500" : "");
  };

  const remainingChars = (fieldName, maxLength) => {
    const currentLength = form[fieldName]?.length || 0;
    return maxLength - currentLength;
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Announcements</h1>
      <button
        onClick={() => openEdit({ id: null, title: "", image: "placeholder", description: "", details: "" })}
        className="px-6 py-3 bg-[#06AED5] text-white rounded-lg transition duration-300 mb-8 text-lg"
      >
        Add Announcement
      </button>
      <div className="space-y-8">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="p-6 border rounded-lg flex justify-between items-center shadow-md hover:shadow-lg transition duration-300">
            <div className="flex gap-6 items-center flex-1">
              <img
                src={announcement.image || placeholder}
                alt="Announcement"
                className="w-28 h-28 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">{announcement.title}</h2>
                <p className="text-gray-500 text-lg max-w-2xl">{announcement.description}</p>
              </div>
            </div>
            <div className="space-x-6 flex ml-4">
              <button onClick={() => openEdit(announcement)} className="text-[#06AED5] transition duration-300">
                <Edit size={24} />
              </button>
              <button onClick={() => openDeleteConfirmation(announcement)} className="text-red-600 transition duration-300">
                <Trash size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">{form.id ? "Edit Announcement" : "Add Announcement"}</h2>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter announcement title"
                className={getFieldClassName("title")}
                maxLength={50}
              />
              {touched.title && errors.title ? (
                <p className="text-red-600 text-sm">{errors.title}</p>
              ) : (
                <p className="text-gray-500 text-xs text-right">
                  {remainingChars("title", 50)} characters remaining
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image <span className="text-red-500">*</span>
              </label>
              <input
                id="image"
                name="image"
                type="file"
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/gif, image/webp"
                className="w-full p-3 border rounded-lg mb-2 text-gray-800 file:border-0 file:bg-[#06AED5] file:text-white focus:outline-none"
              />
              {form.image && form.image !== "placeholder" ? (
                <div className="mb-2">
                  <img src={form.image} alt="Preview" className="w-24 h-24 object-cover rounded-lg" />
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-2">No image selected</p>
              )}
              {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
              <p className="text-gray-500 text-xs">Supported formats: JPEG, PNG, GIF, WEBP (max 2MB)</p>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter a brief description"
                className={getFieldClassName("description")}
                rows={3}
                maxLength={200}
              />
              {touched.description && errors.description ? (
                <p className="text-red-600 text-sm">{errors.description}</p>
              ) : (
                <p className="text-gray-500 text-xs text-right">
                  {remainingChars("description", 200)} characters remaining
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
                id="details"
                name="details"
                value={form.details}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter detailed information (optional)"
                className={getFieldClassName("details")}
                rows={5}
                maxLength={1000}
              />
              {touched.details && errors.details ? (
                <p className="text-red-600 text-sm">{errors.details}</p>
              ) : (
                <p className="text-gray-500 text-xs text-right">
                  {remainingChars("details", 1000)} characters remaining
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setSelected(null)} 
                className="px-6 py-2 bg-gray-300 rounded-lg transition duration-300"
              >
                Cancel
              </button>
              <button 
                onClick={form.id ? saveAnnouncement : addAnnouncement} 
                className="px-6 py-2 bg-[#06AED5] text-white rounded-lg transition duration-300"
              >
                {form.id ? "Save Changes" : "Add Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && announcementToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-5 sm:p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle size={24} className="text-red-600" />
              <h2 className="text-lg sm:text-xl font-semibold">Confirm Delete</h2>
            </div>
            
            <p className="mb-4">
              Are you sure you want to delete the announcement <span className="font-semibold">"{announcementToDelete.title}"</span>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end gap-3 mt-5">
              <button 
                onClick={() => {
                  setDeleteModalOpen(false);
                  setAnnouncementToDelete(null);
                }} 
                className="px-4 py-2 border border-gray-300 rounded-md transition"
              >
                Cancel
              </button>
              <button 
                onClick={deleteAnnouncement} 
                className="px-4 py-2 bg-red-600 text-white rounded-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}