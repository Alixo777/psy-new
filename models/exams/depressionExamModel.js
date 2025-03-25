const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = mongoose;

// Schema definition for Depression Exam
const depressionSchema = new Schema({
  internalSadness: { type: String, enum: ['כן', 'לעיתים קרובות', 'מדי פעם', 'לא'], required: true }, // תחושת עצבות פנימית
  internalTension: { type: String, enum: ['כן', 'לעיתים קרובות', 'מדי פעם', 'לא'], required: true }, // מתח פנימי
  lossOfInterest: { type: String, enum: ['כן', 'לעיתים קרובות', 'מדי פעם', 'לא'], required: true }, // אובדן עניין והנאה
  pessimisticThoughts: { type: String, enum: ['כן', 'לעיתים קרובות', 'מדי פעם', 'לא'], required: true }, // מחשבות פסימיות
  suicidalThoughts: { type: String, enum: ['כן', 'לעיתים קרובות', 'מדי פעם', 'לא'], required: true }, // מחשבות אובדניות
  concentrationDifficulties: { type: String, enum: ['כן', 'לעיתים קרובות', 'מדי פעם', 'לא'], required: true }, // קשיי ריכוז
  fatigue: { type: String, enum: ['כן', 'לעיתים קרובות', 'מדי פעם', 'לא'], required: true }, // תשישות
  othersNoticeSadness: { type: String, enum: ['כן', 'לעיתים קרובות', 'מדי פעם', 'לא'], required: true }, // מעירים לך שאתה נראה עצוב
  insomnia: { type: String, enum: ['כן', 'לעיתים קרובות', 'מדי פעם', 'לא'], required: true }, // נדודי שינה
  lackOfAppetite: { type: String, enum: ['כן', 'לעיתים קרובות', 'מדי פעם', 'לא'], required: true }, // חוסר תאבון
});

// Mongoose model
const DepressionExam = mongoose.model('DepressionExam', depressionSchema);

exports.DepressionExam = DepressionExam;

// Joi validation schema
exports.validateDepressionExam = (reqBody) => {
  const joiSchema = Joi.object({
    internalSadness: Joi.string().valid('כן', 'לעיתים קרובות', 'מדי פעם', 'לא').required(),
    internalTension: Joi.string().valid('כן', 'לעיתים קרובות', 'מדי פעם', 'לא').required(),
    lossOfInterest: Joi.string().valid('כן', 'לעיתים קרובות', 'מדי פעם', 'לא').required(),
    pessimisticThoughts: Joi.string().valid('כן', 'לעיתים קרובות', 'מדי פעם', 'לא').required(),
    suicidalThoughts: Joi.string().valid('כן', 'לעיתים קרובות', 'מדי פעם', 'לא').required(),
    concentrationDifficulties: Joi.string().valid('כן', 'לעיתים קרובות', 'מדי פעם', 'לא').required(),
    fatigue: Joi.string().valid('כן', 'לעיתים קרובות', 'מדי פעם', 'לא').required(),
    othersNoticeSadness: Joi.string().valid('כן', 'לעיתים קרובות', 'מדי פעם', 'לא').required(),
    insomnia: Joi.string().valid('כן', 'לעיתים קרובות', 'מדי פעם', 'לא').required(),
    lackOfAppetite: Joi.string().valid('כן', 'לעיתים קרובות', 'מדי פעם', 'לא').required(),
  });

  return joiSchema.validate(reqBody);
};

// Function to evaluate the responses
exports.evaluateDepressionExam = (reqBody) => {
  // Helper function to count positive answers (Yes or Often)
  const countPositiveAnswers = (answers) => {
    return answers.filter((answer) => answer === 'כן' || answer === 'לעיתים קרובות').length;
  };

  // Extract answers from the body
  const answers = Object.values(reqBody);

  // Count the positive responses
  const positiveAnswersCount = countPositiveAnswers(answers);

  // Evaluation logic
  if (positiveAnswersCount >= 5) {
    return {
      message: 'נראה שאת/ה סובל מכמה מאפיינים של דיכאון כמו עצב, פסימיות, חוסר חשק או חוסר הנאה מדברים. כדאי לפנות לקבלת טיפול פסיכולוגי אצל פסיכולוג, על מנת לשפר את מצב הרוח או להביא ליציבותו.',
    };
  } 

  // Check if answers 6-10 are positive (signs affecting daily functioning)
  const functionalSymptoms = answers.slice(5, 10);
  const functionalPositiveAnswersCount = countPositiveAnswers(functionalSymptoms);

  if (functionalPositiveAnswersCount > 0) {
    return {
      message: 'לא מדובר רק בתחושה פנימית של עצב או דכדוך, אלא גם בסממנים אובייקטיביים הפוגעים בתפקוד היומיומי שלך, מה שיכול להעיד על דיכאון. במקרה כזה מומלץ לפנות בדחיפות לקבלת טיפול נפשי אצל פסיכולוג או פסיכיאטר.',
    };
  }

  return { message: 'לא נדרשות תשובות נוספות' };
};
