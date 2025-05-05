import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  number: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const busSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  busName: {
    type: String,
    required: true,
    trim: true
  },
  from: {
    type: String,
    required: true,
    trim: true
  },
  to: {
    type: String,
    required: true,
    trim: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  departureTime: {
    type: String,
    required: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: String,
    required: true
  },
  pricePerSeat: {
    type: Number,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  busType: {
    type: String,
    required: true,
    enum: ['AC', 'Non-AC', 'Sleeper', 'Semi-Sleeper']
  },
  seats: [seatSchema],
  amenities: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate seats before saving
busSchema.pre('save', function(next) {
  if (this.isNew) {
    this.seats = [];
    for (let i = 1; i <= this.totalSeats; i++) {
      this.seats.push({
        number: i.toString(),
        isBooked: false
      });
    }
    this.availableSeats = this.totalSeats;
  }
  next();
});

export const Bus = mongoose.model('Bus', busSchema);