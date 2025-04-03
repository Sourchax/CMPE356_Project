import React, { useState, useEffect, useMemo } from 'react';
import { 
  Anchor, Coffee, MapPin, Info, X, ChevronDown, Check, 
  Navigation, Compass, Ship, ArrowRightCircle, PanelTop, 
  AlertCircle, ChevronRight, Star, Zap, DollarSign
} from 'lucide-react';

// Import new components
import FastFerrySeatMap, { generateFastFerrySeats } from './FastFerrySeatMap';
import SeabusSeatMap, { generateSeabusSeats } from './SeabusSeatMap';

// SailMate color palette constants
const COLORS = {
  primary: '#0D3A73',    // Navy Blue
  secondary: '#06AED5',  // Light Blue
  accent: '#F0C808',     // Yellow
  success: '#D1FFD7',    // Soft Green
  danger: '#F05D5E'      // Coral Red
};

// Ferry types
const FERRY_TYPES = {
  FAST_FERRY: 'fastFerry',
  SEABUS: 'seabus'
};

// Ticket classes
const TICKET_CLASSES = {
  PROMO: 'promo',
  ECON: 'econ',
  BUSINESS: 'business'
};

// Seat status constants
const SEAT_STATUS = {
  OCCUPIED: 'occupied',
  AVAILABLE: 'available',
  SELECTED: 'selected',
  RESTRICTED: 'restricted' // For seats not available for the current ticket class
};

