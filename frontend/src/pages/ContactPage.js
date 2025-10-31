import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaClock,
  FaUser,
  FaPaperPlane,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    // Add contact page styles
    const contactStyles = document.createElement('style');
    contactStyles.textContent = `
      .contact-page {
        position: relative;
        overflow-x: hidden;
      }

      .hero-background {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
        overflow: hidden;
      }

      .hero-background::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23ffffff' fill-opacity='0.05'/%3E%3C/svg%3E");
        animation: movePattern 20s linear infinite;
      }

      @keyframes movePattern {
        0% { transform: translateX(0); }
        100% { transform: translateX(60px); }
      }

      .floating-elements {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
        pointer-events: none;
      }

      .floating-element {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        animation: floatUpDown 6s ease-in-out infinite;
      }

      .floating-element:nth-child(1) {
        width: 100px;
        height: 100px;
        top: 10%;
        left: 10%;
        animation-delay: 0s;
      }

      .floating-element:nth-child(2) {
        width: 60px;
        height: 60px;
        top: 70%;
        right: 10%;
        animation-delay: 2s;
      }

      .floating-element:nth-child(3) {
        width: 80px;
        height: 80px;
        top: 40%;
        left: 80%;
        animation-delay: 4s;
      }

      @keyframes floatUpDown {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-30px) rotate(180deg); }
      }

      .hero-content {
        animation: fadeInUp 1s ease-out;
      }

      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(50px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .card {
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        transition: all 0.3s ease;
        animation: slideUp 0.8s ease-out;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .gradient-text {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }

      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
      }

      .input-field {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 8px;
        background: white;
        transition: all 0.3s ease;
        font-size: 16px;
      }

      .input-field:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      .spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      .section-divider {
        width: 100px;
        height: 4px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0 auto;
        border-radius: 2px;
      }
    `;
    document.head.appendChild(contactStyles);

    return () => {
      if (document.head.contains(contactStyles)) {
        document.head.removeChild(contactStyles);
      }
    };
  }, []);

  return (
    <div className="contact-page min-h-screen bg-white">
      {/* Hero Section */}
      <section className="hero-background py-20 px-4">
        {/* Floating Elements */}
        <div className="floating-elements">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        <div className="hero-content max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get in <span className="text-yellow-300">Touch</span>
          </h1>
          <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
            Have questions about our courses? Need help with your learning journey? 
            We're here to help! Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field pl-10"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="courses">Course Information</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="input-field resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="spinner mr-2" />
                  ) : (
                    <FaPaperPlane className="mr-2" />
                  )}
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">
                  Our team is ready to help you succeed. Choose the best way to reach us, 
                  and we'll get back to you as soon as possible.
                </p>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaEnvelope className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600 mb-2">Send us an email anytime</p>
                    <a 
                      href="mailto:support@learnhub.com"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      support@learnhub.com
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaPhone className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600 mb-2">Mon-Fri from 8am to 6pm</p>
                    <a 
                      href="tel:+1234567890"
                      className="text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 hover:from-purple-100 hover:to-violet-100 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaMapMarkerAlt className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Visit Us</h3>
                    <p className="text-gray-600">
                      123 Learning Street<br />
                      Education City, EC 12345<br />
                      United States
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                    <FaClock className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200 shadow-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Follow Us</h3>
                <p className="text-gray-600 mb-4">
                  Stay connected with us on social media for updates and learning tips.
                </p>
                <div className="flex space-x-4">
                  <a 
                    href="https://facebook.com/learnhub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    aria-label="Follow us on Facebook"
                  >
                    <FaFacebook />
                  </a>
                  <a 
                    href="https://twitter.com/learnhub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-sky-400 to-sky-500 rounded-xl flex items-center justify-center text-white hover:from-sky-500 hover:to-sky-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    aria-label="Follow us on Twitter"
                  >
                    <FaTwitter />
                  </a>
                  <a 
                    href="https://linkedin.com/company/learnhub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl flex items-center justify-center text-white hover:from-blue-800 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    aria-label="Follow us on LinkedIn"
                  >
                    <FaLinkedin />
                  </a>
                  <a 
                    href="https://instagram.com/learnhub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    aria-label="Follow us on Instagram"
                  >
                    <FaInstagram />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <div className="section-divider mb-6"></div>
            <p className="text-xl text-gray-600">
              Quick answers to common questions about our platform and courses.
            </p>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How do I enroll in a course?
              </h3>
              <p className="text-gray-600">
                Simply browse our course catalog, select a course that interests you, and click the "Enroll" button. 
                For free courses, you'll be enrolled immediately. For premium courses, you'll complete the payment process first.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Do I get a certificate after completing a course?
              </h3>
              <p className="text-gray-600">
                Yes! You'll receive a verified certificate for each course you complete successfully. 
                Certificates are downloadable as PDF files and can be shared on LinkedIn.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Can I access courses on mobile devices?
              </h3>
              <p className="text-gray-600">
                Absolutely! Our platform is fully responsive and works great on all devices, 
                including smartphones and tablets. Learn anywhere, anytime.
              </p>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What if I need help during a course?
              </h3>
              <p className="text-gray-600">
                Our AI chatbot is available 24/7 to answer your questions. You can also contact our 
                support team via email or phone during business hours.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;