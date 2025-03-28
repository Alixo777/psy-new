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

// Function to save meetData to the database
exports.saveMeetData = async (meetData) => {
  try {
    
    // Find the latest meet for the patient to determine the next meetNum
    const latestMeet = await exports.MeetsModel.findOne({ patientId: meetData.patientId })
      .sort({ meetNum: -1 })
      .exec();
    meetData.meetNum = latestMeet ? latestMeet.meetNum + 1 : 1; // Increment or start at 1

    const meet = new exports.MeetsModel(meetData);
    await meet.save();
    return { success: true, data: meet };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Function to convert meetData to MeetsModel
exports.convertToMeetsModel = (meetData) => {
  return {
    stressExamID: meetData.examType === 'stress' ? meetData.exam : null,
    panicExamID: meetData.examType === 'panic' ? meetData.exam : null,
    depressionExamID: meetData.examType === 'depression' ? meetData.exam : null,
    socialPanicExamID: meetData.examType === 'SocialPanic' ? meetData.exam : null,
    selfConfidenceExamID: meetData.examType === 'SelfConfidence' ? meetData.exam : null,
    patientId: meetData.patient,
    therapistID: meetData.therapistId, // Add therapist reference
    meetCode: `MEET-${Date.now()}`, // Example meetCode generation
    startDate: new Date().toISOString(), // Default to current date
    meetNum: 1, // Default meet number
    // Add other fields as needed
  };
};
