import React from 'react';
import { ArrowRight, ArrowUpDown, Wind, Toilet, Circle, Gem } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FastFerrySeatMap = ({ 
  currentDeck, 
  selectedSeats, 
  onSeatClick, 
  availableSeats,
  ticketClass 
}) => {
  const { t } = useTranslation();

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

  // Helper function to render window indicators on sides
  const renderWindowIndicators = (side) => {
    return [...Array(8)].map((_, i) => (
      <div key={`${side}-window-${i}`} className="w-1 h-6 bg-blue-300 rounded-sm my-3" />
    ));
  };

  // Helper function to render restrooms
  const renderRestrooms = () => {
    return (
      <div className="text-center">
        <div className="w-12 h-8 bg-gray-200 mx-auto mb-1 rounded-sm flex items-center justify-center text-gray-600 text-xs border border-gray-300">
          WC
        </div>
        <span className="text-xs text-gray-500">{t('ferryTicketing.facilities.restrooms')}</span>
      </div>
    );
  };

  // Helper function to render information
  const renderInformation = () => {
    return (
      <div className="text-center">
        <div className="w-12 h-8 bg-blue-100 mx-auto mb-1 rounded-sm flex items-center justify-center text-blue-600 text-xs border border-blue-300">
          i
        </div>
        <span className="text-xs text-gray-500">{t('ferryTicketing.facilities.information')}</span>
      </div>
    );
  };

  // Helper function to render stairs with label
  const renderStairs = () => {
    return (
      <div className="text-center">
        <div className="w-12 h-8 bg-yellow-100 mx-auto mb-1 rounded-sm flex items-center justify-center text-yellow-700 text-xs border border-yellow-300">
          ↑↓
        </div>
        <span className="text-xs text-gray-500">
          {currentDeck === 'upper' 
            ? t('ferryTicketing.facilities.toLowerDeck') 
            : t('ferryTicketing.facilities.toUpperDeck')}
        </span>
      </div>
    );
  };

  const renderUpperDeck = () => (
    <div className="relative">
      <div className="text-center font-bold text-blue-800 py-2 bg-gray-200">{t('ferryTicketing.deck.upper')}</div>
      <div className="relative w-full max-w-lg mx-auto bg-gray-100 p-2">
        {/* Windows on left side */}
        <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-around">
          {renderWindowIndicators('left')}
        </div>
        
        {/* Windows on right side */}
        <div className="absolute top-0 bottom-0 right-0 flex flex-col justify-around">
          {renderWindowIndicators('right')}
        </div>

        <div className="mb-4">
          <div className="text-center font-bold text-white py-2 bg-red-600 rounded-sm">
            {t('ferryTicketing.classLabels.business')}
          </div>
          <div className="bg-white p-3 rounded-sm">
            <div className="flex justify-center mb-1">
              {renderSeatRow('A', 1, 10, 'business')}
            </div>
            <div className="flex justify-center mb-1">
              {renderSeatRow('B', 11, 20, 'business')}
            </div>
            <div className="flex justify-center">
              {renderSeatRow('C', 21, 30, 'business')}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-center font-bold text-white py-2 bg-green-600 rounded-sm">
            {t('ferryTicketing.classLabels.economy')}
          </div>
          <div className="bg-white p-3 rounded-sm">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="flex justify-center mb-1">
                  {renderSeatRow('D', 1, 6, 'economy')}
                </div>
                <div className="flex justify-center mb-1">
                  {renderSeatRow('E', 7, 12, 'economy')}
                </div>
                <div className="flex justify-center">
                  {renderSeatRow('F', 13, 18, 'economy')}
                </div>
              </div>
              <div>
                <div className="flex justify-center mb-1">
                  {renderSeatRow('G', 19, 24, 'economy')}
                </div>
                <div className="flex justify-center mb-1">
                  {renderSeatRow('H', 25, 30, 'economy')}
                </div>
                <div className="flex justify-center">
                  {renderSeatRow('I', 31, 36, 'economy')}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center items-center space-x-8 my-4">
              {renderStairs()}
              {renderInformation()}
              {renderRestrooms()}
            </div>
          </div>
        </div>

        <div>
          <div className="text-center font-bold text-white py-2 bg-yellow-500 rounded-sm">
            {t('ferryTicketing.classLabels.promo')}
          </div>
          <div className="bg-white p-3 rounded-sm">
            <div className="flex justify-center mb-1">
              {renderSeatRow('J', 1, 10, 'promo')}
            </div>
            <div className="flex justify-center mb-1">
              {renderSeatRow('K', 11, 20, 'promo')}
            </div>
            
            <div className="flex justify-center items-center space-x-8 my-4">
              {renderRestrooms()}
              {renderInformation()}
              {renderRestrooms()}
            </div>
            
            <div className="flex justify-center mb-1">
              {renderSeatRow('L', 21, 30, 'promo')}
            </div>
            <div className="flex justify-center">
              {renderSeatRow('M', 31, 40, 'promo')}
            </div>
          </div>
        </div>
        
        {/* Stern indicator */}
        <div className="absolute -bottom-8 right-1/2 transform translate-x-1/2 text-gray-600 flex items-center">
          <span className="text-xs font-semibold bg-gray-200 px-2 py-1 rounded">{t('ferryTicketing.stern')}</span>
        </div>
      </div>
    </div>
  );

  const renderLowerDeck = () => (
    <div className="relative">
      <div className="text-center font-bold text-blue-800 py-2 bg-gray-200">{t('ferryTicketing.deck.main')}</div>
      <div className="relative w-full max-w-lg mx-auto bg-gray-100 p-2">
        {/* Windows on left side */}
        <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-around">
          {renderWindowIndicators('left')}
        </div>
        
        {/* Windows on right side */}
        <div className="absolute top-0 bottom-0 right-0 flex flex-col justify-around">
          {renderWindowIndicators('right')}
        </div>

        <div className="mb-4">
          <div className="text-center font-bold text-white py-2 bg-red-600 rounded-sm">
            {t('ferryTicketing.classLabels.business')}
          </div>
          <div className="bg-white p-3 rounded-sm">
            <div className="flex justify-center mb-1">
              {renderSeatRow('A', 1, 10, 'business')}
            </div>
            <div className="flex justify-center mb-1">
              {renderSeatRow('B', 11, 20, 'business')}
            </div>
            <div className="flex justify-center">
              {renderSeatRow('C', 21, 30, 'business')}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-center font-bold text-white py-2 bg-green-600 rounded-sm">
            {t('ferryTicketing.classLabels.economy')}
          </div>
          <div className="bg-white p-3 rounded-sm">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="flex justify-center mb-1">
                  {renderSeatRow('D', 1, 6, 'economy')}
                </div>
                <div className="flex justify-center mb-1">
                  {renderSeatRow('E', 7, 12, 'economy')}
                </div>
                <div className="flex justify-center">
                  {renderSeatRow('F', 13, 18, 'economy')}
                </div>
              </div>
              <div>
                <div className="flex justify-center mb-1">
                  {renderSeatRow('G', 19, 24, 'economy')}
                </div>
                <div className="flex justify-center mb-1">
                  {renderSeatRow('H', 25, 30, 'economy')}
                </div>
                <div className="flex justify-center">
                  {renderSeatRow('I', 31, 36, 'economy')}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center items-center space-x-8 my-4">
              {renderStairs()}
              {renderInformation()}
              {renderRestrooms()}
            </div>
          </div>
        </div>

        <div>
          <div className="text-center font-bold text-white py-2 bg-yellow-500 rounded-sm">
            {t('ferryTicketing.classLabels.promo')}
          </div>
          <div className="bg-white p-3 rounded-sm">
            <div className="flex justify-center mb-1">
              {renderSeatRow('N', 1, 10, 'promo')}
            </div>
            <div className="flex justify-center mb-1">
              {renderSeatRow('O', 11, 20, 'promo')}
            </div>
            
            <div className="flex justify-center items-center space-x-8 my-4">
              {renderRestrooms()}
              {renderInformation()}
              {renderRestrooms()}
            </div>
            
            <div className="flex justify-center mb-1">
              {renderSeatRow('P', 21, 30, 'promo')}
            </div>
            <div className="flex justify-center">
              {renderSeatRow('Q', 31, 40, 'promo')}
            </div>
          </div>
        </div>
        
        {/* Stern indicator */}
        <div className="absolute -bottom-8 right-1/2 transform translate-x-1/2 text-gray-600 flex items-center">
          <span className="text-xs font-semibold bg-gray-200 px-2 py-1 rounded">{t('ferryTicketing.stern')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-2 max-w-lg mx-auto">
      {currentDeck === 'upper' ? renderUpperDeck() : renderLowerDeck()}
    </div>
  );
};

export default FastFerrySeatMap;