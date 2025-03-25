const Joi = require('joi');
const mongoose = require('mongoose');

const diagnosesSchema = new mongoose.Schema({
    diagnoseTypeCode: String,
    examTypeCode: String,
    patientId: String,
    tCode: String,
    startDate: String,
    conclusionD: String
    // maor
});

const DiagnosesModel = mongoose.model("diagnoses", diagnosesSchema);

const validateDiagnose = (diagnose) => {
    const schema = Joi.object({
        diagnoseTypeCode: Joi.string().required(),
        examTypeCode: Joi.string().required(),
        patientId: Joi.string().required(),
        tCode: Joi.string().required(),
        startDate: Joi.string().required(),
        conclusionD: Joi.string().required()
    });

    return schema.validate(diagnose);
};

module.exports = { DiagnosesModel, validateDiagnose };

