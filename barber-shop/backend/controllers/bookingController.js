const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');

exports.createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { barber, service, date, timeSlot, duration, price, notes } = req.body;

    const conflict = await Booking.findOne({
      barber,
      date,
      timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflict) {
      return res.status(409).json({ error: 'Time slot already booked' });
    }

    const booking = await Booking.create({
      customer: req.user.id,
      barber,
      service,
      date,
      timeSlot,
      duration,
      price,
      notes,
    });

    res.status(201).json({ booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { customer: req.user.id };
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('barber', 'name avatar')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Booking.countDocuments(filter);

    res.json({ bookings, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('barber', 'name avatar')
      .populate('customer', 'name email');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, customer: req.user.id, status: { $ne: 'cancelled' } },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or already cancelled' });
    }

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};
