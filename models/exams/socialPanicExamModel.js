const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = mongoose;

// Schema definition for Social Panic Exam
const socialPanicExamSchema = new Schema({
  fearOfJudgmentInSocialSituations: { type: Boolean, required: true }, // פחד ממצב חברתי שבו אנשים עשויים לשפוט אותך
  fearOfHumiliationInSocialSituations: { type: Boolean, required: true }, // פחד שמעשיך יגרמו להשפלתך
  fearOfPhysicalSignsOfAnxietyBeingNoticed: { type: Boolean, required: true }, // פחד שאנשים יבחינו בכך שאתה מסמיק, מזיע, רועד או מראה סימני חרדה אחרים
  awarenessThatFearIsExaggeratedOrUnrealistic: { type: Boolean, required: true }, // הידיעה שהפחד שלך מוגזם או לא סביר
  constantAnxietyInSocialSituations: { type: Boolean, required: true }, // לחוש תמיד בחרדה
  avoidanceOfScarySocialSituations: { type: Boolean, required: true }, // להימנע מהשתתפות במצבים מפחידים
  disruptionToDailyLife: { type: Boolean, required: true }, // האם כל זה מפריע לחייך היום יומיים
});

// Mongoose model
const SocialPanicExam = mongoose.model('SocialPanicExam', socialPanicExamSchema);

exports.SocialPanicExam = SocialPanicExam;

// Joi validation schema
exports.validateSocialPanicExam = (reqBody) => {
  const joiSchema = Joi.object({
    fearOfJudgmentInSocialSituations: Joi.boolean().required(),
    fearOfHumiliationInSocialSituations: Joi.boolean().required(),
    fearOfPhysicalSignsOfAnxietyBeingNoticed: Joi.boolean().required(),
    awarenessThatFearIsExaggeratedOrUnrealistic: Joi.boolean().required(),
    constantAnxietyInSocialSituations: Joi.boolean().required(),
    avoidanceOfScarySocialSituations: Joi.boolean().required(),
    disruptionToDailyLife: Joi.boolean().required(),
  });

  return joiSchema.validate(reqBody);
};

// Function to evaluate the responses
exports.evaluateSocialPanicExam = (reqBody) => {
  // Helper function to count positive answers (true answers) for each group
  const countPositiveAnswers = (answers) => answers.filter((answer) => answer === true).length;

  // Extract answers from the body
  const answers = Object.values(reqBody);

  // Split answers into two groups (questions 1-4 for group 1, questions 5-7 for group 2)
  const group1Answers = answers.slice(0, 4); // First 4 questions
  const group2Answers = answers.slice(4); // Last 3 questions

  // Count positive answers for each group
  const group1PositiveCount = countPositiveAnswers(group1Answers);
  const group2PositiveCount = countPositiveAnswers(group2Answers);

  // Evaluation based on the count of positive answers
  if (group1PositiveCount >= 2) {
    if (group2PositiveCount >= 1) {
      return {
        message: 'החרדה בסיטואציות חברתיות מפריעה לאורח חייך התקין. כדאי לפנות לטיפול מקצועי כדי להתמודד עם החרדה החברתית.',
      };
    }
    return {
      message: 'נראה שאתה סובל מחוסר ביטחון וחרדה בסיטואציות חברתיות. כדאי לפנות לקבלת טיפול על מנת לשפר את ההתמודדות עם חרדה זו.',
    };
  }

  return { message: 'לא נמצאו תסמינים חמורים של חרדה חברתית. אם אתה מרגיש שיש מקום לשיפור, ניתן לשקול פנייה לעזרה מקצועית.' };
};
