const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Mock database - in production, use a real database
let ratings = [];
let qrCodes = [];

// API Routes for feedback submission
app.post('/api/feedback', (req, res) => {
  try {
    const { token, rating, comment, tableNumber, lastName, timestamp, deviceInfo } = req.body;
    
    // Validate required fields
    if (!token || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Invalid rating data'
      });
    }

    // In a real app, validate the QR token
    const qrCode = qrCodes.find(qr => qr.token === token);
    if (!qrCode && token !== 'demo_token') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired QR code'
      });
    }

    // Create rating record
    const newRating = {
      id: `rating_${Date.now()}_${Math.random()}`,
      waiterId: qrCode ? qrCode.waiterId : 'demo_waiter',
      guestId: `guest_${Date.now()}`,
      qrToken: token,
      rating: parseInt(rating),
      comment: comment || null,
      tableNumber: tableNumber || null,
      lastName: lastName || null,
      timestamp: new Date(timestamp),
      location: deviceInfo?.location || null,
      isVerified: true,
      isFlagged: false,
      deviceInfo
    };

    ratings.push(newRating);

    // Calculate points awarded
    let pointsAwarded = 0;
    if (rating === 4) pointsAwarded = 10;
    if (rating === 5) pointsAwarded = 20;

    console.log('New rating received:', {
      rating: newRating.rating,
      points: pointsAwarded,
      waiter: newRating.waiterId,
      table: newRating.tableNumber
    });

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      pointsAwarded
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// API to get ratings (for mobile app)
app.get('/api/ratings', (req, res) => {
  const { waiterId, since } = req.query;
  
  let filteredRatings = ratings;
  
  if (waiterId) {
    filteredRatings = ratings.filter(r => r.waiterId === waiterId);
  }
  
  if (since) {
    const sinceDate = new Date(since);
    filteredRatings = filteredRatings.filter(r => new Date(r.timestamp) >= sinceDate);
  }
  
  res.json(filteredRatings);
});

// API to validate QR codes
app.get('/api/qr/:token', (req, res) => {
  const { token } = req.params;
  
  // For demo, accept any token
  if (token === 'demo_token' || token.startsWith('token_')) {
    res.json({
      isValid: true,
      waiterId: 'demo_waiter',
      waiterName: 'John Smith',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });
  } else {
    res.status(404).json({
      isValid: false,
      message: 'Invalid QR code'
    });
  }
});

// Serve feedback form for any /feedback/* route
app.get('/feedback/:token', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'feedback.html'));
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    ratings: ratings.length 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Feedback server running at http://localhost:${PORT}`);
  console.log(`📱 Test feedback form: http://localhost:${PORT}/feedback/demo_token`);
  console.log(`🔗 API health check: http://localhost:${PORT}/health`);
  
  // Create a demo QR code for testing
  qrCodes.push({
    id: 'demo_qr',
    waiterId: 'demo_waiter',
    token: 'demo_token',
    url: `http://localhost:${PORT}/feedback/demo_token`,
    isUsed: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });
});

module.exports = app;
