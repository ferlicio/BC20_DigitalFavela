const twitterService = require('../services/twitter.service.js')

exports.setInfluencerTW = (req, res) => {
  const code = req.body.code
  const uid = req.body.uid
  twitterService.setInfluencerTW(code, uid)
    .then(() => {
      res.status(200)
    }
    )
    .catch(() => {
      res.status(400).send('')
    })
}

