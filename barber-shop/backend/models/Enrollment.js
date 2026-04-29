const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    plan: {
      type: String,
      required: [true, 'Plan is required'],
      enum: ['basic', 'standard', 'premium'],
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'cancelled', 'expired'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    servicesIncluded: [
      {
        service: String,
        quantity: Number,
        used: { type: Number, default: 0 },
      },
    ],
    autoRenew: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, status: 1 });

enrollmentSchema.methods.isActive = function () {
  return this.status === 'active' && new Date() <= this.endDate;
};

module.exports = mongoose.model('Enrollment', enrollmentSchema);
