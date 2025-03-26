const express = require('express');
const router = express.Router();
const Result = require('../models/Result'); // Import the Result model

// POST route to save a result
router.post('/saveResult', async (req, res) => {
  try {
    const { exam, therapist, date, time, examName } = req.body; // Include examName

    const newResult = new Result({
      exam,
      therapist,
      date,
      time,
      testName: examName, // Map examName to testName in the model
    });

    const savedResult = await newResult.save();
    res.status(201).json({ message: 'Result saved successfully', result: savedResult });
  } catch (error) {
    console.error('Error saving result:', error);
    res.status(500).json({ error: 'Failed to save result' });
  }
});

// POST route for booking
router.post('/booking', async (req, res) => {
    try {
        const { exam, therapist, date, time, clickedExamName } = req.body; // Destructure fields
        const newBooking = new Result({ exam, therapist, date, time, clickedExamName }); // Include all fields
        await newBooking.save(); // Save the booking to the database
        res.status(201).json({ message: 'Booking saved successfully', booking: newBooking });
    } catch (error) {
        res.status(500).json({ message: 'Error saving booking', error: error.message });
    }
});

// GET route to fetch all results
router.get('/getResults', async (req, res) => {
  try {
    const results = await Result.find();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

module.exports = router;
