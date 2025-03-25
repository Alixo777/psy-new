const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = mongoose;

// Schema definition for Stress Exam
const stressExamSchema = new Schema({
  difficultyFallingAsleep: { type: Boolean, required: true }, // האם לא הצלחת להירדם?
  feelingsOfAnger: { type: Boolean, required: true }, // האם עלו בך תחושות של כעס ועצבים?
  difficultyStayingAsleep: { type: Boolean, required: true }, // האם התקשית להחזיק במצב של שינה?
  intrusiveFeelingsRelatedToEvent: { type: Boolean, required: true }, // האם חווית תחושות הקשורות למקרה בעקבות רמזים או אזכורים שלו?
  feelingThatEventWasUnreal: { type: Boolean, required: true }, // האם הרגשת כאילו המקרה לא היה באמת?
  intrusiveImagesOfEvent: { type: Boolean, required: true }, // האם פתאום עלו בראשך תמונות של המקרה?
  unwantedThoughtsAboutEvent: { type: Boolean, required: true }, // האם קפצו מחשבות על המקרה למרות שלא רצית לחשוב עליו?
  avoidanceOfThingsRemindingOfEvent: { type: Boolean, required: true }, // האם ניסית להימנע מלעשות דברים שיזכירו לך את המקרה?
  tryingNotToWorryAboutEvent: { type: Boolean, required: true }, // האם כאשר חשבת או נזכרת במקרה ניסית לא שלדאוג ממנו?
  beingEasilyStartled: { type: Boolean, required: true }, // האם במהלך אותו שבוע אירועים ומצבים שונים גרמו לך להיבהל, להיות זהיר או דרוך בקלות?
  overwhelmingFeelingsAboutEvent: { type: Boolean, required: true }, // האם תחושות חזקות על המקרה הציפו אותך בשבוע זה?
  avoidingThinkingAboutEvent: { type: Boolean, required: true }, // האם ניסית להימנע מלחשוב על המקרה?
  tryingToEraseEventFromMind: { type: Boolean, required: true }, // האם ניסית למחוק מהראש את המקרה?
  difficultyConcentrating: { type: Boolean, required: true }, // האם חווית קשיי ריכוז?
  emotionalNumbnessOrApathy: { type: Boolean, required: true }, // האם חשת תחושה של קהות או של רגשות מעומעמים לגבי המקרה?
  nightmaresAboutEvent: { type: Boolean, required: true }, // האם במהלך השינה הופיעו חלומות הקשורים לאותו אירוע?
  reExperiencingTheEvent: { type: Boolean, required: true }, // האם חשת או התנהגת כאילו המקרה קורה שוב?
  avoidingTalkingAboutEvent: { type: Boolean, required: true }, // האם ניסית להימנע מלשוחח על המקרה?
  awarenessOfUnresolvedEmotions: { type: Boolean, required: true }, // האם הייתה בך המודעות לכך שישנם רגשות שטרם התמודדות איתם בהקשר למקרה?
  physicalSymptomsFromEventCues: { type: Boolean, required: true }, // האם רמזים הנוגעים למקרה גרמו לך ל: דפיקות לב, הזעה, בחילה או קשיי נשימה?
});

// Mongoose model
const StressExam = mongoose.model('StressExam', stressExamSchema);

exports.StressExam = StressExam;

// Joi validation schema
exports.validateStressExam = (reqBody) => {
  const joiSchema = Joi.object({
    difficultyFallingAsleep: Joi.boolean().required(),
    feelingsOfAnger: Joi.boolean().required(),
    difficultyStayingAsleep: Joi.boolean().required(),
    intrusiveFeelingsRelatedToEvent: Joi.boolean().required(),
    feelingThatEventWasUnreal: Joi.boolean().required(),
    intrusiveImagesOfEvent: Joi.boolean().required(),
    unwantedThoughtsAboutEvent: Joi.boolean().required(),
    avoidanceOfThingsRemindingOfEvent: Joi.boolean().required(),
    tryingNotToWorryAboutEvent: Joi.boolean().required(),
    beingEasilyStartled: Joi.boolean().required(),
    overwhelmingFeelingsAboutEvent: Joi.boolean().required(),
    avoidingThinkingAboutEvent: Joi.boolean().required(),
    tryingToEraseEventFromMind: Joi.boolean().required(),
    difficultyConcentrating: Joi.boolean().required(),
    emotionalNumbnessOrApathy: Joi.boolean().required(),
    nightmaresAboutEvent: Joi.boolean().required(),
    reExperiencingTheEvent: Joi.boolean().required(),
    avoidingTalkingAboutEvent: Joi.boolean().required(),
    awarenessOfUnresolvedEmotions: Joi.boolean().required(),
    physicalSymptomsFromEventCues: Joi.boolean().required(),
  });

  return joiSchema.validate(reqBody);
};

// Function to evaluate the responses
exports.evaluateStressExam = (reqBody) => {
  // Helper function to count positive answers (true answers)
  const countPositiveAnswers = (answers) => {
    return answers.filter((answer) => answer === true).length;
  };

  // Extract answers from the body
  const answers = Object.values(reqBody);

  // Count positive answers
  const positiveAnswersCount = countPositiveAnswers(answers);

  // Evaluation based on the count of positive answers
  if (positiveAnswersCount >= 3) {
    return {
      message: 'ייתכן שאת/ה מתקשה להתמודד עם מצבי לחץ. כדאי לפנות לסיוע מקצועי על מנת ללמוד איך לשפר את יכולת ההתמודדות שלך עם מצבים כאלו.',
    };
  }

  return { message: 'לא נדרשות תשובות נוספות' };
};
