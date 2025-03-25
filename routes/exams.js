const express = require('express');
const { ExamsModel, validateExam } = require('../models/examsModel'); // Import the Exams model and validation function
const router = express.Router();

// Get all exams
router.get('/', async (req, res) => {
    try {
        let data = await ExamsModel.find({});
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving exams data", error: error.message });
    }
});

// Create a new exam
router.post('/', async (req, res) => {
    const { error } = validateExam(req.body);
    if (error) {
        return res.status(400).json(error.details);
    }

    const exam = new ExamsModel(req.body);
    try {
        await exam.save();
        res.json(exam);
    } catch (error) {
        res.status(500).json({ message: "Error saving exam", error: error.message });
    }
});

// Delete an exam by ID
router.delete("/:delId", async (req, res) => {
    const delId = req.params.delId;
    try {
        const data = await ExamsModel.deleteOne({ _id: delId });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error deleting exam", error: error.message });
    }
});

// Update an exam by ID
router.put("/:id", async (req, res) => {
    const examId = req.params.id;
    
    const { error } = validateExam(req.body);
    if (error) {
        return res.status(400).json(error.details);
    }

    try {
        const updatedExam = await ExamsModel.findByIdAndUpdate(
            examId,
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedExam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        res.json(updatedExam);
    } catch (error) {
        res.status(500).json({ message: "Error updating exam data", error: error.message });
    }
});

module.exports = router;
