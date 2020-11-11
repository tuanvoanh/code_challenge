const router = require("express-promise-router")();

const pharmaController = require("../controllers/pharma");

const {
    validateBody,
    validateParam,
    validateQuery,
    schemas,
} = require("../helpers/routerHelpers");

const passport = require("passport");
const passportConfig = require("../middlewares/passport"); // chi la noi code, khong de ngoai app vi chi dung cho user
const e = require("express");

router
    .use(passport.authenticate("jwt", { session: false }))
    .route("/")
    .get(
        validateQuery(schemas.pharmaPagination),
        pharmaController.getListMedicine
    )
    .post(
        validateBody(schemas.pharmaCreate),
        pharmaController.createNewMedicine
    );

router
    .use(passport.authenticate("jwt", { session: false }))
    .route("/:id")
    .get(
        validateParam(schemas.idSchema, "id"),
        pharmaController.getMedicineById
    )
    .put(
        validateParam(schemas.idSchema, "id"),
        validateBody(schemas.pharmaCreate),
        pharmaController.editMedicine
    )
module.exports = router;
