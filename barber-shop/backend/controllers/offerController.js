const { validationResult } = require('express-validator');
const Offer = require('../models/Offer');

exports.getActiveOffers = async (_req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 });

    res.json({ offers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
};

exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.json({ offer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch offer' });
  }
};

exports.createOffer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const offer = await Offer.create(req.body);
    res.status(201).json({ offer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create offer' });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    res.json({ offer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update offer' });
  }
};

exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    res.json({ message: 'Offer deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete offer' });
  }
};

exports.validateCode = async (req, res) => {
  try {
    const { code } = req.body;
    const offer = await Offer.findOne({ code: code.toUpperCase() });

    if (!offer || !offer.isValid()) {
      return res.status(400).json({ error: 'Invalid or expired offer code' });
    }

    res.json({ valid: true, offer });
  } catch (err) {
    res.status(500).json({ error: 'Failed to validate code' });
  }
};
