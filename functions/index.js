module.exports = {
  ...require("./routes/twitter.route"),
  ...require("./routes/facebook.route"),
  ...require("./routes/admin.route"),
  ...require("./routes/influencer.route"),
  ...require("./routes/youtube.route"),
  ...require("./routes/cronJob.route"),
};
