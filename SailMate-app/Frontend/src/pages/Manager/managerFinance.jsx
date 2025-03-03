import React, { useState } from "react";
import { Ship, Percent, Save, Tag, Users, User, DollarSign } from "lucide-react";

const managerFinance = () => {
  // Initial state for ticket classes and discounts
  const [ticketClasses, setTicketClasses] = useState([
    { id: 1, name: "Promo", basePrice: 149.99 },
    { id: 2, name: "Economy", basePrice: 199.99 },
    { id: 3, name: "Business", basePrice: 449.99 }
  ]);

  const [discounts, setDiscounts] = useState([
    { id: 1, name: "Student", percentage: 15 },
    { id: 2, name: "Senior (65+)", percentage: 20 }
  ]);
  
  // Service fee state
  const [serviceFee, setServiceFee] = useState(10);

  // States for form validation
  const [errors, setErrors] = useState({
    ticketClasses: {},
    discounts: {},
    serviceFee: null
  });

  // Function to validate price input
  const validatePrice = (price) => {
    if (isNaN(price) || price <= 0) {
      return "Price must be a positive number";
    }
    return null;
  };

  // Function to validate discount percentage
  const validateDiscount = (percentage) => {
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      return "Discount must be between 0-100%";
    }
    return null;
  };

  // Handle ticket price change
  const handlePriceChange = (id, newPrice) => {
    const updatedErrors = { ...errors };
    
    // Validate input
    const error = validatePrice(newPrice);
    if (error) {
      updatedErrors.ticketClasses[id] = error;
      setErrors(updatedErrors);
      return;
    }
    
    // Clear error if valid
    delete updatedErrors.ticketClasses[id];
    setErrors(updatedErrors);
    
    // Update state
    setTicketClasses(
      ticketClasses.map(ticketClass => 
        ticketClass.id === id ? { ...ticketClass, basePrice: parseFloat(newPrice) } : ticketClass
      )
    );
  };

  // Handle discount percentage change
  const handleDiscountChange = (id, newPercentage) => {
    const updatedErrors = { ...errors };
    
    // Validate input
    const error = validateDiscount(newPercentage);
    if (error) {
      updatedErrors.discounts[id] = error;
      setErrors(updatedErrors);
      return;
    }
    
    // Clear error if valid
    delete updatedErrors.discounts[id];
    setErrors(updatedErrors);
    
    // Update state
    setDiscounts(
      discounts.map(discount => 
        discount.id === id ? { ...discount, percentage: parseFloat(newPercentage) } : discount
      )
    );
  };

  // Calculate final price with discount and service fee
  const calculateDiscountedPrice = (basePrice, discountPercentage) => {
    // Apply discount to base price
    const discountedPrice = basePrice * (1 - discountPercentage / 100);
    return discountedPrice.toFixed(2);
  };
  
  // Calculate total price with service fee
  const calculateTotalPrice = (price) => {
    return (parseFloat(price) + serviceFee).toFixed(2);
  };

  // Handle service fee change
  const handleServiceFeeChange = (newFee) => {
    const updatedErrors = { ...errors };
    
    // Validate input
    if (isNaN(newFee) || newFee < 0) {
      updatedErrors.serviceFee = "Service fee must be a non-negative number";
      setErrors(updatedErrors);
      return;
    }
    
    // Clear error if valid
    updatedErrors.serviceFee = null;
    setErrors(updatedErrors);
    
    // Update state
    setServiceFee(parseFloat(newFee));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if there are any errors
    if (
      Object.keys(errors.ticketClasses).length > 0 || 
      Object.keys(errors.discounts).length > 0 || 
      errors.serviceFee
    ) {
      return;
    }
    
    // Form is valid - you could add API call here
    alert("Pricing updated successfully!");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ferry Ticket Pricing Manager</h1>
        <p className="text-gray-600">Manage your ferry ticket prices and passenger discounts</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Ticket Classes Section */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Ship className="text-blue-600 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Ferry Ticket Classes</h2>
          </div>
          
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
                        <Tag size={16} className="text-gray-500 mr-2" />
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
                            className={`block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                              errors.ticketClasses[ticketClass.id] ? "border-red-500" : ""
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
        </section>

        {/* Service Fee Section */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center mb-4">
            <DollarSign className="text-amber-600 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Service Fee</h2>
          </div>
          
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
                className={`block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.serviceFee ? "border-red-500" : ""
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
        </section>
        
        {/* Discounts Section */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Percent className="text-green-600 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Special Discounts</h2>
          </div>
          
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
                        {discount.name.includes("Student") ? (
                          <Users size={16} className="text-gray-500 mr-2" />
                        ) : (
                          <User size={16} className="text-gray-500 mr-2" />
                        )}
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
                            className={`block w-full rounded-md border-gray-300 pr-12 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                              errors.discounts[discount.id] ? "border-red-500" : ""
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
        </section>

        {/* Preview Section */}
        <section className="bg-white shadow-lg rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Tag className="text-purple-600 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-gray-800">Price Preview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ticketClasses.map((ticketClass) => (
              <div key={ticketClass.id} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">{ticketClass.name}</h3>
                <p className="text-gray-500 mb-1">Base price: <span className="font-semibold text-gray-900">${ticketClass.basePrice.toFixed(2)}</span></p>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">With discounts:</h4>
                  <ul className="space-y-1 list-none">
                    {discounts.map((discount) => {
                      const discountedPrice = calculateDiscountedPrice(ticketClass.basePrice, discount.percentage);
                      const totalPrice = calculateTotalPrice(discountedPrice);
                      return (
                        <li key={discount.id} className="text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>{discount.name}:</span>
                            <span className="font-medium text-green-600">
                              ${discountedPrice}
                            </span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">With service fee:</span>
                            <span className="font-medium text-xs text-blue-600">
                              ${totalPrice}
                            </span>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Regular price + fee:</span>
                      <span className="font-medium text-gray-900">
                        ${calculateTotalPrice(ticketClass.basePrice.toFixed(2))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Save size={18} className="mr-2" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default managerFinance;