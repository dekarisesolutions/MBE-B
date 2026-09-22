const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(express.json());

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Motofence Backend API is running"
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/auth', require('./routes/authRoutes'));

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/motofence';

// Reuse connection for serverless environments (Vercel)
if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGO_URI, { family: 4 })
    .then(() => {
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB', err);
    });
}

// Only listen locally if run directly (not imported by Vercel)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for serverless execution
module.exports = app;
