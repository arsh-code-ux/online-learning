import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  FaCreditCard, 
  FaShieldAlt, 
  FaCheck, 
  FaLock,
  FaPaypal,
  FaStar,
  FaClock,
  FaUser,
  FaCheckCircle
} from 'react-icons/fa';
import { courseAPI, paymentAPI } from '../utils/api';
import toast from 'react-hot-toast';

// Stripe public key - For production, use environment variable
// For demo purposes, Stripe is optional - payment will work without it
const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || null;
let stripePromise = null;

// Only initialize Stripe if we have a valid key
if (STRIPE_PUBLIC_KEY && STRIPE_PUBLIC_KEY.startsWith('pk_')) {
  stripePromise = loadStripe(STRIPE_PUBLIC_KEY).catch(err => {
    console.warn('Stripe failed to load:', err);
    return null;
  });
}

const CheckoutForm = ({ course, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // For demo purposes, simulate successful payment
      if (paymentMethod === 'demo') {
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast.success('Payment successful! (Demo Mode)');
        onSuccess();
        navigate('/dashboard');
        return;
      }

      // Create payment intent
      const { data } = await paymentAPI.createPaymentIntent(course._id, course.price);
      
      const cardElement = elements.getElement(CardElement);
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: 'Demo User',
            },
          }
        }
      );

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Payment successful!');
        onSuccess();
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="grid grid-cols-1 gap-3">
          <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="demo"
              checked={paymentMethod === 'demo'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div className="flex items-center">
              <FaCheckCircle className="text-green-600 mr-2" />
              <span className="font-medium">Demo Payment (Free for Testing)</span>
            </div>
          </label>
          
          <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div className="flex items-center">
              <FaCreditCard className="text-blue-600 mr-2" />
              <span className="font-medium">Credit/Debit Card</span>
            </div>
          </label>

          <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3"
            />
            <div className="flex items-center">
              <FaPaypal className="text-blue-500 mr-2" />
              <span className="font-medium">PayPal</span>
            </div>
          </label>
        </div>
      </div>

      {/* Card Details (only show if card is selected) */}
      {paymentMethod === 'card' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-md p-3 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500">
            <CardElement options={cardOptions} />
          </div>
        </div>
      )}

      {/* Demo Payment Notice */}
      {paymentMethod === 'demo' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Demo Mode Active</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            This is a demonstration. No actual payment will be processed.
          </p>
        </div>
      )}

      {/* PayPal Notice */}
      {paymentMethod === 'paypal' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <FaPaypal className="text-blue-600 mr-2" />
            <span className="text-blue-800 font-medium">PayPal Integration</span>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            PayPal integration coming soon. Use demo payment for now.
          </p>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center">
          <FaShieldAlt className="text-green-600 mr-2" />
          <span className="text-gray-800 font-medium">Secure Payment</span>
        </div>
        <p className="text-gray-600 text-sm mt-1">
          Your payment information is encrypted and secure. We never store your card details.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || (!stripe && paymentMethod === 'card')}
        className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="spinner mr-2" />
            Processing...
          </div>
        ) : (
          <div className="flex items-center">
            <FaLock className="mr-2" />
            {paymentMethod === 'demo' ? 'Complete Demo Purchase' : `Pay $${course?.price || 0}`}
          </div>
        )}
      </button>
    </form>
  );
};

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await courseAPI.getCourse(id);
        if (data.success) {
          setCourse(data.course);
        }
      } catch (error) {
        toast.error('Course not found');
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id, navigate]);

  const handlePaymentSuccess = async () => {
    try {
      await courseAPI.enrollCourse(id);
      toast.success('Successfully enrolled in course!');
    } catch (error) {
      console.error('Enrollment error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4" />
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Not Found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="btn-primary"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Course Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Purchase</h1>
            
            <div className="border-b border-gray-200 pb-6 mb-6">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <FaUser className="text-gray-400 mr-2" />
                  <span>{course.instructor}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="text-gray-400 mr-2" />
                  <span>{course.duration}</span>
                </div>
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-2" />
                  <span>{course.rating} ({course.studentsEnrolled} students)</span>
                </div>
                <div className="flex items-center">
                  <span className="text-lg font-bold text-primary-600">${course.price}</span>
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaCheck className="text-green-600 mr-2" />
                  <span>Lifetime access to course content</span>
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-600 mr-2" />
                  <span>Certificate of completion</span>
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-600 mr-2" />
                  <span>Access to course community</span>
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-600 mr-2" />
                  <span>Mobile and desktop access</span>
                </li>
                <li className="flex items-center">
                  <FaCheck className="text-green-600 mr-2" />
                  <span>30-day money-back guarantee</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Details</h2>
            
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Course Price</span>
                <span className="font-semibold">${course.price}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-primary-600">${course.price}</span>
                </div>
              </div>
            </div>

            <Elements stripe={stripePromise}>
              <CheckoutForm 
                course={course} 
                onSuccess={handlePaymentSuccess}
              />
            </Elements>

            <div className="mt-6 text-center text-sm text-gray-500">
              By completing your purchase, you agree to our Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;