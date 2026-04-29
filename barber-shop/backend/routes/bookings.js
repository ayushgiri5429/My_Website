const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} = require('../controllers/bookingController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('barber').notEmpty().withMessage('Barber is required'),
    body('service').notEmpty().withMessage('Service is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  createBooking
);

router.get('/', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/status', authorizeRoles('barber', 'admin'), updateBookingStatus);
router.patch('/:id/cancel', cancelBooking);

module.exports = router;
