const express = require('express');
const { ExamsModel } = require('../models/examsModel'); // Import the Exams model and validation function
const { PatientsModel } = require('../models/patientsModel'); // Import the Patient model
const { BookingModel} = require('../models/booklingModel'); // Import the Booking model
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Get all exams
router.get('/', async (req, res) => {
  try {
    let data = await ExamsModel.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving exams data', error: error.message });
  }
});

// Get all patients (requires authentication)
router.get('/patients', authenticateToken, async (req, res) => {
  try {
    let patients = await PatientsModel.find({}, 'firstName lastName id');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving patients data', error: error.message });
  }
});

// Book an exam (requires authentication)
router.post('/bookExam', authenticateToken, async (req, res) => {
  const { examId, therapistId, date, time, patientId } = req.body;

  // Validate the booking data
  if (!examId || !therapistId || !date || !time || !patientId) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Create a new booking
    const booking = new BookingModel({
      examId,
      therapistId,
      date,
      time,
      patientId
    });

    // Save the booking to the database
    await booking.save();

    res.json({ message: 'Booking confirmed', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error booking exam', error: error.message });
  }
});

module.exports = router;