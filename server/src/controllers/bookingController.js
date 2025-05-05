import { validationResult } from 'express-validator';
import { Booking } from '../models/bookingModel.js';
import { Bus } from '../models/busModel.js';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { 
      busId, 
      seatNumbers, 
      journeyDate, 
      passengerDetails 
    } = req.body;
    
    // Validate bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      res.status(404);
      throw new Error('Bus not found');
    }
    
    // Check if seats are available
    const unavailableSeats = [];
    
    for (const seatNumber of seatNumbers) {
      const seatIndex = bus.seats.findIndex(seat => seat.number === seatNumber);
      
      if (seatIndex === -1) {
        unavailableSeats.push(seatNumber);
      } else if (bus.seats[seatIndex].isBooked) {
        unavailableSeats.push(seatNumber);
      }
    }
    
    if (unavailableSeats.length > 0) {
      res.status(400);
      throw new Error(`Seats ${unavailableSeats.join(', ')} are not available`);
    }
    
    // Calculate total amount
    const totalAmount = seatNumbers.length * bus.pricePerSeat;
    
    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      bus: busId,
      seatNumbers,
      totalAmount,
      journeyDate,
      passengerDetails
    });
    
    // Update bus seat status
    for (const seatNumber of seatNumbers) {
      const seatIndex = bus.seats.findIndex(seat => seat.number === seatNumber);
      bus.seats[seatIndex].isBooked = true;
    }
    
    bus.availableSeats -= seatNumbers.length;
    await bus.save();
    
    // Populate booking with bus details
    const populatedBooking = await Booking.findById(booking._id)
      .populate('bus', 'busNumber busName from to departureDate departureTime arrivalDate arrivalTime')
      .populate('user', 'name email');
    
    res.status(201).json({
      success: true,
      data: populatedBooking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('bus', 'busNumber busName from to departureDate departureTime arrivalDate arrivalTime')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('bus', 'busNumber busName from to departureDate departureTime arrivalDate arrivalTime busType')
      .populate('user', 'name email');
    
    if (booking) {
      // Check if booking belongs to user or user is admin
      if (booking.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to access this booking');
      }
      
      res.json({
        success: true,
        data: booking
      });
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (booking) {
      // Check if booking belongs to user or user is admin
      if (booking.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to cancel this booking');
      }
      
      // Prevent cancellation if status is already cancelled
      if (booking.status === 'Cancelled') {
        res.status(400);
        throw new Error('Booking is already cancelled');
      }
      
      // Update booking status
      booking.status = 'Cancelled';
      await booking.save();
      
      // Update bus seat availability
      const bus = await Bus.findById(booking.bus);
      
      if (bus) {
        for (const seatNumber of booking.seatNumbers) {
          const seatIndex = bus.seats.findIndex(seat => seat.number === seatNumber);
          if (seatIndex !== -1) {
            bus.seats[seatIndex].isBooked = false;
          }
        }
        
        bus.availableSeats += booking.seatNumbers.length;
        await bus.save();
      }
      
      res.json({
        success: true,
        message: 'Booking cancelled successfully',
        data: booking
      });
    } else {
      res.status(404);
      throw new Error('Booking not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin only)
// @route   GET /api/bookings/all
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('bus', 'busNumber busName from to departureDate departureTime')
      .populate('user', 'name email')
      .sort('-createdAt');
    
    res.json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};