import React, { useState, useEffect } from 'react';
import { FaTimes, FaAnchor, FaInfoCircle, FaShip } from 'react-icons/fa';
import FastFerrySeatMap from './FastFerrySeatMap';
import SeaBusSeatMap from './SeabusSeatMap';

const SeatSelectionModal = ({ 
  isOpen, 
  onClose, 
  type, 
  passengerCount, 
  onSeatSelection,
  ticketClass,
  shipType,
  voyageId,
  seatsInformation
}) => {
  const [selectionMode, setSelectionMode] = useState('automatic');
  const [currentDeck, setCurrentDeck] = useState('main');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [availableSeats, setAvailableSeats] = useState({});
  const isDeparture = type === 'departure';

  const seatInfo = seatsInformation.find(
    info => info.voyageId === voyageId
  );

  // Generate seat map structure based on ferry type and deck
  const generateSeatMap = () => {
    // Define seat configurations based on ferry type and deck
    const seatConfigs = {
      'Fast Ferry': {
        'main': {
          'business': { prefix: '1B', count: 30, startIndex: 1, deckKey: 'lowerDeckBusiness' },
          'economy': { prefix: '1E', count: 60, startIndex: 1, deckKey: 'lowerDeckEconomy' },
          'promo': { prefix: '1P', count: 60, startIndex: 1, deckKey: 'lowerDeckPromo' }
        },
        'upper': {
          'business': { prefix: '2B', count: 20, startIndex: 1, deckKey: 'upperDeckBusiness' },
          'economy': { prefix: '2E', count: 40, startIndex: 1, deckKey: 'upperDeckEconomy' },
          'promo': { prefix: '2P', count: 40, startIndex: 1, deckKey: 'upperDeckPromo' }
        }
      },
      'Sea Bus': {
        'main': {
          'business': { prefix: '1B', count: 10, startIndex: 1, deckKey: 'lowerDeckBusiness' },
          'economy': { prefix: '1E', count: 40, startIndex: 1, deckKey: 'lowerDeckEconomy' },
          'promo': { prefix: '1P', count: 40, startIndex: 1, deckKey: 'lowerDeckPromo' }
        },
        'upper': {
          'business': { prefix: '2B', count: 20, startIndex: 1, deckKey: 'upperDeckBusiness' },
          'economy': { prefix: '2E', count: 20, startIndex: 1, deckKey: 'upperDeckEconomy' },
          'promo': { prefix: '2P', count: 20, startIndex: 1, deckKey: 'upperDeckPromo' }
        }
      }
    };
  
    // Create seat map for both decks
    const seatMap = {};
    
    // Get the ship type from seatInfo
    const shipType = seatInfo?.shipType || 'Fast Ferry';
    
    // Generate seats for the specific ship type
    const shipConfig = seatConfigs[shipType];
    
    Object.keys(shipConfig).forEach(deck => {
      Object.keys(shipConfig[deck]).forEach(seatClass => {
        const { prefix, count, startIndex, deckKey } = shipConfig[deck][seatClass];
        
        // Get the availability array for this deck and class
        const availabilityArray = seatInfo?.[deckKey] || [];
        
        for (let i = startIndex; i <= count; i++) {
          const seatId = `${prefix}-${i}`;
          
          // Determine seat availability from the seatInfo
          // Note: false in the array means seat is available (not taken)
          const isAvailable = !availabilityArray[i - startIndex];
          
          seatMap[seatId] = {
            id: seatId,
            class: seatClass,
            deck: deck,
            index: i,
            isAvailable: isAvailable
          };
        }
      });
    });
    
    return seatMap;
  };

  // Create seat map when modal opens or when ferry type changes
  useEffect(() => {
    if (isOpen) {
      const newSeatMap = generateSeatMap();
      setAvailableSeats(newSeatMap);
      
      // If automatic selection is active, generate seats
      if (selectionMode === 'automatic') {
        const autoSeats = generateAutomaticSeats(passengerCount, ticketClass, newSeatMap);
        setSelectedSeats(autoSeats);
      }
    }
  }, [isOpen, shipType, ticketClass]);

  // Function to filter seats for the current ticket class (regardless of deck)
  const getSeatsForTicketClass = (seatMap = availableSeats) => {
    const classPrefix = ticketClass === 'business' ? 'B' : 
                       ticketClass === 'economy' ? 'E' : 'P'; // P for Promo

    return Object.values(seatMap).filter(
      seat => seat.id.includes(classPrefix) && seat.isAvailable
    );
  };

  // Generate automatic seats based on ticket class and passenger count
  const generateAutomaticSeats = (count, ticketClass, seatMap = availableSeats) => {
    // Filter available seats of the correct class
    const availableSeatsArray = getSeatsForTicketClass(seatMap);
    
    // If not enough available seats, show warning
    if (availableSeatsArray.length < count) {
      alert(`Not enough ${ticketClass} seats available. Only ${availableSeatsArray.length} seats found.`);
      return availableSeatsArray.slice(0, count).map(seat => seat.id);
    }
    
    // Try to assign seats in a smart way - use seats from both decks
    const result = [];
    
    // First try to get seats from main deck
    const mainDeckSeats = availableSeatsArray
      .filter(seat => seat.deck === 'main')
      .map(seat => seat.id);
    
    // Then get seats from upper deck
    const upperDeckSeats = availableSeatsArray
      .filter(seat => seat.deck === 'upper')
      .map(seat => seat.id);
    
    // Distribute based on availability
    if (count === 1) {
      // For single passenger, prefer main deck
      if (mainDeckSeats.length > 0) {
        result.push(mainDeckSeats[0]);
      } else {
        result.push(upperDeckSeats[0]);
      }
    } else {
      // For multiple passengers, try to distribute between decks
      const mainCount = Math.min(Math.ceil(count / 2), mainDeckSeats.length);
      const upperCount = Math.min(count - mainCount, upperDeckSeats.length);
      
      result.push(...mainDeckSeats.slice(0, mainCount));
      result.push(...upperDeckSeats.slice(0, upperCount));
      
      // If we still need more seats, add from whatever is available
      const remaining = count - result.length;
      if (remaining > 0) {
        if (mainDeckSeats.length > mainCount) {
          result.push(...mainDeckSeats.slice(mainCount, mainCount + remaining));
        } else if (upperDeckSeats.length > upperCount) {
          result.push(...upperDeckSeats.slice(upperCount, upperCount + remaining));
        }
      }
    }
    
    return result;
  };

  // Function to handle automatic seat selection
  const handleAutomaticSelection = () => {
    setSelectionMode('automatic');
    const autoSeats = generateAutomaticSeats(passengerCount, ticketClass);
    setSelectedSeats(autoSeats);
  };

  // Function to handle manual selection mode
  const handleManualSelection = () => {
    setSelectionMode('manual');
  };

  // Function to toggle a seat selection with queue-like behavior
  const handleSeatClick = (seatId) => {
    // If seat is already selected, remove it
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      // Using queue-like behavior - if max seats reached, remove first, add new one at end
      if (selectedSeats.length >= passengerCount) {
        const updatedSeats = [...selectedSeats];
        updatedSeats.shift(); // Remove the first seat (oldest)
        updatedSeats.push(seatId); // Add the new seat
        setSelectedSeats(updatedSeats);
      } else {
        // Otherwise just add the seat
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  // Function to confirm seat selection
  const handleConfirm = () => {
    if (selectedSeats.length === passengerCount) {
      onSeatSelection(selectedSeats);
      onClose();
    } else {
      alert(`Please select exactly ${passengerCount} seats.`);
    }
  };

  // Display the selected seats
  const formatSelectedSeats = () => {
    if (selectedSeats.length === 0) return 'None';
    if (selectedSeats.length === 1) return selectedSeats[0];
    return selectedSeats.join(', ');
  };

  // When modal opens, set automatic selection by default
  useEffect(() => {
    if (isOpen) {
      setSelectionMode('automatic');
    }
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <FaAnchor className="text-blue-800 mr-2" />
            <h2 className="text-xl font-semibold">
              {isDeparture ? 'Departure' : 'Return'} Seat Selection
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Selection Mode */}
        <div className="p-4 bg-gray-50">
          <div className="flex space-x-4">
            <button 
              onClick={handleAutomaticSelection}
              className={`flex-1 py-3 px-4 rounded border flex items-center justify-center 
                ${selectionMode === 'automatic' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
            >
              <span className="mr-2">⚙️</span>
              Automatic Selection
            </button>
            <button 
              onClick={handleManualSelection}
              className={`flex-1 py-3 px-4 rounded border flex items-center justify-center 
                ${selectionMode === 'manual' ? 'bg-blue-50 border-blue-500' : 'border-gray-300'}`}
            >
              <span className="mr-2">📍</span>
              Manual Selection
            </button>
          </div>
          
          {/* Selected seat display */}
          {selectedSeats.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-md flex flex-col text-blue-800">
              <div className="flex items-center">
                <FaAnchor className="mr-2" />
                <span className="font-semibold">Selected seats:</span>
                <span className="ml-2 text-sm">
                  ({selectedSeats.length}/{passengerCount})
                </span>
              </div>
              <div className="mt-1 pl-6 text-sm">
                {formatSelectedSeats()}
              </div>
            </div>
          )}
        </div>

        {/* Only show legend for manual selection */}
        {selectionMode === 'manual' && (
          <div className="px-4 py-3 border-t border-b flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span className="text-sm">Occupied</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
              <span className="text-sm">Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-400 rounded mr-2"></div>
              <span className="text-sm">Selected</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
              <span className="text-sm">Restricted</span>
            </div>
          </div>
        )}

        {/* Seat Map Area - Only show for manual selection */}
        {selectionMode === 'manual' && (
            <div className="p-4">
                {/* Deck type and class indicators */}
                <div className="flex justify-between mb-4">
                <div className="flex items-center">
                    <FaShip className="text-blue-700 mr-2" />
                    <span className="font-semibold">{shipType === 'Fast Ferry' ? 'Fast Ferry' : 'Sea Bus'}</span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-600 mr-2">{ticketClass} Class</span>
                </div>
                </div>

                {/* FastFerrySeatMap component */}
                {shipType === 'Fast Ferry' && (
                <FastFerrySeatMap
                    currentDeck={currentDeck}
                    selectedSeats={selectedSeats}
                    onSeatClick={handleSeatClick}
                    availableSeats={availableSeats}
                    ticketClass={ticketClass}
                />
                )}

                {/* SeaBusSeatMap component */}
                {shipType === 'Sea Bus' && (
                <SeaBusSeatMap
                    currentDeck={currentDeck}
                    selectedSeats={selectedSeats}
                    onSeatClick={handleSeatClick}
                    availableSeats={availableSeats}
                    ticketClass={ticketClass}
                />
                )}

                {/* Deck selection */}
                <div className="flex space-x-4 mb-4">
                <button 
                    onClick={() => setCurrentDeck('main')}
                    className={`py-2 px-4 rounded-md ${currentDeck === 'main' ? 
                    'bg-blue-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                    <span>Main Deck</span>
                </button>
                <button 
                    onClick={() => setCurrentDeck('upper')}
                    className={`py-2 px-4 rounded-md ${currentDeck === 'upper' ? 
                    'bg-blue-800 text-white' : 'bg-gray-100 text-gray-800'}`}
                >
                    <span>Upper Deck</span>
                </button>
                </div>

                <div className="text-sm text-gray-500 flex items-center">
                <FaInfoCircle className="mr-2" />
                Click on a seat to select it. You can select seats from both decks.
                </div>
            </div>
            )}

        {/* Footer with action buttons */}
        <div className="flex justify-between p-4 border-t">
          <button 
            onClick={onClose}
            className="py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center"
          >
            <FaTimes className="mr-2" />
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={selectedSeats.length !== passengerCount}
            className={`py-2 px-4 rounded-md text-white flex items-center
              ${selectedSeats.length === passengerCount ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <span className="mr-2">✓</span>
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionModal;