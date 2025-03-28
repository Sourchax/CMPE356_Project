import React, { useState } from 'react';

const FerrySeatSelection = ({ 
  tripType, 
  onSeatSelected,
  isOpen,
  toggleOpen,
  selectedSeat
}) => {
  const [selectionMode, setSelectionMode] = useState('auto');
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [currentDeck, setCurrentDeck] = useState('main');
  const [manualSeat, setManualSeat] = useState(null);
  
  // Define seat status options
  const SEAT_STATUS = {
    FULL: 'full',
    EMPTY: 'empty',
    SELECTED: 'selected'
  };
  
  // Generate seat data for each deck
  const generateDeckSeats = (deckType) => {
    // Create an empty grid
    const grid = [];
    
    if (deckType === 'main') {
      // Row 1 (Top row)
      const row1 = Array(16).fill().map((_, i) => ({
        id: `M1-${i+1}`,
        status: Math.random() > 0.8 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
        position: [1, i+1],
        deck: 'main'
      }));
      grid.push(row1);
      
      // Row 2-3 (Second section, two rows)
      for (let r = 0; r < 2; r++) {
        const row = Array(20).fill().map((_, i) => ({
          id: `M${r+2}-${i+1}`,
          status: Math.random() > 0.8 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
          position: [r+2, i+1],
          deck: 'main'
        }));
        grid.push(row);
      }
      
      // Row 4-5 (Third section, two rows with café in middle)
      for (let r = 0; r < 2; r++) {
        const row = [];
        // Left side
        for (let i = 0; i < 8; i++) {
          row.push({
            id: `M${r+4}-${i+1}`,
            status: Math.random() > 0.8 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
            position: [r+4, i+1],
            deck: 'main'
          });
        }
        
        // Middle (café space) - add 4 empty spaces
        for (let i = 0; i < 4; i++) {
          row.push(null);
        }
        
        // Right side
        for (let i = 0; i < 8; i++) {
          row.push({
            id: `M${r+4}-${i+13}`,
            status: Math.random() > 0.8 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
            position: [r+4, i+13],
            deck: 'main'
          });
        }
        grid.push(row);
      }
      
      // Row 6-7 (Fourth section, two rows with stairs in middle)
      for (let r = 0; r < 2; r++) {
        const row = [];
        // Left side
        for (let i = 0; i < 8; i++) {
          row.push({
            id: `M${r+6}-${i+1}`,
            status: Math.random() > 0.8 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
            position: [r+6, i+1],
            deck: 'main'
          });
        }
        
        // Middle (stairs space) - add 4 empty spaces
        for (let i = 0; i < 4; i++) {
          row.push(null);
        }
        
        // Right side
        for (let i = 0; i < 8; i++) {
          row.push({
            id: `M${r+6}-${i+13}`,
            status: Math.random() > 0.8 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
            position: [r+6, i+13],
            deck: 'main'
          });
        }
        grid.push(row);
      }
      
      // Row 8 (Bottom row)
      const row8 = Array(16).fill().map((_, i) => ({
        id: `M8-${i+1}`,
        status: Math.random() > 0.8 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
        position: [8, i+1],
        deck: 'main'
      }));
      grid.push(row8);
      
    } else if (deckType === 'upper') {
      // Different layout for upper deck
      // Row 1 (Top row)
      const row1 = Array(12).fill().map((_, i) => ({
        id: `U1-${i+1}`,
        status: Math.random() > 0.7 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
        position: [1, i+1],
        deck: 'upper'
      }));
      grid.push(row1);
      
      // Middle rows
      for (let r = 0; r < 3; r++) {
        const row = Array(18).fill().map((_, i) => ({
          id: `U${r+2}-${i+1}`,
          status: Math.random() > 0.7 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
          position: [r+2, i+1],
          deck: 'upper'
        }));
        grid.push(row);
      }
      
      // Bottom rows with observation deck
      for (let r = 0; r < 2; r++) {
        const row = [];
        // Left side
        for (let i = 0; i < 6; i++) {
          row.push({
            id: `U${r+5}-${i+1}`,
            status: Math.random() > 0.7 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
            position: [r+5, i+1],
            deck: 'upper'
          });
        }
        
        // Middle (observation deck) - add 6 empty spaces
        for (let i = 0; i < 6; i++) {
          row.push(null);
        }
        
        // Right side
        for (let i = 0; i < 6; i++) {
          row.push({
            id: `U${r+5}-${i+13}`,
            status: Math.random() > 0.7 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
            position: [r+5, i+13],
            deck: 'upper'
          });
        }
        grid.push(row);
      }
      
      // Bottom row
      const row7 = Array(12).fill().map((_, i) => ({
        id: `U7-${i+1}`,
        status: Math.random() > 0.7 ? SEAT_STATUS.FULL : SEAT_STATUS.EMPTY,
        position: [7, i+1],
        deck: 'upper'
      }));
      grid.push(row7);
    }
    
    return grid;
  };
  
  // Generate both decks
  const mainDeckSeats = generateDeckSeats('main');
  const upperDeckSeats = generateDeckSeats('upper');
  
  // Get current deck seats
  const currentSeats = currentDeck === 'main' ? mainDeckSeats : upperDeckSeats;
  
  const handleSeatClick = (seat) => {
    if (!seat || seat.status === SEAT_STATUS.FULL) return;
    
    setManualSeat(seat);
    onSeatSelected(`${seat.id} (${seat.deck === 'main' ? 'Main Deck' : 'Upper Deck'})`);
  };
  
  const handleDeckChange = (deck) => {
    setCurrentDeck(deck);
  };
  
  const handleModeChange = (mode) => {
    setSelectionMode(mode);
    if (mode === 'auto') {
      // Generate a random available seat
      const availableSeats = [];
      
      // Collect all available seats from both decks
      mainDeckSeats.forEach(row => {
        row.forEach(seat => {
          if (seat && seat.status === SEAT_STATUS.EMPTY) {
            availableSeats.push(seat);
          }
        });
      });
      
      upperDeckSeats.forEach(row => {
        row.forEach(seat => {
          if (seat && seat.status === SEAT_STATUS.EMPTY) {
            availableSeats.push(seat);
          }
        });
      });
      
      // Select a random available seat
      if (availableSeats.length > 0) {
        const randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
        onSeatSelected(`${randomSeat.id} (${randomSeat.deck === 'main' ? 'Main Deck' : 'Upper Deck'})`);
      }
      
      setShowSeatMap(false);
    } else {
      setShowSeatMap(true);
    }
  };
  
  const handleConfirm = () => {
    if (manualSeat) {
      toggleOpen();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {tripType === 'departure' ? 'Departure' : 'Return'} Seat Selection
          </h3>
          <button 
            onClick={toggleOpen}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <div className="flex space-x-4 mb-4">
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectionMode === 'auto' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleModeChange('auto')}
              >
                Automatic Selection
              </button>
              <button
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectionMode === 'manual' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => handleModeChange('manual')}
              >
                Manual Selection
              </button>
            </div>
            
            {selectedSeat && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z"></path>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <span>Selected seat: <strong>{selectedSeat}</strong></span>
              </div>
            )}
          </div>
          
          {showSeatMap && (
            <>
              {/* Header with legend */}
              <div className="flex justify-between items-center mb-4 pb-2 border-b">
                <div className="flex space-x-6">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-400 rounded mr-2"></div>
                    <span className="text-gray-700">Occupied</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-green-400 rounded mr-2"></div>
                    <span className="text-gray-700">Available</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-amber-300 rounded mr-2"></div>
                    <span className="text-gray-700">Selected</span>
                  </div>
                </div>
              </div>
              
              {/* Ferry layout */}
              <div className="relative border border-gray-200 p-4 mb-4 rounded-lg bg-gray-50 shadow-inner">
                {/* Top and bottom labels */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                  Window Side
                </div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                  Window Side
                </div>
                
                {/* Seat grid */}
                <div className="pt-8 pb-8">
                  {currentSeats.map((row, rowIndex) => (
                    <div key={`row-${rowIndex}`} className="flex justify-center mb-2">
                      {/* Insert feature elements for main deck */}
                      {currentDeck === 'main' && rowIndex === 4 && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
                          <div className="bg-white p-2 rounded-md border border-gray-300 shadow-md flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                              <path d="M3 2l18 24"></path>
                              <path d="M15 2L9 9h12l-8 11"></path>
                            </svg>
                            <span className="font-medium text-sm">Café</span>
                          </div>
                        </div>
                      )}
                      
                      {currentDeck === 'main' && rowIndex === 6 && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
                          <div className="bg-white p-2 rounded-md border border-gray-300 shadow-md flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                              <path d="M18 3v17h-6v-4"></path>
                              <path d="M6 3v17h6v-4"></path>
                              <path d="M6 14h18"></path>
                              <path d="M6 8h18"></path>
                            </svg>
                            <span className="font-medium text-sm">Stairs</span>
                          </div>
                        </div>
                      )}

                      {/* WC icon */}
                      {currentDeck === 'main' && rowIndex === 2 && (
                        <div className="absolute left-6 transform -translate-y-1 z-10">
                          <div className="bg-white p-2 rounded-md border border-gray-300 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                              <path d="M7 13h10v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"></path>
                              <path d="M7 13V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7"></path>
                              <path d="M12 2v4"></path>
                            </svg>
                          </div>
                        </div>
                      )}
                      
                      {/* Upper deck observation deck */}
                      {currentDeck === 'upper' && rowIndex === 5 && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
                          <div className="bg-white p-2 rounded-md border border-gray-300 shadow-md flex items-center space-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
                              <circle cx="12" cy="12" r="10"></circle>
                              <circle cx="12" cy="12" r="4"></circle>
                              <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                              <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                              <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                              <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                            </svg>
                            <span className="font-medium text-sm">Deck</span>
                          </div>
                        </div>
                      )}
                      
                      {row.map((seat, colIndex) => (
                        seat === null ? (
                          <div key={`empty-${rowIndex}-${colIndex}`} className="w-6 h-6 mx-1"></div>
                        ) : (
                          <div
                            key={seat.id}
                            className={`
                              w-6 h-6 mx-1 rounded-md cursor-pointer transition-all
                              flex items-center justify-center text-xs
                              ${seat.status === SEAT_STATUS.FULL ? 'bg-gray-400 opacity-80' : 
                                manualSeat && manualSeat.id === seat.id ? 'bg-amber-300 ring-2 ring-amber-500' :
                                'bg-green-400 hover:brightness-110'}
                              ${seat.status !== SEAT_STATUS.FULL ? 'hover:shadow-md transform hover:scale-105' : ''}
                            `}
                            onClick={() => handleSeatClick(seat)}
                            title={seat.id}
                          ></div>
                        )
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Deck selection buttons */}
              <div className="flex justify-between items-center mb-4">
                <div className="space-x-3">
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentDeck === 'main' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleDeckChange('main')}
                  >
                    Main Deck
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentDeck === 'upper' 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleDeckChange('upper')}
                  >
                    Upper Deck
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-700 transition-colors"
            onClick={toggleOpen}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Ticket summary component extension
const SeatSelectionBox = ({ tripType, onSeatSelected, selectedSeat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h3 className="font-medium text-blue-800 mb-2">
        {tripType === 'departure' ? 'Departure' : 'Return'} Seat Selection
      </h3>
      
      <div className="flex flex-col space-y-2">
        {selectedSeat ? (
          <div className="bg-white p-3 rounded border border-blue-200 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Selected Seat:</span>
              <div className="font-medium">{selectedSeat}</div>
            </div>
            <button 
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              onClick={toggleModal}
            >
              Change
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <button 
              className="flex-1 py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={toggleModal}
            >
              Select Seat
            </button>
          </div>
        )}
      </div>
      
      <FerrySeatSelection 
        tripType={tripType}
        onSeatSelected={onSeatSelected}
        isOpen={isModalOpen}
        toggleOpen={toggleModal}
        selectedSeat={selectedSeat}
      />
    </div>
  );
};

export { SeatSelectionBox };