const Joi = require("@hapi/joi");

const validateBody = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.body);
    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value.params = {};

      req.value.body = validatorResult.value;
      next();
    }
  };
};

const validateParam = (schema, name) => {
  return (req, res, next) => {
    const validatorResult = schema.validate({ param: req.params[name] });

    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value.params = {};

      req.value.params[name] = req.params[name];
      next();
    }
  };
};

const validateQuery = (schema) => {
  return (req, res, next) => {
    const validatorResult = schema.validate(req.query);

    if (validatorResult.error) {
      return res.status(400).json(validatorResult.error);
    } else {
      if (!req.value) req.value = {};
      if (!req.value["params"]) req.value.params = {};

      req.value.query = validatorResult.value;
      next();
    }
  };
};

const validateRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      req.user.admin = false;
    } else {
      req.user.admin = true;
    }
    next();
  };
};

const isRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401).json({ error: "Unauthorized" });
    } else {
      next();
    }
  };
};

const schemas = {
  authSignInSchema: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  authSignUpSchema: Joi.object().keys({
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),

  pharmaPagination: Joi.object().keys({
    page: Joi.number().integer().min(0).default(0),
    limit: Joi.number().integer().positive().default(10),
  }),

  pharmaCreate: Joi.object().keys({
    medicine: Joi.string().min(2).required(),
    quality: Joi.number().integer().positive().required(),
  }),

  idSchema: Joi.object().keys({
    param: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
  }),
};

module.exports = {
  validateBody,
  validateParam,
  validateQuery,
  schemas,
  validateRole,
  isRole
};
