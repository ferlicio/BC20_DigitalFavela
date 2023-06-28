exports.dataProcessing = (rawData) => {
  const data = { ...rawData }
  data.insights = insightData(data.insights.data)
  data.media = midiaData(data.media.data, data.followers_count)
  return data
}
exports.dailyInsights = (rawData) => {
  let dailyInsights = {}
  for (let insight of rawData) {
    dailyInsights[insight.name] = insight.values[1].value
  }
  let dateInsight = {}
  let date = new Date();
  date.setDate(date.getDate() - 1);
  dateInsight[date] = dailyInsights
  return dateInsight
}



function insightData(data) {
  let insights = {}
  for (let insight of data) {
    const value = insight.values[0].value
    if (insight.name == "audience_gender_age") {
      const genderAge = genderAgeData(value)
      Object.assign(insights, genderAge)
    } else if (insight.name == "audience_city") {
      const city = audienceCityData(value)
      Object.assign(insights, city)
    }
    else {
      insights[insight.name] = value
    }
  }
  return insights
}

function midiaData(data, followers) {
  console.log(followers)
  const midias = data
  const midiasProcessed = []
  for (let midia of midias) {
    const mediaInsights = insightData(midia.insights.data)
    mediaInsights.engagement = parseFloat(((mediaInsights.engagement * 100) / followers).toFixed(2))
    delete midia.insights
    Object.assign(midia, mediaInsights)
    midiasProcessed.push(midia)
  }
  return midiasProcessed
}

function audienceCityData(data) {
  let audience_city = []
  let total = 0
  for (let city in data) {
    total += data[city]
  }
  for (let city in data) {
    const cityData = {
      city: city,
      value: (data[city] * 100 / total)
    }
    audience_city.push(cityData)
  }
  audience_city.sort((a, b) => b.value - a.value)

  return { audience_city }
}



function genderAgeData(values) {
  ageArray = ['18-24', '25-34', '35-44', '34-54', '55-64', '65+']
  let audience_genderAge = []
  let audience_age = {}
  let f = 0
  let m = 0
  let u = 0
  total = 0
  for (let i in values) {
    if (i.charAt(0) == "F") {
      f += values[i]
    } else if (i.charAt(0) == "M") {
      m += values[i]
    } else {
      u += values[i]
    }
    total += values[i]
  }

  u = ((u / total) * 100).toFixed(2)
  f = ((f / total) * 100).toFixed(2)
  m = ((m / total) * 100).toFixed(2)
  audience_age = {
    female: f,
    male: m,
    undefined: u
  }


  for (let ageValue of ageArray) {
    f = 0
    m = 0
    u = 0
    for (let i in values) {
      if (i.slice(2) == ageValue) {
        if (i.charAt(0) == "F") {
          f += values[i]
        } else if (i.charAt(0) == "M") {
          m += values[i]
        } else {
          u += values[i]

        }
      }
    }
    ageObj = {
      age: ageValue,
      female: ((f / total) * 100).toFixed(2),
      male: ((m / total) * 100).toFixed(2),
      undefined: ((u / total) * 100).toFixed(2),
    }
    audience_genderAge.push(ageObj)
  }
  return { audience_genderAge, audience_age }
}