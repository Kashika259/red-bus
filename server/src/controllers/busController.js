import { validationResult } from 'express-validator';
import { Bus } from '../models/busModel.js';

// @desc    Get all buses
// @route   GET /api/buses
// @access  Public
export const getAllBuses = async (req, res, next) => {
  try {
    // Build query
    const { from, to, departureDate } = req.query;
    const queryObj = { isActive: true };
    
    if (from) queryObj.from = new RegExp(from, 'i');
    if (to) queryObj.to = new RegExp(to, 'i');
    if (departureDate) {
      const date = new Date(departureDate);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      queryObj.departureDate = {
        $gte: date,
        $lt: nextDay
      };
    }
    
    const buses = await Bus.find(queryObj).select('-seats');
    
    res.json({
      success: true,
      count: buses.length,
      data: buses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bus by ID
// @route   GET /api/buses/:id
// @access  Public
export const getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (bus) {
      res.json({
        success: true,
        data: bus
      });
    } else {
      res.status(404);
      throw new Error('Bus not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new bus
// @route   POST /api/buses
// @access  Private/Admin
export const createBus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      busNumber,
      busName,
      from,
      to,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      pricePerSeat,
      totalSeats,
      busType,
      amenities
    } = req.body;
    
    const busExists = await Bus.findOne({ busNumber });
    if (busExists) {
      res.status(400);
      throw new Error('Bus with this number already exists');
    }
    
    const bus = await Bus.create({
      busNumber,
      busName,
      from,
      to,
      departureDate,
      departureTime,
      arrivalDate,
      arrivalTime,
      pricePerSeat,
      totalSeats,
      availableSeats: totalSeats,
      busType,
      amenities: amenities || []
    });
    
    res.status(201).json({
      success: true,
      data: bus
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bus availability
// @route   PUT /api/buses/:id
// @access  Private/Admin
export const updateBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (bus) {
      bus.busName = req.body.busName || bus.busName;
      bus.from = req.body.from || bus.from;
      bus.to = req.body.to || bus.to;
      bus.departureDate = req.body.departureDate || bus.departureDate;
      bus.departureTime = req.body.departureTime || bus.departureTime;
      bus.arrivalDate = req.body.arrivalDate || bus.arrivalDate;
      bus.arrivalTime = req.body.arrivalTime || bus.arrivalTime;
      bus.pricePerSeat = req.body.pricePerSeat || bus.pricePerSeat;
      bus.busType = req.body.busType || bus.busType;
      bus.isActive = req.body.isActive !== undefined ? req.body.isActive : bus.isActive;
      bus.amenities = req.body.amenities || bus.amenities;
      
      const updatedBus = await bus.save();
      
      res.json({
        success: true,
        data: updatedBus
      });
    } else {
      res.status(404);
      throw new Error('Bus not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a bus
// @route   DELETE /api/buses/:id
// @access  Private/Admin
export const deleteBus = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    
    if (bus) {
      await bus.deleteOne();
      res.json({
        success: true,
        message: 'Bus removed'
      });
    } else {
      res.status(404);
      throw new Error('Bus not found');
    }
  } catch (error) {
    next(error);
  }
};