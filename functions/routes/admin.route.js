const express = require("express");
const adminController = require('../controllers/admin.controller')
const superAdmin = require('../middlewares/superAdmin')
const cors = require("cors")
const functions = require("firebase-functions");

const adminApp = express();

adminApp.use(cors({ origin: true }));

adminApp.post("", superAdmin.verify, adminController.createAdmin);

exports.admin = functions.https.onRequest(adminApp)
