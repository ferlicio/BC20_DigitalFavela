const facebookService = require('../services/facebook.service.js')

exports.setInfluencerFB = (req, res) => {
  const code = req.body.code
  const uid = req.body.uid
  facebookService.setInfluencerFB(code, uid)
    .then(() => {
      res.status(200)
    }
    )
    .catch((error) => {
      res.status(400).send('')
    })
}

