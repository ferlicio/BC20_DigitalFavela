const express = require("express");
const facebookController = require('../controllers/facebook.controller')
const cors = require("cors")
const functions = require("firebase-functions");

const facebookApp = express();

facebookApp.use(cors({ origin: true }));

facebookApp.post("", facebookController.setInfluencerFB);

exports.facebook = functions.https.onRequest(facebookApp)
