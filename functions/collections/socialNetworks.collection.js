const firebase = require('../config/admin.config');

const socialNetworksCollection = firebase.db.collection('socialNetworks')

module.exports = socialNetworksCollection