import React, { useState } from "react";
// Remove CSS import as we'll be using Tailwind
// import "../assets/styles/contact.css";
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Send,
  Tag,
  CheckCircle,
  Loader
} from "lucide-react";
import { FaFacebookF, FaXTwitter, FaInstagram} from 'react-icons/fa6';

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
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-white">
      {/* Hero Background */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-cover bg-center z-0" 
           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40"></div>
      </div>
      
      {/* Wave Transition */}
      <div className="absolute top-[35vh] left-0 w-full h-[10vh] z-[1] overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none"
             className="absolute w-full h-full fill-white">
          <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,128C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
      
      <div className="relative z-10 max-w-[1200px] w-full mx-auto mt-[20vh] px-6 flex flex-col md:flex-row gap-8">
        {/* Contact Info Section - Left Side */}
        <div className="w-full md:w-2/5 rounded-xl shadow-xl overflow-hidden animate-[fadeIn_0.8s_ease-out] h-fit">
          <div className="bg-[#0D3A73] pt-16 pb-12 px-6 text-white">
            <h2 className="text-2xl font-bold mb-4 pb-3 relative">
              Get in Touch
              <span className="absolute bottom-0 left-0 w-12 h-[3px] bg-[#f0c808]"></span>
            </h2>
            <p className="mb-6 opacity-90">We'd love to hear from you. Fill out the form and we'll respond as soon as possible.</p>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <MapPin size={20} className="text-[#f0c808]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">Our Location</h3>
                  <p className="text-sm opacity-80">Cibali, Kadir Has Cd., 34083 Cibali / Fatih/İstanbul</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone size={20} className="text-[#f0c808]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">Phone Number</h3>
                  <p className="text-sm opacity-80">+90 (212) 555-1234</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <Mail size={20} className="text-[#f0c808]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">Email Address</h3>
                  <p className="text-sm opacity-80">support@sailmate.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3 flex-shrink-0">
                  <Clock size={20} className="text-[#f0c808]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">Working Hours</h3>
                  <p className="text-sm opacity-80">Mon-Fri: 9am - 6pm</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
              <div className="flex items-center gap-6 mt-2">
                <a href="#" className="text-white hover:text-[#f0c808] transition-colors duration-300">
                  <FaFacebookF size={22} />
                </a>
                <a href="#" className="text-white hover:text-[#f0c808] transition-colors duration-300">
                  <FaXTwitter size={22} />
                </a>
                <a href="#" className="text-white hover:text-[#f0c808] transition-colors duration-300">
                  <FaInstagram size={22} />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Form Section - Right Side */}
        <div className="w-full md:w-3/5 bg-white rounded-xl shadow-xl p-6 animate-[fadeIn_1s_ease-out]">
          <span className="block text-2xl font-bold mb-6 pb-3 relative text-gray-800">
            Contact Us
            <span className="absolute bottom-0 left-0 w-12 h-[3px] bg-[#f0c808]"></span>
          </span>
          
          {submitted && (
            <div className="animate-[fadeIn_0.5s_ease-out] bg-green-100 text-green-800 p-4 rounded-lg flex items-center mb-6">
              <CheckCircle size={20} className="mr-3 text-green-600" />
              <p>Thank you for your message! We'll get back to you soon.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your name"
                  className={`pl-10 w-full py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:shadow-[0_0_0_3px_rgba(6,174,213,0.1)] focus:outline-none transition-all`}
                  aria-invalid={errors.name ? "true" : "false"}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  maxLength={50}
                  required
                />
              </div>
              {errors.name && <p className="text-red-600 text-sm mt-1" id="name-error">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your email"
                  className={`pl-10 w-full py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:shadow-[0_0_0_3px_rgba(6,174,213,0.1)] focus:outline-none transition-all`}
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  maxLength={100}
                  required
                />
              </div>
              {errors.email && <p className="text-red-600 text-sm mt-1" id="email-error">{errors.email}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Subject <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Message subject"
                  className={`pl-10 w-full py-3 border ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:shadow-[0_0_0_3px_rgba(6,174,213,0.1)] focus:outline-none transition-all`}
                  aria-invalid={errors.subject ? "true" : "false"}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  maxLength={100}
                  required
                />
              </div>
              {errors.subject && <p className="text-red-600 text-sm mt-1" id="subject-error">{errors.subject}</p>}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
                  <Send size={18} />
                </div>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Your message"
                  className={`pl-10 w-full py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm focus:ring-[#06AED5] focus:border-[#06AED5] focus:shadow-[0_0_0_3px_rgba(6,174,213,0.1)] focus:outline-none transition-all resize-none h-32`}
                  aria-invalid={errors.message ? "true" : "false"}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  maxLength={1000}
                  required
                ></textarea>
                <div className="absolute bottom-2 right-3 text-xs text-gray-500">
                  {getCharacterCount()}
                </div>
              </div>
              {errors.message && <p className="text-red-600 text-sm mt-1" id="message-error">{errors.message}</p>}
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              <span className="text-red-500">*</span> Required fields
            </div>
            
            <button 
              type="submit" 
              className={`w-full bg-[#0D3A73] hover:bg-[#06AED5] text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${loading ? 'opacity-80 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader size={20} className="animate-spin mr-2" />
                  <span>Sending...</span>
                </div>
              ) : "Send Message"}
            </button>
          </form>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="w-full mt-12 mb-10 px-6 relative z-[2]">
        <div className="max-w-[1200px] mx-auto">
          <div className="rounded-xl overflow-hidden shadow-xl h-[450px]">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.8022543483845!2d28.95722687651698!3d41.03662087134233!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab989dc4c37c1%3A0x64c8680b5ac768e8!2sCibali%2C%20Kadir%20Has%20Cd.%2C%2034083%20Fatih%2F%C4%B0stanbul!5e0!3m2!1sen!2str!4v1710271335458!5m2!1sen!2str" 
              width="100%" 
              height="100%" 
              className="border-0"
              allowFullScreen="" 
              loading="lazy"
              title="Cibali, Kadir Has Cd., 34083 Cibali / Fatih/Fatih/İstanbul"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;