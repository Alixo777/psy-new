const mongoose = require('mongoose');
const Joi = require('joi');
const { Schema } = mongoose;

const panicExamSchema = new Schema({
  dfeekutLev: { type: Boolean, required: true }, // דפיקות לב
  haza: { type: Boolean, required: true }, // הזעה
  kotzerNeshima: { type: Boolean, required: true }, // קוצר נשימה
  chnek: { type: Boolean, required: true }, // חנק
  keevBaLeiv: { type: Boolean, required: true }, // כאב בחזה
  bikhila: { type: Boolean, required: true }, // בחילה או אי נוחות בבטן
  chulshaBaRaglayim: { type: Boolean, required: true }, // חולשה ברגליים
  sachraza: { type: Boolean, required: true }, // סחרחורת
  tachushaLoMetsuyanit: { type: Boolean, required: true }, // תחושה לא מציאותית או תחושה שאתה מנותק מעצמך
  tachushaShalAvodShilKontrol: { type: Boolean, required: true }, // תחושה של איבוד שליטה, שאתה משתגע
  pachadMiMavet: { type: Boolean, required: true }, // פחד ממוות
  akutzut: { type: Boolean, required: true }, // עקצוץ
  tzmaromot: { type: Boolean, required: true }, // צמרמורת או גלי חום
  pachadMiMekomot: { type: Boolean, required: true }, // פחד ממקומות או מצבים שבהם יהיה קשה להשיג עזרה או להמלט מהם
  loYacholLeNasea: { type: Boolean, required: true }, // אינך יכול לנסוע ללא ליווי
  // Additional questions for post-attack symptoms
  pachadMiAtaF: { type: Boolean, required: false }, // פחד מהתקף לב או דאגה שאתה "משתגע"
  shinuiBehitnagut: { type: Boolean, required: false }, // שינית את התנהגותך בשל ההתקף
});

const PanicExam = mongoose.model('PanicExam', panicExamSchema);

exports.PanicExam = PanicExam;

// Joi validation schema
exports.validatePanicExam = (reqBody) => {
  const joiSchema = Joi.object({
    dfeekutLev: Joi.boolean().required(),
    haza: Joi.boolean().required(),
    kotzerNeshima: Joi.boolean().required(),
    chnek: Joi.boolean().required(),
    keevBaLeiv: Joi.boolean().required(),
    bikhila: Joi.boolean().required(),
    chulshaBaRaglayim: Joi.boolean().required(),
    sachraza: Joi.boolean().required(),
    tachushaLoMetsuyanit: Joi.boolean().required(),
    tachushaShalAvodShilKontrol: Joi.boolean().required(),
    pachadMiMavet: Joi.boolean().required(),
    akutzut: Joi.boolean().required(),
    tzmaromot: Joi.boolean().required(),
    pachadMiMekomot: Joi.boolean().required(),
    loYacholLeNasea: Joi.boolean().required(),
    // Optional: Additional questions after attack if positive answers exceed 4
    pachadMiAtaF: Joi.boolean(),
    shinuiBehitnagut: Joi.boolean(),
  });

  return joiSchema.validate(reqBody);
};

// Function to calculate the number of positive responses and check additional questions if needed
exports.evaluatePanicExam = (reqBody) => {
  // Count the number of true answers
  const positiveAnswers = Object.values(reqBody).filter((value) => value === true).length;

  // If more than 4 positive answers, check the additional two questions
  if (positiveAnswers > 4) {
    const additionalQuestions = {
      pachadMiAtaF: reqBody.pachadMiAtaF,
      shinuiBehitnagut: reqBody.shinuiBehitnagut,
    };

    const hasAdditionalSymptoms = Object.values(additionalQuestions).includes(true);

    if (hasAdditionalSymptoms) {
      return {
        message: `ניכר שאתה סובל מהתקפי חרדה, המתבטאים בחוויה רגשית של חרדה ופחד, בסימפטומים פיזיולוגיים (גופניים) ובסממנים התנהגותיים (בד"כ הימנעות). ניתן לטפל בחרדה בכל המישורים הללו - הרגשי, הפיזיולוגי וההתנהגותי. אל תמשיך לסבול או להימנע, פנה לטיפול.`,
      };
    }
  }

  return { message: 'לא נדרשות תשובות נוספות' };
};
