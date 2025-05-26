const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const User = require('C:\Users\KIIT0001\Desktop\Project Revise\loginpage\source\models\User.js'); 
const app = express();

mongoose.connect('mongodb://localhost:27017/register');
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loginpage.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'registration.html'));
});

app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: identifier }, { email: identifier }, { employeeId: identifier }] // Added employeeId check
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username/email/employee ID or password' });
    }

    const isMatch = await user.comparePassword(password); // Use the method from schema
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/email/employee ID or password' });
    }

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.post('/register', async (req, res) => {
  try {
    const { firstname, lastname, email, password, employeeId, gender, country } = req.body;

    const existingUser = await User.findOne({ $or: [{ email: email }, { employeeId: employeeId }] });
    if (existingUser) {
      let message = '';
      if (existingUser.email === email) {
        message += 'Email already registered. ';
      }
      if (existingUser.employeeId === employeeId) {
        message += 'Employee ID already registered.';
      }
      return res.status(409).send(message.trim());
    }

    const newUser = new User({
      firstname,
      lastname,
      email,
      password,
      employeeId,
      gender,
      country,
      username: email 
    });

    await newUser.save();
    res.status(201).send('Registration successful! You can now login.');
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).send(`Validation error: ${messages.join(', ')}`);
    }
    res.status(500).send('Server error during registration');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});