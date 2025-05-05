import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, AlertCircle ,ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import SeatLayout from '../components/booking/SeatLayout';
import PassengerForm from '../components/booking/PassengerForm';
import { useBooking } from '../contexts/BookingContext';
import { mockBusData } from '../data/mockBusData';
import { mockSeatData } from '../data/mockSeatData';

const SeatSelection: React.FC = () => {
  const { busId } = useParams<{ busId: string }>();
  const { bookingDetails, setBookingInfo } = useBooking();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [busDetails, setBusDetails] = useState<any>(null);
  const [seats, setSeats] = useState<any[]>([]);
  const [currentPassengerSeat, setCurrentPassengerSeat] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate API call to get bus details
    setLoading(true);
    
    setTimeout(() => {
      if (!busId) {
        toast.error('Bus ID not found');
        navigate('/search');
        return;
      }
      
      const bus = mockBusData.find(b => b.id === busId);
      
      if (!bus) {
        toast.error('Bus not found');
        navigate('/search');
        return;
      }
      
      setBusDetails(bus);
      
      // Get seat data for this bus
      const busSeats = mockSeatData.filter(s => s.busId === busId);
      setSeats(busSeats);
      
      setLoading(false);
    }, 1000);
  }, [busId, navigate]);
  
  const handleContinue = () => {
    if (!bookingDetails) {
      toast.error('Booking details not found');
      return;
    }
    
    if (bookingDetails.selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }
    
    if (bookingDetails.selectedSeats.length !== bookingDetails.passengers.length) {
      // Find which seat is missing passenger details
      const seatWithoutPassenger = bookingDetails.selectedSeats.find(seatId => 
        !bookingDetails.passengers.some(p => p.seatNumber === seatId)
      );
      
      if (seatWithoutPassenger) {
        setCurrentPassengerSeat(seatWithoutPassenger);
        toast.error('Please add passenger details for all selected seats');
        return;
      }
    }
    
    // Proceed to checkout
    navigate('/checkout');
  };
  
  const handleAddPassenger = (seatId: string) => {
    setCurrentPassengerSeat(seatId);
  };
  
  const closeSeatModal = () => {
    setCurrentPassengerSeat(null);
  };
  
  const formatTime = (time24: string) => {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
        </div>
      </div>
    );
  }
  
  if (!busDetails || !bookingDetails) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-[var(--primary)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Bus details not found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't load the bus details. Please try again or go back to search.
          </p>
          <button
            onClick={() => navigate('/search')}
            className="btn btn-primary"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bus List
        </button>
        
        {/* Bus Details Banner */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-1">{busDetails.name}</h1>
              <p className="text-sm text-gray-500 mb-2">{busDetails.type}</p>
              
              <div className="flex items-center space-x-6 mt-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium">{formatTime(busDetails.departureTime)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm">{busDetails.source}</span>
                </div>
                <div className="flex items-center">
                  <ArrowRight className="h-4 w-4 text-gray-500 mr-1" />
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm font-medium">{formatTime(busDetails.arrivalTime)}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-sm">{busDetails.destination}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <p className="text-sm text-gray-500">{formatDate(bookingDetails.journeyDate)}</p>
              <p className="text-2xl font-bold text-[var(--primary)]">₹{busDetails.fare}</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Seat Selection */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <SeatLayout seats={seats} busType={busDetails.type} />
            </div>
          </div>
          
          {/* Booking Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Bus</p>
                  <p className="font-medium">{busDetails.name}</p>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium">{busDetails.source}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium">{busDetails.destination}</p>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Journey Date</p>
                    <p className="font-medium">{formatDate(bookingDetails.journeyDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Departure</p>
                    <p className="font-medium">{formatTime(busDetails.departureTime)}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">Selected Seats</p>
                    <p className="text-sm font-medium">{bookingDetails.selectedSeats.length || 0}</p>
                  </div>
                  
                  {bookingDetails.selectedSeats.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {bookingDetails.selectedSeats.map(seatId => {
                        const seat = seats.find(s => s.id === seatId);
                        const hasPassenger = bookingDetails.passengers.some(p => p.seatNumber === seatId);
                        
                        return (
                          <div 
                            key={seatId}
                            className={`
                              relative inline-flex items-center rounded-full px-3 py-1 text-sm
                              ${hasPassenger 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800 cursor-pointer'
                              }
                            `}
                            onClick={() => !hasPassenger && handleAddPassenger(seatId)}
                          >
                            <span className="mr-1">{seat?.number || seatId}</span>
                            {hasPassenger 
                              ? <span className="text-xs">✓</span>
                              : <span className="text-xs">+ Add</span>
                            }
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                <div className="pt-4 border-t">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm">Base Fare × {bookingDetails.selectedSeats.length}</p>
                    <p className="text-sm">₹{busDetails.fare * bookingDetails.selectedSeats.length}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p className="text-sm">Tax</p>
                    <p className="text-sm">₹0</p>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2 mt-2">
                    <p>Total Amount</p>
                    <p className="text-[var(--primary)]">
                      ₹{busDetails.fare * bookingDetails.selectedSeats.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleContinue}
                className="btn btn-primary w-full mt-6"
                disabled={!bookingDetails.selectedSeats.length}
              >
                Continue to Payment
              </button>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Important Information</h3>
              <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                <li>Please arrive 30 minutes before departure</li>
                <li>Carry a valid ID proof while traveling</li>
                <li>Children above 5 years need a separate ticket</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Passenger Form Modal */}
      {currentPassengerSeat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <PassengerForm 
              seatNumber={currentPassengerSeat} 
              onClose={closeSeatModal} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;