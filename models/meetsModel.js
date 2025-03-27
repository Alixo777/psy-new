const Joi = require('joi');
const mongoose = require('mongoose');

let meetsSchema = new mongoose.Schema({
  meetCode: String,
  startDate: String,
  meetNum: Number,
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'patients' },
  therapistID: { type: mongoose.Schema.Types.ObjectId, ref: 'therapists' },
  depressionExamID: { type: mongoose.Schema.Types.ObjectId, ref: 'DepressionExam' },
  panicExamID: { type: mongoose.Schema.Types.ObjectId, ref: 'PanicExam' },
  selfConfidenceExamID: { type: mongoose.Schema.Types.ObjectId, ref: 'SelfConfidenceExam' },
  socialPanicExamID: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialPanicExam' },
  stressExamID: { type: mongoose.Schema.Types.ObjectId, ref: 'StressExam' },
});

// We need to export both the model and the validation function
exports.MeetsModel = mongoose.model("meets", meetsSchema);

// Validation function for the "meets" schema
const validateMeet = (meet) => {
  const schema = Joi.object({
    meetCode: Joi.string().required(),
    patientId: Joi.string().required(), // Should be a valid ObjectId
    tcode: Joi.string().required(),
    startDate: Joi.string().required(),
    meetNum: Joi.number().required()
  });
  return schema.validate(meet);
};

exports.validateMeet = validateMeet;
