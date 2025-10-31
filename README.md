# Learning Management System (LMS)

A comprehensive full-stack Learning Management System built with React.js, Node.js, Express.js, and MongoDB.

## 🚀 Features

### User Features
- **User Authentication**: Secure registration and login with JWT
- **Course Categories**: Soft Skills, Technical Skills, and Analytical Skills
- **Mixed Content**: Free basic content and paid premium content
- **Payment Integration**: Stripe payment gateway for premium courses
- **Progress Tracking**: Track learning progress across courses
- **Assessments**: Quizzes and final assessments for courses
- **Certificates**: Downloadable certificates upon course completion
- **AI Chatbot**: Intelligent chatbot for course-related queries

### Admin Features
- **Course Management**: Create, edit, and delete courses
- **Student Monitoring**: Track student progress and performance
- **Payment Management**: Monitor transactions and payments
- **Content Management**: Manage course materials and resources

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Modern UI**: Glassmorphism effects and responsive design

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcrypt**: Password hashing
- **Stripe**: Payment processing

## 📁 Project Structure

```
ONLINE-LEARNING/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Stripe account for payment processing

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create `.env` file with required environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PORT=5000
   ```

3. Start backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start frontend development server:
   ```bash
   npm start
   ```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (Admin)
- `PUT /api/courses/:id` - Update course (Admin)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Enrollment
- `POST /api/enroll` - Enroll in course
- `GET /api/user/courses` - Get user's enrolled courses

### Payments
- `POST /api/payment/create-intent` - Create payment intent
- `POST /api/payment/confirm` - Confirm payment

### Assessments
- `POST /api/assessments/submit` - Submit assessment
- `GET /api/assessments/results` - Get assessment results

## 🔐 Environment Variables

Create `.env` files in both backend directories:

### Backend `.env`
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms_db
JWT_SECRET=your_super_secure_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
PORT=5000
NODE_ENV=development
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px and above)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@lms-platform.com or join our Slack channel.

---

**Built with ❤️ by [Your Name]**