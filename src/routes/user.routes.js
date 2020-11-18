const { Router } = require('express');
const router = Router();
const { userList, createUser, loginUser } = require("../controllers/user.controller");
const {isAuth, isAdmin, isUser, isVisitor} = require('../middlewares/auth');
const {
  userRegisterValidations,
  userLoginValidations,
} = require("../middlewares/validations");

//GET
router.get('/', isAuth, isAdmin, userList)
// router.get('/:id', isAuth, isAdmin, getUser);

//POST
router.post("/register", userRegisterValidations, createUser);
router.post("/login", userLoginValidations, loginUser);

module.exports = router;