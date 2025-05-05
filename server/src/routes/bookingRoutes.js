import express from 'express';
import { check } from 'express-validator';
import { 
  createBooking, 
  getUserBookings, 
  getBookingById, 
  cancelBooking, 
  getAllBookings 
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/bookings
router.post(
  '/', 
  [
    protect,
    check('busId', 'Bus ID is required').isMongoId(),
    check('seatNumbers', 'Seat numbers are required').isArray().notEmpty(),
    check('journeyDate', 'Journey date is required').isISO8601().toDate(),
    check('passengerDetails', 'Passenger details are required').isArray().notEmpty(),
    check('passengerDetails.*.name', 'Passenger name is required').notEmpty(),
    check('passengerDetails.*.age', 'Passenger age is required').isInt({ min: 1 }),
    check('passengerDetails.*.gender', 'Passenger gender is required').isIn(['Male', 'Female', 'Other'])
  ], 
  createBooking
);

// @route   GET /api/bookings
router.get('/', protect, getUserBookings);

// @route   GET /api/bookings/all
router.get('/all', protect, admin, getAllBookings);

// @route   GET /api/bookings/:id
router.get('/:id', protect, getBookingById);

// @route   PUT /api/bookings/:id/cancel
router.put('/:id/cancel', protect, cancelBooking);

export default router;