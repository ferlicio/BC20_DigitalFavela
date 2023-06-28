const influencerCollection = require("../collections/influencers.collection");
const socialNetworksCollection = require("../collections/socialNetworks.collection");
const axios = require("axios");
const qs = require("qs");
const twitterApp = require("../config/twitterApp.config");
const twitterDelete = twitterApp.twitterDeleteToken;
const twitterToken = twitterApp.token;

const youtubeURL = "https://oauth2.googleapis.com/revoke";
const facebookURL = "https://graph.facebook.com/v14.0/me/permissions";
const twitterURL = "https://api.twitter.com/2/oauth2/revoke";

exports.checkValidEmailAndCPF = async (email, cpf) => {
  const querySnapshotCPF = await influencerCollection
    .where("cpf", "==", cpf)
    .get();
  const querySnapshotEmail = await influencerCollection
    .where("email", "==", email)
    .get();

  if (querySnapshotCPF.empty && querySnapshotEmail.empty) return true;
  return false;
};

exports.deleteSocialNetwork = async (uid, socialNetwork) => {
  try {
    const token = await getToken(socialNetwork, uid);

    if (socialNetwork == "youtube") {
      await axios.post(youtubeURL, { token: token });
    } else if (socialNetwork == "instagram") {
      await axios.delete(facebookURL, {
        params: {
          access_token: token,
        },
      });
    } else {
      const params = {
        ...twitterDelete,
        token: token,
      };
      const headers = {
        Authorization: `Basic ${twitterToken}`,
        "Content-type": "application/x-www-form-urlencoded",
      };

      await axios.post(twitterURL, qs.stringify(params), { headers });
    }
    await influencerCollection.doc(uid).update({
      [socialNetwork]: null,
    });
    await socialNetworksCollection.doc(uid).update({
      [socialNetwork]: null,
    });

    await checkConnected(uid);
  } catch {
    console.log("deleteSocialnetwork error");
  }
};

//function to get token - depends of the socialNetwork
async function getToken(socialNetwork, uid) {
  try {
    const data = await socialNetworksCollection.doc(uid).get();
    if (socialNetwork == "instagram") {
      return data.data().instagram.access_token;
    } else if (socialNetwork == "youtube") {
      return data.data().youtube.refresh_token;
    } else if (socialNetwork == "twitter") {
      return data.data().twitter.twitter_access_token;
    }
  } catch {
    console.log("getToken error");
  }
}

//function to check if the user still have a socialNetwork connected
async function checkConnected(uid) {
  const dado = await socialNetworksCollection.doc(uid).get();
  const twitter = dado.data().twitter;
  const instagram = dado.data().instagram;
  const youtube = dado.data().youtube;

  if (twitter == null && instagram == null && youtube == null) {
    await influencerCollection.doc(uid).set(
      {
        cadastroFinalizado: "false",
      },
      { merge: true }
    );
  }
}
