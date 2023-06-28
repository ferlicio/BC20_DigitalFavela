exports.getGenderAge = (values) => {
  const age = [
    "age13-17",
    "age18-24",
    "age25-34",
    "age35-44",
    "age45-54",
    "age55-64",
    "age65",
  ];
  let female = 0;
  for (let i of values) {
    if (i[1] == "female") {
      female += i[2];
    }
  }
  let gender = {
    female: female,
    male: 100 - female,
  };

  let genderAge = [];

  for (let i in age) {
    let female = 0;
    let male = 0;
    for (let value of values) {
      if (age[i] == value[0]) {
        if (value[1] == "female") {
          female = value[2];
        } else {
          male = value[2];
        }
      }
    }
    const result = {
      age: age[i].substring(3),
      female: female,
      male: male,
    };
    genderAge.push(result);
  }
  return { gender, genderAge };
}

exports.getBasics = (data) => {
  const properties = data.columnHeaders;
  const values = data.rows[0];
  const basics = {};
  for (let i in properties) {
    basics[properties[i].name] = values[i];
  }
  return basics;
}


exports.getVideoData=(videosList,subscribers)=>{
  const videos = videosList.map((value)=>{return {
    id:value.id,
    thumbnail:value.snippet.thumbnails.high.url,
    title:value.snippet.title,
    description:value.snippet.description,
    views:value.statistics.viewCount,
    likes:value.statistics.likeCount,
    favorite:value.statistics.favoriteCount,
    comments:value.statistics.commentCount,
    reach:value.statistics.viewCount*100/subscribers,
    engagement:((value.statistics.likeCount*1+value.statistics.commentCount*1)*100)/subscribers
}})
return {videos}
}