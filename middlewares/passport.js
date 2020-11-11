const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const headerStrategy = require("passport-http-header-strategy").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { JWT_SECRET } = require("../config");

const User = require("../models/User");

// Passport Jwt
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("Authorization"),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.sub);

        if (!user) return done(null, false);

        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);


// Passport local
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email, isActive: true });
        if (!user) return done(null, false);
        const isCorrectPassword = await user.isValidPassword(password);
        if (!isCorrectPassword) throw new Error("Invalid Password");
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
