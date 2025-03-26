const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    name: { type: String }, // Removed required: true
    email: { type: String }, // Removed required: true
    date: { type: Date, required: true },
    service: { type: String }, // Removed required: true
    testName: { type: String }, // Added testName field
    // Add other fields as needed
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
