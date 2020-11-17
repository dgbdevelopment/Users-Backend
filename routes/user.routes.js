const { Router } = require('express');
const router = Router();
const { home, getUser, createUser, loginUser } = require("../controllers/user.controller");
const {
  userRegisterValidations,
  userLoginValidations,
} = require("../middlewares/validations");

//GET
router.get('/', home)

//POST
router.post("/register", userRegisterValidations, createUser);
router.post("/login", userLoginValidations, loginUser);

module.exports = router;