const express = require('express');
const router = express.Router();
const { saveMeetData, convertToMeetsModel, MeetsModel } = require('../models/meetsModel');

// Route to save meetData
router.post('/saveMeet', async (req, res) => {
  try {
    const meetData = req.body;
    const meetsModelData = convertToMeetsModel(meetData);
    const result = await saveMeetData(meetsModelData);
    if (result.success) {
      res.status(201).send(result.data);
    } else {
      res.status(400).send({ error: result.error });
    }
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Route to get specific meet data with populated references
router.get('/getMeet/:id', async (req, res) => {
  try {
    const meetId = req.params.id;
    const meetData = await MeetsModel.findById(meetId)
      .populate('patientId', 'firstName lastName age phoneNumber') // Populate patient details
      .populate('therapistID', 'firstName lastName') // Populate therapist details
      .populate('depressionExamID')
      .populate('panicExamID')
      .populate('selfConfidenceExamID')
      .populate('socialPanicExamID')
      .populate('stressExamID');

    if (!meetData) {
      return res.status(404).send({ error: 'Meet not found' });
    }

    res.status(200).send(meetData);
  } catch (error) {
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

// Route to get all meets with populated references
router.get('/getAllMeets', async (req, res) => {
  try {
    const meets = await MeetsModel.find()
      .populate('patientId', 'firstName lastName age phoneNumber') // Populate patient details
      .populate('therapistID', 'firstName lastName') // Populate therapist details
      .populate('depressionExamID')
      .populate('panicExamID')
      .populate('selfConfidenceExamID')
      .populate('socialPanicExamID')
      .populate('stressExamID'); // Populate related exam details
    res.status(200).send(meets);
  } catch (error) {
    console.error('Error fetching meets:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
