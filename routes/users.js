
const router = require("express-promise-router")();

const UserController = require("../controllers/user");

const {
  validateBody,
  schemas,
} = require("../helpers/routerHelpers");

const passport = require("passport");
const passportConfig = require("../middlewares/passport"); // chi la noi code, khong de ngoai app vi chi dung cho user


router
  .route("/signup")
  .post(validateBody(schemas.authSignUpSchema), UserController.signUp);

router
  .route("/signin")
  .post(
    validateBody(schemas.authSignInSchema),
    passport.authenticate("local", { session: false }),
    UserController.signIn
  );
    

module.exports = router;
