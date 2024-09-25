const express = require('express');
const bcrypt = require('bcrypt'); // Make sure to install bcrypt
const User = require('../models/User'); // Ensure this path is correct

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Destructure email and password from the request body

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and if password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Respond with user role if authentication is successful
    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error('Error during login:', error); // Log error for debugging
    res.status(500).json({ message: 'Server error', error }); // Respond with server error
  }
});

module.exports = router;
