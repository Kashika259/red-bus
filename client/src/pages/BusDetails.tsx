import React from 'react';
import { useParams } from 'react-router-dom';

const BusDetails = () => {
  const { busId } = useParams();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Bus Details</h1>
        
        {/* Bus Information Section */}
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Journey Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Bus ID</p>
                <p className="text-lg font-medium text-gray-900">{busId}</p>
              </div>
              {/* Placeholder for actual bus data */}
              <div>
                <p className="text-sm text-gray-600">Operator</p>
                <p className="text-lg font-medium text-gray-900">Premium Bus Services</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bus Type</p>
                <p className="text-lg font-medium text-gray-900">Luxury Sleeper</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Seats</p>
                <p className="text-lg font-medium text-gray-900">32</p>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>WiFi</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>USB Charging</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Air Conditioning</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Reading Light</span>
              </div>
            </div>
          </div>

          {/* Boarding & Dropping Points */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Boarding & Dropping Points</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700">Boarding Point</h3>
                <p className="text-gray-600">Central Bus Station, Platform 3</p>
                <p className="text-sm text-gray-500">Departure: 10:00 PM</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700">Dropping Point</h3>
                <p className="text-gray-600">City Terminal, Gate 5</p>
                <p className="text-sm text-gray-500">Arrival: 6:00 AM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusDetails;