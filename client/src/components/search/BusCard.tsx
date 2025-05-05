import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, ShieldCheck, Wifi, Coffee, ChevronDown, ChevronUp } from 'lucide-react';
import { useBooking } from '../../contexts/BookingContext';

export interface BusDetails {
  id: string;
  name: string;
  type: string;
  rating: number;
  totalReviews: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  source: string;
  destination: string;
  fare: number;
  seatsAvailable: number;
  amenities: string[];
  cancellationPolicy: string;
  operatorLogo?: string;
}

interface BusCardProps {
  bus: BusDetails;
  journeyDate: string;
}

const BusCard: React.FC<BusCardProps> = ({ bus, journeyDate }) => {
  const [expanded, setExpanded] = useState(false);
  const { setBookingInfo } = useBooking();
  const navigate = useNavigate();
  
  const {
    id,
    name,
    type,
    rating,
    totalReviews,
    departureTime,
    arrivalTime,
    duration,
    source,
    destination,
    fare,
    seatsAvailable,
    amenities,
    cancellationPolicy,
    operatorLogo,
  } = bus;
  
  const handleViewSeats = () => {
    setBookingInfo({
      busId: id,
      journeyDate,
      source,
      destination,
      fare,
      busName: name,
      departureTime,
      arrivalTime,
      busType: type,
      selectedSeats: [],
      passengers: [],
      totalAmount: 0,
    });
    
    navigate(`/bus/${id}/seats`);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          {/* Operator Info */}
          <div className="flex items-center mb-3 md:mb-0 md:w-1/5">
            {operatorLogo ? (
              <img 
                src={operatorLogo} 
                alt={name} 
                className="w-10 h-10 object-contain mr-3"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-gray-500 font-semibold">{name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">{name}</h3>
              <div className="flex items-center">
                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full flex items-center">
                  <Star className="h-3 w-3 mr-1 fill-current" /> {rating}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({totalReviews} reviews)
                </span>
              </div>
            </div>
          </div>
          
          {/* Timing Info */}
          <div className="flex items-center justify-between md:w-2/5">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{departureTime}</p>
              <p className="text-xs text-gray-500">{source}</p>
            </div>
            <div className="flex flex-col items-center px-4">
              <p className="text-xs text-gray-500">{duration}</p>
              <div className="w-24 h-0.5 bg-gray-300 relative my-1">
                <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-gray-700 transform -translate-y-1/2"></div>
              </div>
              <p className="text-xs text-gray-500">Direct</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{arrivalTime}</p>
              <p className="text-xs text-gray-500">{destination}</p>
            </div>
          </div>
          
          {/* Price & Seat Info */}
          <div className="mt-4 md:mt-0 md:w-1/5">
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">₹{fare}</p>
              <p className="text-sm text-gray-500">{seatsAvailable} seats left</p>
            </div>
          </div>
        </div>
        
        {/* Type & View Seats Button */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="badge bg-blue-100 text-blue-800">{type}</span>
            {amenities.includes('wifi') && (
              <span className="badge bg-gray-100 text-gray-800">
                <Wifi className="h-3 w-3 mr-1" /> WiFi
              </span>
            )}
          </div>
          <button
            onClick={handleViewSeats}
            className="btn btn-primary py-1.5"
          >
            View Seats
          </button>
        </div>
        
        {/* Toggle Details */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 w-full flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 py-1 border-t"
        >
          {expanded ? (
            <>
              <span>Hide Details</span>
              <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              <span>View Details</span>
              <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </button>
      </div>
      
      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100 slide-up">
          <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Amenities */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Amenities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center">
                    {amenity === 'wifi' && <Wifi className="h-4 w-4 mr-2 text-gray-500" />}
                    {amenity === 'charging_point' && <Coffee className="h-4 w-4 mr-2 text-gray-500" />}
                    {amenity === 'blanket' && <Coffee className="h-4 w-4 mr-2 text-gray-500" />}
                    {amenity.charAt(0).toUpperCase() + amenity.slice(1).replace('_', ' ')}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Policies */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Cancellation Policy</h4>
              <div className="text-sm text-gray-600">
                <p>{cancellationPolicy}</p>
              </div>
            </div>
            
            {/* Safety Measures */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Safety Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                  Sanitized Bus
                </li>
                <li className="flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-2 text-green-600" />
                  Masked Staff
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-600" />
                  Punctual Service
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusCard;