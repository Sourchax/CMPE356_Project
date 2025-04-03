import React from 'react';
import { Coffee, Star, PanelTop, Compass, Check } from 'lucide-react';

// Seat status constants
const SEAT_STATUS = {
  OCCUPIED: 'occupied',
  AVAILABLE: 'available',
  SELECTED: 'selected',
  RESTRICTED: 'restricted'
};

// Ticket classes
const TICKET_CLASSES = {
  PROMO: 'promo',
  ECON: 'econ',
  BUSINESS: 'business'
};

const FastFerrySeatMap = ({ 
  currentDeck, 
  currentSeats, 
  manualSeat, 
  handleSeatClick,
  zoom
}) => {
  // Helper function to check if a seat is selected
  const isSeatSelected = (seat) => {
    const seatWithDeck = `${seat.id} (${seat.deck === 'main' ? 'Main Deck' : 'Upper Deck'})`;
    return manualSeat && manualSeat.seat === seatWithDeck;
  };

  return (
    <div className="pt-16 pb-10 transform origin-center" style={{ transform: `scale(${zoom})` }}>
      {currentSeats.map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="flex justify-center mb-1.5 sm:mb-2 relative">
          {/* Row-specific features */}
          {renderRowFeatures(currentDeck, rowIndex)}
          
          {/* Seat Row */}
          {row.map((seat, colIndex) => (
            seat === null ? (
              <div key={`empty-${rowIndex}-${colIndex}`} className="w-5 h-5 sm:w-6 sm:h-6 mx-0.5"></div>
            ) : (
              <button
                key={seat.id}
                disabled={seat.status === SEAT_STATUS.OCCUPIED || seat.status === SEAT_STATUS.RESTRICTED}
                className={`
                  relative w-5 h-5 sm:w-6 sm:h-6 mx-0.5 rounded 
                  transition-all duration-150 ease-out 
                  flex items-center justify-center text-xs outline-none
                  ${
                    seat.status === SEAT_STATUS.OCCUPIED ? 'bg-[#F05D5E] cursor-not-allowed opacity-80' : 
                    seat.status === SEAT_STATUS.RESTRICTED ? 'bg-gray-300 cursor-not-allowed opacity-70' :
                    isSeatSelected(seat) ? 'bg-[#F0C808] ring-1 ring-[#0D3A73] z-10 shadow-sm' :
                    seat.class === 'business' ? 'bg-[#D1FFD7] ring-1 ring-[#F0C808] hover:bg-[#D1FFD7]/80 active:bg-[#F0C808] cursor-pointer' :
                    'bg-[#D1FFD7] hover:bg-[#D1FFD7]/80 active:bg-[#F0C808] cursor-pointer'
                  }
                  ${seat.status !== SEAT_STATUS.OCCUPIED && seat.status !== SEAT_STATUS.RESTRICTED ? 
                    'hover:shadow hover:scale-110' : ''}
                `}
                onClick={() => handleSeatClick(seat)}
                title={`${seat.id} (${seat.class === 'business' ? 'Business Class' : 'Economy Class'})`}
                aria-label={`Seat ${seat.id}, ${
                  seat.status === SEAT_STATUS.OCCUPIED ? 'Occupied' : 
                  seat.status === SEAT_STATUS.RESTRICTED ? 'Not available for your ticket class' :
                  'Available'
                }, ${seat.class === 'business' ? 'Business Class' : 'Economy Class'}`}
              >
                {isSeatSelected(seat) && (
                  <Check size={14} className="text-[#0D3A73]" />
                )}
                {seat.class === 'business' && seat.status !== SEAT_STATUS.OCCUPIED && seat.status !== SEAT_STATUS.RESTRICTED && !isSeatSelected(seat) && (
                  <Star size={8} className="text-[#F0C808]" />
                )}
              </button>
            )
          ))}
        </div>
      ))}
    </div>
  );
};

