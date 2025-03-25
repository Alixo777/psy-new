const express = require('express');
const bcrypt = require("bcrypt");
const { auth } = require("../middlewares/auth");
const { therapistsModel, validateTherapist, validLogin, createToken } = require('../models/therapistsModel');
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let data = await therapistsModel.find({});
        res.json(data);
    } catch (err) {
        res.status(500).json({ msg: 'Error fetching therapists', error: err.message });
    }
});

router.post('/register', async (req, res) => {
  const { email, password, fullName, firstName, lastName, age, address, phoneNumber, tCode, img } = req.body;

  // Step 1: Basic validation using the existing validateTherapist function
  let validateBody = validateTherapist(req.body);
  if (validateBody.error) {
      return res.status(400).json(validateBody.error.details);
  }

  try {
      // Step 2: Check if the therapist already exists by email
      const existingtherapist = await therapistsModel.findOne({ email });
      if (existingtherapist) {
          return res.status(400).json({ msg: 'Email already registered' });
      }

      // Hash the password before saving the therapist
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new therapist with the provided fields
      const newtherapist = new therapistsModel({
        tCode, // Make sure tCode is included in the request body
        firstName,
        lastName,
        img,
        email,
        password: hashedPassword
      });

      // Save the new therapist to the database
      await newtherapist.save();

      // Generate a JWT token for the newly registered therapist
      const token = createToken(newtherapist);

      // Send back success response with the token
      res.json({ message: 'Registration successful', token });

  } catch (err) {
      res.status(500).json({ msg: 'Error during registration', error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Check if the email is provided
  if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
  }

  try {
      // Step 2: Find the therapist by email
      const therapist = await therapistsModel.findOne({ email });
      if (!therapist) {
          return res.status(401).json({ msg: "Invalid email or password" });
      }

      // Step 3: Compare the provided password with the stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, therapist.password);
      if (!isPasswordCorrect) {
          return res.status(401).json({ msg: "Invalid email or password" });
      }

      // Step 4: Generate a JWT token
      const token = createToken(therapist);

      // Step 5: Send the token as a response
      res.json({ message: "Login successful", token });

  } catch (err) {
      res.status(500).json({ msg: "Error during login", error: err.message });
  }
});

router.get("/myInfo", async (req, res) => {
    let token = req.header("x-api-key");

    if (!token) {
      return res.status(401).json({ msg: "You need to send token to this endpoint url" });
    }

    try {
      let tokenData = jwt.verify(token, "PsySecret");

      let therapist = await therapistsModel.findOne({ _id: tokenData._id }, { password: 0 });

      res.json(therapist);
    } catch (err) {
      return res.status(401).json({ msg: "Token not valid or expired" });
    }
});

router.delete("/:delId", async (req, res) => {
    let newDelId = req.params.delId;
    try {
        let data = await therapistsModel.deleteOne({ _id: newDelId });
        res.json(data);
    } catch (err) {
        res.status(500).json({ msg: "Error deleting therapist", error: err.message });
    }
});

router.put("/:id", async (req, res) => {
    let therapistId = req.params.id;
    
    // Validate the request body first
    let validateBody = validateTherapist(req.body);
    if (validateBody.error) {
        return res.status(400).json(validateBody.error.details);
    }

    try {
        // Find the therapist by their ID and update their data
        let updatedtherapist = await therapistsModel.findByIdAndUpdate(
            therapistId,
            req.body,
            { new: true }
        );

        if (!updatedtherapist) {
            return res.status(404).json({ message: "Therapist not found" });
        }

        // Return the updated therapist data
        res.json(updatedtherapist);
    } catch (error) {
        res.status(500).json({ message: "Error updating therapist data", error: error.message });
    }
});

module.exports = router;