const FerrySeatSelection = ({ 
  tripType, 
  onSeatSelected,
  isOpen,
  toggleOpen,
  selectedSeat,
  ferryType = FERRY_TYPES.FAST_FERRY, // Default to fast ferry
  ticketClass = TICKET_CLASSES.ECON,  // Default to economy
  passengerCount = 1 // Add passengerCount parameter with default value
}) => {
  const [selectionMode, setSelectionMode] = useState('auto');
  const [showSeatMap, setShowSeatMap] = useState(false);
  const [currentDeck, setCurrentDeck] = useState('main');
  // Replace single manualSeat with array of selected seats
  const [selectedSeats, setSelectedSeats] = useState([]);
  // Track the current passenger whose seat is being selected
  const [currentPassenger, setCurrentPassenger] = useState(0);
  const [mainDeckSeats, setMainDeckSeats] = useState([]);
  const [upperDeckSeats, setUpperDeckSeats] = useState([]);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [zoom, setZoom] = useState(1);
  
  // Normalize ticketClass to ensure it uses the enum values
  const normalizedTicketClass = useMemo(() => {
    if (typeof ticketClass === 'string') {
      switch(ticketClass.toLowerCase()) {
        case 'business': return TICKET_CLASSES.BUSINESS;
        case 'promo': return TICKET_CLASSES.PROMO;
        case 'econ':
        case 'economy': 
        default: return TICKET_CLASSES.ECON;
      }
    }
    return ticketClass;
  }, [ticketClass]);
  
  // Initialize selectedSeats array when component mounts or passengerCount changes
  useEffect(() => {
    // If there's a single selected seat as a string, convert it to array format
    if (typeof selectedSeat === 'string' && selectedSeat && selectedSeats.length === 0) {
      setSelectedSeats([{ seat: selectedSeat, passengerIndex: 0 }]);
    } 
    // If we need more seats in the array, initialize them
    else if (selectedSeats.length < passengerCount) {
      const newSeats = [...selectedSeats];
      for (let i = selectedSeats.length; i < passengerCount; i++) {
        newSeats.push({ seat: "", passengerIndex: i });
      }
      setSelectedSeats(newSeats);
    }
  }, [passengerCount, selectedSeat, selectedSeats.length]);
  
  // Generate seat data for both decks using useMemo to avoid unnecessary recalculations
  const { mainDeckSeats: memoMainDeckSeats, upperDeckSeats: memoUpperDeckSeats } = useMemo(() => {
    // Use a deterministic pattern for seat status
    const getSeatStatus = (row, col, deckType, seatClass) => {
      // Check if seat is already selected by another passenger
      const seatId = `${deckType === 'main' ? 'M' : 'U'}${row}-${col}`;
      const seatWithDeck = `${seatId} (${deckType === 'main' ? 'Main Deck' : 'Upper Deck'})`;
      
      const isAlreadySelected = selectedSeats.some(selected => 
        selected.seat === seatWithDeck && selected.passengerIndex !== currentPassenger
      );
      
      if (isAlreadySelected) {
        return SEAT_STATUS.OCCUPIED;
      }
      
      // Using a deterministic pattern based on seat position
      // Use a lower threshold (>85 instead of >80) to make fewer seats occupied
      const seed = (row * 31 + col * 17) % 100;
      
      // For Fast Ferry: Business class seats are in the front (rows 1-2)
      if (ferryType === FERRY_TYPES.FAST_FERRY) {
        // Business class seats - front rows
        const isBusinessSeat = (deckType === 'main' && row <= 2) || 
                               (deckType === 'upper' && row <= 1);
        
        // For business seats, check if user has business ticket
        if (isBusinessSeat && normalizedTicketClass !== TICKET_CLASSES.BUSINESS) {
          return SEAT_STATUS.RESTRICTED;
        }
        
        // For economy seats, check if user has business ticket
        if (!isBusinessSeat && normalizedTicketClass === TICKET_CLASSES.BUSINESS) {
          // Business class passengers can ONLY select business class seats
          return SEAT_STATUS.RESTRICTED;
        }
      } 
      // For Seabus: Business class seats are on the upper deck
      else if (ferryType === FERRY_TYPES.SEABUS) {
        // Business class seats are on the upper deck
        const isBusinessSeat = deckType === 'upper';
        
        // For business seats, check if user has business ticket
        if (isBusinessSeat && normalizedTicketClass !== TICKET_CLASSES.BUSINESS) {
          return SEAT_STATUS.RESTRICTED;
        }
        
        // Business class passengers can ONLY select business class seats
        if (!isBusinessSeat && normalizedTicketClass === TICKET_CLASSES.BUSINESS) {
          return SEAT_STATUS.RESTRICTED;
        }
      }
      
      // Default randomized availability - Make more seats available
      return seed > 85 ? SEAT_STATUS.OCCUPIED : SEAT_STATUS.AVAILABLE;
    };
    
    // Generate ferry-specific seat layouts
    if (ferryType === FERRY_TYPES.FAST_FERRY) {
      return generateFastFerrySeats(getSeatStatus);
    } else {
      return generateSeabusSeats(getSeatStatus);
    }
  }, [ferryType, normalizedTicketClass, selectedSeats, currentPassenger]);
  
  // Update seat states from memoized values when they change
  useEffect(() => {
    setMainDeckSeats(memoMainDeckSeats);
    setUpperDeckSeats(memoUpperDeckSeats);
  }, [memoMainDeckSeats, memoUpperDeckSeats]);
  
  // Get current deck seats
  const currentSeats = currentDeck === 'main' ? mainDeckSeats : upperDeckSeats;
  
  // Get available seats across both decks for auto-selection
  const availableSeats = useMemo(() => {
    const seats = [];
    
    // Helper function to collect available seats from a deck
    const collectAvailableSeats = (deck) => {
      deck.forEach(row => {
        row.forEach(seat => {
          if (seat && seat.status === SEAT_STATUS.AVAILABLE) {
            seats.push(seat);
          }
        });
      });
    };
    
    collectAvailableSeats(mainDeckSeats);
    collectAvailableSeats(upperDeckSeats);
    
    return seats;
  }, [mainDeckSeats, upperDeckSeats]);
  
  const handleSeatClick = (seat) => {
    if (!seat || seat.status === SEAT_STATUS.OCCUPIED || seat.status === SEAT_STATUS.RESTRICTED) return;
    
    const seatWithDeck = `${seat.id} (${seat.deck === 'main' ? 'Main Deck' : 'Upper Deck'})`;
    
    // Update the selected seat for the current passenger
    const updatedSeats = [...selectedSeats];
    updatedSeats[currentPassenger] = { 
      seat: seatWithDeck, 
      passengerIndex: currentPassenger 
    };
    
    setSelectedSeats(updatedSeats);
    
    // Create a formatted string of all selected seats to pass to the parent component
    const formattedSeats = updatedSeats
      .map((s, index) => `Passenger ${index + 1}: ${s.seat || "Not selected"}`)
      .join(" | ");
    
    onSeatSelected(formattedSeats);
    
    // Auto-advance to next passenger if there are more
    if (currentPassenger < passengerCount - 1) {
      setCurrentPassenger(currentPassenger + 1);
    }
  };
  
  const handleDeckChange = (deck) => {
    setCurrentDeck(deck);
  };
  
  const handleModeChange = (mode) => {
    setSelectionMode(mode);
    if (mode === 'auto') {
      // Auto-select seats for all passengers
      const newSelectedSeats = [];
      
      // Try to find available seats for each passenger
      for (let i = 0; i < passengerCount; i++) {
        // Filter out seats already selected for other passengers
        const alreadySelected = newSelectedSeats.map(s => s.seat);
        
        // Get available seats that haven't been selected yet
        const availableForThisPassenger = availableSeats.filter(seat => {
          const seatWithDeck = `${seat.id} (${seat.deck === 'main' ? 'Main Deck' : 'Upper Deck'})`;
          return !alreadySelected.includes(seatWithDeck);
        });
        
        if (availableForThisPassenger.length > 0) {
          // Use a deterministic selection based on passenger index
          const index = (i * 5) % availableForThisPassenger.length;
          const selectedSeat = availableForThisPassenger[index];
          const seatWithDeck = `${selectedSeat.id} (${selectedSeat.deck === 'main' ? 'Main Deck' : 'Upper Deck'})`;
          
          newSelectedSeats.push({
            seat: seatWithDeck,
            passengerIndex: i
          });
        } else {
          // No available seat for this passenger
          newSelectedSeats.push({
            seat: "",
            passengerIndex: i
          });
        }
      }
      
      setSelectedSeats(newSelectedSeats);
      
      // Create a formatted string of all selected seats
      const formattedSeats = newSelectedSeats
        .map((s, index) => `Passenger ${index + 1}: ${s.seat || "Not selected"}`)
        .join(" | ");
      
      onSeatSelected(formattedSeats);
      
      setShowSeatMap(false);
    } else {
      setShowSeatMap(true);
    }
  };
  
  const handlePassengerChange = (index) => {
    setCurrentPassenger(index);
  };
  
  const handleConfirm = () => {
    toggleOpen();
  };
  
  // Get the currently selected seat for the current passenger
  const getCurrentSeat = () => {
    if (selectedSeats[currentPassenger]) {
      return selectedSeats[currentPassenger].seat;
    }
    return "";
  };
  
  // Check if a seat is selected by the current passenger
  const isSeatSelectedByCurrentPassenger = (seatId, deck) => {
    const seatWithDeck = `${seatId} (${deck === 'main' ? 'Main Deck' : 'Upper Deck'})`;
    return selectedSeats[currentPassenger]?.seat === seatWithDeck;
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transform transition-transform duration-300 ease-out border border-gray-200">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 rounded-t-lg flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Ship size={18} className="text-blue-300" />
            <h3 className="text-base font-medium">
              {tripType === 'departure' ? 'Departure' : 'Return'} Seat Selection
            </h3>
          </div>
          <button 
            onClick={toggleOpen}
            className="text-gray-300 hover:text-white transition-colors duration-200 rounded-full hover:bg-white/10 p-1.5"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5">
          {/* Selection Mode */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
              <button
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-center ${
                  selectionMode === 'auto' 
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700' 
                    : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                }`}
                onClick={() => handleModeChange('auto')}
              >
                <ArrowRightCircle size={16} className="mr-2" />
                Automatic Selection
              </button>
              <button
                className={`px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out flex items-center justify-center ${
                  selectionMode === 'manual' 
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-700'
                    : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                }`}
                onClick={() => handleModeChange('manual')}
              >
                <MapPin size={16} className="mr-2" />
                Manual Selection
              </button>
            </div>
            
            {/* Passenger Selection Tabs */}
            {passengerCount > 1 && (
              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Select seat for:
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: passengerCount }).map((_, index) => (
                    <button
                      key={index}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
                        currentPassenger === index
                          ? 'bg-blue-600 text-white'
                          : selectedSeats[index]?.seat
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => handlePassengerChange(index)}
                    >
                      Passenger {index + 1} {selectedSeats[index]?.seat ? '✓' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Selected Seat Info */}
            {getCurrentSeat() && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-slate-700 flex items-center animate-fadeIn">
                <Anchor size={16} className="mr-2 text-blue-600" />
                <span className="text-sm">
                  {passengerCount > 1 ? `Passenger ${currentPassenger + 1} seat: ` : 'Selected seat: '}
                  <strong>{getCurrentSeat()}</strong>
                </span>
              </div>
            )}
          </div>
          
          {/* Seat Map */}
          {showSeatMap && (
            <>
              {/* Seat Legend */}
              <div className="flex flex-wrap gap-4 items-center mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#F05D5E] rounded mr-2"></div>
                  <span className="text-xs text-gray-700">Occupied</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#D1FFD7] rounded mr-2"></div>
                  <span className="text-xs text-gray-700">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-[#F0C808] rounded mr-2 ring-1 ring-[#0D3A73]"></div>
                  <span className="text-xs text-gray-700">Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
                  <span className="text-xs text-gray-700">Restricted</span>
                </div>
                {ferryType === FERRY_TYPES.FAST_FERRY && (
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#D1FFD7] rounded mr-2 ring-1 ring-[#F0C808]"></div>
                    <span className="text-xs text-gray-700 flex items-center">
                      <Star size={10} className="text-[#F0C808] mr-1" />
                      Business
                    </span>
                  </div>
                )}
              </div>
              
              {/* Ferry Shape Outline */}
              <div className="relative border-2 border-[#0D3A73] rounded-2xl p-4 mb-6 bg-blue-50 shadow-inner mx-auto max-w-3xl overflow-hidden">
                {/* Ship Hull Shape */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 left-0 right-0 h-8 bg-[#0D3A73]/5 rounded-t-2xl"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#0D3A73]/5 rounded-b-2xl"></div>
                </div>
                
                {/* Water Animation */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#06AED5]/30"></div>
                
                {/* Ferry Type Label */}
                <div className="absolute top-2 left-2 z-10">
                  <div className="bg-[#0D3A73] text-white px-3 py-1.5 text-xs font-medium rounded-md shadow-sm flex items-center">
                    <Ship size={12} className="mr-1.5 text-[#06AED5]" />
                    {ferryType === FERRY_TYPES.FAST_FERRY ? 'Fast Ferry' : 'Seabus'}
                </div>
                </div>
                
                {/* Ticket Class Indicator */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10">
                  <div className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-sm flex items-center
                    ${normalizedTicketClass === TICKET_CLASSES.BUSINESS 
                      ? 'bg-[#F0C808] text-[#0D3A73]' 
                      : 'bg-white text-[#0D3A73] border border-[#06AED5]/20'}`}>
                    {normalizedTicketClass === TICKET_CLASSES.BUSINESS ? (
                      <>
                        <Star size={12} className="mr-1.5" />
                        Business Class Only
                      </>
                    ) : normalizedTicketClass === TICKET_CLASSES.ECON ? (
                      <>
                        <DollarSign size={12} className="mr-1.5" />
                        Economy Class
                      </>
                    ) : (
                      <>
                        <Zap size={12} className="mr-1.5" />
                        Promo Class
                      </>
                    )}
                  </div>
                </div>

                {/* Current Passenger Indicator */}
                {passengerCount > 1 && (
                  <div className="absolute top-2 right-24 z-10">
                    <div className="bg-blue-500 text-white px-3 py-1.5 text-xs font-medium rounded-md shadow-sm">
                      Selecting for Passenger {currentPassenger + 1}
                          </div>
                        </div>
                      )}
                      
                {/* Deck Label */}
                <div className="absolute top-2 right-2 z-10">
                  <div className="bg-[#0D3A73] text-white px-3 py-1.5 text-xs font-medium rounded-md shadow-sm">
                  {currentDeck === 'main' ? 'MAIN DECK' : 'UPPER DECK'}
                          </div>
                        </div>
                
                {/* Ferry Direction Labels */}
                <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs text-[#0D3A73] bg-white px-2.5 py-0.5 rounded-full shadow-sm border border-[#06AED5]/20 flex items-center">
                  <Navigation size={11} className="mr-1" />
                  <span className="text-xs font-medium">Bow</span>
                          </div>
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-[#0D3A73] bg-white px-2.5 py-0.5 rounded-full shadow-sm border border-[#06AED5]/20 flex items-center">
                  <Navigation size={11} className="mr-1 transform rotate-180" />
                  <span className="text-xs font-medium">Stern</span>
                </div>

                {/* Render appropriate seat map based on ferry type */}
                {ferryType === FERRY_TYPES.FAST_FERRY ? (
                  <FastFerrySeatMap
                    currentDeck={currentDeck}
                    currentSeats={currentSeats}
                    manualSeat={selectedSeats.find(s => s.passengerIndex === currentPassenger)}
                    handleSeatClick={handleSeatClick}
                    zoom={zoom}
                  />
                ) : (
                  <SeabusSeatMap
                    currentDeck={currentDeck}
                    currentSeats={currentSeats}
                    manualSeat={selectedSeats.find(s => s.passengerIndex === currentPassenger)}
                    handleSeatClick={handleSeatClick}
                    zoom={zoom}
                  />
                )}
              </div>
              
              {/* Deck Selection Tabs */}
              <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="flex space-x-2">
                  <button 
                    className={`px-3.5 py-2 rounded-md text-xs font-medium transition-all duration-150 ease-out flex items-center ${
                      currentDeck === 'main' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleDeckChange('main')}
                  >
                    <Ship size={14} className="mr-1.5" />
                    Main Deck
                  </button>
                  <button 
                    className={`px-3.5 py-2 rounded-md text-xs font-medium transition-all duration-150 ease-out flex items-center ${
                      currentDeck === 'upper' 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'bg-gray-100 text-slate-700 hover:bg-gray-200'
                    }`}
                    onClick={() => handleDeckChange('upper')}
                  >
                    <Ship size={14} className="mr-1.5" />
                    Upper Deck
                  </button>
                </div>
                
                <div className="mt-2 sm:mt-0 flex items-center text-xs text-slate-600">
                  <Info size={12} className="mr-1" />
                  <span>Click on a seat to select it</span>
                </div>
              </div>
            </>
          )}
          
          {/* Selection Helper */}
          {!showSeatMap && selectionMode === 'auto' && (
            <div className="bg-emerald-50 p-3 rounded-md border border-emerald-500/20 text-sm text-gray-700 mb-6">
              <div className="flex items-start">
                <Info size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <p className="text-xs">We've automatically selected seats for all passengers. To choose different seats, please switch to Manual Selection.</p>
              </div>
            </div>
          )}
          
          {/* Selected Seats Summary */}
          {passengerCount > 1 && (
            <div className="mb-6 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Seat Summary:</h3>
              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedSeats.map((selectedSeat, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded ${
                        selectedSeat.seat 
                          ? 'bg-green-50 border border-green-200' 
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <div className="text-xs font-medium">Passenger {index + 1}:</div>
                      <div className="text-sm mt-1">{selectedSeat.seat || "Not selected"}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg flex justify-between items-center">
          <button
            className="text-slate-600 hover:text-slate-900 transition-colors px-3.5 py-2 rounded-md text-sm font-medium flex items-center"
            onClick={toggleOpen}
          >
            <X size={14} className="mr-1.5" />
            Cancel
          </button>
          
          <button
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-5 py-2 rounded-md shadow-sm transition-colors text-sm font-medium flex items-center"
            onClick={handleConfirm}
          >
            <Check size={14} className="mr-1.5" />
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

// Ticket summary component extension
const SeatSelectionBox = ({ 
  tripType, 
  onSeatSelected, 
  selectedSeat,
  ferryType = FERRY_TYPES.FAST_FERRY,
  ticketClass = TICKET_CLASSES.ECON,
  passengerCount = 1 // Add passengerCount prop with default value
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Normalize ticketClass to ensure it uses the enum values
  const normalizedTicketClass = useMemo(() => {
    if (typeof ticketClass === 'string') {
      switch(ticketClass.toLowerCase()) {
        case 'business': return TICKET_CLASSES.BUSINESS;
        case 'promo': return TICKET_CLASSES.PROMO;
        case 'econ':
        case 'economy': 
        default: return TICKET_CLASSES.ECON;
      }
    }
    return ticketClass;
  }, [ticketClass]);
  
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  
  // Parse the selectedSeat string to extract individual seat information
  const parsedSeats = useMemo(() => {
    if (!selectedSeat) return [];
    
    // If it's a single seat (old format)
    if (!selectedSeat.includes('Passenger')) {
      return [{ seat: selectedSeat, passengerIndex: 0 }];
    }
    
    // If it's the new format with multiple passengers
    return selectedSeat.split(' | ').map((seatInfo, index) => {
      const match = seatInfo.match(/Passenger \d+: (.+)/);
      return {
        seat: match ? match[1] : "",
        passengerIndex: index
      };
    });
  }, [selectedSeat]);
  
  // Count how many seats are selected
  const selectedCount = parsedSeats.filter(s => s.seat && s.seat !== "Not selected").length;
  
  return (
    <div className="mt-3 p-5 bg-gradient-to-br from-white to-slate-50 rounded-xl border border-[#06AED5]/20 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-[#0D3A73] flex items-center text-sm">
          <Anchor size={18} className="mr-2.5 text-[#06AED5]" strokeWidth={2.5} />
          {tripType === 'departure' ? 'Departure' : 'Return'} Seats
      </h3>
        
        <div className="flex items-center">
          <div className={`text-xs px-2 py-1 rounded-md ${
            ferryType === FERRY_TYPES.FAST_FERRY 
              ? 'bg-blue-100 text-[#0D3A73]' 
              : 'bg-green-100 text-green-800'
          }`}>
            <Ship size={12} className="inline mr-1" />
            {ferryType === FERRY_TYPES.FAST_FERRY ? 'Fast Ferry' : 'Seabus'}
          </div>
          
          <div className={`ml-2 text-xs px-2 py-1 rounded-md ${
            normalizedTicketClass === TICKET_CLASSES.BUSINESS 
              ? 'bg-[#F0C808] text-[#0D3A73]' 
              : normalizedTicketClass === TICKET_CLASSES.ECON
                ? 'bg-blue-100 text-blue-800'
                : 'bg-purple-100 text-purple-800'
          }`}>
            {normalizedTicketClass === TICKET_CLASSES.BUSINESS ? (
              <>
                <Star size={12} className="inline mr-1" />
                Business
              </>
            ) : normalizedTicketClass === TICKET_CLASSES.ECON ? (
              <>
                <DollarSign size={12} className="inline mr-1" />
                Economy
              </>
            ) : (
              <>
                <Zap size={12} className="inline mr-1" />
                Promo
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col space-y-3">
        {selectedSeat ? (
          <div className="bg-white p-4 rounded-lg border border-[#06AED5]/20 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-slate-500">
                Selected {passengerCount > 1 ? 'Seats' : 'Seat'}:
              </span>
            <button 
                className="px-3 py-1.5 text-xs font-semibold bg-[#06AED5] text-white rounded-lg hover:bg-[#06AED5]/90 transition-all duration-200 shadow-sm flex items-center gap-1.5 group"
              onClick={toggleModal}
            >
              Change
                <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            </div>
            
            {passengerCount > 1 ? (
              <div className="grid grid-cols-1 gap-2 mt-2">
                {parsedSeats.map((seatInfo, index) => (
                  <div key={index} className="flex justify-between text-sm border-b pb-2 last:border-b-0">
                    <span className="font-medium">Passenger {index + 1}:</span>
                    <span className="text-[#0D3A73]">{seatInfo.seat || "Not selected"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-bold text-[#0D3A73] text-base mt-1">{selectedSeat}</div>
            )}
          </div>
        ) : (
            <button 
            className="w-full py-3 px-4 bg-[#F0C808] text-[#0D3A73] text-sm font-medium rounded-lg hover:bg-[#F0C808]/90 
                    transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 group"
              onClick={toggleModal}
            >
            <span className="relative">
              <MapPin size={18} className="transition-transform duration-200 group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#F05D5E] rounded-full animate-pulse"></span>
            </span>
            <span className="font-semibold">Select Your {passengerCount > 1 ? 'Seats' : 'Seat'}</span>
            </button>
        )}
      </div>
      
      {!selectedSeat && (
        <div className="mt-3 flex items-center p-2.5 bg-amber-50 rounded-lg text-xs text-[#0D3A73] border border-[#F0C808]">
          <AlertCircle size={14} className="mr-2 flex-shrink-0 text-[#F0C808]" />
          <span className="font-medium">Please select {passengerCount > 1 ? 'seats' : 'a seat'} to continue</span>
        </div>
      )}
      
      {passengerCount > 1 && selectedSeat && selectedCount < passengerCount && (
        <div className="mt-3 flex items-center p-2.5 bg-amber-50 rounded-lg text-xs text-[#0D3A73] border border-[#F0C808]">
          <AlertCircle size={14} className="mr-2 flex-shrink-0 text-[#F0C808]" />
          <span className="font-medium">You've selected {selectedCount} of {passengerCount} required seats</span>
        </div>
      )}
      
      <FerrySeatSelection 
        tripType={tripType}
        onSeatSelected={onSeatSelected}
        isOpen={isModalOpen}
        toggleOpen={toggleModal}
        selectedSeat={selectedSeat}
        ferryType={ferryType}
        ticketClass={normalizedTicketClass}
        passengerCount={passengerCount} // Pass the passengerCount
      />
    </div>
  );
};

export { SeatSelectionBox, FERRY_TYPES, TICKET_CLASSES };
export default FerrySeatSelection;