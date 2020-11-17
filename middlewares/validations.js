const { check } = require('express-validator');

const passwordRegEx = /(?=(.*[0-9]))((?=.*[A-Za-z0-9])(?=.*[A-Z])(?=.*[a-z]))^.{6,}$/;

const userRegisterValidations = [
  check("username", "El nombre de usuario es obligatorio")
    .not().isEmpty(),
  check("email", "El email no es válido").isEmail(),
  check(
    "password",
    "La contraseña debe contener 6 caracteres mínimo con al menos: 1 miníscula, 1 mayúscula y 1 número"
  ).custom(value => {
    if (!passwordRegEx.test(value)) return false;
    return true;
  }),
  check('confirm', 'Las contraseñas no coinciden').custom((value, { req }) => {
    if (value !== req.body.password) return false;
    return true;
  })
];

const userLoginValidations = [
  check("email", "El email no es válido").isEmail(),
  check(
    "password",
    "La contraseña debe contener 6 caracteres mínimo con al menos: 1 miníscula, 1 mayúscula y 1 número"
  ).custom((value) => {
    if (!passwordRegEx.test(value)) return false;
    return true;
  }),
];


module.exports = { userRegisterValidations, userLoginValidations };

