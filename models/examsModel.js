const Joi = require('joi');
const mongoose = require('mongoose');

let examsSchema = new mongoose.Schema({
    examCode: String,
    examTypeCode: String,
    patientId: String,
    tCode: String,
    startDate: String,
    checkDate: String
});

exports.ExamsModel = mongoose.model("exams", examsSchema);

// Validation schema for the Exams model
const validateExam = (exam) => {
    const schema = Joi.object({
        examCode: Joi.string().allow(null),
        examTypeCode: Joi.string().allow(null),
        patientId: Joi.string().required(),
        tCode: Joi.string().allow(null),
        startDate: Joi.string().required(),
        checkDate: Joi.string().required()
    });
    return schema.validate(exam);
};

exports.validateExam = validateExam;
