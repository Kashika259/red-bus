import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  bus: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Bus'
  },
  seatNumbers: {
    type: [String],
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  journeyDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Confirmed', 'Cancelled', 'Pending'],
    default: 'Confirmed'
  },
  paymentInfo: {
    type: String,
    default: 'Paid'
  },
  passengerDetails: [
    {
      name: {
        type: String,
        required: true
      },
      age: {
        type: Number,
        required: true
      },
      gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
      }
    }
  ]
}, {
  timestamps: true
});

export const Booking = mongoose.model('Booking', bookingSchema);