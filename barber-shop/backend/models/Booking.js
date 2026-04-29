const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    barber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: String,
      required: [true, 'Service type is required'],
      enum: ['haircut', 'shave', 'beard_trim', 'hair_color', 'combo', 'premium'],
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    timeSlot: {
      type: String,
      required: [true, 'Time slot is required'],
    },
    duration: {
      type: Number,
      default: 30,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    notes: {
      type: String,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ customer: 1, date: 1 });
bookingSchema.index({ barber: 1, date: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
