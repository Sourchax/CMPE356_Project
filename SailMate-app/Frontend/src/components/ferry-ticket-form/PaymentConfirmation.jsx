import React, { useState } from "react";
import "../../assets/styles/ferry-ticket-form/paymentconfirmation.css";


const PaymentConfirmation = ({ onCCDataChange }) => {
  const termsText = `SailMate Payment Terms & Conditions

By proceeding with payment on SailMate, you acknowledge that you have read, understood, and agree to be bound by the following terms and conditions`;

  
  const [formData, setFormData] = useState({
    name: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim().slice(0, 19);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "cardNumber") {
      setFormData((prev) => ({ ...prev, [name]: formatCardNumber(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name);
  };

  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      termsAccepted: e.target.checked,
    }));
    
    if (errors.termsAccepted) {
      setErrors(prev => ({ ...prev, termsAccepted: "" }));
    }
  };

  const validateField = (fieldName) => {
    const newError = {};
    
    switch (fieldName) {
      case "name":
        if (!formData.name.trim()) {
          newError.name = "Name is required";
        } else if (/\d/.test(formData.name)) {
          newError.name = "Name should not contain numbers";
        }
        break;
      case "cardNumber":
        if (!formData.cardNumber.replace(/\s/g, '') || !/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, '')))
          newError.cardNumber = "Please enter a valid 16-digit card number";
        break;
      case "expiryMonth":
        if (!formData.expiryMonth) newError.expiryMonth = "Required";
        break;
      case "expiryYear":
        if (!formData.expiryYear) newError.expiryYear = "Required";
        break;
      case "cvv":
        if (!formData.cvv || !/^\d{3}$/.test(formData.cvv))
          newError.cvv = "3-digit CVV required";
        break;
      case "termsAccepted":
        if (!formData.termsAccepted)
          newError.termsAccepted = "You must accept the terms";
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, ...newError }));
    return Object.keys(newError).length === 0;
  };

  const validateForm = () => {
    const fieldNames = ["name", "cardNumber", "expiryMonth", "expiryYear", "cvv", "termsAccepted"];
    let formIsValid = true;
    const newErrors = {};
    
    fieldNames.forEach(field => {
      const fieldValue = formData[field];
      
      switch (field) {
        case "name":
          if (!fieldValue.trim()) {
            newErrors.name = "Name is required";
            formIsValid = false;
          } else if (/\d/.test(fieldValue)) {
            newErrors.name = "Name should not contain numbers";
            formIsValid = false;
          }
          break;
        case "cardNumber":
          if (!fieldValue.replace(/\s/g, '') || !/^\d{16}$/.test(fieldValue.replace(/\s/g, ''))) {
            newErrors.cardNumber = "Please enter a valid 16-digit card number";
            formIsValid = false;
          }
          break;
        case "expiryMonth":
          if (!fieldValue) {
            newErrors.expiryMonth = "Required";
            formIsValid = false;
          }
          break;
        case "expiryYear":
          if (!fieldValue) {
            newErrors.expiryYear = "Required";
            formIsValid = false;
          }
          break;
        case "cvv":
          if (!fieldValue || !/^\d{3}$/.test(fieldValue)) {
            newErrors.cvv = "3-digit CVV required";
            formIsValid = false;
          }
          break;
        case "termsAccepted":
          if (!fieldValue) {
            newErrors.termsAccepted = "You must accept the terms";
            formIsValid = false;
          }
          break;
        default:
          break;
      }
    });
    
    setErrors(newErrors);
    
    return formIsValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    const isValid = validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      // Pass the form data to the parent component
      // The parent component will handle the actual API call and ticket creation
      onCCDataChange({...formData});
      
      // Note: We're not resetting isSubmitting because we want the button to stay in loading state
      // until the payment process completes or the user is redirected
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  return (
    <div className="py-4 sm:py-8 w-full max-w-full">
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-4 sm:p-6">
        <div className="border-b pb-3 sm:pb-4 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Complete Your Purchase</h1>
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm sm:text-base text-gray-600">Transaction #38291</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="As shown on card"
                disabled={isSubmitting}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base ${touched.name && errors.name ? "border-red-300 bg-red-50" : touched.name && !errors.name ? "border-green-300 bg-green-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
              <input
                id="cardNumber"
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                disabled={isSubmitting}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base ${touched.cardNumber && errors.cardNumber ? "border-red-300 bg-red-50" : touched.cardNumber && !errors.cardNumber ? "border-green-300 bg-green-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
              />
              {touched.cardNumber && errors.cardNumber && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.cardNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="col-span-1">
                <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  id="expiryMonth"
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={`w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg border text-sm sm:text-base ${touched.expiryMonth && errors.expiryMonth ? "border-red-300 bg-red-50" : touched.expiryMonth && !errors.expiryMonth ? "border-green-300 bg-green-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    return <option key={month} value={month}>{month.toString().padStart(2, '0')}</option>;
                  })}
                </select>
                {touched.expiryMonth && errors.expiryMonth && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.expiryMonth}</p>
                )}
              </div>

              <div className="col-span-1">
                <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <select
                  id="expiryYear"
                  name="expiryYear"
                  value={formData.expiryYear}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isSubmitting}
                  className={`w-full px-2 sm:px-3 py-2 sm:py-3 rounded-lg border text-sm sm:text-base ${touched.expiryYear && errors.expiryYear ? "border-red-300 bg-red-50" : touched.expiryYear && !errors.expiryYear ? "border-green-300 bg-green-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                >
                  <option value="">YY</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return <option key={year} value={year}>{year.toString().slice(2)}</option>;
                  })}
                </select>
                {touched.expiryYear && errors.expiryYear && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.expiryYear}</p>
                )}
              </div>

              <div className="col-span-1">
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  id="cvv"
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength="3"
                  placeholder="123"
                  disabled={isSubmitting}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border text-sm sm:text-base ${touched.cvv && errors.cvv ? "border-red-300 bg-red-50" : touched.cvv && !errors.cvv ? "border-green-300 bg-green-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                />
                {touched.cvv && errors.cvv && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.cvv}</p>
                )}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="termsAccepted"
                  checked={formData.termsAccepted}
                  onChange={handleCheckboxChange}
                  disabled={isSubmitting}
                  className={`h-4 w-4 text-blue-600 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                />
                <span className="text-xs sm:text-sm text-gray-600">
                  I accept the <a href="#" onClick={handleTermsClick} className="text-blue-600">terms and conditions</a>
                </span>
              </label>
              {touched.termsAccepted && errors.termsAccepted && (
                <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.termsAccepted}</p>
              )}
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 sm:py-3 font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base ${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Terms and Conditions Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-96 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Terms and Conditions</h2>
                <button 
                  onClick={closeTermsModal}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-sm sm:text-base text-gray-600">
                {termsText || "Please provide terms text via the termsText prop."}
              </div>
              <div className="mt-6 text-right">
                <button
                  onClick={closeTermsModal}
                  className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentConfirmation;