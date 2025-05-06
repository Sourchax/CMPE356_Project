import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { Settings, X } from "lucide-react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSessionToken } from "../utils/sessions";

const API_BASE_URL = 'http://localhost:8080/api';

const UserPreferencesModal = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [emailSmsLanguage, setEmailSmsLanguage] = useState("en");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const modalRef = useRef(null);
  const { t } = useTranslation();

  // Initialize form with user's current preferences from metadata
  useEffect(() => {
    if (isOpen && user) {
      // Get language preferences from user metadata if available
      const userLan = user.publicMetadata?.lan || "en";
      setEmailSmsLanguage(userLan);
    }
  }, [isOpen, user]);

  // Handle outside click to close modal and prevent background scrolling
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      // Prevent background scrolling when modal is open
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "auto";
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

  // Reset form state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccess("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    try {
      // Get the session token for API authorization
      const token = await useSessionToken();
      
      // Update preferences through backend API only
      await axios.post(`${API_BASE_URL}/users/preferences`, {
        emailSmsLanguage
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Manually update the local user metadata reference for immediate UI feedback
      // This is just for UI display and doesn't affect the actual user data
      if (user && user.publicMetadata) {
        // Create a shallow copy of the metadata
        const updatedMetadata = { ...user.publicMetadata, lan: emailSmsLanguage };
        
        // Force update the dropdown value
        setEmailSmsLanguage(emailSmsLanguage);
        
        // This is a trick to update the select dropdown visually without actually
        // modifying Clerk's data (which is already updated through the API)
        Object.defineProperty(user, 'publicMetadata', {
          writable: true,
          value: updatedMetadata
        });
      }
      
      setSuccess(t("preferencesModal.success"));
    } catch (err) {
      console.error("Error updating preferences:", err);
      setError(t("preferencesModal.error"));
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
            <Settings size={20} className="mr-2" />
            {t("preferencesModal.title")}
          </h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors bg-red-600 hover:bg-red-700 rounded-md w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            <X size={20} />
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
                htmlFor="email-sms-language" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("preferencesModal.emailSmsLanguage")}
              </label>
              <select
                id="email-sms-language"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#0D3A73] focus:border-[#0D3A73]"
                value={emailSmsLanguage}
                onChange={(e) => setEmailSmsLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {t("preferencesModal.emailSmsLanguageHelp")}
              </p>
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
            {t("preferencesModal.cancel")}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0D3A73] hover:bg-blue-800 rounded-md transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("preferencesModal.saving") : t("preferencesModal.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPreferencesModal;