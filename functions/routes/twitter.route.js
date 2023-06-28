const express = require("express");
const twitterController = require('../controllers/twitter.controller')
const cors = require("cors")
const functions = require("firebase-functions");

const twitterApp = express();

twitterApp.use(cors({ origin: true }));

twitterApp.post("", twitterController.setInfluencerTW);

exports.twitter = functions.https.onRequest(twitterApp)
