const User = require("../models/user.model");
const { validationResult } = require("express-validator");
const { getToken } = require("../helpers/jwt");
const Response = require('../responses/response');
const Role = require('../models/role.model');

let userController = {};

//GET /api/user
//Lista de usuarios registrados
userController.userList = async (req, res) => {
  await User.find((err, users) => {
    if (err)
      return res
        .status(400)
        .send(new Response(0, ["Error al consultar la lista de usuarios" ]));
    return res.status(200).send(new Response(1, [`Lista de usuarios actuales.`], users ));
  });
};

// POST /api/user/register
//Registrar un usuario
userController.createUser = async (req, res) => {
  //Validar lo que nos llega
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(new Response(0, errors.errors.map((error) => error.msg)));
  const newUser = new User(req.body);
  //Encriptar el password
  newUser.password = await newUser.encryptPassword(newUser.password);
  //Asignacion de roles
  //Si es el primer usuario en registrarse será admin
  const count = await User.estimatedDocumentCount();
  if (count === 0) {
    const roles = await Role.find();
    newUser.roles = roles.map(rol=> rol._id)
  }
  //Si ya hay un usuario tendrá el rol por defecto visitor
  else {
    const role = await Role.findOne({ name: 'visitor' });
    newUser.roles = [role._id]
  }
  //Guardar usuario
  await newUser.save(async (err, user) => {
    if (err) return res.status(400).send(new Response(0, ["Error al crear usuario: " + err.message]));
    //Obtenemos token
    user = await User.findById(user._id).populate('roles')
    const token = getToken(user);
    //Mandamos datos de usuario
    return res
      .status(200)
      .send(new Response(1, ["El usuario ha sido registrado correctamente."], token));
  })
};

// POST /api/user/login
// Loguear un usuario
userController.loginUser = async (req, res) => {
  //Validamos lo que llega
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send(new Response(0, errors.errors.map((error) => error.msg)));
  //Verificamos que el usuario exista
  const user = await User.findOne({ email: req.body.email }).populate('roles');
  if (!user)
    return res
      .status(400)
      .send({
        msg: "El email introducido no existe en nuestra base de datos.",
      });
  // //Comprobamos el password
  const matchPassword = await user.matchPassword(
    req.body.password,
    user.password
  );
  if (!matchPassword)
    return res
      .status(400)
      .send(new Response(0, ["La contraseña introducida es incorrecta."]));
  //Obtenemos un nuevo token
  const token = getToken(user);
  //Mandamos los datos
  res.status(200).send(new Response(1, ["Usuario logeado correctamente"], token ));
};

module.exports = userController;
