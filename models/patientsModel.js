const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

let patientsSchema = new mongoose.Schema({
id:Number ,
firstName:String , 
lastName:String , 
age:Number ,
address:String,
email:String , 
password:String,
phoneNumber:String,
date_created:{
    type:Date , default:Date.now()
  },
      // הוספת יוצר הרשומה 
    user_id:String, 
    
  role:{
      type:String, default:"patient"
    }
})

exports.PatientsModel = mongoose.model("patients", patientsSchema);


// פונקציה שמייצרת טוקן 
exports.createToken = (user) => {
  // מייצר טוקן, שם תכולה - "מטען" - שלו שזה איי די של המשתמש
  // מילה סודית שרק לנו מותר להכיר אותה
  // ותוקף  
  let token = jwt.sign({_id: user._id.toString()}, process.env.JWT_SECRET_KEY,{expiresIn:"60mins"} , {_role: user.role})
  return token;
}

exports.validatePatient = (reqBody) => {
    let joiSchema = Joi.object({
        id:Joi.number().min(100000000).max(999999999).required() ,
        firstName:Joi.string().min(3).max(99).required() , 
        lastName:Joi.string().min(3).max(99).required() , 
        age:Joi.number().min(18).max(120).required() ,
        address:Joi.string().required(),
        email:Joi.string().required(), 
        phoneNumber:Joi.string().required(),
        password:Joi.string().min(3).max(99).required()
    });

    return joiSchema.validate(reqBody)
}


exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
      email:Joi.string().min(2).max(99).email().required(),
      password:Joi.string().min(3).max(99).required()
    })
  
    return joiSchema.validate(_reqBody);
  }