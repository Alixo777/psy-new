const express = require('express');
const router = express.Router();

// Import models for each exam
const exams = {
    depression: {
        model: require('../models/exams/depressionExamModel').DepressionExam,
        validate: require('../models/exams/depressionExamModel').validateDepressionExam
    },
    panic: {
        model: require('../models/exams/panicExamModel').PanicExam,
        validate: require('../models/exams/panicExamModel').validatePanicExam
    },
    selfConfidence: {
        model: require('../models/exams/selfConfidenceExamModel').SelfConfidenceExam,
        validate: require('../models/exams/selfConfidenceExamModel').validateSelfConfidenceExam
    },
    socialPanic: {
        model: require('../models/exams/socialPanicExamModel').SocialPanicExam,
        validate: require('../models/exams/socialPanicExamModel').validateSocialPanicExam
    },
    stress: {
        model: require('../models/exams/stressExamModel').StressExam,
        validate: require('../models/exams/stressExamModel').validateStressExam
    }
};

// router.get('/depression', async (req, res) => {

// })

// Get all exams of a specific type
router.get('/:examType', async (req, res) => {
    const { examType } = req.params;
    if (!exams[examType]) {
        return res.status(400).json({ message: "Invalid exam type." });
    }
    try {
        let data = await exams[examType].model.find({});
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving data", error: error.message });
    }
});

// Create a new exam of a specific type
router.post('/:examType', async (req, res) => {
    const { examType } = req.params;
    if (!exams[examType]) {
        return res.status(400).json({ message: "Invalid exam type." });
    }
    
    const { error } = exams[examType].validate(req.body);
    if (error) {
        return res.status(400).json(error.details);
    }
    
    try {
        const exam = new exams[examType].model(req.body);
        await exam.save();
        const message = `New ${examType} exam saved successfully.`;
        res.json({ message, exam });
    } catch (error) {
        res.status(500).json({ message: "Error saving exam", error: error.message });
    }
});

module.exports = router;
