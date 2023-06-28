const youtubeService = require('../services/youtube.service.js')

exports.setInfluencerYT = (req, res) => {
  const code = req.body.code
  const uid = req.body.uid
  youtubeService.setInfluencerYT(code, uid)
    .then(() => {
      res.status(200)
    }
    )
    .catch((error) => {
      res.status(400).send('')
    })
}