// Helper function to render features for each row
function renderRowFeatures(deck, rowIndex) {
  if (deck === 'main') {
    // Business Class Label (Rows 1-2)
    if (rowIndex === 0) {
      return (
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-[#F0C808] p-1.5 rounded-r-md shadow-sm flex items-center">
            <Star size={12} className="mr-1 text-[#0D3A73]" />
            <span className="font-medium text-xs text-[#0D3A73]">Business Class</span>
          </div>
        </div>
      );
    }
    
    // WC on row 3
    if (rowIndex === 2) {
      return (
        <>
          {/* Left WC */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <div className="bg-white p-1.5 rounded-md border border-[#06AED5] shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#06AED5]">
                <path d="M7 13h10v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"></path>
                <path d="M7 13V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7"></path>
                <path d="M12 2v4"></path>
              </svg>
            </div>
          </div>
          
          {/* Economy Label */}
          <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 z-10">
            <div className="bg-white p-1.5 rounded-r-md border-y border-r border-[#06AED5] shadow-sm flex items-center">
              <span className="font-medium text-xs text-[#0D3A73]">Economy</span>
            </div>
          </div>
        </>
      );
    }
    
    // Café in the middle (Row 6)
    if (rowIndex === 5) {
      return (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white p-1.5 rounded-md border border-[#06AED5] shadow-sm flex items-center">
            <Coffee size={14} className="mr-1 text-[#06AED5]" />
            <span className="font-medium text-xs text-[#0D3A73]">Café</span>
          </div>
        </div>
      );
    }
    
    // Stairs (Row 7)
    if (rowIndex === 6) {
      return (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white p-1.5 rounded-md border border-[#06AED5] shadow-sm flex items-center">
            <PanelTop size={14} className="mr-1 text-[#06AED5]" />
            <span className="font-medium text-xs text-[#0D3A73]">Stairs</span>
          </div>
        </div>
      );
    }
  } 
  else if (deck === 'upper') {
    // Business Class Label (Row 1)
    if (rowIndex === 0) {
      return (
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-[#F0C808] p-1.5 rounded-r-md shadow-sm flex items-center">
            <Star size={12} className="mr-1 text-[#0D3A73]" />
            <span className="font-medium text-xs text-[#0D3A73]">Business Class</span>
          </div>
        </div>
      );
    }
    
    // Economy Label (Row 2)
    if (rowIndex === 1) {
      return (
        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 z-10">
          <div className="bg-white p-1.5 rounded-r-md border-y border-r border-[#06AED5] shadow-sm flex items-center">
            <span className="font-medium text-xs text-[#0D3A73]">Economy</span>
          </div>
        </div>
      );
    }
    
    // Observation Deck (Row 5)
    if (rowIndex === 4) {
      return (
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white p-1.5 rounded-md border border-[#06AED5] shadow-sm flex items-center">
            <Compass size={14} className="mr-1 text-[#06AED5]" />
            <span className="font-medium text-xs text-[#0D3A73]">Observation Deck</span>
          </div>
        </div>
      );
    }
  }
  
  return null;
}

// Function to generate seats for Fast Ferry
export function generateFastFerrySeats(getSeatStatus) {
  const mainDeck = [];
  const upperDeck = [];
  
  // Row 1-2 (Business Class - Front rows)
  for (let r = 0; r < 2; r++) {
    const row = Array(16).fill().map((_, i) => ({
      id: `M${r+1}-${i+1}`,
      status: getSeatStatus(r+1, i+1, 'main', 'business'),
      position: [r+1, i+1],
      deck: 'main',
      class: 'business'
    }));
    mainDeck.push(row);
  }
  
  // Row 3-5 (Economy Class)
  for (let r = 0; r < 3; r++) {
      const row = Array(20).fill().map((_, i) => ({
      id: `M${r+3}-${i+1}`,
      status: getSeatStatus(r+3, i+1, 'main', 'economy'),
      position: [r+3, i+1],
      deck: 'main',
      class: 'economy'
    }));
    mainDeck.push(row);
  }
  
  // Row 6-7 (Economy with café in middle)
    for (let r = 0; r < 2; r++) {
      const row = [];
      // Left side
      for (let i = 0; i < 8; i++) {
        row.push({
        id: `M${r+6}-${i+1}`,
        status: getSeatStatus(r+6, i+1, 'main', 'economy'),
        position: [r+6, i+1],
        deck: 'main',
        class: 'economy'
        });
      }
      
      // Middle (café space) - add 4 empty spaces
      for (let i = 0; i < 4; i++) {
        row.push(null);
      }
      
      // Right side
      for (let i = 0; i < 8; i++) {
        row.push({
        id: `M${r+6}-${i+13}`,
        status: getSeatStatus(r+6, i+13, 'main', 'economy'),
        position: [r+6, i+13],
        deck: 'main',
        class: 'economy'
      });
    }
    mainDeck.push(row);
  }
  
  // Row 8 (Bottom row - Economy)
  const row8 = Array(16).fill().map((_, i) => ({
    id: `M8-${i+1}`,
    status: getSeatStatus(8, i+1, 'main', 'economy'),
    position: [8, i+1],
    deck: 'main',
    class: 'economy'
  }));
  mainDeck.push(row8);
  
  // Upper Deck - Row 1 (Business Class)
  const upperRow1 = Array(12).fill().map((_, i) => ({
    id: `U1-${i+1}`,
    status: getSeatStatus(1, i+1, 'upper', 'business'),
    position: [1, i+1],
    deck: 'upper',
    class: 'business'
  }));
  upperDeck.push(upperRow1);
  
  // Upper Deck - Rows 2-7 (Economy Class)
  for (let r = 1; r < 7; r++) {
    const row = r < 4 ? 
      // Rows 2-4: Full rows
      Array(18).fill().map((_, i) => ({
        id: `U${r+1}-${i+1}`,
        status: getSeatStatus(r+1, i+1, 'upper', 'economy'),
        position: [r+1, i+1],
        deck: 'upper',
        class: 'economy'
      })) :
      // Rows 5-7: Rows with observation deck in middle
      (() => {
        const rowArr = [];
        // Left side
        for (let i = 0; i < 6; i++) {
          rowArr.push({
            id: `U${r+1}-${i+1}`,
            status: getSeatStatus(r+1, i+1, 'upper', 'economy'),
            position: [r+1, i+1],
            deck: 'upper',
            class: 'economy'
          });
        }
        
        // Middle (observation deck) - add 6 empty spaces
        for (let i = 0; i < 6; i++) {
          rowArr.push(null);
        }
        
        // Right side
        for (let i = 0; i < 6; i++) {
          rowArr.push({
            id: `U${r+1}-${i+13}`,
            status: getSeatStatus(r+1, i+13, 'upper', 'economy'),
            position: [r+1, i+13],
            deck: 'upper',
            class: 'economy'
          });
        }
        return rowArr;
      })();
    
    upperDeck.push(row);
  }
  
  return { mainDeckSeats: mainDeck, upperDeckSeats: upperDeck };
}

export default FastFerrySeatMap; 