import React from 'react';
import { ArrowRight, ArrowUpDown, Wind, Toilet, Circle, Gem } from 'lucide-react';

const FastFerrySeatMap = ({ 
  currentDeck, 
  selectedSeats, 
  onSeatClick, 
  availableSeats,
  ticketClass 
}) => {
  const getClassHighlight = (seatClass) => {
    if (ticketClass === seatClass) return 'border-2 border-blue-500';
    return '';
  };

  const isSeatSelectable = (seatId) => {
    const seatPrefix = seatId.split('-')[0];
    const classPrefix = ticketClass === 'business' ? 'B' : 
                        ticketClass === 'economy' ? 'E' : 'P';
    return seatPrefix.includes(classPrefix);
  };

  const renderSeatRow = (rowChar, startNum, endNum, seatClass, customStyles = '') => {
    const seats = [];
    const classPrefix = seatClass === 'business' ? 'B' : seatClass === 'economy' ? 'E' : 'P';
    const deckPrefix = currentDeck === 'main' ? '1' : '2';
    const fullPrefix = deckPrefix + classPrefix;
    
    for (let i = startNum; i <= endNum; i++) {
      // Calculate the unique seat index based on the row and column
      const seatIndex = i;
      const seatId = `${fullPrefix}-${seatIndex}`;
      
      const isAvailable = availableSeats?.[seatId]?.isAvailable ?? true;
      const isSelected = selectedSeats.includes(seatId);
      const canSelect = isSeatSelectable(seatId);
      
      seats.push(
        <button
          key={seatId}
          onClick={() => isAvailable && canSelect && onSeatClick(seatId)}
          disabled={!isAvailable || !canSelect}
          className={`w-6 h-6 m-0.5 rounded-sm text-xs flex items-center justify-center relative
            ${canSelect ? 
              (isAvailable ? 
                (isSelected ? 'bg-yellow-400' : 'bg-green-100') 
                : 'bg-red-500') 
              : 'bg-gray-300 cursor-not-allowed'}
            ${customStyles}`}
          title={seatId}
        >
          <span className="sr-only">{seatId}</span>
        </button>
      );
    }
    return seats;
  };

  const renderUpperDeck = () => (
    <div className="relative">
      <div className="relative w-full bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="absolute -top-6 right-1/2 transform translate-x-1/2 text-gray-600 flex items-center">
          <span className="mr-1">Bow</span>
          <ArrowRight size={16} />
        </div>

        <div className="absolute top-2 left-0 right-0 flex justify-between px-4">
          {[...Array(15)].map((_, i) => (
            <div key={`top-window-${i}`} className="w-3 h-1 bg-blue-300 rounded-sm" />
          ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4">
          {[...Array(15)].map((_, i) => (
            <div key={`bottom-window-${i}`} className="w-3 h-1 bg-blue-300 rounded-sm" />
          ))}
        </div>

        <div className={`mb-4 pb-2 border-b border-dashed border-gray-300 ${getClassHighlight('business')}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-blue-800">Business Class</span>
            <Gem className="text-yellow-500" size={12} />
          </div>
          <div className="flex justify-center mb-1">
            {renderSeatRow('A', 1, 10, 'business')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('B', 11, 20, 'business')}
          </div>
        </div>

        <div className={`mb-4 pb-2 border-b border-dashed border-gray-300 ${getClassHighlight('economy')}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-blue-600">Economy Class</span>
            <Circle className="text-blue-500 fill-blue-500" size={10} />
          </div>
          <div className="flex justify-center">
            {renderSeatRow('C', 1, 10, 'economy')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('D', 11, 20, 'economy')}
          </div>

          <div className="flex justify-between items-center my-2">
            <div className="bg-gray-200 p-1 rounded flex items-center">
              <ArrowUpDown className="text-gray-600 mr-1" size={14} />
              <span className="text-xs">Stairs</span>
            </div>
            <div className="bg-gray-200 p-1 rounded flex items-center">
              <Toilet className="text-gray-600 mr-1" size={14} />
              <span className="text-xs">Toilet</span>
            </div>
            <div className="bg-gray-200 p-1 rounded flex items-center">
              <Wind className="text-gray-600 mr-1" size={14} />
              <span className="text-xs">A/C</span>
            </div>
          </div>

          <div className="flex justify-center">
            {renderSeatRow('E', 21, 30, 'economy')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('F', 31, 40, 'economy')}
          </div>
        </div>

        <div className={`${getClassHighlight('promo')}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-purple-700">Promo Class</span>
            <Circle className="text-purple-500 fill-purple-500" size={10} />
          </div>
          <div className="flex justify-center">
            {renderSeatRow('G', 1, 10, 'promo')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('H', 11, 20, 'promo')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('I', 21, 30, 'promo')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('J', 31, 40, 'promo')}
          </div>
        </div>

        <div className="absolute -bottom-6 right-1/2 transform translate-x-1/2 text-gray-600 flex items-center">
          <span className="mr-1">Stern</span>
        </div>
      </div>
    </div>
  );

  const renderLowerDeck = () => (
    <div className="relative">
      <div className="relative w-full bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="absolute -top-6 right-1/2 text-gray-600 flex items-center">
          <span className="mr-1">Bow</span>
          <ArrowRight size={16} />
        </div>

        <div className="absolute top-2 left-0 right-0 flex justify-between px-4">
          {[...Array(15)].map((_, i) => (
            <div key={`top-window-${i}`} className="w-3 h-1 bg-blue-300 rounded-sm" />
          ))}
        </div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4">
          {[...Array(15)].map((_, i) => (
            <div key={`bottom-window-${i}`} className="w-3 h-1 bg-blue-300 rounded-sm" />
          ))}
        </div>

        <div className={`mb-4 pb-2 border-b border-dashed border-gray-300 ${getClassHighlight('business')}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-blue-800">Business Class</span>
            <Gem className="text-yellow-500" size={12} />
          </div>
          <div className="flex justify-center mb-1">
            {renderSeatRow('A', 1, 10, 'business')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('B', 11, 20, 'business')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('C', 21, 30, 'business')}
          </div>
        </div>

        <div className={`mb-4 pb-2 border-b border-dashed border-gray-300 ${getClassHighlight('economy')}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-blue-600">Economy Class</span>
            <Circle className="text-blue-500 fill-blue-500" size={10} />
          </div>
          <div className="flex justify-center">
            {renderSeatRow('D', 1, 10, 'economy')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('E', 11, 20, 'economy')}
          </div>

          <div className="flex justify-between items-center my-2">
            <div className="bg-gray-200 p-1 rounded flex items-center">
              <ArrowUpDown className="text-gray-600 mr-1" size={14} />
              <span className="text-xs">Stairs</span>
            </div>
            <div className="bg-gray-200 p-1 rounded flex items-center">
              <Toilet className="text-gray-600 mr-1" size={14} />
              <span className="text-xs">Toilet</span>
            </div>
            <div className="bg-gray-200 p-1 rounded flex items-center">
              <Wind className="text-gray-600 mr-1" size={14} />
              <span className="text-xs">A/C</span>
            </div>
          </div>

          <div className="flex justify-center">
            {renderSeatRow('F', 21, 30, 'economy')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('G', 31, 40, 'economy')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('H', 41, 50, 'economy')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('I', 51, 60, 'economy')}
          </div>
        </div>

        <div className={`${getClassHighlight('promo')}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-purple-700">Promo Class</span>
            <Circle className="text-purple-500 fill-purple-500" size={10} />
          </div>
          <div className="flex justify-center">
            {renderSeatRow('J', 1, 10, 'promo')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('K', 11, 20, 'promo')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('L', 21, 30, 'promo')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('M', 31, 40, 'promo')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('N', 41, 50, 'promo')}
          </div>
          <div className="flex justify-center">
            {renderSeatRow('O', 51, 60, 'promo')}
          </div>
        </div>

        <div className="absolute -bottom-6 right-1/2 transform translate-x-1/2 text-gray-600 flex items-center">
          <span className="mr-1">Stern</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-2">
      {currentDeck === 'upper' ? renderUpperDeck() : renderLowerDeck()}
    </div>
  );
};

export default FastFerrySeatMap;