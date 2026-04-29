const Loyalty = require('../models/Loyalty');

exports.getMyLoyalty = async (req, res) => {
  try {
    let loyalty = await Loyalty.findOne({ user: req.user.id });
    if (!loyalty) {
      loyalty = await Loyalty.create({ user: req.user.id });
    }
    res.json({ loyalty });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch loyalty data' });
  }
};

exports.addPoints = async (req, res) => {
  try {
    const { userId, points, description } = req.body;

    let loyalty = await Loyalty.findOne({ user: userId });
    if (!loyalty) {
      loyalty = await Loyalty.create({ user: userId });
    }

    await loyalty.addPoints(points, description);
    res.json({ message: 'Points added', loyalty });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add points' });
  }
};

exports.redeemPoints = async (req, res) => {
  try {
    const { points, description } = req.body;

    const loyalty = await Loyalty.findOne({ user: req.user.id });
    if (!loyalty) {
      return res.status(404).json({ error: 'Loyalty account not found' });
    }

    await loyalty.redeemPoints(points, description);
    res.json({ message: 'Points redeemed', loyalty });
  } catch (err) {
    res.status(400).json({ error: err.message || 'Failed to redeem points' });
  }
};

exports.getLeaderboard = async (_req, res) => {
  try {
    const leaderboard = await Loyalty.find()
      .populate('user', 'name avatar')
      .sort({ points: -1 })
      .limit(10);

    res.json({ leaderboard });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};
