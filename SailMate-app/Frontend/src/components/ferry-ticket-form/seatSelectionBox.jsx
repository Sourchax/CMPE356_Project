import { Star, DollarSign, Zap } from 'lucide-react';
import React from 'react';
import { FaAnchor, FaInfoCircle, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const SeatSelectionBox = ({ 
  type, 
  isSelected, 
  onOpen, 
  ticketClass, 
  shipType, 
  passengerCount,
  selectedSeats = [] // Add this prop to receive the selected seats
}) => {
  const { t } = useTranslation();
  const isDeparture = type === 'departure';
  
  // Format the seats for display
  const formatSelectedSeats = () => {
    if (!selectedSeats || selectedSeats.length === 0) return '';
    if (selectedSeats.length === 1) return selectedSeats[0];
    if (selectedSeats.length === 2) return `${selectedSeats[0]}, ${selectedSeats[1]}`;
    return `${selectedSeats}`;
  };
  
  return (
    <div className="mb-4">
      <div className="flex items-center mb-2">
        <FaAnchor className={`${isDeparture ? 'text-blue-600' : 'text-red-600'} mr-2`} />
        <h2 className="text-lg font-medium">{isDeparture ? t('ferryTicketing.departureSeats') : t('ferryTicketing.returnSeats')}</h2>
        <div className="ml-auto flex space-x-2">
          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">{shipType}</span>
          <div className={`ml-2 text-xs px-2 py-1 rounded-md ${
            ticketClass === "business"
              ? 'bg-[#F0C808] text-[#0D3A73]' 
              : ticketClass === "economy"
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
          }`}>
            {ticketClass === "business" ? (
              <>
                <Star size={12} className="inline mr-1" />
                {t('ferryTicketing.business')}
              </>
            ) : ticketClass === "economy" ? (
              <>
                <DollarSign size={12} className="inline mr-1" />
                {t('ferryTicketing.economy')}
              </>
            ) : (
              <>
                <Zap size={12} className="inline mr-1" />
                {t('ferryTicketing.promo')}
              </>
            )}
          </div>
        </div>
      </div>
      
      <button 
        onClick={onOpen}
        className={`w-full py-4 px-4 ${isDeparture ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-orange-400 hover:bg-orange-500'} rounded-md flex items-center justify-center text-gray-800 font-medium`}
      >
        <span className="mr-2">
          {isSelected ? 
            (passengerCount > 1 ? t('ferryTicketing.changeSeats') : t('ferryTicketing.changeSeat')) : 
            (passengerCount > 1 ? t('ferryTicketing.selectSeats') : t('ferryTicketing.selectSeat'))
          }
        </span>
      </button>
      
      {!isSelected && (
        <div className="mt-2 flex items-center text-yellow-600 text-sm">
          <FaInfoCircle className="mr-1" />
          {t('ferryTicketing.pleaseSelectSeat')}
        </div>
      )}
      {isSelected && (
        <div className="mt-2">
          <div className="flex items-center text-green-600 text-sm mb-1">
            <FaCheckCircle className="mr-1" />
            {selectedSeats.length > 1 ? t('ferryTicketing.seatsSelected') : t('ferryTicketing.seatSelected')} ({selectedSeats.length}/{passengerCount})
          </div>
          <div className="bg-gray-50 p-2 rounded-md text-sm font-medium text-gray-700 border border-gray-200">
            {formatSelectedSeats()}
          </div>
        </div>
      )}  
    </div>
  );
};

export default SeatSelectionBox;