import React, { useState } from "react";
import "../assets/styles/paymentconfirmation.css";

const PaymentConfirmation = ({ onCCDataChange}) => {
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
    
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    
    setTouched(allTouched);
    
    const isValid = validateForm();
    
    if (isValid) {
      onCCDataChange(formData);
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <div className="border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Complete Your Purchase</h1>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-600">Transaction #38291</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
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
                className={`w-full px-4 py-3 rounded-lg border ${touched.name && errors.name ? "border-red-300 bg-red-50" : touched.name && !errors.name ? "border-green-300 bg-green-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                className={`w-full px-4 py-3 rounded-lg border ${touched.cardNumber && errors.cardNumber ? "border-red-300 bg-red-50" : touched.cardNumber && !errors.cardNumber ? "border-green-300 bg-green-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              />
              {touched.cardNumber && errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {errors.cardNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">Month</label>
                <select
                  id="expiryMonth"
                  name="expiryMonth"
                  value={formData.expiryMonth}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full px-3 py-3 rounded-lg border ${touched.expiryMonth && errors.expiryMonth ? "border-red-300 bg-red-50" : touched.expiryMonth && !errors.expiryMonth ? "border-green-300 bg-green-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    return <option key={month} value={month}>{month.toString().padStart(2, '0')}</option>;
                  })}
                </select>
                {touched.expiryMonth && errors.expiryMonth && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryMonth}</p>
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
                  className={`w-full px-3 py-3 rounded-lg border ${touched.expiryYear && errors.expiryYear ? "border-red-300 bg-red-50" : touched.expiryYear && !errors.expiryYear ? "border-green-300 bg-green-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                >
                  <option value="">YY</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() + i;
                    return <option key={year} value={year}>{year.toString().slice(2)}</option>;
                  })}
                </select>
                {touched.expiryYear && errors.expiryYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryYear}</p>
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
                  className={`w-full px-4 py-3 rounded-lg border ${touched.cvv && errors.cvv ? "border-red-300 bg-red-50" : touched.cvv && !errors.cvv ? "border-green-300 bg-green-50" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                />
                {touched.cvv && errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
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
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  I accept the <a href="#" className="text-blue-600">terms and conditions</a>
                </span>
              </label>
              {touched.termsAccepted && errors.termsAccepted && (
                <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>
              )}
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Confirm Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
