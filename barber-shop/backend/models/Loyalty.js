const mongoose = require('mongoose');

const loyaltySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    tier: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum'],
      default: 'bronze',
    },
    totalVisits: {
      type: Number,
      default: 0,
    },
    history: [
      {
        action: { type: String, enum: ['earned', 'redeemed'] },
        points: Number,
        description: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

loyaltySchema.methods.addPoints = function (amount, description) {
  this.points += amount;
  this.totalVisits += 1;
  this.history.push({ action: 'earned', points: amount, description });
  this.tier = this.calculateTier();
  return this.save();
};

loyaltySchema.methods.redeemPoints = function (amount, description) {
  if (this.points < amount) {
    throw new Error('Insufficient points');
  }
  this.points -= amount;
  this.history.push({ action: 'redeemed', points: amount, description });
  return this.save();
};

loyaltySchema.methods.calculateTier = function () {
  if (this.totalVisits >= 50) return 'platinum';
  if (this.totalVisits >= 25) return 'gold';
  if (this.totalVisits >= 10) return 'silver';
  return 'bronze';
};

module.exports = mongoose.model('Loyalty', loyaltySchema);
