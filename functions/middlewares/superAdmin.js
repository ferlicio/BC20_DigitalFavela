const firebase = require('../config/admin.config')

exports.verify = async (req, res, next) => {
  try {
    const userToken = req.headers.authorization.slice(7);
    const decodedToken = await firebase.auth.verifyIdToken(userToken);
    const user = await firebase.auth.getUser(decodedToken.uid);
    if (user.customClaims["superAdmin"]) {
      next();
    } else {
      res
        .status(401)
        .json({ success: false, message: "Usuário não é super administrador" });
    }
  } catch (err) {
    res.status(400).json({ success: false, message: "Token Inválido" });
  }
};