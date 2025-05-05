import { BookingDetails } from '../contexts/BookingContext';

// Mock API service for booking
// In a real app, this would make actual API calls to your backend

export const bookingService = {
  // Create a booking order
  createOrder: async (bookingDetails: BookingDetails): Promise<{ orderId: string }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          orderId: `order_${Math.random().toString(36).substring(2, 15)}`
        });
      }, 800);
    });
  },
  
  // Verify payment
  verifyPayment: async (paymentData: any): Promise<{ success: boolean; bookingId: string }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          bookingId: `booking_${Math.random().toString(36).substring(2, 15)}`
        });
      }, 600);
    });
  },
  
  // Get booking history
  getBookingHistory: async (): Promise<any[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: 'RB123456789',
            journeyDate: '2025-07-15',
            source: 'Delhi',
            destination: 'Jaipur',
            busName: 'Rajasthan Travels',
            departureTime: '22:00',
            arrivalTime: '04:30',
            seats: ['A1', 'A2'],
            amount: 1200,
            status: 'confirmed'
          },
          {
            id: 'RB987654321',
            journeyDate: '2025-06-10',
            source: 'Mumbai',
            destination: 'Pune',
            busName: 'Maharashtra Express',
            departureTime: '17:30',
            arrivalTime: '20:45',
            seats: ['B5'],
            amount: 550,
            status: 'completed'
          }
        ]);
      }, 800);
    });
  },
  
  // Get booking details
  getBookingDetails: async (bookingId: string): Promise<any> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (bookingId) {
          resolve({
            id: bookingId,
            journeyDate: '2025-07-15',
            source: 'Delhi',
            destination: 'Jaipur',
            busName: 'Rajasthan Travels',
            departureTime: '22:00',
            arrivalTime: '04:30',
            seats: ['A1', 'A2'],
            amount: 1200,
            status: 'confirmed',
            passengers: [
              { name: 'John Doe', age: 28, gender: 'male', seatNumber: 'A1' },
              { name: 'Jane Doe', age: 26, gender: 'female', seatNumber: 'A2' }
            ]
          });
        } else {
          reject(new Error('Booking not found'));
        }
      }, 800);
    });
  },
  
  // Cancel booking
  cancelBooking: async (bookingId: string): Promise<{ success: boolean; refundAmount: number }> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          refundAmount: 1080 // 90% refund
        });
      }, 1000);
    });
  }
};