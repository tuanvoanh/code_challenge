const UserService = require("../services/user");

const signIn = async (req, res, next) => {
  // Assign a token
  const token = UserService.encodedToken(req.user._id)

  res.setHeader('Authorization', token)
  return res.status(200).json({ success: true })
};

const signUp = async (req, res, next) => {
  UserService.signUpService(req, res, next)
};


module.exports = {
  signIn,
  signUp,
};
