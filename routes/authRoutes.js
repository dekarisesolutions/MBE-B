const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';

  if (username === adminUsername && password === adminPassword) {
    // In a production app, we would generate and return a JWT here.
    // For this simple implementation, returning a success flag is enough.
    res.status(200).json({ success: true, token: 'fake-jwt-token-mbe-admin' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

module.exports = router;
