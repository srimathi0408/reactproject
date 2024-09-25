const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const craftRoutes = require('./routes/craftRoutes'); // Ensure this path is correct
const decorRoutes = require('./routes/decorRoutes')
const statueRoutes = require('./routes/statueRoutes');
const productRoutes = require('./routes/productRoutes'); // Ensure this path is correct
const User = require('./models/User');
const app = express();
const port = 5000;

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));


app.use(express.json());


mongoose.connect('mongodb://localhost:27017/craftDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB:', err);
});

app.use('/api', craftRoutes); // Ensure this line is correct
app.use('/api',decorRoutes);
app.use('/api', statueRoutes);
app.use('/api/Products', productRoutes); // Updated to use productRoutes

// Signup route
app.post('/api/signup', async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
      console.error('Failed to register user:', error);
      res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  try {
      const { email, password } = req.body;
      if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
      console.error('Failed to login:', error);
      res.status(500).json({ error: 'Failed to login' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
