import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { bookingService } from '../services/bookingService';
import { useAuth } from './AuthContext';

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber: string;
}

export interface BookingDetails {
  busId: string;
  journeyDate: string;
  source: string;
  destination: string;
  fare: number;
  selectedSeats: string[];
  passengers: Passenger[];
  totalAmount: number;
  busName?: string;
  departureTime?: string;
  arrivalTime?: string;
  busType?: string;
}

interface BookingContextType {
  bookingDetails: BookingDetails | null;
  setBookingInfo: (info: Partial<BookingDetails>) => void;
  addPassenger: (passenger: Passenger) => void;
  removePassenger: (seatNumber: string) => void;
  proceedToPayment: () => Promise<void>;
  resetBooking: () => void;
  loading: boolean;
  error: string | null;
}

const initialBookingState: BookingDetails = {
  busId: '',
  journeyDate: '',
  source: '',
  destination: '',
  fare: 0,
  selectedSeats: [],
  passengers: [],
  totalAmount: 0,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const setBookingInfo = (info: Partial<BookingDetails>) => {
    setBookingDetails(prev => {
      if (!prev) {
        return { ...initialBookingState, ...info };
      }
      
      // If updating selected seats, recalculate total amount
      const updatedState = { ...prev, ...info };
      if (info.selectedSeats || info.fare) {
        updatedState.totalAmount = updatedState.fare * updatedState.selectedSeats.length;
      }
      
      return updatedState;
    });
  };

  const addPassenger = (passenger: Passenger) => {
    setBookingDetails(prev => {
      if (!prev) return null;
      
      // Check if seat is already assigned to a passenger
      const existingPassengerIndex = prev.passengers.findIndex(
        p => p.seatNumber === passenger.seatNumber
      );
      
      let updatedPassengers;
      
      if (existingPassengerIndex >= 0) {
        // Replace existing passenger
        updatedPassengers = [...prev.passengers];
        updatedPassengers[existingPassengerIndex] = passenger;
      } else {
        // Add new passenger
        updatedPassengers = [...prev.passengers, passenger];
      }
      
      return {
        ...prev,
        passengers: updatedPassengers,
      };
    });
  };

  const removePassenger = (seatNumber: string) => {
    setBookingDetails(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        passengers: prev.passengers.filter(p => p.seatNumber !== seatNumber),
      };
    });
  };

  const proceedToPayment = async () => {
    try {
      if (!isAuthenticated) {
        toast.error('Please login to continue booking');
        navigate('/login');
        return;
      }
      
      if (!bookingDetails) {
        toast.error('Booking details not found');
        return;
      }
      
      if (bookingDetails.passengers.length === 0) {
        toast.error('Please add passenger details');
        return;
      }
      
      if (bookingDetails.passengers.length !== bookingDetails.selectedSeats.length) {
        toast.error('Please add details for all selected seats');
        return;
      }
      
      setLoading(true);
      setError(null);
      
      // In a real app, this would create an order and initialize Razorpay
      // For our MVP, we'll simulate this process
      const orderResponse = await bookingService.createOrder(bookingDetails);
      
      // Simulate successful payment for now
      // In a real implementation, this would open the Razorpay payment window
      setTimeout(() => {
        navigate('/payment-success');
      }, 1000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment initiation failed';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setBookingDetails(null);
    setError(null);
  };

  return (
    <BookingContext.Provider
      value={{
        bookingDetails,
        setBookingInfo,
        addPassenger,
        removePassenger,
        proceedToPayment,
        resetBooking,
        loading,
        error,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};