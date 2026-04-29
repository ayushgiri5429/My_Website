const express = require('express');
const {
  getMyLoyalty,
  addPoints,
  redeemPoints,
  getLeaderboard,
} = require('../controllers/loyaltyController');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/leaderboard', getLeaderboard);

router.use(authenticate);

router.get('/me', getMyLoyalty);
router.post('/add', authorizeRoles('barber', 'admin'), addPoints);
router.post('/redeem', redeemPoints);

module.exports = router;
