require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 5000;


// view the cart
app.get('/cart', (req, res) => {
    res.render('cart', { cartItems });
  });
// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Load the Item model and schema
const itemSchema = require('./cartSchema');
// Set the view engine to use EJS
app.set('view engine', 'ejs');
// Parse incoming requests
app.use(bodyParser.json());

// Serve static files (images)
app.use(express.static('public'));


// Get all items on sale
app.get('/', async (req, res) => {
  try {
    const items = await itemSchema.find();
    res.render('index', { items });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Internal Server Error');
  }
});


let cartItems = []; // Initialize cartItems as an empty array

// Add item to cart
app.post('/cart/add/:itemId', async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await itemSchema.findById(itemId);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return;
    }
    // Add the item to the cart (you can implement this part according to your needs)
    // For simplicity, let's assume you have a global cartItems array.
    cartItems.push(item);
    res.json({ message: 'Item added to cart successfully' });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// Serve the signup form
app.get('/signup', (req, res) => {
  res.render('signup');
});

// Handle the form submission to register a new user
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if the username and email are already registered
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).send('Username or email already registered.');
    }

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).send('User registered successfully!');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
