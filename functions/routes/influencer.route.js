const express = require("express");
const influencerController = require("../controllers/influencer.controller");
const cors = require("cors");
const functions = require("firebase-functions");

const influencerApp = express();

influencerApp.use(cors({ origin: true }));

influencerApp.post("/verifier", influencerController.checkValidEmailAndCPF);
influencerApp.post("/delete", influencerController.deleteSocialNetwork);

exports.influencer = functions.https.onRequest(influencerApp);
