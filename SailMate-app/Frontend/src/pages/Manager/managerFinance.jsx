import React, { useState, useEffect } from "react";
import { Ship, Percent, Save, Tag, Users, User, DollarSign, ArrowRight, Check } from "lucide-react";

const ManagerFinance = () => {
  // Animation state
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);


  const [ticketClasses, setTicketClasses] = useState([
    { id: 1, name: "Promo", basePrice: 149.99, color: "#8B5CF6" },
    { id: 2, name: "Economy", basePrice: 199.99, color: "#3B82F6" },
    { id: 3, name: "Business", basePrice: 449.99, color: "#10B981" }
  ]);

  const [discounts, setDiscounts] = useState([
    { id: 1, name: "Student", percentage: 15, icon: Users },
    { id: 2, name: "Senior (65+)", percentage: 20, icon: User }
  ]);

  const [serviceFee, setServiceFee] = useState(10);


  const [errors, setErrors] = useState({
    ticketClasses: {},
    discounts: {},
    serviceFee: null
  });

  const [saveSuccess, setSaveSuccess] = useState(false);


  const validatePrice = (price) => {
    if (isNaN(price) || price <= 0) {
      return "Price must be a positive number";
    }
    return null;
  };


  const validateDiscount = (percentage) => {
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return "Discount must be between 0-100%";
    }
    return null;
  };


  const handlePriceChange = (id, newPrice) => {
    const updatedErrors = { ...errors };
    

    const error = validatePrice(newPrice);
    if (error) {
      updatedErrors.ticketClasses[id] = error;
      setErrors(updatedErrors);
      return;
    }
    

    delete updatedErrors.ticketClasses[id];
    setErrors(updatedErrors);
    

    setTicketClasses(
      ticketClasses.map(ticketClass => 
        ticketClass.id === id ? { ...ticketClass, basePrice: parseFloat(newPrice) } : ticketClass
      )
    );
  };


  const handleDiscountChange = (id, newPercentage) => {
    const updatedErrors = { ...errors };
    

    const error = validateDiscount(newPercentage);
    if (error) {
      updatedErrors.discounts[id] = error;
      setErrors(updatedErrors);
      return;
    }
    

    delete updatedErrors.discounts[id];
    setErrors(updatedErrors);
    

    setDiscounts(
      discounts.map(discount => 
        discount.id === id ? { ...discount, percentage: parseFloat(newPercentage) } : discount
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
    const updatedErrors = { ...errors };
    
    if (isNaN(newFee) || newFee < 0) {
      updatedErrors.serviceFee = "Service fee must be a non-negative number";
      setErrors(updatedErrors);
      return;
    }
    
    updatedErrors.serviceFee = null;
    setErrors(updatedErrors);
    
    setServiceFee(parseFloat(newFee));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (
      Object.keys(errors.ticketClasses).length > 0 || 
      Object.keys(errors.discounts).length > 0 || 
      errors.serviceFee
    ) {
      return;
    }
    
    setSaveSuccess(true);
    
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with animation */}
        <header 
          className={`mb-8 transition-all duration-700 transform ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ferry Ticket Pricing</h1>
          <div className="flex items-center text-gray-600">
            <div className="h-1 w-10 bg-blue-600 mr-3"></div>
            <p>Manage your ferry ticket prices and passenger discounts</p>
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
                  <h2 className="text-xl font-semibold text-gray-800">Ferry Ticket Classes</h2>
                  <p className="text-sm text-gray-500">Set the base price for each ticket class</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Base Price ($)</th>
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
                            <span className="text-sm font-medium text-gray-900">{ticketClass.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="relative mt-1 rounded-md shadow-sm">
                              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">$</span>
                              </div>
                              <input
                                type="number"
                                min="0"
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
                  <h2 className="text-xl font-semibold text-gray-800">Service Fee</h2>
                  <p className="text-sm text-gray-500">Additional fee applied to all tickets</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="max-w-md">
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
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
                  The service fee is added to all ticket prices after discounts are applied.
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
                  <h2 className="text-xl font-semibold text-gray-800">Special Discounts</h2>
                  <p className="text-sm text-gray-500">Set discounts for special passenger groups</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="overflow-hidden border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount (%)</th>
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
                            <span className="text-sm font-medium text-gray-900">{discount.name}</span>
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
                                className={`block w-full rounded-md border border-gray-300 pr-12 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                                  errors.discounts[discount.id] ? "border-red-500 ring-red-500" : ""
                                }`}
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
                  <h2 className="text-xl font-semibold text-gray-800">Price Preview</h2>
                  <p className="text-sm text-gray-500">See how your changes affect final prices</p>
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
                        <h3 className="font-semibold text-gray-900">{ticketClass.name}</h3>
                        <div className="text-2xl font-bold text-gray-900">${ticketClass.basePrice.toFixed(2)}</div>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">Base price before any discounts or fees</p>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-3">With discounts:</h4>
                        <ul className="space-y-3">
                          {discounts.map((discount) => {
                            const discountedPrice = calculateDiscountedPrice(ticketClass.basePrice, discount.percentage);
                            const totalPrice = calculateTotalPrice(discountedPrice);
                            const Icon = discount.icon;
                            return (
                              <li key={discount.id} className="text-sm">
                                <div className="flex items-center mb-1">
                                  <Icon size={14} className="text-gray-500 mr-1.5" />
                                  <span className="text-gray-600">{discount.name}</span>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                  <div>
                                    <div className="text-xs text-gray-500">Discounted:</div>
                                    <div className="font-medium text-green-600">${discountedPrice}</div>
                                  </div>
                                  <ArrowRight size={14} className="text-gray-400 mx-1" />
                                  <div>
                                    <div className="text-xs text-gray-500">With fee:</div>
                                    <div className="font-medium text-blue-600">${totalPrice}</div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                            <span className="text-sm text-gray-600">Regular price + fee:</span>
                            <span className="font-bold text-gray-900">
                              ${calculateTotalPrice(ticketClass.basePrice.toFixed(2))}
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
                Changes Saved!
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
              >
                <Save size={18} className="mr-2" />
                Save Changes
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManagerFinance;