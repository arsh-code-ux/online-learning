const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const { auth, isStudent } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payment/create-intent
// @desc    Create payment intent for course purchase
// @access  Private
router.post('/create-intent', auth, isStudent, [
  body('courseId')
    .notEmpty()
    .withMessage('Course ID is required')
    .isMongoId()
    .withMessage('Invalid course ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { courseId } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if course is paid
    if (course.isFree) {
      return res.status(400).json({
        success: false,
        message: 'This course is free. Use the enrollment endpoint instead.'
      });
    }

    // Check if user is already enrolled
    const user = await User.findById(userId);
    const alreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(course.price * 100), // Stripe uses cents
      currency: 'usd',
      metadata: {
        courseId: courseId,
        userId: userId,
        courseName: course.title
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    // Save payment record
    const payment = new Payment({
      userId,
      courseId,
      stripePaymentIntentId: paymentIntent.id,
      amount: course.price,
      currency: 'usd',
      status: 'pending'
    });

    await payment.save();

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: course.price,
        courseName: course.title
      }
    });

  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating payment intent'
    });
  }
});

// @route   POST /api/payment/confirm
// @desc    Confirm successful payment and enroll user
// @access  Private
router.post('/confirm', auth, [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('Payment intent ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { paymentIntentId } = req.body;
    const userId = req.user.id;

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (!paymentIntent) {
      return res.status(404).json({
        success: false,
        message: 'Payment intent not found'
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      stripePaymentIntentId: paymentIntentId,
      userId
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Check if payment was successful
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed',
        paymentStatus: paymentIntent.status
      });
    }

    // Update payment status
    payment.status = 'succeeded';
    payment.transactionId = paymentIntent.id;
    await payment.save();

    // Get course and user
    const [course, user] = await Promise.all([
      Course.findById(payment.courseId),
      User.findById(userId)
    ]);

    // Enroll user in course
    user.enrolledCourses.push({
      courseId: payment.courseId,
      enrolledAt: new Date(),
      progress: 0,
      completed: false
    });

    await user.save();

    // Update course enrollment count
    course.enrollmentCount += 1;
    await course.save();

    res.json({
      success: true,
      message: 'Payment confirmed and enrollment completed',
      data: {
        courseId: payment.courseId,
        courseName: course.title,
        enrolledAt: new Date(),
        transactionId: paymentIntent.id
      }
    });

  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error confirming payment'
    });
  }
});

// @route   GET /api/payment/history
// @desc    Get user's payment history
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate('courseId', 'title thumbnail category price')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   POST /api/payment/webhook
// @desc    Handle Stripe webhooks
// @access  Public (Stripe webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Update payment status
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { 
            status: 'succeeded',
            transactionId: paymentIntent.id
          }
        );
        
        console.log('Payment succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        // Update payment status
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: failedPayment.id },
          { status: 'failed' }
        );
        
        console.log('Payment failed:', failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// @route   POST /api/payment/refund/:paymentId
// @desc    Process refund for a payment
// @access  Private (Admin only)
router.post('/refund/:paymentId', auth, async (req, res) => {
  try {
    // Only admin can process refunds for now
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { paymentId } = req.params;
    const { reason } = req.body;

    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Cannot refund payment that was not successful'
      });
    }

    // Create refund in Stripe
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
      reason: reason || 'requested_by_customer'
    });

    // Update payment record
    payment.status = 'refunded';
    payment.refundId = refund.id;
    payment.refundAmount = refund.amount / 100;
    payment.refundReason = reason;
    await payment.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refundId: refund.id,
        amount: refund.amount / 100
      }
    });

  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing refund'
    });
  }
});

module.exports = router;