import React, { useState } from "react";
import "../assets/styles/contact.css";
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Send,
  Tag
} from "lucide-react";
import { FaFacebookF, FaXTwitter, FaInstagram} from 'react-icons/fa6';
import Button from "../components/Button";


const Contact = () => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          error = "Name cannot exceed 50 characters";
        } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
          error = "Name can only contain letters, spaces, hyphens and apostrophes";
        }
        break;
        
      case 'email':
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        } else if (value.length > 100) {
          error = "Email cannot exceed 100 characters";
        }
        break;
        
      case 'subject':
        if (!value.trim()) {
          error = "Subject is required";
        } else if (value.trim().length < 3) {
          error = "Subject must be at least 3 characters";
        } else if (value.trim().length > 100) {
          error = "Subject cannot exceed 100 characters";
        }
        break;
        
      case 'message':
        if (!value.trim()) {
          error = "Message is required";
        } else if (value.trim().length < 10) {
          error = "Message must be at least 10 characters";
        } else if (value.trim().length > 1000) {
          error = "Message cannot exceed 1000 characters";
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      
      setTimeout(() => {
        setLoading(false);
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
        
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }, 1500);
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
      {/* Hero Background - Added to match TicketCheck */}
      <div className="hero-background"></div>
      
      {/* Wave Transition - Added to match TicketCheck */}
      <div className="wave-transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you. Fill out the form and we'll respond as soon as possible.</p>
          
          <div className="contact-details">
            <div className="contact-detail-item">
              <div className="contact-icon">
                <MapPin size={20} />
              </div>
              <div>
                <h3>Our Location</h3>
                <p>Cibali, Kadir Has Cd., 34083 Cibali / Fatih/İstanbul</p>
              </div>
            </div>
            
            <div className="contact-detail-item">
              <div className="contact-icon">
                <Phone size={20} />
              </div>
              <div>
                <h3>Phone Number</h3>
                <p>+90 546 434 20 22</p>
              </div>
            </div>
            
            <div className="contact-detail-item">
              <div className="contact-icon">
                <Mail size={20} />
              </div>
              <div>
                <h3>Email Address</h3>
                <p>sailmatesup@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-detail-item">
              <div className="contact-icon">
                <Clock size={20} />
              </div>
              <div>
                <h3>Working Hours</h3>
                <p>Mon-Fri: 9am - 6pm</p>
              </div>
            </div>
          </div>
          
          <div className="contact-social">
            <h3>Follow Us</h3>
            <div className="social-icons">
              <a href="https://www.facebook.com/profile.php?id=61573753716618" className="social-icon facebook">
                <FaFacebookF size={18} />
                <span className="tooltip">Facebook</span>
              </a>
              <a href="https://x.com/sailmate221538" className="social-icon twitter">
                <FaXTwitter size={18} />
                <span className="tooltip">X</span>
              </a>
              <a href="#" className="social-icon instagram">
                <FaInstagram size={18} />
                <span className="tooltip">Instagram</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          <div className="contact-form">
            <span className="heading">Contact Us</span>
            
            {submitted && (
              <div className="success-message">
                <i className="fas fa-check-circle"></i>
                <p>Thank you for your message! We'll get back to you soon.</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Full Name <span className="required">*</span></label>
                <div className="input-with-icon">
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your name"
                    className={errors.name ? "error" : ""}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    maxLength={50}
                    required
                  />
                  <User className="input-icon" size={18} />
                </div>
                {errors.name && <span className="error-message" id="name-error">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <div className="input-with-icon">
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your email"
                    className={errors.email ? "error" : ""}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    maxLength={100}
                    required
                  />
                  <Mail className="input-icon" size={18} />
                </div>
                {errors.email && <span className="error-message" id="email-error">{errors.email}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject <span className="required">*</span></label>
                <div className="input-with-icon">
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Message subject"
                    className={errors.subject ? "error" : ""}
                    aria-invalid={errors.subject ? "true" : "false"}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                    maxLength={100}
                    required
                  />
                  <Tag className="input-icon" size={18} />
                </div>
                {errors.subject && <span className="error-message" id="subject-error">{errors.subject}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message <span className="required">*</span></label>
                <div className="textarea-with-icon">
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Your message"
                    className={errors.message ? "error" : ""}
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    maxLength={1000}
                    required
                  ></textarea>
                  <Send className="input-icon" size={18} />
                  <div className="character-count">{getCharacterCount()}</div>
                </div>
                {errors.message && <span className="error-message" id="message-error">{errors.message}</span>}
              </div>
              
              <div className="form-note">
                <span className="required">*</span> Required fields
              </div>
              
              <Button 
                type="submit" 
                loading={loading}
                variant="primary"
                fullWidth
                size="lg"
                className="contact-submit-btn mt-4"
              >
                Send Message
              </Button>
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