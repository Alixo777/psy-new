const express = require('express');
const { MeetsModel, validateMeet } = require('../models/meetsModel'); // Import the Meets model and validation function
const router = express.Router();

// Get all meets
router.get('/', async (req, res) => {
  try {
    let data = await MeetsModel.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving meets data", error: error.message });
  }
});

// Create a new meet
router.post('/', async (req, res) => {
  const { error } = validateMeet(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  const meet = new MeetsModel(req.body);
  try {
    await meet.save();
    res.json(meet);
  } catch (error) {
    res.status(500).json({ message: "Error saving meet", error: error.message });
  }
});

// Delete a meet by ID
router.delete("/:delId", async (req, res) => {
  const delId = req.params.delId;
  try {
    const data = await MeetsModel.deleteOne({ _id: delId });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error deleting meet", error: error.message });
  }
});

// Update a meet by ID
router.put("/:id", async (req, res) => {
  const meetId = req.params.id;

  const { error } = validateMeet(req.body);
  if (error) {
    return res.status(400).json(error.details);
  }

  try {
    const updatedMeet = await MeetsModel.findByIdAndUpdate(
      meetId,
      req.body,
      { new: true } // Return the updated document
    );

    if (!updatedMeet) {
      return res.status(404).json({ message: "Meet not found" });
    }

    res.json(updatedMeet);
  } catch (error) {
    res.status(500).json({ message: "Error updating meet data", error: error.message });
  }
});

module.exports = router;
