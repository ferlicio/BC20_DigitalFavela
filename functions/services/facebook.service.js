const influencerCollection = require("../collections/influencers.collection");
const socialNetworksCollection = require("../collections/socialNetworks.collection");
const faceConfig = require("../config/facebookApp.config");
const facebookUtils = require("../utils/facebook.utils");
const axios = require("axios");

const baseURL = "https://graph.facebook.com/v14.0/";
const basicURL = "https://graph.facebook.com";

exports.setInfluencerFB = async (code, uid) => {
  try {
    const access_token = await exchangeToken(code);
    await setInstagram(uid);
    const pageID = await getPageID(access_token);
    const instaID = await getInstaID(access_token, pageID);
    const data = await getData(instaID, access_token)
    const dailyInsights = await getDailyInsights(instaID, access_token)
    await saveToken(uid, access_token, pageID, instaID);
    await saveInstaData(uid, data, dailyInsights);
  } catch {
    console.log("setInfluencerFB error");
  }
};


async function exchangeToken(code) {
  try {
    const res = await axios.get(`${baseURL}oauth/access_token`, {
      params: {
        ...faceConfig,
        code: code,
      },
    });

    return res.data.access_token;
  } catch {
    console.log("exchangeToken error");
  }
}
async function getData(instaID, access_token) {
  try {
    const res = await axios.get(`${baseURL}${instaID}`, {
      params: {
        access_token: access_token,
        fields: 'biography, followers_count, media_count, profile_picture_url, name, username, website, follows_count,media.limit(8){id,like_count,comments_count,media_type,timestamp,media_url,caption,permalink,comments,insights.metric(reach,engagement,impressions)},insights.metric(audience_city,audience_gender_age,audience_country).period(lifetime)'
      }
    })
    return facebookUtils.dataProcessing(res.data)
  }
  catch {
    console.log("getData error");
  }
}
async function getDailyInsights(instaID, access_token) {
  try {
    const res = await axios.get(`${basicURL}/${instaID}/insights`, {
      params: {
        access_token: access_token,
        metric: 'impressions,reach,profile_views,follower_count',
        period: 'day'
      }
    })
    return facebookUtils.dailyInsights(res.data.data)

  }
  catch {
    console.log("getDaily error");
  }
}

// Function to give faster connect feedback to the influencer
async function setInstagram(uid) {
  try {
    await influencerCollection.doc(uid).set(
      {
        instagram: "true",
        cadastroFinalizado: "true",
      },
      { merge: true }
    );
  } catch (error) {
    console.log("setInstagram error");
  }
}

async function getPageID(access_token) {
  try {
    const res = await axios.get(`${baseURL}me/accounts`, {
      params: {
        access_token: access_token,
      },
    });
    return res.data.data[0].id;
  } catch {
    console.log("getPageID error");
  }
}

async function getInstaID(access_token, pageID) {
  try {
    const res = await axios.get(`${baseURL}${pageID}`, {
      params: {
        fields: "instagram_business_account",
        access_token: access_token,
      },
    });
    return res.data.instagram_business_account.id;
  } catch {
    console.log("getInstaID error");
  }
}

async function saveToken(uid, access_token, pageID, instaID) {
  try {
    await socialNetworksCollection.doc(uid).set(
      {
        instagram: {
          access_token: access_token,
          pageID: pageID,
          instaID: instaID,
        },
      },
      { merge: true }
    );
  } catch {
    console.log("saveToken error");
  }
}


async function saveInstaData(uid, data, dailyInsights) {

  try {
    await influencerCollection.doc(uid).update({
      instagram: { ...data, timestamp: new Date(), dailyInsights: dailyInsights },
    });
  } catch {
    console.log("saveData error");
  }
}

exports.cronJobFacebook = async () => {
  try {
    const usuarios = await socialNetworksCollection.get().then((x) =>
      x.docs.map((doc) => {
        if (doc.data().instagram) {
          return {
            access_token: doc.data().instagram.access_token,
            instaID: doc.data().instagram.instaID,
            uid: doc.id,
          };
        } else {
          return null;
        }
      })
    );
    for (users of usuarios) {
      if (users) {
        const access_token = users.access_token;
        const instaID = users.instaID;
        const uid = users.uid;
        const data = await getData(instaID, access_token)
        const dailyInsights = await getDailyInsights(instaID, access_token)
        await saveInstaData(uid, data, dailyInsights);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
