const express = require('express');
const router = express.Router();
const Meet = require('../models/Meet'); // Assuming a Mongoose model for meets

// Route to get all meets with populated references
router.get('/getAllMeets', async (req, res) => {
  try {
    const meets = await Meet.find()
      .populate('therapistID', 'name specialty') // Ensure therapist details are populated
      .populate('patientId', 'firstName lastName') // Populate patient details
      .populate('depressionExamID')
      .populate('panicExamID')
      .populate('selfConfidenceExamID')
      .populate('socialPanicExamID')
      .populate('stressExamID'); // Populate related exam details

    res.json(meets);
  } catch (error) {
    console.error('Error fetching meets:', error);
    res.status(500).json({ error: 'Failed to fetch meets' });
  }
});

module.exports = router;
