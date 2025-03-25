const Joi = require('joi');
const mongoose = require('mongoose');

let meetsSchema = new mongoose.Schema({
  meetCode: String,
  patientId: String,
  tcode: String,
  startDate: String,
  meetNum: Number
});

// We need to export both the model and the validation function
exports.MeetsModel = mongoose.model("meets", meetsSchema);

// Validation function for the "meets" schema
const validateMeet = (meet) => {
  const schema = Joi.object({
    meetCode: Joi.string().required(),
    patientId: Joi.string().required(),
    tcode: Joi.string().required(),
    startDate: Joi.string().required(),
    meetNum: Joi.number().required()
  });
  return schema.validate(meet);
};

exports.validateMeet = validateMeet;
