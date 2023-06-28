const influencerService = require("../services/influencer.service");
exports.checkValidEmailAndCPF = async (req, res) => {
  const cpf = req.body.cpf;
  const email = req.body.email;

  const verifier = await influencerService.checkValidEmailAndCPF(email, cpf);
  if (verifier) return res.status(200).json({ verifier: true });
  else
    return res
      .status(400)
      .json({ verifier: false, message: "CPF ou email inválido" });
};

exports.deleteSocialNetwork = async (req, res) => {
  const socialNetwork = req.body.socialNetwork.toLowerCase();
  const uid = req.body.uid;

  influencerService
    .deleteSocialNetwork(uid, socialNetwork)
    .then(() => {
      res.status(200);
    })
    .catch(() => {
      res.status(400);
    });
};
