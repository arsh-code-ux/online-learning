const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  stripePaymentIntentId: {
    type: String,
    required: true,
    unique: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'usd',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'succeeded', 'failed', 'canceled', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'stripe'
  },
  transactionId: String,
  receiptUrl: String,
  refundId: String,
  refundAmount: Number,
  refundReason: String,
  metadata: {
    type: Map,
    of: String
  }
}, {
  timestamps: true
});

// Index for efficient queries
paymentSchema.index({ userId: 1, courseId: 1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);