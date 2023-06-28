const adminService = require('../services/admin.service.js')

exports.createAdmin = (req, res) => {
  const { email, password, displayName } = req.body;
  adminService.createAdmin({ email, password, displayName })
    .then(() => {
      res.status(200).send('cadastrado com sucesso')
    })
    .catch(() => {
      res.status(400);
    })
}

