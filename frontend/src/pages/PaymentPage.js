import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaLock, 
  FaCreditCard, 
  FaShieldAlt, 
  FaCheck,
  FaClock,
  FaUsers,
  FaStar,
  FaArrowLeft,
  FaPaypal,
  FaApple,
  FaGoogle
} from 'react-icons/fa';
import { CourseContext } from '../context/CourseContext';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCourse, processPayment } = useContext(CourseContext);
  const { user } = useContext(AuthContext);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [billingInfo, setBillingInfo] = useState({
    email: user?.email || '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const courseData = await getCourse(id);
      setCourse(courseData);
    } catch (error) {
      toast.error('Failed to load course details');
      navigate('/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCardInputChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (value.length > 19) value = value.substring(0, 19);
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '').replace(/(\d{2})(\d{2})/, '$1/$2');
      if (value.length > 5) value = value.substring(0, 5);
    }
    
    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '');
      if (value.length > 3) value = value.substring(0, 3);
    }

    setCardData({
      ...cardData,
      [name]: value
    });
  };

  const handleBillingChange = (e) => {
    setBillingInfo({
      ...billingInfo,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (paymentMethod === 'card') {
      const { cardNumber, expiryDate, cvv, cardholderName } = cardData;
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        toast.error('Please fill in all card details');
        return false;
      }
      
      if (cardNumber.replace(/\s/g, '').length < 16) {
        toast.error('Please enter a valid card number');
        return false;
      }
      
      if (cvv.length < 3) {
        toast.error('Please enter a valid CVV');
        return false;
      }
    }

    const { email, firstName, lastName } = billingInfo;
    if (!email || !firstName || !lastName) {
      toast.error('Please fill in all required billing information');
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentData = {
        courseId: course._id,
        amount: course.price,
        paymentMethod,
        ...(paymentMethod === 'card' ? { cardData } : {}),
        billingInfo
      };

      await processPayment(paymentData);
      
      toast.success('Payment successful! Welcome to the course!');
      navigate(`/dashboard/course/${course._id}`);
      
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Purchase</h1>
          <p className="text-gray-600 mt-2">
            Secure checkout powered by industry-leading encryption
          </p>
        </div>
      </div>

      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handlePayment} className="space-y-6">
                {/* Payment Method Selection */}
                <div className="card p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-3 transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FaCreditCard className="text-xl" />
                      <span className="font-medium">Credit Card</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-3 transition-colors ${
                        paymentMethod === 'paypal'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FaPaypal className="text-xl text-blue-600" />
                      <span className="font-medium">PayPal</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple')}
                      className={`p-4 border-2 rounded-lg flex items-center justify-center space-x-3 transition-colors ${
                        paymentMethod === 'apple'
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FaApple className="text-xl" />
                      <span className="font-medium">Apple Pay</span>
                    </button>
                  </div>
                </div>

                {/* Card Details (if card selected) */}
                {paymentMethod === 'card' && (
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Card Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          name="cardholderName"
                          value={cardData.cardholderName}
                          onChange={handleCardInputChange}
                          className="input-field"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={cardData.cardNumber}
                          onChange={handleCardInputChange}
                          className="input-field"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={cardData.expiryDate}
                            onChange={handleCardInputChange}
                            className="input-field"
                            placeholder="MM/YY"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={cardData.cvv}
                            onChange={handleCardInputChange}
                            className="input-field"
                            placeholder="123"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing Information */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={billingInfo.firstName}
                        onChange={handleBillingChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={billingInfo.lastName}
                        onChange={handleBillingChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={billingInfo.email}
                        onChange={handleBillingChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={billingInfo.address}
                        onChange={handleBillingChange}
                        className="input-field"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={billingInfo.city}
                        onChange={handleBillingChange}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={billingInfo.zipCode}
                        onChange={handleBillingChange}
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="card p-6">
                  <button
                    type="submit"
                    disabled={processing}
                    className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? (
                      <div className="flex items-center justify-center">
                        <div className="spinner mr-3" />
                        Processing Payment...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <FaLock className="mr-2" />
                        Complete Purchase - ${course.price}
                      </div>
                    )}
                  </button>
                  
                  <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center">
                      <FaShieldAlt className="mr-2 text-green-500" />
                      <span>SSL Secured</span>
                    </div>
                    <div className="flex items-center">
                      <FaLock className="mr-2 text-green-500" />
                      <span>256-bit Encryption</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                {/* Course Info */}
                <div className="mb-6">
                  <img
                    src={course.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop&crop=center`}
                    alt={course.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">by {course.instructor}</p>
                  
                  {/* Course Features */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <FaClock className="mr-2" />
                        <span>Duration</span>
                      </div>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <FaUsers className="mr-2" />
                        <span>Students</span>
                      </div>
                      <span className="font-medium">{course.enrolledCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-600">
                        <FaStar className="mr-2 text-yellow-400" />
                        <span>Rating</span>
                      </div>
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What's Included</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                      <span>Lifetime access to course content</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                      <span>Certificate of completion</span>
                    </div>
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2 flex-shrink-0" />
                      <span>24/7 student support</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Price</span>
                      <span>${course.price}</span>
                    </div>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-${course.originalPrice - course.price}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span>$0</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${course.price}</span>
                    </div>
                  </div>
                </div>

                {/* Money Back Guarantee */}
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <FaShieldAlt className="text-green-600 mr-2" />
                    <span className="font-semibold text-green-800">30-Day Money Back Guarantee</span>
                  </div>
                  <p className="text-sm text-green-700">
                    If you're not satisfied with the course, we'll refund your money within 30 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;