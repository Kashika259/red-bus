import express from 'express';
import { check } from 'express-validator';
import { 
  getAllBuses, 
  getBusById, 
  createBus, 
  updateBus, 
  deleteBus 
} from '../controllers/busController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/buses
router.get('/', getAllBuses);

// @route   GET /api/buses/:id
router.get('/:id', getBusById);

// @route   POST /api/buses
router.post(
  '/', 
  [
    protect, 
    admin,
    check('busNumber', 'Bus number is required').notEmpty(),
    check('busName', 'Bus name is required').notEmpty(),
    check('from', 'Departure location is required').notEmpty(),
    check('to', 'Destination is required').notEmpty(),
    check('departureDate', 'Departure date is required').isISO8601().toDate(),
    check('departureTime', 'Departure time is required').notEmpty(),
    check('arrivalDate', 'Arrival date is required').isISO8601().toDate(),
    check('arrivalTime', 'Arrival time is required').notEmpty(),
    check('pricePerSeat', 'Price per seat is required').isNumeric(),
    check('totalSeats', 'Total seats is required').isInt({ min: 1 }),
    check('busType', 'Bus type is required').isIn(['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper'])
  ], 
  createBus
);

// @route   PUT /api/buses/:id
router.put('/:id', protect, admin, updateBus);

// @route   DELETE /api/buses/:id
router.delete('/:id', protect, admin, deleteBus);

export default router;