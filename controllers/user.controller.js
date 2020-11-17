const User = require('../models/user.model');
const { validationResult } = require('express-validator')
const { getToken } = require('../helpers/jwt');

let userController = {}

//GET /api/user
userController.home = async (req, res) => {
  await User.find((err, users) => {
    if (err) return res.status(400).send({ msg: "Error al consultar la lista de usuarios" });
    return  res.status(200).send({ msg: `Lista de usuarios actuales.`, users});
  })
};

// POST /api/user/register
userController.createUser = async (req, res) => {
  //Validar lo que nos llega
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors);
  //Verificar que el usuario no exista
  const { email } = req.body;
  const checkforEmail = await User.findOne({ email });
  if (checkforEmail)
    return res
      .status(400)
      .send({ errors: [{ msg: "El email proporcionado ya está registrado" }] });
  //Crear usuario con los datos que nos llegan
  const newUser = new User(req.body);
  //Encriptar el password
  newUser.password = await newUser.encryptPassword(newUser.password);
  //Guardar usuario
  await newUser.save((err, user) => {
    if (err)
      return res
        .status(400)
        .send({ msg: "Error al crear usuario", reason: err.message });
    //Obtenemos token
    const token = getToken(user)
    //Mandamos datos de usuario
    return res
      .status(200)
      .send({ msg: "El usuario ha sido registrado correctamente.", token});
  });
}

// POST /api/user/login
userController.loginUser = async (req, res) => {
  //Validamos lo que llega
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(errors);
  //Verificamos que el usuario exista
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send({ msg: 'El email introducido no existe en nuestra base de datos.' })
  //Comprobamos el password
  const matchPassword = await user.matchPassword(req.body.password, user.password);
  if (!matchPassword) return res.status(400).send({msg: 'La contraseña introducida es incorrecta.'})
  //Obtenemos un nuevo token
  const token = getToken(user);
  //Mandamos los datos
  res.status(200).send({ msg: 'Usuario logeado correctamente', token })
}


module.exports = userController;