import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bus, Calendar, Clock, Download, MapPin, ArrowRight, Search, AlertCircle, Filter, } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { mockBookingHistoryData } from '../data/mockBookingHistoryData';

interface BookingHistoryItem {
  id: string;
  journeyDate: string;
  source: string;
  destination: string;
  busName: string;
  departureTime: string;
  arrivalTime: string;
  seats: string[];
  amount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  passengers: { name: string; age: number; gender: string; seatNumber: string }[];
}

const MyBookings: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Simulate API call to get booking history
    setLoading(true);

    setTimeout(() => {
      setBookings(mockBookingHistoryData);
      setLoading(false);
    }, 1000);
  }, [isAuthenticated, navigate]);

  const filteredBookings = bookings.filter(booking => {
    // Apply status filter
    if (filter === 'upcoming' && booking.status !== 'confirmed') return false;
    if (filter === 'completed' && booking.status !== 'completed') return false;
    if (filter === 'cancelled' && booking.status !== 'cancelled') return false;

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        booking.id.toLowerCase().includes(query) ||
        booking.source.toLowerCase().includes(query) ||
        booking.destination.toLowerCase().includes(query) ||
        booking.busName.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const formatTime = (time24: string) => {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const getStatusBadge = (status: BookingHistoryItem['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="badge badge-success">Upcoming</span>;
      case 'completed':
        return <span className="badge bg-blue-100 text-blue-800">Completed</span>;
      case 'cancelled':
        return <span className="badge bg-red-100 text-red-800">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            {/* Status Filters */}
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 text-sm rounded-md ${filter === 'all'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${filter === 'upcoming'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => setFilter('upcoming')}
              >
                Upcoming
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${filter === 'completed'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </button>
              <button
                className={`px-3 py-1 text-sm rounded-md ${filter === 'cancelled'
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => setFilter('cancelled')}
              >
                Cancelled
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 text-sm py-2"
              />
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                {/* Booking Header */}
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID: {booking.id}</p>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm font-medium mr-3">{formatDate(booking.journeyDate)}</span>
                      {getStatusBadge(booking.status)}
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <a href="#" className="inline-flex items-center text-sm text-[var(--primary)] hover:underline">
                      <Download className="h-4 w-4 mr-1" />
                      Download Ticket
                    </a>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center">
                    {/* Bus Info */}
                    <div className="flex-1 mb-4 md:mb-0">
                      <h3 className="font-medium text-gray-900 mb-1">{booking.busName}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        <span>{booking.seats.length} {booking.seats.length === 1 ? 'Seat' : 'Seats'}</span>
                        <span className="mx-1">•</span>
                        <span className="text-xs">{booking.seats.join(', ')}</span>
                      </p>
                    </div>

                    {/* Route Info */}
                    <div className="flex-1 flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-medium">{formatTime(booking.departureTime)}</div>
                        <div className="text-xs text-gray-500">{booking.source}</div>
                      </div>

                      <ArrowRight className="h-4 w-4 text-gray-400" />

                      <div className="text-center">
                        <div className="text-sm font-medium">{formatTime(booking.arrivalTime)}</div>
                        <div className="text-xs text-gray-500">{booking.destination}</div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="mt-4 md:mt-0 md:ml-4 text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-lg font-semibold text-gray-900">₹{booking.amount}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                    {booking.status === 'confirmed' && (
                      <>
                        <button className="btn btn-outline text-sm py-1">Cancel Booking</button>
                        <button className="btn btn-outline text-sm py-1">Change Seats</button>
                      </>
                    )}
                    <button className="btn btn-primary text-sm py-1">View Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
            {searchQuery ? (
              <p className="text-gray-600 mb-6">
                We couldn't find any bookings matching "{searchQuery}".
              </p>
            ) : (
              <p className="text-gray-600 mb-6">
                You don't have any {filter !== 'all' ? filter : ''} bookings yet.
              </p>
            )}
            <Link to="/" className="btn btn-primary">Book a Trip</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;