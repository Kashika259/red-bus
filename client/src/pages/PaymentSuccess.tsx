import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Send, Calendar, Clock, MapPin } from 'lucide-react';
import { useBooking } from '../contexts/BookingContext';

const PaymentSuccess: React.FC = () => {
  const { bookingDetails, resetBooking } = useBooking();
  const navigate = useNavigate();
  
  // Generate a random booking ID
  const bookingId = `RB${Math.floor(100000000 + Math.random() * 900000000)}`;
  
  useEffect(() => {
    if (!bookingDetails) {
      navigate('/');
      return;
    }
    
    // Cleanup booking details when leaving this page
    return () => {
      resetBooking();
    };
  }, [bookingDetails, navigate, resetBooking]);
  
  if (!bookingDetails) {
    return null;
  }
  
  const formatTime = (time24: string = "00:00") => {
    if (!time24) return "00:00";
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
  
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Your booking has been confirmed. Your ticket has been sent to your email.
            </p>
            
            <div className="inline-block bg-gray-100 rounded-md px-4 py-2 mb-6">
              <p className="text-sm text-gray-600">Booking Reference Number</p>
              <p className="text-xl font-semibold">{bookingId}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
              <button className="btn btn-outline flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </button>
              
              <button className="btn btn-outline flex items-center justify-center">
                <Send className="h-4 w-4 mr-2" />
                Email Ticket
              </button>
            </div>
          </div>
          
          {/* Ticket Details */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 border border-gray-200">
            <div className="bg-[var(--primary)] p-4">
              <h2 className="text-white font-bold text-lg">Bus Ticket</h2>
            </div>
            
            <div className="p-6">
              {/* Journey Info */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <h3 className="text-lg font-semibold">{bookingDetails.source}</h3>
                    <p className="text-sm text-gray-700">{formatTime(bookingDetails.departureTime)}</p>
                  </div>
                  
                  <div className="hidden sm:block">
                    <div className="w-24 h-0.5 bg-gray-300 relative">
                      <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-gray-700 transform -translate-y-1/2"></div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <h3 className="text-lg font-semibold">{bookingDetails.destination}</h3>
                    <p className="text-sm text-gray-700">{formatTime(bookingDetails.arrivalTime)}</p>
                  </div>
                </div>
              </div>
              
              {/* Travel Details */}
              <div className="p-4 bg-gray-50 rounded-md mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Bus</p>
                    <p className="font-medium">{bookingDetails.busName}</p>
                    <p className="text-sm text-gray-700">{bookingDetails.busType}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Journey Date</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <p className="font-medium">{formatDate(bookingDetails.journeyDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Passenger Info */}
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-3">Passenger Details</h3>
                
                <div className="space-y-3">
                  {bookingDetails.passengers.map((passenger, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{passenger.name}</p>
                        <p className="text-sm text-gray-600">
                          {passenger.age} years • {passenger.gender.charAt(0).toUpperCase() + passenger.gender.slice(1)}
                        </p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        Seat {passenger.seatNumber}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Fare Details */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-md font-semibold mb-3">Payment Details</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Fare (₹{bookingDetails.fare} × {bookingDetails.selectedSeats.length})</span>
                    <span>₹{bookingDetails.fare * bookingDetails.selectedSeats.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold pt-2 border-t border-gray-200 mt-2">
                    <span>Total Amount</span>
                    <span className="text-[var(--primary)]">₹{bookingDetails.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Important Information */}
            <div className="p-6 bg-blue-50 border-t border-blue-100">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Important Information</h3>
              <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                <li>Please arrive at the boarding point 30 minutes before departure.</li>
                <li>Carry a printed copy of this ticket or show the soft copy along with a valid ID proof.</li>
                <li>Luggage allowance is 15kg per passenger.</li>
                <li>For any assistance, call our helpline at 1800-123-4567.</li>
              </ul>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
            <Link to="/my-bookings" className="btn btn-primary flex-1 flex items-center justify-center">
              My Bookings
            </Link>
            
            <Link to="/" className="btn btn-outline flex-1 flex items-center justify-center">
              Book Another Trip
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;