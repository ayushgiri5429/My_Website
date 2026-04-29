const { validationResult } = require('express-validator');
const Enrollment = require('../models/Enrollment');

exports.enroll = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const activeEnrollment = await Enrollment.findOne({
      user: req.user.id,
      status: 'active',
    });

    if (activeEnrollment) {
      return res.status(409).json({ error: 'You already have an active plan' });
    }

    const { plan, price, servicesIncluded, endDate, autoRenew } = req.body;

    const enrollment = await Enrollment.create({
      user: req.user.id,
      plan,
      price,
      servicesIncluded,
      endDate,
      autoRenew,
    });

    res.status(201).json({ enrollment });
  } catch (err) {
    res.status(500).json({ error: 'Enrollment failed' });
  }
};

exports.getMyEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user.id,
      status: 'active',
    });

    if (!enrollment) {
      return res.status(404).json({ error: 'No active enrollment found' });
    }

    res.json({ enrollment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrollment' });
  }
};

exports.getEnrollmentHistory = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ enrollments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrollment history' });
  }
};

exports.cancelEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id, status: 'active' },
      { status: 'cancelled' },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ error: 'Active enrollment not found' });
    }

    res.json({ message: 'Enrollment cancelled', enrollment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to cancel enrollment' });
  }
};

exports.updateEnrollment = async (req, res) => {
  try {
    const { autoRenew } = req.body;
    const enrollment = await Enrollment.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { autoRenew },
      { new: true }
    );

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    res.json({ enrollment });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update enrollment' });
  }
};
