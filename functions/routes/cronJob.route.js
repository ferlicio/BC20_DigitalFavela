const twitterService = require("../services/twitter.service");
const facebookService = require("../services/facebook.service");
const youtubeService = require("../services/youtube.service");

const functions = require("firebase-functions");

exports.cronJobs = functions.pubsub
  .schedule("1 0 * * *")
  .timeZone("America/Sao_Paulo")
  .onRun(() => {
    twitterService.cronJobTwitter();
    facebookService.cronJobFacebook();
    youtubeService.cronJobYoutube();
  });
