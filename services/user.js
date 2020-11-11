const { JWT_SECRET } = require("../config");
const JWT = require("jsonwebtoken");
const User = require("../models/User");

module.exports = UserService = {
  encodedToken: (userID) => {
    return JWT.sign(
      {
        iss: "Tuan Vo",
        sub: userID,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3),
      },
      JWT_SECRET
    );
  },

  signUpService: async (req, res, next) => {
    const { firstName, lastName, email, password } = req.value.body;

    // Check if there is a user with the same user
    const foundUser = await User.findOne({ email });
    if (foundUser)
      return res
        .status(403)
        .json({ error: { message: "Email is already in use." } });

    // Create a new user
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    // Encode a token
    const token = UserService.encodedToken(newUser._id);

    res.setHeader("Authorization", token);
    
    return res.status(201).json({ success: true });
  },
};
