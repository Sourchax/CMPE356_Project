import React, { useState } from "react";
import "../assets/styles/contact.css";
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Send,
  Tag,
  LogIn
} from "lucide-react";
import {useSessionToken} from "../utils/sessions";
import { FaFacebookF, FaXTwitter, FaInstagram} from 'react-icons/fa6';
import Button from "../components/Button";
import axios from "axios";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Contact = () => {
  // Get userId from Clerk authentication
  const { user, isSignedIn } = useUser();
  const userId = isSignedIn ? user.id : "guest";
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateField = (name, value) => {
    let error = null;
  
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = t('contactPage.formErrors.nameRequired');
        } else if (value.trim().length < 2) {
          error = t('contactPage.formErrors.nameMinLength');
        } else if (value.trim().length > 50) {
          error = t('contactPage.formErrors.nameMaxLength');
        } else if (!/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]+$/.test(value)) {
          error = t('contactPage.formErrors.nameInvalid');
        }
        break;
  
      case 'email':
        if (!value.trim()) {
          error = t('contactPage.formErrors.emailRequired');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = t('contactPage.formErrors.emailInvalid');
        } else if (value.length > 100) {
          error = t('contactPage.formErrors.emailMaxLength');
        }
        break;
  
      case 'subject':
        if (!value.trim()) {
          error = t('contactPage.formErrors.subjectRequired');
        } else if (value.trim().length < 3) {
          error = t('contactPage.formErrors.subjectMinLength');
        } else if (value.trim().length > 100) {
          error = t('contactPage.formErrors.subjectMaxLength');
        }
        break;
  
      case 'message':
        if (!value.trim()) {
          error = t('contactPage.formErrors.messageRequired');
        } else if (value.trim().length < 10) {
          error = t('contactPage.formErrors.messageMinLength');
        } else if (value.trim().length > 1000) {
          error = t('contactPage.formErrors.messageMaxLength');
        }
        break;
  
      default:
        break;
    }
  
    return error;
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    setErrors({
      ...errors,
      [name]: error
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const getCharacterCount = () => {
    return `${formData.message.length}/1000`;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If user is not signed in, return early
    if (!isSignedIn) return;
    
    setSubmitError(null);
    
    if (validateForm()) {
      setLoading(true);
      
      try {
        // Create complaint request object
        const complaintData = {
          userId: userId,
          sender: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        };
        
        const token = useSessionToken();
        await axios.post('http://localhost:8080/api/complaints', complaintData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Reset form and show success message
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        setSubmitted(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      } catch (error) {
        console.error("Error submitting complaint:", error);
        setSubmitError(t('contactPage.formErrors.submitError'));
      } finally {
        setLoading(false);
      }
    } else {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        document.getElementById(firstErrorField)?.focus();
      }
    }
  };

  return (
    <div className="contact-container">
      {/* Hero Background */}
      <div className="hero-background"></div>
      
      {/* Wave Transition */}
      <div className="wave-transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <h2>{t('contactPage.getInTouch')}</h2>
          <p>{t('contactPage.getInTouchText')}</p>
          
          <div className="contact-details">
            <div className="contact-detail-item">
              <div className="contact-icon">
                <MapPin size={20} />
              </div>
              <div>
                <h3>{t('contactPage.ourLocation')}</h3>
                <p>Cibali, Kadir Has Cd., 34083 Cibali / Fatih/İstanbul</p>
              </div>
            </div>
            
            <div className="contact-detail-item">
              <div className="contact-icon">
                <Phone size={20} />
              </div>
              <div>
                <h3>{t('contactPage.phoneNumber')}</h3>
                <p>+90 546 434 20 22</p>
              </div>
            </div>
            
            <div className="contact-detail-item">
              <div className="contact-icon">
                <Mail size={20} />
              </div>
              <div>
                <h3>{t('contactPage.emailAddress')}</h3>
                <p>sailmatesup@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-detail-item">
              <div className="contact-icon">
                <Clock size={20} />
              </div>
              <div>
                <h3>{t('contactPage.workingHours')}</h3>
                <p>{t('contactPage.workingHoursValue')}</p>
              </div>
            </div>
          </div>
          
          <div className="contact-social">
            <h3>{t('contactPage.followUs')}</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61573753716618" className="social-icon facebook">
                <FaFacebookF size={18} />
                <span className="tooltip">{t('contactPage.facebookTooltip')}</span>
              </a>
              <a href="https://x.com/sailmate221538" className="social-icon twitter">
                <FaXTwitter size={18} />
                <span className="tooltip">{t('contactPage.twitterTooltip')}</span>
              </a>
              <a href="https://www.instagram.com/sailmate_/" className="social-icon instagram">
                <FaInstagram size={18} />
                <span className="tooltip">{t('contactPage.instagramTooltip')}</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          <div className="contact-form">
            <span className="heading">{t('contactPage.contactUs')}</span>
            
            {submitted && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <p>{t('contactPage.successMessage')}</p>
              </div>
            )}
            
            {submitError && (
              <div className="error-message-container">
                <p>{submitError}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">{t('contactPage.fullName')} <span className="required">*</span></label>
                <div className="input-with-icon">
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('contactPage.yourName')}
                    className={`${errors.name ? "error" : ""} ${!isSignedIn ? "bg-gray-100 opacity-70 cursor-not-allowed" : ""}`}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    maxLength={50}
                    required
                    disabled={!isSignedIn}
                  />
                  <User className="input-icon" size={18} />
                </div>
                {errors.name && <span className="error-message" id="name-error">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">{t('contactPage.emailAddress')} <span className="required">*</span></label>
                <div className="input-with-icon">
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('contactPage.yourEmail')}
                    className={`${errors.email ? "error" : ""} ${!isSignedIn ? "bg-gray-100 opacity-70 cursor-not-allowed" : ""}`}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    maxLength={100}
                    required
                    disabled={!isSignedIn}
                  />
                  <Mail className="input-icon" size={18} />
                </div>
                {errors.email && <span className="error-message" id="email-error">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">{t('contactPage.subject')} <span className="required">*</span></label>
                <div className="input-with-icon">
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('contactPage.messageSubject')}
                    className={`${errors.subject ? "error" : ""} ${!isSignedIn ? "bg-gray-100 opacity-70 cursor-not-allowed" : ""}`}
                    aria-invalid={errors.subject ? "true" : "false"}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                    maxLength={100}
                    required
                    disabled={!isSignedIn}
                  />
                  <Tag className="input-icon" size={18} />
                </div>
                {errors.subject && <span className="error-message" id="subject-error">{errors.subject}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="message">{t('contactPage.message')} <span className="required">*</span></label>
                <div className="textarea-with-icon">
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={t('contactPage.yourMessage')}
                    className={`${errors.message ? "error" : ""} ${!isSignedIn ? "bg-gray-100 opacity-70 cursor-not-allowed" : ""}`}
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    maxLength={1000}
                    required
                    disabled={!isSignedIn}
                  ></textarea>
                  <Send className="input-icon" size={18} />
                  <div className="character-count">{getCharacterCount()}</div>
                </div>
                {errors.message && <span className="error-message" id="message-error">{errors.message}</span>}
              </div>
              
              <div className="form-note">
                <span className="required">*</span> {t('contactPage.requiredFields')}
              </div>
              
              {!isSignedIn ? (
                <div className="mt-6 p-6 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-center animate-pulse">
                  <div className="flex items-center justify-center gap-3 text-gray-600 mb-4">
                    <LogIn size={18} />
                    <p className="m-0 text-base">{t('contactPage.signInToMessage')}</p>
                  </div>
                  <Button 
                    type="button"
                    variant="secondary"
                    fullWidth
                    size="lg"
                    className="font-medium transition-all duration-300 mt-4"
                    onClick={() => navigate("/sign-in")}
                  >
                    {t('common.login')}
                  </Button>
                </div>
              ) : (
                <Button 
                  type="submit" 
                  loading={loading}
                  variant="primary"
                  fullWidth
                  size="lg"
                  className="contact-submit-btn mt-4"
                >
                  {t('contactPage.sendMessage')}
                </Button>
              )}
            </form>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="contact-map">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.8022543483845!2d28.95722687651698!3d41.03662087134233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab989dc4c37c1%3A0x64c8680b5ac768e8!2sCibali%2C%20Kadir%20Has%20Cd.%2C%2034083%20Fatih%2F%C4%B0stanbul!5e0!3m2!1sen!2str!4v1710271335458!5m2!1sen!2str" 
          width="100%" 
          height="450" 
          style={{ border: 0 }} 
          allowFullScreen="" 
          loading="lazy"
          title="Cibali, Kadir Has Cd., 34083 Cibali / Fatih/Fatih/İstanbul"
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;