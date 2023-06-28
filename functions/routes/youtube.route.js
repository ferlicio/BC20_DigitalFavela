const express = require("express");
const youtubeController = require('../controllers/youtube.controller')
const cors = require("cors")
const functions = require("firebase-functions");

const youtubeApp = express();

youtubeApp.use(cors({ origin: true }));

youtubeApp.post("", youtubeController.setInfluencerYT);

exports.youtube = functions.https.onRequest(youtubeApp)