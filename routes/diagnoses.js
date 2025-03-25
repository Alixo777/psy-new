
// create this file but instead diagrams - therapists
const express = require('express');
const { DiagnosesModel, validateDiagnose } = require('../models/diagnosesModel'); // Import the Diagnoses model and validation function
const router = express.Router();

// Get all diagnoses
router.get('/', async (req, res) => {
    try {
        let data = await DiagnosesModel.find({});
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving diagnoses data", error: error.message });
    }
});

// Create a new diagnosis
router.post('/', async (req, res) => {
    let validateBody = validateDiagnose(req.body);
    if (validateBody.error) {
        return res.status(400).json(validateBody.error.details);
    }

    let diagnose = new DiagnosesModel(req.body);
    try {
        await diagnose.save();
        res.json(diagnose);
    } catch (error) {
        res.status(500).json({ message: "Error saving diagnosis", error: error.message });
    }
});

// Delete a diagnosis by ID
router.delete("/:delId", async (req, res) => {
    let newDelId = req.params.delId;
    try {
        let data = await DiagnosesModel.deleteOne({ _id: newDelId });
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Error deleting diagnosis", error: error.message });
    }
});

// Update a diagnosis by ID
router.put("/:id", async (req, res) => {
    let diagnoseId = req.params.id;
    
    let validateBody = validateDiagnose(req.body);
    if (validateBody.error) {
        return res.status(400).json(validateBody.error.details);
    }

    try {
        let updatedDiagnose = await DiagnosesModel.findByIdAndUpdate(
            diagnoseId,
            req.body,
            { new: true } // Return the updated document
        );

        if (!updatedDiagnose) {
            return res.status(404).json({ message: "Diagnosis not found" });
        }

        res.json(updatedDiagnose);
    } catch (error) {
        res.status(500).json({ message: "Error updating diagnosis data", error: error.message });
    }
});

module.exports = router;
