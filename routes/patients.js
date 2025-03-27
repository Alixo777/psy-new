const express = require('express');
const bcrypt = require("bcrypt");

const { auth } = require("../middlewares/auth");
const {PatientsModel, validatePatient, validLogin, createToken } = require('../models/patientsModel'); // Or whatever the correct name is
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get('/', auth, async (req, res) => {
    let data = await PatientsModel.find({});
    res.json(data);
});

router.post('/register', async (req, res) => {
  const { email, password, fullName, firstName, lastName, age, address, phoneNumber } = req.body;

  // Step 1: Basic validation using the existing validatePatient function
  let validateBody = validatePatient(req.body);
  if (validateBody.error) {
      return res.status(400).json(validateBody.error.details);
  }

  try {
      // Step 2: Check if the patient already exists by email
    //   const existingPatient = await patientsModel.findOne({ email });
    //   if (existingPatient) {
    //       return res.status(400).json({ msg: 'Email already registered' });
    //   }

      // Hash the password before saving the patient
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new patient with the provided fields
      const newPatient = new PatientsModel({
          firstName,
          lastName,
          age,
          address,
          email,
          password: hashedPassword,
          phoneNumber,
          fullName
      });

      // Save the new patient to the database
      await newPatient.save();

      // Send back success response with the token
      res.json({ message: 'Registration successful' });

  } catch (err) {
      res.status(500).json({ msg: 'Error during registration', error: err.message });
  }
});


// 2
// בראוטר ניתן להעביר בשרשור המון פונקציות שכדי לעבור אחד מהשני
// אנחנו צריכים להשתמש בפקודת נקסט שנעביר לפונקציית מידל וואר
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("api Patient/login");
  

  // Step 1: Check if the email is provided
  if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
      // Step 2: Find the patient by email
      const patient = await PatientsModel.findOne({ email });
      if (!patient) {
          return res.status(401).json({ msg: "Invalid email or password" });
      }

      console.log("end step 2")

      // Step 3: Compare the provided password with the stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, patient.password);
       if (!isPasswordCorrect) {
          return res.status(401).json({ msg: "Invalid email or password" });
      }
      console.log("end step 3")

      // Step 4: Generate a JWT token
      const token = createToken(patient);
      console.log("end step 4")

      // Step 5: Send the token as a response
      res.json({ message: "Login successful", token });

  } catch (err) {
      res.status(500).json({ msg: "Error during login", error: err.message });
  }
});

  // 3
// אזור שמחזיר למשתמש את הפרטים שלו לפי הטוקן שהוא שולח
router.get("/myInfo", auth, async (req, res) => {
    // בדיקה אם המשתמש בכלל שלח טוקן בהידר
    // הסיבה שעובדים מול הידר, שהוא גם מאובטח וגם נותן לשלוח עד 600 תווים
    // וגם עובד בבקשת גט לעומת באדי שלא עובד
    // req.query, req.params, req.body, req.header
    // let token = req.header("x-api-key");
    // console.log(token);
    
    // if (!token) {
    //   return res.status(401).json({ msg: "You need to send token to this endpoint url" })
    // }
    try {
      // מנסה לפענח את הטוקן ויכיל את כל המטען/מידע שבתוכו
    //   let tokenData = jwt.verify(token, JWT_SECRET_KEY);
    //   console.log(tokenData);
  
  
      // עושה שאילתא של שליפת המידע מהמסד לפי האיי די שפוענח בטוקן
      // {password:0} -> יציג את כל המאפיינים חוץ מהסיסמא ואם זה 1
      // דווקא יציג רק אותו ולא יציג אחרים
      // 
      let patient = await PatientsModel.findOne({ _id: req.tokenData._id },
         { password: 0 });
      // אומר לא להציג את הסיסמא מתוך המאפיינים
      res.json(patient);
    }
    catch (err) {
      return res.status(401).json({ msg: "Token not valid or expired" })
    }
  
  })

router.delete("/:delId", async (req, res) => {
    let newDelId = req.params.delId;
    let data = await PatientsModel.deleteOne({ _id: newDelId });
    res.json(data);
});

router.put("/:id", async (req, res) => {
    let patientId = req.params.id;
    
    // Validate the request body first
    let validateBody = validatePatient(req.body);
    if (validateBody.error) {
        return res.status(400).json(validateBody.error.details);
    }

    try {
        // Find the patient by their ID and update their data
        let updatedPatient = await PatientsModel.findByIdAndUpdate(
            patientId,
            req.body,
            { new: true } // this option ensures the updated patient is returned
        );

        // If no patient is found, return a 404 error
        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        // Return the updated patient data
        res.json(updatedPatient);
    } catch (error) {
        res.status(500).json({ message: "Error updating patient data", error: error.message });
    }
});

module.exports = router;