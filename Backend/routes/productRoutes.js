const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Import the Product model

// POST route to add a new product
router.post('/add', async (req, res) => {
  console.log('Request Body:', req.body); // Log request data
  
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    console.log('Product saved:', newProduct); // Log saved product data
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error); // Log any errors
    res.status(500).json({ message: 'Error occurred while adding product', error });
  }
});


module.exports = router;
