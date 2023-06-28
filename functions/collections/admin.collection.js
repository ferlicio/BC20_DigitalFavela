const firebase = require("../config/admin.config");

const adminCollection = firebase.db.collection("admins");

module.exports = adminCollection;
