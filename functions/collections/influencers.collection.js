const firebase = require('../config/admin.config');

const influencerCollection = firebase.db.collection('influencers')

module.exports = influencerCollection