import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FaCreditCard, FaLock, FaCheck, FaStar } from 'react-icons/fa';
import { getCurriculumByCourseId } from '../data/courseCurriculum';

// NOTE: don't initialize Stripe at module import time - lazy-load when the payment page mounts

const CheckoutForm = ({ course, price, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [succeeded, setSucceeded] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError('');

    const cardElement = elements.getElement(CardElement);

    // Create payment method
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: 'Premium Course Student',
        email: 'student@example.com',
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
      return;
    }

    // Simulate payment processing (in real app, call your backend)
    setTimeout(() => {
      setSucceeded(true);
      setProcessing(false);
      
      // Store premium access in localStorage (in real app, update database)
      const premiumCourses = JSON.parse(localStorage.getItem('premiumCourses') || '[]');
      if (!premiumCourses.includes(course.courseId)) {
        premiumCourses.push(course.courseId);
        localStorage.setItem('premiumCourses', JSON.stringify(premiumCourses));
      }
      
      // Call success callback
      onPaymentSuccess(course.courseId);
      
      // Redirect to course after delay
      setTimeout(() => {
        navigate(`/course/${course.courseId}`);
      }, 2000);
    }, 2000);
  };

  return (
    <div className="checkout-form">
      <style jsx>{`
        .checkout-form {
          max-width: 500px;
          margin: 0 auto;
          background: white;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
        }
        
        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .form-header h2 {
          color: #1e293b;
          margin-bottom: 8px;
          font-size: 24px;
        }
        
        .course-info {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
        }
        
        .course-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .course-features {
          font-size: 14px;
          opacity: 0.9;
        }
        
        .price-display {
          text-align: center;
          margin: 24px 0;
          font-size: 32px;
          font-weight: bold;
          color: #1e293b;
        }
        
        .card-element-container {
          margin: 24px 0;
          padding: 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: #f8fafc;
        }
        
        .pay-button {
          width: 100%;
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 20px;
        }
        
        .pay-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
        }
        
        .pay-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .error-message {
          color: #ef4444;
          background: #fef2f2;
          padding: 12px;
          border-radius: 8px;
          margin: 16px 0;
          text-align: center;
        }
        
        .success-message {
          color: #10b981;
          background: #f0fdf4;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          margin: 16px 0;
        }
        
        .security-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #64748b;
          font-size: 14px;
          margin-top: 16px;
        }
      `}</style>

      <div className="form-header">
        <h2>Complete Your Purchase</h2>
        <p style={{ color: '#64748b' }}>Unlock premium content and advance your skills</p>
      </div>

      <div className="course-info">
        <div className="course-title">{course.courseTitle}</div>
        <div className="course-features">
          ✨ {course.modules?.length || 0} Premium Modules • 
          📹 High-Quality Videos • 
          📚 Advanced Content • 
          🏆 Lifetime Access
        </div>
      </div>

      <div className="price-display">
        ₹{(price / 100).toFixed(2)}
      </div>

      {!succeeded ? (
        <form onSubmit={handleSubmit}>
          <div className="card-element-container">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={!stripe || processing}
            className="pay-button"
          >
            {processing ? (
              <>
                <div style={{ display: 'inline-block', marginRight: '8px' }}>
                  <div style={{ 
                    width: '16px', 
                    height: '16px', 
                    border: '2px solid rgba(255,255,255,0.3)', 
                    borderLeft: '2px solid white', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' 
                  }}></div>
                </div>
                Processing Payment...
              </>
            ) : (
              <>
                <FaCreditCard style={{ marginRight: '8px' }} />
                Pay ₹{(price / 100).toFixed(2)}
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="success-message">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎉</div>
          <h3>Payment Successful!</h3>
          <p>You now have lifetime access to this premium course. Redirecting to your course...</p>
        </div>
      )}

      <div className="security-info">
        <FaLock />
        <span>Secure payment powered by Stripe</span>
      </div>
    </div>
  );
};

const PremiumPaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [course, setCourse] = useState(null);
  const [price, setPrice] = useState(0);
  const [stripePromise, setStripePromise] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lazy-load Stripe.js when this page mounts to avoid loading it globally
    let mounted = true;
    const key = 'pk_test_51QKqplGzzANjIRRi1f1VhdZfYp8vj5gaxO5JXQOWGtAapNRrDBscGNNRNTPKJPYxbBnqU9qzTLsOsnKw6e0TVKoi00K7xUkxhd';
    loadStripe(key)
      .then(sp => {
        if (mounted) setStripePromise(sp);
      })
      .catch(err => {
        console.error('Failed to load Stripe.js', err);
        // leave stripePromise as null - we handle fallback in render
      });

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const courseId = searchParams.get('course');
    const coursePrice = parseInt(searchParams.get('price')) || 0;
    
    if (courseId) {
      const courseData = getCurriculumByCourseId(courseId);
      if (courseData && courseData.isPremium) {
        setCourse(courseData);
        setPrice(coursePrice);
      } else {
        // Redirect if course not found or not premium
        navigate('/courses');
      }
    } else {
      navigate('/courses');
    }
  }, [searchParams, navigate]);

  const handlePaymentSuccess = (courseId) => {
    console.log(`Payment successful for course: ${courseId}`);
    // Here you would typically update your database/backend
  };

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '50px 20px' 
    }}>
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: 'white', fontSize: '36px', marginBottom: '16px' }}>
            Upgrade to Premium
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px' }}>
            Unlock advanced content and accelerate your learning journey
          </p>
        </div>

        {stripePromise ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm 
              course={course} 
              price={price}
              onPaymentSuccess={handlePaymentSuccess}
            />
          </Elements>
        ) : (
          <div style={{ textAlign: 'center', color: 'white', padding: '24px' }}>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>Initializing secure payment gateway…</div>
            <div style={{ opacity: 0.9 }}>If this message persists, please check your network or disable any script-blocking extensions.</div>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px', 
          marginTop: '40px' 
        }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '24px', 
            borderRadius: '12px', 
            color: 'white', 
            textAlign: 'center' 
          }}>
            <FaStar style={{ fontSize: '32px', color: '#ffd700', marginBottom: '12px' }} />
            <h3>Premium Quality</h3>
            <p>High-quality video content created by industry experts</p>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '24px', 
            borderRadius: '12px', 
            color: 'white', 
            textAlign: 'center' 
          }}>
            <FaCheck style={{ fontSize: '32px', color: '#10b981', marginBottom: '12px' }} />
            <h3>Lifetime Access</h3>
            <p>One-time payment for permanent access to all course materials</p>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)', 
            padding: '24px', 
            borderRadius: '12px', 
            color: 'white', 
            textAlign: 'center' 
          }}>
            <FaLock style={{ fontSize: '32px', color: '#3b82f6', marginBottom: '12px' }} />
            <h3>Secure Payment</h3>
            <p>Your payment information is protected with industry-standard encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPaymentPage;