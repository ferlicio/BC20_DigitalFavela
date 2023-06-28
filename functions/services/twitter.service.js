const influencerCollection = require("../collections/influencers.collection");
const socialNetworksCollection = require("../collections/socialNetworks.collection");
const twitterApp = require("../config/twitterApp.config");
const twitterConfig = twitterApp.twitterConfig;
const token = twitterApp.token;
const twitterRefreshToken = twitterApp.twitterRefreshToken;
const axios = require("axios");
const qs = require("qs");

const baseURL = "https://api.twitter.com/2/users/";
const urlToken = "https://api.twitter.com/2/oauth2/token";

exports.setInfluencerTW = async (code, uid) => {
  try {
    const res = await exchangeToken(code);
    await setTwitter(uid);
    const access_token = res.access_token;
    const refresh_token = res.refresh_token;
    const twitterID = await getTwitterId(access_token);
    await saveToken(uid, access_token, refresh_token, twitterID);
    const twitterInfoUser = await getMetricsUser(access_token, twitterID);
    const twitterInfoTweets = await getMetricsTweets(access_token, twitterID);
    await saveTwitterData(twitterInfoUser, twitterInfoTweets, uid);

  } catch (err) {
    console.log("setInfluencerTW error");
  }
};

async function exchangeToken(code) {
  try {
    const params = {
      ...twitterConfig,
      code: code,
    };
    const headers = {
      Authorization: `Basic ${token}`,
      "Content-type": "application/x-www-form-urlencoded",
    };
    const res = await axios.post(urlToken, qs.stringify(params), { headers });
    return res.data;
  } catch (error) {
    console.log("exchangeToken error");
  }
}

// Function to give faster connect feedback to the influencer
async function setTwitter(uid) {
  try {
    await influencerCollection.doc(uid).set(
      {
        twitter: "true",
        cadastroFinalizado: "true",
      },
      { merge: true }
    );
  } catch (error) {
    console.log("setTwitter error");
  }
}

async function getTwitterId(access_token) {
  try {
    const id = await axios.get(`${baseURL}me?user.fields=id`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return id.data.data.id;
  } catch (error) {
    console.log("getTwitterId error");
  }
}

async function saveToken(uid, access_token, refresh_token, twitterID) {
  try {
    await socialNetworksCollection.doc(uid).set(
      {
        twitter: {
          twitter_id: twitterID,
          twitter_access_token: access_token,
          twitter_refresh_token: refresh_token,
        },
      },
      { merge: true }
    );
  } catch (error) {
    console.log("saveToken error");
  }
}

async function getMetricsUser(access_token, twitterID) {
  try {
    const metrics = await axios.get(`${baseURL}${twitterID}`, {
      params: {
        "user.fields":
          "created_at,description,location,profile_image_url,protected,public_metrics,verified,withheld"
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return metrics.data.data;
  } catch (error) {
    console.log("getMetricsUser error");
  }
}

async function getMetricsTweets (access_token, twitterID) {
  try {
    const metrics = await axios.get(`${baseURL}${twitterID}/tweets?`, {
      params: {
        "max_results": 100,
        "tweet.fields": "attachments,author_id,geo,organic_metrics"
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return metrics.data.data;
  } catch (error) {
    console.log("getMetricsTweets error");
  }
}

async function saveTwitterData(twitterInfoUser, twitterInfoTweets, uid) {
  try {
    influencerCollection.doc(`${uid}`).update({
      twitter: { twitterUser: { ...twitterInfoUser }, twitterTweets: { ...twitterInfoTweets }, timestamp: new Date() },
    });
  } catch (error) {
    console.log("saveTwitterData error");
  }
}

exports.cronJobTwitter = async () => {
  try {
    const usuarios = await socialNetworksCollection.get().then((x) =>
      x.docs.map((doc) => {
        if (doc.data().twitter) {
          return {
            refresh_token: doc.data().twitter.twitter_refresh_token,
            twitterID: doc.data().twitter.twitter_id,
            uid: doc.id,
          };
        } else {
          return null;
        }
      })
    );
    for (users of usuarios) {
      if (users) {
        const refresh_token = users.refresh_token;
        const twitterID = users.twitterID;
        const uid = users.uid;

        const params = {
          ...twitterRefreshToken,
          refresh_token: refresh_token,
        };
        const headers = {
          Authorization: `Basic ${token}`,
          "Content-type": "application/x-www-form-urlencoded",
        };
        const res = await axios.post(urlToken, qs.stringify(params), {
          headers,
        });
        await saveToken(
          uid,
          res.data.access_token,
          res.data.refresh_token,
          twitterID
        );
        const twitterInfoUser = await getMetricsUser(res.data.access_token, twitterID);
        const twitterInfoTweets = await getMetricsTweets(res.data.access_token, twitterID);
        await saveTwitterData(twitterInfoUser,twitterInfoTweets, uid);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
