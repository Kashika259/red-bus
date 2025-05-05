import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';

interface Seat {
  id: string;
  number: string;
  isAvailable: boolean;
  isLadiesSeat: boolean;
  isWindowSeat: boolean;
  deck: 'lower' | 'upper';
  price: number;
}

interface SeatLayoutProps {
  seats: Seat[];
  busType: string;
}

const SeatLayout: React.FC<SeatLayoutProps> = ({ seats, busType }) => {
  const [showTooltip, setShowTooltip] = useState('');
  const { bookingDetails, setBookingInfo } = useBooking();
  
  const lowerDeckSeats = seats.filter(seat => seat.deck === 'lower');
  const upperDeckSeats = seats.filter(seat => seat.deck === 'upper');
  
  const hasUpperDeck = upperDeckSeats.length > 0;
  
  // Check if a seat is selected
  const isSeatSelected = (seatId: string) => {
    return bookingDetails?.selectedSeats.includes(seatId) || false;
  };
  
  // Handle seat selection
  const handleSeatSelect = (seat: Seat) => {
    if (!seat.isAvailable) return;
    
    if (!bookingDetails) return;
    
    let newSelectedSeats;
    
    if (isSeatSelected(seat.id)) {
      // Deselect the seat
      newSelectedSeats = bookingDetails.selectedSeats.filter(id => id !== seat.id);
    } else {
      // Select the seat
      newSelectedSeats = [...bookingDetails.selectedSeats, seat.id];
    }
    
    setBookingInfo({
      selectedSeats: newSelectedSeats,
      totalAmount: newSelectedSeats.length * bookingDetails.fare,
    });
  };
  
  // Format a group of seats for display
  const renderSeatGroup = (seatsGroup: Seat[], title: string) => {
    // For sleeper buses
    if (busType.toLowerCase().includes('sleeper')) {
      return (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between mb-4">
              <div className="text-xs text-gray-500">Front</div>
              <div className="text-xs text-gray-500">Back</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {/* Left Side (Lower Berths) */}
              <div className="space-y-2">
                {seatsGroup
                  .filter(seat => parseInt(seat.number) % 3 === 1)
                  .map(seat => (
                    <div 
                      key={seat.id}
                      className={`
                        relative flex items-center justify-center rounded-md border-2 h-16 cursor-pointer transition-colors
                        ${seat.isAvailable 
                          ? isSeatSelected(seat.id) 
                            ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                            : seat.isLadiesSeat 
                              ? 'bg-pink-100 border-pink-300 hover:bg-pink-200' 
                              : 'bg-gray-100 border-gray-300 hover:bg-gray-200' 
                          : 'bg-gray-300 border-gray-400 cursor-not-allowed text-gray-500'
                        }
                      `}
                      onClick={() => handleSeatSelect(seat)}
                      onMouseEnter={() => setShowTooltip(seat.id)}
                      onMouseLeave={() => setShowTooltip('')}
                    >
                      <span className="font-medium">{seat.number}</span>
                      {showTooltip === seat.id && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
                          {seat.isWindowSeat ? 'Window Seat' : 'Aisle Seat'} • ₹{seat.price}
                          <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-gray-800"></div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              
              {/* Right Side (Upper Berths) */}
              <div className="space-y-2">
                {seatsGroup
                  .filter(seat => parseInt(seat.number) % 3 !== 1)
                  .map(seat => (
                    <div 
                      key={seat.id}
                      className={`
                        relative flex items-center justify-center rounded-md border-2 h-16 cursor-pointer transition-colors
                        ${seat.isAvailable 
                          ? isSeatSelected(seat.id) 
                            ? 'bg-[var(--primary)] text-white border-[var(--primary)]' 
                            : seat.isLadiesSeat 
                              ? 'bg-pink-100 border-pink-300 hover:bg-pink-200' 
                              : 'bg-gray-100 border-gray-300 hover:bg-gray-200' 
                          : 'bg-gray-300 border-gray-400 cursor-not-allowed text-gray-500'
                        }
                      `}
                      onClick={() => handleSeatSelect(seat)}
                      onMouseEnter={() => setShowTooltip(seat.id)}
                      onMouseLeave={() => setShowTooltip('')}
                    >
                      <span className="font-medium">{seat.number}</span>
                      {showTooltip === seat.id && (
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
                          {seat.isWindowSeat ? 'Window Seat' : 'Aisle Seat'} • ₹{seat.price}
                          <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-gray-800"></div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // For seater buses
    return (
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">{title}</h3>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between mb-4">
            <div className="text-xs text-gray-500">Front</div>
            <div className="text-xs text-gray-500">Back</div>
          </div>
          
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: Math.ceil(seatsGroup.length / 5) }).map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {seatsGroup.slice(rowIndex * 5, rowIndex * 5 + 5).map((seat, colIndex) => (
                  <div 
                    key={seat.id}
                    className={`
                      relative w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition-colors
                      ${seat.isAvailable 
                        ? isSeatSelected(seat.id) 
                          ? 'bg-[var(--primary)] text-white' 
                          : seat.isLadiesSeat 
                            ? 'bg-pink-100 hover:bg-pink-200' 
                            : 'bg-gray-100 hover:bg-gray-200' 
                        : 'bg-gray-300 cursor-not-allowed text-gray-500'
                      }
                      ${colIndex === 2 ? 'col-span-1 ml-4' : ''}
                    `}
                    onClick={() => handleSeatSelect(seat)}
                    onMouseEnter={() => setShowTooltip(seat.id)}
                    onMouseLeave={() => setShowTooltip('')}
                  >
                    <span className="text-sm font-medium">{seat.number}</span>
                    {showTooltip === seat.id && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 whitespace-nowrap">
                        {seat.isWindowSeat ? 'Window Seat' : 'Aisle Seat'} • ₹{seat.price}
                        <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 rotate-45 w-3 h-3 bg-gray-800"></div>
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Select Your Seats</h2>
        <div className="flex items-center">
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Seat Info
          </button>
        </div>
      </div>
      
      {/* Seat Legend */}
      <div className="bg-white p-3 rounded-md shadow-sm mb-6 flex flex-wrap gap-4">
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-100 rounded mr-2"></div>
          <span className="text-xs text-gray-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-gray-300 rounded mr-2"></div>
          <span className="text-xs text-gray-600">Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-[var(--primary)] rounded mr-2"></div>
          <span className="text-xs text-gray-600">Selected</span>
        </div>
        <div className="flex items-center">
          <div className="w-6 h-6 bg-pink-100 rounded mr-2"></div>
          <span className="text-xs text-gray-600">Ladies</span>
        </div>
      </div>
      
      {/* Lower Deck */}
      {renderSeatGroup(lowerDeckSeats, "Lower Deck")}
      
      {/* Upper Deck (if applicable) */}
      {hasUpperDeck && renderSeatGroup(upperDeckSeats, "Upper Deck")}
      
      {/* Selected Seats Info */}
      {bookingDetails && bookingDetails.selectedSeats.length > 0 && (
        <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Seats</h3>
          <div className="flex flex-wrap gap-2">
            {bookingDetails.selectedSeats.map(seatId => {
              const seat = seats.find(s => s.id === seatId);
              return (
                <div key={seatId} className="bg-[var(--primary)] text-white px-2 py-1 rounded text-sm">
                  {seat?.number || seatId}
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">Total: <span className="font-semibold">₹{bookingDetails.totalAmount}</span></p>
              <p className="text-xs text-gray-500">(incl. taxes & fees)</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;