import { useState, useEffect } from "react";
import { Edit, Trash2, AlertCircle, Loader2 } from "lucide-react";
import placeholder from "../../assets/images/placeholder.jpg";
import { useSessionToken } from "../../utils/sessions";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from 'react-i18next';

// API base URL
const API_BASE_URL = "http://localhost:8080/api/announcements";

export default function AdminAnnounce() {
  const { t } = useTranslation();
  const location = useLocation();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // Add submitting state
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ 
    id: null, 
    title: "", 
    imageBase64: "", 
    image: null, // For file object
    description: "", 
    details: "" 
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);
  
  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    setLoading(true);
    const token = useSessionToken();
    try {
      const response = await axios.get(API_BASE_URL);
      // Make sure we're setting an array, even if the API returns something else
      const data = response.data || [];
      setAnnouncements(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError(t('admin.announcements.errors.loadFailed'));
      // Initialize with empty array on error
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  // Load announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);
  
  // Check for openAddModal in location state (from quick action)
  useEffect(() => {
    if (location.state?.openAddModal) {
      openEdit({ id: null, title: "", imageBase64: "", description: "", details: "" });
      // Clean up the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
      location.state.openAddModal = false;
    }
  }, [location]);

  const openEdit = (announcement) => {
    setErrors({});
    setTouched({});
    
    // Create a copy of the announcement to edit
    const formData = { ...announcement };
    
    // Initialize preview URL if there's an image
    if (announcement.imageBase64) {
      formData.imagePreview = `data:image/jpeg;base64,${announcement.imageBase64}`;
    }
    
    setForm(formData);
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
        setErrors({ ...errors, image: t('admin.announcements.validation.invalidImageType') });
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, image: t('admin.announcements.validation.imageTooLarge') });
        return;
      }
      
      // Read the file as base64
      const reader = new FileReader();
      reader.onload = () => {
        // Extract the base64 data part (remove data:image/jpeg;base64, prefix)
        const base64String = reader.result.split(',')[1];
        
        setForm({
          ...form, 
          image: file,
          imageBase64: base64String,
          imagePreview: reader.result
        });
      };
      reader.readAsDataURL(file);
      setTouched({ ...touched, image: true });
    }
  };

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "title":
        if (!value.trim()) {
          error = t('admin.announcements.validation.titleRequired');
        } else if (value.trim().length < 3) {
          error = t('admin.announcements.validation.titleTooShort');
        } else if (value.trim().length > 50) {
          error = t('admin.announcements.validation.titleTooLong');
        }
        break;
        
      case "description":
        if (!value.trim()) {
          error = t('admin.announcements.validation.descriptionRequired');
        } else if (value.trim().length < 10) {
          error = t('admin.announcements.validation.descriptionTooShort');
        } else if (value.trim().length > 200) {
          error = t('admin.announcements.validation.descriptionTooLong');
        }
        break;
        
      case "details":
        if (value && value.trim().length > 1000) {
          error = t('admin.announcements.validation.detailsTooLong');
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
    
    // Image validation - only require for new announcements
    if (!form.id && !form.imageBase64) {
      formErrors.image = t('admin.announcements.validation.imageRequired');
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

  const saveAnnouncement = async () => {
    // Prevent submission if already submitting
    if (submitting) {
      return;
    }
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    
    try {
      setSubmitting(true);
      const announcementData = {
        id: form.id,
        title: form.title,
        description: form.description,
        details: form.details || "",
        imageBase64: form.imageBase64
      };
      const token = useSessionToken();
      const response = await axios.put(`${API_BASE_URL}/${form.id}`, announcementData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update the announcements list with the updated item
      setAnnouncements(prevAnnouncements => 
        prevAnnouncements.map(a => a.id === form.id ? response.data : a)
      );
      
      setSelected(null);
      setErrors({});
      setTouched({});
    } catch (err) {
      console.error("Error updating announcement:", err);
      setErrors({ submit: t('admin.announcements.errors.updateFailed') });
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteConfirmation = (announcement) => {
    setAnnouncementToDelete(announcement);
    setDeleteModalOpen(true);
  };

  const deleteAnnouncement = async () => {
    if (announcementToDelete && !submitting) {
      try {
        setSubmitting(true);
        const token = useSessionToken();
        await axios.delete(`${API_BASE_URL}/${announcementToDelete.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Update the UI after successful deletion
        setAnnouncements(prevAnnouncements => 
          prevAnnouncements.filter(a => a.id !== announcementToDelete.id)
        );
        setDeleteModalOpen(false);
        setAnnouncementToDelete(null);
      } catch (err) {
        console.error("Error deleting announcement:", err);
        setErrors({ submit: t('admin.announcements.errors.deleteFailed') });
      } finally {
        setSubmitting(false);
      }
    }
  };

  const addAnnouncement = async () => {
    // Prevent submission if already submitting
    if (submitting) {
      return;
    }
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      return;
    }
    
    try {
      setSubmitting(true);
      const announcementData = {
        title: form.title,
        description: form.description,
        details: form.details || "",
        imageBase64: form.imageBase64
      };
      const token = useSessionToken();
      
      const response = await axios.post(API_BASE_URL, announcementData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Add the new announcement to the list
      setAnnouncements(prevAnnouncements => [...prevAnnouncements, response.data]);
      
      // Reset form and close modal
      setForm({ id: null, title: "", imageBase64: "", description: "", details: "" });
      setSelected(null);
      setErrors({});
      setTouched({});
    } catch (err) {
      console.error("Error adding announcement:", err);
      setErrors({ submit: t('admin.announcements.errors.addFailed') });
    } finally {
      setSubmitting(false);
    }
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">{t('admin.announcements.title')}</h1>
      <button
        onClick={() => openEdit({ id: null, title: "", imageBase64: "", description: "", details: "" })}
        className="px-6 py-3 bg-[#06AED5] text-white rounded-lg transition duration-300 mb-8 text-lg"
        disabled={submitting}
      >
        {t('admin.announcements.addButton')}
      </button>
      
      {/* Error message */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 border border-red-400 text-red-800 rounded-lg flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Loading indicator */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#06AED5] border-r-transparent"></div>
          <p className="mt-2 text-gray-600">{t('admin.announcements.loading')}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {!Array.isArray(announcements) ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">{t('admin.announcements.errors.invalidFormat')}</p>
              <p className="text-gray-400">{t('admin.announcements.errors.contactAdmin')}</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">{t('admin.announcements.noAnnouncements')}</p>
              <p className="text-gray-400">{t('admin.announcements.createNewHint')}</p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="p-6 border rounded-lg shadow-md hover:shadow-lg transition duration-300">
                <div className="flex justify-between">
                  {/* Left side: Image and text */}
                  <div className="flex gap-6 items-start overflow-hidden">
                    <img
                      src={announcement.imageBase64 ? `data:image/jpeg;base64,${announcement.imageBase64}` : placeholder}
                      alt={t('admin.announcements.announcementImageAlt')}
                      className="w-28 h-28 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        console.log("Image failed to load, using placeholder");
                        e.target.src = placeholder;
                      }}
                    />
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <h2 className="text-2xl font-semibold text-gray-800 mb-2 truncate">{announcement.title}</h2>
                      <p className="text-gray-500 text-lg line-clamp-2 overflow-hidden text-ellipsis">{announcement.description}</p>
                    </div>
                  </div>
                  
                  {/* Right side: Action buttons */}
                  <div className="flex items-start space-x-6 ml-4 flex-shrink-0">
                    <button 
                      onClick={() => openEdit(announcement)} 
                      className="text-[#06AED5] transition duration-300"
                      disabled={submitting}
                      aria-label={t('admin.announcements.editButtonAriaLabel')}
                    >
                      <Edit size={24} />
                    </button>
                    <button 
                      onClick={() => openDeleteConfirmation(announcement)} 
                      className="text-red-600 transition duration-300"
                      disabled={submitting}
                      aria-label={t('admin.announcements.deleteButtonAriaLabel')}
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit/Add Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              {form.id ? t('admin.announcements.editTitle') : t('admin.announcements.addTitle')}
            </h2>
            
            {/* General error message */}
            {errors.submit && (
              <div className="p-3 mb-4 bg-red-100 border border-red-400 text-red-800 rounded-lg">
                {errors.submit}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.announcements.form.title')} <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('admin.announcements.form.titlePlaceholder')}
                className={getFieldClassName("title")}
                maxLength={50}
                disabled={submitting}
              />
              {touched.title && errors.title ? (
                <p className="text-red-600 text-sm">{errors.title}</p>
              ) : (
                <p className="text-gray-500 text-xs text-right">
                  {remainingChars("title", 50)} {t('admin.announcements.form.charactersRemaining')}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.announcements.form.image')} {!form.id && <span className="text-red-500">*</span>}
              </label>
              <input
                id="image"
                name="image"
                type="file"
                onChange={handleImageChange}
                accept="image/jpeg, image/png, image/gif, image/webp"
                className="w-full p-3 border rounded-lg mb-2 text-gray-800 file:border-0 file:bg-[#06AED5] file:text-white focus:outline-none"
                disabled={submitting}
              />
              {(form.imagePreview || (form.imageBase64 && !form.imagePreview)) ? (
                <div className="mb-2">
                  <img 
                    src={form.imagePreview || `data:image/jpeg;base64,${form.imageBase64}`} 
                    alt={t('admin.announcements.form.previewAlt')} 
                    className="w-24 h-24 object-cover rounded-lg" 
                    onError={(e) => {
                      console.log("Preview image failed to load");
                      e.target.src = placeholder;
                    }}
                  />
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-2">{t('admin.announcements.form.noImageSelected')}</p>
              )}
              {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
              <p className="text-gray-500 text-xs">{t('admin.announcements.form.supportedFormats')}</p>
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.announcements.form.description')} <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('admin.announcements.form.descriptionPlaceholder')}
                className={getFieldClassName("description")}
                rows={3}
                maxLength={200}
                disabled={submitting}
              />
              {touched.description && errors.description ? (
                <p className="text-red-600 text-sm">{errors.description}</p>
              ) : (
                <p className="text-gray-500 text-xs text-right">
                  {remainingChars("description", 200)} {t('admin.announcements.form.charactersRemaining')}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                {t('admin.announcements.form.details')}
              </label>
              <textarea
                id="details"
                name="details"
                value={form.details || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={t('admin.announcements.form.detailsPlaceholder')}
                className={getFieldClassName("details")}
                rows={5}
                maxLength={1000}
                disabled={submitting}
              />
              {touched.details && errors.details ? (
                <p className="text-red-600 text-sm">{errors.details}</p>
              ) : (
                <p className="text-gray-500 text-xs text-right">
                  {remainingChars("details", 1000)} {t('admin.announcements.form.charactersRemaining')}
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setSelected(null)} 
                className="px-6 py-2 bg-gray-300 rounded-lg transition duration-300"
                disabled={submitting}
              >
                {t('common.cancel')}
              </button>
              <button 
                onClick={form.id ? saveAnnouncement : addAnnouncement} 
                className={`px-6 py-2 bg-[#06AED5] text-white rounded-lg transition duration-300 ${submitting ? 'opacity-70' : ''}`}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <Loader2 size={18} className="animate-spin mr-2" />
                    {form.id ? t('admin.announcements.form.saving') : t('admin.announcements.form.adding')}
                  </span>
                ) : (
                  form.id ? t('admin.announcements.form.saveChanges') : t('admin.announcements.form.addAnnouncement')
                )}
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
              <h2 className="text-lg sm:text-xl font-semibold">{t('admin.announcements.delete.confirmTitle')}</h2>
            </div>
            
            <p className="mb-4">
              {t('admin.announcements.delete.confirmMessage').replace('{title}', announcementToDelete.title)}
            </p>
            
            <div className="flex justify-end gap-3 mt-5">
              <button 
                onClick={() => {
                  setDeleteModalOpen(false);
                  setAnnouncementToDelete(null);
                }} 
                className="px-4 py-2 border border-gray-300 rounded-md transition"
                disabled={submitting}
              >
                {t('common.cancel')}
              </button>
              <button 
                onClick={deleteAnnouncement} 
                className={`px-4 py-2 bg-red-600 text-white rounded-md transition ${submitting ? 'opacity-70' : ''}`}
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <Loader2 size={18} className="animate-spin mr-2" />
                    {t('admin.announcements.delete.deleting')}
                  </span>
                ) : (
                  t('admin.announcements.delete.confirmButton')
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}