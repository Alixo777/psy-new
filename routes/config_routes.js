const express = require('express');
const indexR = require('./index');
const patientsR = require('./patients');
const diagnosesR = require('./diagnoses');
const examsR = require('./exams');
const meetsR = require('./meets');
const therapistsR = require('./therapists');
const eachExamsR = require('./eachExams');
const dataR = require('./data');

const routers = express.Router();

routers.use("/", indexR);
routers.use("/patients", patientsR);
routers.use("/diagnoses", diagnosesR);
routers.use("/exams", examsR);
routers.use("/meets", meetsR);
routers.use("/therapists", therapistsR);
routers.use("/eachExams", eachExamsR);
routers.use("/data", dataR);

module.exports = routers;