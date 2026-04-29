const express = require('express');
const { body } = require('express-validator');
const {
  enroll,
  getMyEnrollment,
  getEnrollmentHistory,
  cancelEnrollment,
  updateEnrollment,
} = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('plan').isIn(['basic', 'standard', 'premium']).withMessage('Invalid plan'),
    body('price').isNumeric().withMessage('Price is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
  ],
  enroll
);

router.get('/me', getMyEnrollment);
router.get('/history', getEnrollmentHistory);
router.patch('/:id/cancel', cancelEnrollment);
router.patch('/:id', updateEnrollment);

module.exports = router;
