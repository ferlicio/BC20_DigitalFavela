const twitterConfig = {
  client_id: "MFZ2Um1acm83LVEyNFZJME1WZnU6MTpjaQ",
  redirect_uri: "http://localhost:4200/callback/tw",
  code_verifier: "challenge",
  grant_type: "authorization_code",
};

const clientSecret = "spSIJmo675FApvOWdS7dcUp5ZsvoCJM8o0DkCnXFI9U2wFeVBr";

const token = Buffer.from(
  `${twitterConfig.client_id}:${clientSecret}`
).toString("base64");

const twitterRefreshToken = {
  grant_type: "refresh_token",
  client_id: "MFZ2Um1acm83LVEyNFZJME1WZnU6MTpjaQ",
};

const twitterDeleteToken = {
  client_id: "MFZ2Um1acm83LVEyNFZJME1WZnU6MTpjaQ",
  token_type_hint: "access_token",
};
module.exports = {
  twitterConfig,
  token,
  twitterRefreshToken,
  twitterDeleteToken,
};
