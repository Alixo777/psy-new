const Joi = require('joi');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;
const jwt = require("jsonwebtoken");

let therapistsSchema = new mongoose.Schema({
  tCode: String,
  firstName: String,
  lastName: String,
  img: String,
  email:String , 
  password:String,
  // בנוסף כל רשומה בברירת מחדל שמייצר אותה
  // ייתן לה את התאריך של עכשיו
  date:{
    type:Date, default:Date.now()
  },
  patients: [{ type: ObjectId, ref: 'patients' }], // Array of ObjectId referencing 'patients' collection
  // הוספת יוצר הרשומה 
  user_id:String,
  role:{
    type:String, default:"therapist"
  }
});

// Model export
exports.therapistsModel = mongoose.model("therapists", therapistsSchema);

// פונקציה שמייצרת טוקן 
exports.createToken = (user_id) => {
  // מייצר טוקן, שם תכולה - "מטען" - שלו שזה איי די של המשתמש
  // מילה סודית שרק לנו מותר להכיר אותה
  // ותוקף  
  let token = jwt.sign({_id:user_id.toString()}, process.env.JWT_SECRET_KEY,{expiresIn:"60mins"},{_role:user.role})
  return token;
}

// Validation function
exports.validateTherapist = (reqBody) => {
  const joiSchema = Joi.object({
    tCode: Joi.string().required().min(3).max(20), // tCode is required and has length constraints
    firstName: Joi.string().required().min(2).max(50), // firstName is required, length between 2-50
    lastName: Joi.string().required().min(2).max(50), // lastName is required, length between 2-50
    img: Joi.string().uri().optional(), // img is optional and should be a valid URI if present
    email:Joi.string().required(), 
    password:Joi.string().min(3).max(99).required(),
    patients: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)).optional(), // Array of ObjectId strings (patient references)
  });

  return joiSchema.validate(reqBody); // Validate the reqBody using the schema
};

exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
      email:Joi.string().min(2).max(99).email().required(),
      password:Joi.string().min(3).max(99).required()
    })
  
    return joiSchema.validate(_reqBody);
  }
