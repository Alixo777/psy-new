const Joi = require('joi');
const mongoose = require('mongoose');

let meetsSchema = new mongoose.Schema({
  meetCode: String,
  date: String, // Save exact date selected in the last step
  time: String, // Save exact time selected in the last step
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
    therapistId: Joi.string().required(),
    date: Joi.string().required(), // Validate exact date
    time: Joi.string().required(), // Validate exact time
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

    // Ensure the time and date are exactly as chosen in the last step
    const meet = new exports.MeetsModel({
      ...meetData,
      date: meetData.date, // Use the exact date from the last step
      time: meetData.time, // Use the exact time from the last step
    });
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
    date: meetData.date, // Use the exact date from the last step
    time: meetData.time, // Use the exact time from the last step
    meetNum: 1, // Default meet number
    // Add other fields as needed
  };
};
