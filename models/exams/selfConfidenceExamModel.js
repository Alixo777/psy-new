const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = mongoose;

// Schema definition for Self Confidence Exam
const selfConfidenceSchema = new Schema({
  difficultyInDecisionMaking: { type: Boolean, required: true }, // האם אתה מתקשה לקבל החלטות לבדך כי אתה לא סומך על עצמך?
  consultOthersForDecisions: { type: Boolean, required: true }, // האם בקבלת החלטה אתה מתייעץ עם אחרים ונוטה להחשיב את דעתם יותר מאשר את דעתך?
  doThingsForOthers: { type: Boolean, required: true }, // האם כאשר מישהו מבקש ממך משהו, אתה תיטה לבצע אותו גם אם לא מתחשק לך או אם אין לך זמן לכך?
  worriedAboutOthersOpinions: { type: Boolean, required: true }, // האם אתה עסוק בשאלה איך אנשים יגיבו לדבריך, למעשיך, מה הם חושבים עליך?
  adjustBehaviorToPleaseOthers: { type: Boolean, required: true }, // האם תכוון את התנהגותך, דיבורך, עפ"י דעתם של אחרים? האם אתה נוטה לרצות אחרים?
  feelWorthlessWhenFailing: { type: Boolean, required: true }, // האם כשאינך מצליח במשימה מסוימת זה מעורר בך תחושה שאתה לא שווה?
  attributeSuccessToExternalFactors: { type: Boolean, required: true }, // האם כשאתה מצליח במשימה מסויימת אתה נוטה לייחס זאת לנסיבות חיצוניות?
  successFeelsTakenForGranted: { type: Boolean, required: true }, // האם כשאתה מצליח במשימה מסויימת אתה רואה זאת כמובן מאליו, אבל כשאתה נכשל באותה משימה אתה רואה בכך כישלון אישי?
  mistakesAreIntolerable: { type: Boolean, required: true }, // האם טעויות שעשית נחוות בעיניך כבלתי נסבלות?
  avoidTasksDueToFearOfFailure: { type: Boolean, required: true }, // האם אתה נוטה לדחות משימות או להימנע מהן כי אתה חושש שמא לא תצליח בהן?
  fearOfRejectionInInterviews: { type: Boolean, required: true }, // האם כאשר אתה ניגש למשימות שדרושות קבלה או הכרה כמו ראיון עבודה או דייט, יש לך הרגשה שבטח לא יקבלו אותך?
  impostorSyndromeWithPositiveFeedback: { type: Boolean, required: true }, // האם כשאתה מקבל פידבק חיובי מאחרים אתה מרגיש תחושת זיוף
});

// Mongoose model
const SelfConfidenceExam = mongoose.model('SelfConfidenceExam', selfConfidenceSchema);

exports.SelfConfidenceExam = SelfConfidenceExam;

// Joi validation schema
exports.validateSelfConfidenceExam = (reqBody) => {
  const joiSchema = Joi.object({
    difficultyInDecisionMaking: Joi.boolean().required(),
    consultOthersForDecisions: Joi.boolean().required(),
    doThingsForOthers: Joi.boolean().required(),
    worriedAboutOthersOpinions: Joi.boolean().required(),
    adjustBehaviorToPleaseOthers: Joi.boolean().required(),
    feelWorthlessWhenFailing: Joi.boolean().required(),
    attributeSuccessToExternalFactors: Joi.boolean().required(),
    successFeelsTakenForGranted: Joi.boolean().required(),
    mistakesAreIntolerable: Joi.boolean().required(),
    avoidTasksDueToFearOfFailure: Joi.boolean().required(),
    fearOfRejectionInInterviews: Joi.boolean().required(),
    impostorSyndromeWithPositiveFeedback: Joi.boolean().required(),
  });

  return joiSchema.validate(reqBody);
};

// Function to evaluate the responses
exports.evaluateSelfConfidenceExam = (reqBody) => {
  // Helper function to count positive answers (true answers)
  const countPositiveAnswers = (answers) => {
    return answers.filter((answer) => answer === true).length;
  };

  // Extract answers from the body
  const answers = Object.values(reqBody);

  // Count positive answers for questions 1-5 (Group 1)
  const positiveAnswersGroup1 = countPositiveAnswers(answers.slice(0, 5));

  // Evaluate based on group 1 answers
  if (positiveAnswersGroup1 >= 3) {
    return {
      message: 'נראה שאתה סובל מביטחון עצמי נמוך במיוחד בסביבת אחרים ובהשוואה אליהם.',
    };
  }

  // Count positive answers for questions 6-12 (Group 2)
  const positiveAnswersGroup2 = countPositiveAnswers(answers.slice(5, 12));

  // Evaluate based on group 2 answers
  if (positiveAnswersGroup2 >= 3) {
    return {
      message: 'נראה שגם ללא נוכחות אחרים, אתה שיפוטי וביקורתי כלפי עצמך ונוטה להעריך את עצמך באופן שלילי.',
    };
  }

  // If both groups show positive answers
  if (positiveAnswersGroup1 >= 3 && positiveAnswersGroup2 >= 3) {
    return {
      message: 'הביטחון העצמי שלך נמוך או לא יציב - כל פידבק שלילי מהסביבה מערער אותו בקלות. כדאי לפנות לקבלת טיפול פסיכולוגי על מנת לחזק את הביטחון העצמי שלך.',
    };
  }

  return { message: 'לא נדרשות תשובות נוספות' };
};
