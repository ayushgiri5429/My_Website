const express = require('express');
const { body } = require('express-validator');
const {
  getActiveOffers,
  getOfferById,
  createOffer,
  updateOffer,
  deleteOffer,
  validateCode,
} = require('../controllers/offerController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', getActiveOffers);
router.get('/:id', getOfferById);
router.post('/validate', validateCode);

router.use(authenticate);
router.use(authorizeRoles('admin'));

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('discountType').isIn(['percentage', 'fixed']).withMessage('Invalid discount type'),
    body('discountValue').isNumeric().withMessage('Discount value must be a number'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
  ],
  createOffer
);

router.put('/:id', updateOffer);
router.delete('/:id', deleteOffer);

module.exports = router;
