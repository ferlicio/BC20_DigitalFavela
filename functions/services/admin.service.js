const adminCollection = require("../collections/admin.collection");
const firebase = require("../config/admin.config");

exports.createAdmin = async ({ email, password, displayName }) => {
  try {
    const user = await firebase.auth.createUser({
      email: email,
      password: password,
      displayName: displayName,
    });
    await adminCollection.doc(user.uid).set({
      uid: user.uid,
      email: email,
      displayName: displayName,
    });
    await firebase.auth.setCustomUserClaims(user.uid, {
      admin: true,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
};
