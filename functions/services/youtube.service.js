const influencerCollection = require("../collections/influencers.collection");
const socialNetworksCollection = require("../collections/socialNetworks.collection");
const youtubeConfig = require("../config/youtubeApp.config");
const youtubeUtils = require("../utils/youtube.utils");
const axios = require("axios");

const urlToken = "https://accounts.google.com/o/oauth2/token";
const urlGoogleApi = "https://www.googleapis.com/youtube/v3";
const URLReports = "https://youtubeanalytics.googleapis.com/v2/reports";
const URLDados = "https://youtube.googleapis.com/youtube/v3/channels";
const URLRefreshToken = "https://oauth2.googleapis.com/token";

exports.setInfluencerYT = async (code, uid) => {
  try {
    const res = await exchangeToken(code);
    await setYoutube(uid);
    const access_token = res.data.access_token;
    const refresh_token = res.data.refresh_token;
    const youtubeID = await getYoutubeID(access_token);
    await saveToken(uid, access_token, refresh_token, youtubeID);
    const publicInsights = await getPublicInsights(youtubeID, access_token);
    const channelInfo = await getChannelInfo(youtubeID);
    const videos = await getVideosData(youtubeID,channelInfo.subscriberCount)
    const basicInfo = await getBasicInfo(youtubeID, access_token);
    await saveYoutubeData(uid, publicInsights, channelInfo, basicInfo,videos);
  } catch (error) {
    console.log("setInfluencerYT error");
  }
};

//

async function exchangeToken(code) {
  try {
    const res = await axios.post(urlToken, {
      ...youtubeConfig.app,
      code: code,
      grant_type: "authorization_code",
    });
    return res;
  } catch (error) {
    console.log("exchangeToken error");
  }
}

// Function to give faster connect feedback to the influencer
async function setYoutube(uid) {
  try {
    await influencerCollection.doc(uid).set(
      {
        youtube: "true",
        cadastroFinalizado: "true",
      },
      { merge: true }
    );
  } catch (error) {
    console.log("setYoutube error");
  }
}

async function getYoutubeID(access_token) {
  try {
    const res = await axios.get(`${urlGoogleApi}/channels`, {
      params: {
        ...youtubeConfig.key,
        access_token: access_token,
        part: "id",
        mine: true,
      },
    });
    return res.data.items[0].id;
  } catch {
    console.log("getYoutubeID error");
  }
}

async function saveToken(uid, access_token, refresh_token, youtubeID) {
  try {
    await socialNetworksCollection.doc(uid).set(
      {
        youtube: {
          access_token: access_token,
          refresh_token: refresh_token,
          youtubeID: youtubeID,
        },
      },
      { merge: true }
    );
  } catch (error) {
    console.log("saveToken error");
  }
}

async function getPublicInsights(youtubeID, access_token) {
  try {
    const publicData = await axios.get(`${URLReports}`, {
      params: {
        metrics: "viewerPercentage",
        dimensions: "ageGroup,gender",
        ids: `channel==${youtubeID}`,
        sort: "gender,ageGroup",
        startDate: "2011-01-01",
        endDate: "2022-05-31",
        ...youtubeConfig.key,
        access_token: access_token,
      },
    });
    genderAgeValues = publicData.data.rows;
    const publicoInsights = youtubeUtils.getGenderAge(genderAgeValues);
    return publicoInsights;
  } catch {
    console.log("getPublicInsights error");
  }
}

async function getChannelInfo(youtubeID) {
  try {
    const resCanal = await axios.get(`${URLDados}`, {
      params: {
        part: "brandingSettings,statistics,snippet",
        id: `${youtubeID}`,
        ...youtubeConfig.key,
      },
    });
    const canalData = resCanal.data.items[0];
    const canalDataObj = {
      title: canalData.brandingSettings.channel.title,
      subscriberCount: canalData.statistics.subscriberCount,
      profile_picture_url: canalData.snippet.thumbnails.medium.url,
    };
    return canalDataObj;
  } catch {
    console.log("getChannelInfo error");
  }
}

async function getBasicInfo(youtubeID, access_token) {
  try {
    const resBasics = await axios.get(`${URLReports}`, {
      params: {
        ids: `channel==${youtubeID}`,
        metrics: "views,comments,likes,dislikes",
        startDate: "2011-01-01",
        endDate: "2022-05-31",
        ...youtubeConfig.key,
        access_token: access_token,
      },
    });
    const basicsInsights = youtubeUtils.getBasics(resBasics.data);
    return basicsInsights;
  } catch {
    console.log("getBasicInfo error");
  }
}


async function getVideosData(youtubeId,subscribers) {
  try {
    const res = await axios.get(`${urlGoogleApi}/search`, {
      params: {
        ...youtubeConfig.key,
        part: "id",
        type:"video",
        channelId:youtubeId,
        maxResults:50
      },
    });
    let videosId= [];
    res.data.items.forEach((video)=>{videosId.push(video.id.videoId)})
    const resData = await axios.get(`${urlGoogleApi}/videos`, {
      params: {
        ...youtubeConfig.key,
        part: "snippet,statistics",
        id:String(videosId)
      },
    });
    return youtubeUtils.getVideoData(resData.data.items,subscribers)
  } catch {
    console.log("getVideoData error");
  }


}

async function saveYoutubeData(uid, publicInsights, channelInfo, basicInfo,videos) {
  try {
    await influencerCollection.doc(`${uid}`).update({
      youtube: {
        ...publicInsights,
        ...channelInfo,
        ...basicInfo,
        ...videos,
        timestamp: new Date(),
      },
    });
  } catch {
    console.log("saveData error");
  }
}

exports.cronJobYoutube = async () => {
  try {
    const usuarios = await socialNetworksCollection.get().then((x) =>
      x.docs.map((doc) => {
        if (doc.data().youtube) {
          return {
            refresh_token: doc.data().youtube.refresh_token,
            youtubeID: doc.data().youtube.youtubeID,
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
        const youtubeID = users.youtubeID;
        const uid = users.uid;

        const res = await axios.post(URLRefreshToken, {
          client_id: youtubeConfig.app.client_id,
          client_secret: youtubeConfig.app.client_secret,
          refresh_token: refresh_token,
          grant_type: "refresh_token",
        });

        const access_token = res.data.access_token;

        await saveToken(uid, access_token, refresh_token, youtubeID);
        const publicInsights = await getPublicInsights(youtubeID, access_token);
        const channelInfo = await getChannelInfo(youtubeID);
        const basicInfo = await getBasicInfo(youtubeID, access_token);
        const videos = await getVideosData(youtubeID,channelInfo.subscriberCount)
        await saveYoutubeData(uid, publicInsights, channelInfo, basicInfo,videos);
      }
    }
  } catch {
    console.log("cronJobYoutube error");
  }
};
