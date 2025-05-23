import React, { useState, useEffect } from "react";
import { Ship, Percent, Save, Tag, Users, User, DollarSign, ArrowRight, Check } from "lucide-react";
import axios from "axios";
import {useSessionToken} from "../../utils/sessions";
import { useTranslation } from 'react-i18next';

const API_URL = "http://localhost:8080/api";

const ManagerFinance = () => {
  const { t } = useTranslation();
  // Animation state
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);

  // Prices state
  const [prices, setPrices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize states with default values, will be updated from API
  const [ticketClasses, setTicketClasses] = useState([
    { id: 1, name: "Promo", basePrice: 0, color: "#F0C909" },
    { id: 2, name: "Economy", basePrice: 0, color: "#34A792" },
    { id: 3, name: "Business", basePrice: 0, color: "#C74646" }
  ]);

  const [discounts, setDiscounts] = useState([
    { id: 1, name: "Student", percentage: 0, icon: Users },
    { id: 2, name: "Senior", percentage: 0, icon: User }
  ]);

  const [serviceFee, setServiceFee] = useState(0);

  // Fetch prices from API
  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/prices`);
        
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setPrices(response.data);
          
          // Update ticket classes with values from API
          const updatedTicketClasses = [...ticketClasses];
          const promoPrice = response.data.find(price => price.className === "Promo");
          const economyPrice = response.data.find(price => price.className === "Economy");
          const businessPrice = response.data.find(price => price.className === "Business");
          
          if (promoPrice) updatedTicketClasses[0].basePrice = promoPrice.value;
          if (economyPrice) updatedTicketClasses[1].basePrice = economyPrice.value;
          if (businessPrice) updatedTicketClasses[2].basePrice = businessPrice.value;
          setTicketClasses(updatedTicketClasses);
          
          // Update discounts with values from API
          const updatedDiscounts = [...discounts];
          const studentDiscount = response.data.find(price => price.className === "Student");
          const seniorDiscount = response.data.find(price => price.className === "Senior");
          
          if (studentDiscount) updatedDiscounts[0].percentage = studentDiscount.value;
          if (seniorDiscount) updatedDiscounts[1].percentage = seniorDiscount.value;
          setDiscounts(updatedDiscounts);
          
          // Update service fee
          const fee = response.data.find(price => price.className === "Fee");
          if (fee) setServiceFee(fee.value);
        } else {
          setError(t('manager.finance.errors.emptyArray'));
        }
      } catch (err) {
        console.error("Error fetching prices:", err);
        setError(t('manager.finance.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrices();
  }, [t]);

  const [errors, setErrors] = useState({
    ticketClasses: {},
    discounts: {},
    serviceFee: null
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const validatePrice = (price) => {
    if (isNaN(price) || price <= 0) {
      return t('manager.finance.validation.positiveNumber');
    }
    return null;
  };

  const validateDiscount = (percentage) => {
    // If empty, return error
    if (percentage === "" || percentage === null) {
      return t('manager.finance.validation.discountEmpty');
    }
    // Check if it's a number between 0-100
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return t('manager.finance.validation.discountRange');
    }
    return null;
  };

  const handlePriceChange = (id, newPrice) => {
    // If the input is empty, don't update the value and return - keep previous value
    if (newPrice === "" || newPrice === null) {
      return;
    }
    
    // Parse the input value as a number
    let numValue = parseFloat(newPrice);
    
    // Ensure the value is positive and not greater than 10,000
    if (isNaN(numValue) || numValue <= 0) {
      numValue = 0.01; // Set to smallest positive value
    } else if (numValue > 10000) {
      numValue = 10000; // Cap at maximum allowed value
    }
    
    // Update the ticket class with the validated value
    setTicketClasses(
      ticketClasses.map(ticketClass => 
        ticketClass.id === id ? { ...ticketClass, basePrice: numValue } : ticketClass
      )
    );
  };

  const handleDiscountChange = (id, newPercentage) => {
    // If the input is empty, don't update the value and return - keep previous value
    if (newPercentage === "" || newPercentage === null) {
      return;
    }
    
    // Parse the input value as a number
    let numValue = parseFloat(newPercentage);
    
    // Ensure the value is within 0-100 range
    if (isNaN(numValue) || numValue < 0) {
      numValue = 0;
    } else if (numValue > 100) {
      numValue = 100;
    }
    
    // Update the discount with the validated value
    setDiscounts(
      discounts.map(discount => 
        discount.id === id ? { ...discount, percentage: numValue } : discount
      )
    );
  };

  const calculateDiscountedPrice = (basePrice, discountPercentage) => {
    const discountedPrice = basePrice * (1 - discountPercentage / 100);
    return discountedPrice.toFixed(2);
  };
  
  const calculateTotalPrice = (price) => {
    return (parseFloat(price) + serviceFee).toFixed(2);
  };

  const handleServiceFeeChange = (newFee) => {
    // If the input is empty, don't update the value and return - keep previous value
    if (newFee === "" || newFee === null) {
      return;
    }
    
    // Parse the input value as a number
    let numValue = parseFloat(newFee);
    
    // Ensure the value is non-negative and not greater than 10,000
    if (isNaN(numValue) || numValue < 0) {
      numValue = 0;
    } else if (numValue > 10000) {
      numValue = 10000; // Cap at maximum allowed value
    }
    
    // Update the service fee with the validated value
    setServiceFee(numValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if already submitting
    if (isSubmitting) return;
    
    // Check if any discount is empty
    const hasEmptyDiscount = discounts.some(discount => 
      discount.percentage === "" || discount.percentage === null
    );
    
    if (
      Object.keys(errors.ticketClasses).length > 0 || 
      Object.keys(errors.discounts).length > 0 || 
      errors.serviceFee || 
      hasEmptyDiscount
    ) {
      // If any discount is empty, add error for it
      if (hasEmptyDiscount) {
        const updatedErrors = { ...errors };
        discounts.forEach(discount => {
          if (discount.percentage === "" || discount.percentage === null) {
            updatedErrors.discounts[discount.id] = t('manager.finance.validation.discountEmpty');
          }
        });
        setErrors(updatedErrors);
      }
      return;
    }
    
    const token = await useSessionToken();
    
    // Set submitting state
    setIsSubmitting(true);
    
    // Prepare data for API update
    try {
      // Compare with original prices fetched from API
      const apiUpdates = [];
      // Track all price changes for the consolidated notification
      const priceChanges = [];
  
      // Check Ticket Classes
      const promoPrice = prices.find(price => price.className === "Promo");
      if (promoPrice && promoPrice.value !== ticketClasses[0].basePrice) {
        apiUpdates.push(
          axios.put(`${API_URL}/prices/class/Promo`, {
            className: "Promo",
            value: ticketClasses[0].basePrice
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        
        // Track this change for notification
        priceChanges.push({
          className: "Promo",
          oldValue: promoPrice.value,
          newValue: ticketClasses[0].basePrice
        });
      }
  
      const economyPrice = prices.find(price => price.className === "Economy");
      if (economyPrice && economyPrice.value !== ticketClasses[1].basePrice) {
        apiUpdates.push(
          axios.put(`${API_URL}/prices/class/Economy`, {
            className: "Economy",
            value: ticketClasses[1].basePrice
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        
        // Track this change for notification
        priceChanges.push({
          className: "Economy",
          oldValue: economyPrice.value,
          newValue: ticketClasses[1].basePrice
        });
      }
  
      const businessPrice = prices.find(price => price.className === "Business");
      if (businessPrice && businessPrice.value !== ticketClasses[2].basePrice) {
        apiUpdates.push(
          axios.put(`${API_URL}/prices/class/Business`, {
            className: "Business",
            value: ticketClasses[2].basePrice
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        
        // Track this change for notification
        priceChanges.push({
          className: "Business",
          oldValue: businessPrice.value,
          newValue: ticketClasses[2].basePrice
        });
      }
  
      // Check Discounts
      const studentDiscount = prices.find(price => price.className === "Student");
      if (studentDiscount && studentDiscount.value !== discounts[0].percentage) {
        apiUpdates.push(
          axios.put(`${API_URL}/prices/class/Student`, {
            className: "Student",
            value: discounts[0].percentage 
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        
        // Track this change for notification
        priceChanges.push({
          className: "Student",
          oldValue: studentDiscount.value,
          newValue: discounts[0].percentage
        });
      }
  
      const seniorDiscount = prices.find(price => price.className === "Senior");
      if (seniorDiscount && seniorDiscount.value !== discounts[1].percentage) {
        apiUpdates.push(
          axios.put(`${API_URL}/prices/class/Senior`, {
            className: "Senior",
            value: discounts[1].percentage
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        
        // Track this change for notification
        priceChanges.push({
          className: "Senior",
          oldValue: seniorDiscount.value,
          newValue: discounts[1].percentage
        });
      }
  
      // Check Service Fee
      const feePrice = prices.find(price => price.className === "Fee");
      if (feePrice && feePrice.value !== serviceFee) {
        apiUpdates.push(
          axios.put(`${API_URL}/prices/class/Fee`, {
            className: "Fee",
            value: serviceFee
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
        );
        
        // Track this change for notification
        priceChanges.push({
          className: "Fee",
          oldValue: feePrice.value,
          newValue: serviceFee
        });
      }
  
      // Only make API calls for changed values
      if (apiUpdates.length > 0) {
        // First, update all the prices in parallel
        await Promise.all(apiUpdates);
        
        // After successful updates, update the local prices state to reflect the changes
        const updatedPrices = [...prices];
        
        priceChanges.forEach(change => {
          const index = updatedPrices.findIndex(p => p.className === change.className);
          if (index !== -1) {
            updatedPrices[index] = {
              ...updatedPrices[index],
              value: change.newValue
            };
          }
        });
        
        // Update local state to reflect changes
        setPrices(updatedPrices);
        
        // Then, if there are any changes, send a single consolidated notification
        if (priceChanges.length > 0) {
          console.log("Sending price notifications:", priceChanges);
          try {
            await axios.post(`${API_URL}/prices/notify-price-updates`, priceChanges, {
              headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Price notification sent successfully");
          } catch (notifyError) {
            console.error("Error sending price notification:", notifyError);
            // Continue even if notification fails - prices are already updated
          }
        }
        
        // Show success message
        setSaveSuccess(true);
        
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else {
        // No changes were made
        console.log("No changes detected, nothing to update");
      }
      
    } catch (err) {
      console.error("Error updating prices:", err);
      setError(t('manager.finance.errors.saveFailed'));
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">{t('manager.finance.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p className="font-medium">{t('common.error')}</p>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with animation */}
        <header 
          className={`mb-8 transition-all duration-700 transform ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('manager.finance.title')}</h1>
          <div className="flex items-center text-gray-600">
            <div className="h-1 w-10 bg-blue-600 mr-3"></div>
            <p>{t('manager.finance.subtitle')}</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ticket Classes Section */}
          <section 
            className={`bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-700 transform ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <div className="border-b border-gray-100">
              <div className="flex items-center p-6">
                <div className="bg-blue-50 p-2 rounded-lg mr-4">
                  <Ship className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{t('manager.finance.ticketClasses.title')}</h2>
                  <p className="text-sm text-gray-500">{t('manager.finance.ticketClasses.subtitle')}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('manager.finance.ticketClasses.classColumn')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('manager.finance.ticketClasses.basePriceColumn')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ticketClasses.map((ticketClass) => (
                      <tr key={ticketClass.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-3" 
                              style={{ backgroundColor: ticketClass.color }}
                            ></div>
                            <span className="text-sm font-medium text-gray-900">{t(`manager.finance.ticketClasses.${ticketClass.name.toLowerCase()}`)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="relative mt-1 rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">₺</span>
                              </div>
                              <input
                                type="number"
                                min="0"
                                max="10000"
                                step="0.01"
                                value={ticketClass.basePrice}
                                onChange={(e) => handlePriceChange(ticketClass.id, e.target.value)}
                                className={`block w-full rounded-md border border-gray-300 pl-7 pr-12 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                  errors.ticketClasses[ticketClass.id] ? "border-red-500 ring-red-500" : ""
                                }`}
                              />
                            </div>
                            {errors.ticketClasses[ticketClass.id] && (
                              <p className="mt-1 text-sm text-red-600">{errors.ticketClasses[ticketClass.id]}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Service Fee Section */}
          <section 
            className={`bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-700 transform ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <div className="border-b border-gray-100">
              <div className="flex items-center p-6">
                <div className="bg-amber-50 p-2 rounded-lg mr-4">
                  <DollarSign className="text-amber-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{t('manager.finance.serviceFee.title')}</h2>
                  <p className="text-sm text-gray-500">{t('manager.finance.serviceFee.subtitle')}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="max-w-md">
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">₺</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10000"
                    step="0.01"
                    value={serviceFee}
                    onChange={(e) => handleServiceFeeChange(e.target.value)}
                    className={`block w-full rounded-md border border-gray-300 pl-7 pr-12 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                      errors.serviceFee ? "border-red-500 ring-red-500" : ""
                    }`}
                  />
                </div>
                {errors.serviceFee && (
                  <p className="mt-1 text-sm text-red-600">{errors.serviceFee}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  {t('manager.finance.serviceFee.description')}
                </p>
              </div>
            </div>
          </section>
          
          {/* Discounts Section */}
          <section 
            className={`bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-700 transform ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="border-b border-gray-100">
              <div className="flex items-center p-6">
                <div className="bg-green-50 p-2 rounded-lg mr-4">
                  <Percent className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{t('manager.finance.discounts.title')}</h2>
                  <p className="text-sm text-gray-500">{t('manager.finance.discounts.subtitle')}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('manager.finance.discounts.groupColumn')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('manager.finance.discounts.percentageColumn')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {discounts.map((discount) => (
                      <tr key={discount.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-gray-100 p-1.5 rounded-lg mr-3">
                              {discount.name.includes("Student") ? (
                                <Users size={16} className="text-gray-600" />
                              ) : (
                                <User size={16} className="text-gray-600" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{t(`manager.finance.discounts.${discount.name.toLowerCase()}`)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="relative mt-1 rounded-md shadow-sm">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={discount.percentage}
                                onChange={(e) => handleDiscountChange(discount.id, e.target.value)}
                                onBlur={(e) => {
                                  // If empty on blur, restore previous value
                                  if (e.target.value === "") {
                                    handleDiscountChange(discount.id, discount.percentage);
                                  }
                                }}
                                className="block w-full rounded-md border border-gray-300 pr-12 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                              />
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-gray-500 sm:text-sm">%</span>
                              </div>
                            </div>
                            {errors.discounts[discount.id] && (
                              <p className="mt-1 text-sm text-red-600">{errors.discounts[discount.id]}</p>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Preview Section */}
          <section 
            className={`bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-700 transform ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '400ms' }}
          >
            <div className="border-b border-gray-100">
              <div className="flex items-center p-6">
                <div className="bg-purple-50 p-2 rounded-lg mr-4">
                  <Tag className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">{t('manager.finance.preview.title')}</h2>
                  <p className="text-sm text-gray-500">{t('manager.finance.preview.subtitle')}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ticketClasses.map((ticketClass) => (
                  <div 
                    key={ticketClass.id} 
                    className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="p-1" style={{ backgroundColor: ticketClass.color }}></div>
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">{t(`manager.finance.ticketClasses.${ticketClass.name.toLowerCase()}`)}</h3>
                        <div className="text-2xl font-bold text-gray-900">₺{ticketClass.basePrice.toFixed(2)}</div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{t('manager.finance.preview.basePrice')}</p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">{t('manager.finance.preview.withDiscounts')}:</h4>
                        <div className="space-y-3">
                          {discounts.map((discount) => {
                            const discountedPrice = calculateDiscountedPrice(ticketClass.basePrice, discount.percentage);
                            const totalPrice = calculateTotalPrice(discountedPrice);
                            const Icon = discount.icon;
                            return (
                              <div key={discount.id} className="text-sm">
                                <div className="flex items-center mb-1">
                                  <Icon size={14} className="text-gray-500 mr-1.5" />
                                  <span className="text-gray-600">{t(`manager.finance.discounts.${discount.name.toLowerCase()}`)}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                  <div>
                                    <div className="text-xs text-gray-500">{t('manager.finance.preview.discounted')}:</div>
                                    <div className="font-medium text-green-600">₺{discountedPrice}</div>
                                  </div>
                                  <ArrowRight size={14} className="text-gray-400 mx-1" />
                                  <div>
                                    <div className="text-xs text-gray-500">{t('manager.finance.preview.withFee')}:</div>
                                    <div className="font-medium text-blue-600">₺{totalPrice}</div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-600">{t('manager.finance.preview.regularPlusFee')}:</span>
                            <span className="font-bold text-gray-900">
                              ₺{calculateTotalPrice(ticketClass.basePrice.toFixed(2))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div 
            className={`flex justify-end transition-all duration-700 transform ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
          {saveSuccess ? (
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-300"
            >
              <Check size={18} className="mr-2" />
              {t('manager.finance.saveSuccess')}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                isSubmitting 
                  ? "bg-blue-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg 
                    className="animate-spin h-5 w-5 mr-2" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24"
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    ></circle>
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t('manager.finance.saving')}
                </div>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  {t('manager.finance.saveChanges')}
                </>
              )}
            </button>
          )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerFinance;