import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Calendar, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API_URL = "http://localhost:8080/api";

const TicketSum = ({ ticketPlanningInfo, ticketTripInfo, prices, onPriceCalculated }) => {
  const { t } = useTranslation();
  const [departureTotalPrice, setDepartureTotalPrice] = useState(0);
  const [returnTotalPrice, setReturnTotalPrice] = useState(0);
  const [currencyRates, setCurrencyRates] = useState({
    TRY: 1,
    USD: 0.031,
    EUR: 0.028
  });
  
  if (!ticketTripInfo) return <div>No ticket data available</div>;

  const { departure, arrival, departureDate, returnDate, passengers, passengerTypes, currency = 'TRY' } = ticketTripInfo;

  // Currency symbols for display
  const currencySymbols = {
    TRY: '₺',
    USD: '$',
    EUR: '€'
  };

  // Get currency symbol
  const getCurrencySymbol = () => currencySymbols[currency] || '₺';
  
  // Fetch currency rates on component mount
  useEffect(() => {
    const fetchCurrencyRates = async () => {
      if (currency === 'TRY') return; // No need to fetch if using default TRY
      
      try {
        // Fetch USD rate
        const usdResponse = await axios.get(`${API_URL}/currency/convert`, {
          params: { amount: 1, from: 'TRY', to: 'USD' }
        });
        
        // Fetch EUR rate
        const eurResponse = await axios.get(`${API_URL}/currency/convert`, {
          params: { amount: 1, from: 'TRY', to: 'EUR' }
        });
        
        setCurrencyRates({
          TRY: 1,
          USD: usdResponse.data || 0.031, // Fallback to default if API fails
          EUR: eurResponse.data || 0.028  // Fallback to default if API fails
        });
      } catch (error) {
        console.error("Error fetching currency rates:", error);
        // Keep fallback rates if API fails
      }
    };
    
    fetchCurrencyRates();
  }, [currency]);
  
  // Convert price from TRY to selected currency
  const convertPrice = (priceTRY) => {
    if (currency === 'TRY') return priceTRY;
    return (priceTRY * currencyRates[currency]).toFixed(2);
  };
  
  // Format price with currency symbol
  const formatPrice = (price) => {
    if (price === 'N/A') return 'N/A';
    const symbol = getCurrencySymbol();
    return `${symbol}${convertPrice(price)}`;
  };

  // Get prices from props instead of hardcoded values
  const getPrice = (className) => {
    const priceItem = prices.find(price => price.className.toLowerCase() === className.toLowerCase());
    return priceItem ? priceItem.value : 0;
  };

  // Get all the necessary prices
  const promoPrice = getPrice("Promo");
  const economyPrice = getPrice("Economy");
  const businessPrice = getPrice("Business");
  const serviceFee = getPrice("Fee");
  
  // Discount rates from database
  const studentDiscount = getPrice("Student") / 100; // Convert percentage to decimal
  const seniorDiscount = getPrice("Senior") / 100;   // Convert percentage to decimal
  const childDiscount = 1.00; // 100% discount for children
  const earlyBookingDiscount = 0.10; // 10% early booking discount

  const isEarlyBooking = (dateStr) => {
    if (!dateStr) return false;
    
    const today = new Date();
    const targetDate = new Date(dateStr);
    
    // Calculate one month from today
    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1);
    
    // Return true if target date is after one month from today
    return targetDate > oneMonthLater;
  };

  // Calculate initial prices (before discounts)
  let departurePriceValue = 0;
  let returnPriceValue = 0;

  const tickets = [
    { label: t('ferryTicketing.oneWay').toUpperCase(), date: departureDate, dep: departure, arr: arrival, planningInfo: ticketPlanningInfo?.departure },
    returnDate ? { label: t('ferryTicketing.return').toUpperCase(), date: returnDate, dep: arrival, arr: departure, planningInfo: ticketPlanningInfo?.return } : null
  ].filter(Boolean);

  // Define seat type colors
  const seatTypeColors = {
    business: "#c74646",
    promo: "#f0c808",
    economy: "#34a693"
  };

  const calculatePassengerPrices = (basePrice, passengerTypes) => {
    if (!passengerTypes || basePrice === "N/A") return { total: "N/A", breakdown: {} };
    
    let total = 0;
    const breakdown = {};
    
    // Calculate price for each passenger type with appropriate discounts
    if (passengerTypes.adult) {
      const adultPrice = basePrice * passengerTypes.adult;
      total += adultPrice;
      breakdown.adult = {
        count: passengerTypes.adult,
        unitPrice: basePrice,
        total: adultPrice
      };
    }
    
    if (passengerTypes.student) {
      const studentUnitPrice = basePrice * (1 - studentDiscount);
      const studentPrice = studentUnitPrice * passengerTypes.student;
      total += studentPrice;
      breakdown.student = {
        count: passengerTypes.student,
        unitPrice: basePrice,
        discount: studentDiscount * 100,
        discountedPrice: studentUnitPrice,
        total: studentPrice
      };
    }
    
    if (passengerTypes.senior) {
      const seniorUnitPrice = basePrice * (1 - seniorDiscount);
      const seniorPrice = seniorUnitPrice * passengerTypes.senior;
      total += seniorPrice;
      breakdown.senior = {
        count: passengerTypes.senior,
        unitPrice: basePrice,
        discount: seniorDiscount * 100,
        discountedPrice: seniorUnitPrice,
        total: seniorPrice
      };
    }
    
    if (passengerTypes.child) {
      const childUnitPrice = basePrice * (1 - childDiscount);
      const childPrice = childUnitPrice * passengerTypes.child;
      total += childPrice;
      breakdown.child = {
        count: passengerTypes.child,
        unitPrice: basePrice,
        discount: childDiscount * 100,
        discountedPrice: childUnitPrice,
        total: childPrice
      };
    }
    
    return { 
      total, 
      breakdown
    };
  };

  // Update prices and notify parent component when they change
  useEffect(() => {
    // Set local state with original TRY values
    setDepartureTotalPrice(departurePriceValue);
    setReturnTotalPrice(returnPriceValue);
    
    // Notify parent component through callback with original TRY prices
    if (onPriceCalculated) {
      onPriceCalculated({
        departure: departurePriceValue,
        return: returnPriceValue
      });
    }
  }, [
    departurePriceValue, 
    returnPriceValue, 
    onPriceCalculated
  ]);

  return (
    <>
      {tickets.map((ticket, index) => {
        const planning = ticket.planningInfo || {};
        const depTime = planning?.departure || "N/A";
        const arrTime = planning?.arrival || "N/A";
        const seatType = planning?.type || "N/A";

        let selectedPrice;
        if (seatType === "business") {
          selectedPrice = businessPrice;
        } else if (seatType === "promo") {
          selectedPrice = promoPrice;
        } else if (seatType === "economy") {
          selectedPrice = economyPrice;
        } else {
          selectedPrice = "N/A";
        }

        const isEarlyBookingApplicable = isEarlyBooking(ticket.date);

        const passengerPrices = calculatePassengerPrices(selectedPrice, passengerTypes);
        
        if (ticket.label === t('ferryTicketing.oneWay').toUpperCase() && passengerPrices.total !== "N/A") {
          const passengerTotal = isEarlyBookingApplicable ? 
            passengerPrices.total * (1 - earlyBookingDiscount) : 
            passengerPrices.total;
          
          departurePriceValue = passengerTotal + (serviceFee * passengers);
        } else if (ticket.label === t('ferryTicketing.return').toUpperCase() && passengerPrices.total !== "N/A") {
          const passengerTotal = isEarlyBookingApplicable ? 
            passengerPrices.total * (1 - earlyBookingDiscount) : 
            passengerPrices.total;
          
          returnPriceValue = passengerTotal + (serviceFee * passengers);
        }

        // Set the overall color style based on the selected seat type
        const colorStyle = seatTypeColors[seatType] || "black";  // Default to black if seat type is unknown

        return (
          <div key={index} className="bg-white rounded-md shadow-sm p-4 mb-4" style={{ borderColor: colorStyle, borderWidth: '2px' }}>
            <div className="flex justify-between items-center mb-2">
              <div className="bg-white text-blue-600 font-bold" style={{ color: colorStyle }}>
                {ticket.label}
              </div>
              <div className="flex items-center">
                <ChevronRight className="mr-2 text-gray-500" />
                <span 
                  className="text-green-500 font-bold"
                  style={{ color: colorStyle }}
                >
                  {seatType.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <span className="text-gray-600" style={{ color: colorStyle }}>{ticket.dep}</span>
                <MapPin className="mx-2" style={{ color: colorStyle }} />
              </div>
              <div className="flex items-center">
                <span className="text-gray-600" style={{ color: colorStyle }}>{ticket.arr}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Calendar className="mr-2" style={{ color: colorStyle }} />
                <div>
                  <div className="text-gray-600">{t('common.date')}</div>
                  <div>{ticket.date || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-right">
                  <div className="text-gray-600">{t('ferryTicketing.departureArrival')}</div>
                  <div>{depTime} - {arrTime}</div>
                </div>
              </div>
            </div>

            <div className="border-t my-2"></div>

            {/* Display passenger counts by type with converted prices */}
            <div className="mb-2">
              <div className="font-medium mb-1">{t('ferryTicketing.passengers.title')}</div>
              {passengerTypes && (
                <div className="space-y-1">
                  {passengerTypes.adult > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="text-gray-700">
                        {t('ferryTicketing.passengers.adult')} {passengerTypes.adult > 1 ? `× ${passengerTypes.adult}` : ''}
                      </div>
                      {passengerPrices.breakdown.adult && (
                        <div className="font-bold" style={{ color: colorStyle }}>
                          {formatPrice(passengerPrices.breakdown.adult.total)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {passengerTypes.student > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="text-gray-700">
                        {t('ferryTicketing.passengerType.student')} × {passengerTypes.student} 
                        <span className="text-green-600 ml-1">
                          ({t('ferryTicketing.pricing.discountPercentage', {percent: studentDiscount * 100})})
                        </span>
                      </div>
                      {passengerPrices.breakdown.student && (
                        <div className="font-bold" style={{ color: colorStyle }}>
                          {formatPrice(passengerPrices.breakdown.student.total)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {passengerTypes.senior > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="text-gray-700">
                        {t('ferryTicketing.passengerType.senior')} × {passengerTypes.senior}
                        <span className="text-green-600 ml-1">
                          ({t('ferryTicketing.pricing.discountPercentage', {percent: seniorDiscount * 100})})
                        </span>
                      </div>
                      {passengerPrices.breakdown.senior && (
                        <div className="font-bold" style={{ color: colorStyle }}>
                          {formatPrice(passengerPrices.breakdown.senior.total)}
                        </div>
                      )}
                    </div>
                  )}
                  {passengerTypes.child > 0 && (
                    <div className="flex justify-between items-center">
                      <div className="text-gray-700">
                        {t('ferryTicketing.passengerType.child')} × {passengerTypes.child}
                        <span className="text-green-600 ml-1">
                          ({t('ferryTicketing.pricing.discountPercentage', {percent: 100})})
                        </span>
                      </div>
                      {passengerPrices.breakdown.child && (
                        <div className="font-bold" style={{ color: colorStyle }}>
                          {formatPrice(0)}
                        </div>
                      )}
                    </div>
                  )}
                </div>              
              )}
            </div>

            {/* Display Early Booking Discount if applicable */}
            {isEarlyBookingApplicable && (
              <div className="flex justify-between items-center mb-2">
                <div className="text-green-600 font-medium">
                  {t('ferryTicketing.earlyBookingDiscount', {percent: 10}) || `Early Booking Discount (10%)`}
                </div>
                <div className="font-bold text-green-600">
                  {formatPrice(-passengerPrices.total * earlyBookingDiscount)}
                </div>
              </div>
            )}

            <div className="border-t my-2"></div>

            {/* Display Service Fee with currency conversion */}
            <div className="flex justify-between items-center mb-2">
              <div className="text-gray-600">{t('ferryTicketing.pricing.serviceFee')}</div>
              <div className="font-bold" style={{ color: colorStyle }}>
                {formatPrice(serviceFee * passengers)}
              </div>
            </div>

            {/* Display Total Price with currency conversion */}
            <div className="bg-green-500 text-white p-2 flex justify-between items-center" style={{ backgroundColor: colorStyle }}>
              <div>{t('ferryTicketing.pricing.total')}</div>
              <div>
                {ticket.label === t('ferryTicketing.oneWay').toUpperCase() 
                  ? formatPrice(departurePriceValue)
                  : formatPrice(returnPriceValue)
                }
              </div>
            </div>
          </div>
        );
      })}

      {/* Grand Total with currency conversion */}
      <div className="bg-green-600 text-white p-4 mt-6 rounded-md shadow-md flex justify-between items-center">
        <div className="text-lg font-bold">{t('ferryTicketing.pricing.grandTotal')}</div>
        <div className="text-xl font-bold">
          {returnDate === "" 
            ? formatPrice(departurePriceValue)
            : formatPrice(departurePriceValue + returnPriceValue)
          }
        </div>
      </div>
    </>
  );
};

export default TicketSum;