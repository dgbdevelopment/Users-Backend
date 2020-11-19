const { verifyToken } = require("../helpers/jwt");
const Response = require("../responses/response");

const isAuth = (req, res, next) => {
  //obtener el token del header
  if (!req.headers.authorization) return res.send(new Response(0, ['No tienes autorización']));
  const token = req.headers.authorization.split(' ')[1];
  //Verificar que exista el token
  if(!token) return res.status(401).send(new Response(0, ['No hay token. No tienes autorización.']))
  //Verificar que el token sea válido
  const data = verifyToken(token);
  if (data.err) return res.status(401).send(new Response(0, [`Token no válido: ${data.err}`]))
  //Añadir usuario al request
  req.user = data.user
  next()
}
const isAdmin = (req, res, next) => {
  let found = false;
  req.user.roles.forEach(rol => {    
    if (rol.name === 'admin') return found = true;
  })
  if (!found) return res.status(401).send(new Response(0, ['Necesitas permisos nivel administrador para acceder']));
  next();
}
const isUser = (req, res, next) => {
  let found = false;
  req.user.roles.forEach(rol => {    
    if (rol.name === 'user') return found = true;
  })
  if (!found) return res.status(401).send(new Response(0, ['Necesitas permisos nivel usuario para acceder']));
  next();
}
const isVisitor = (req, res, next) => {
  let found = false;
  req.user.roles.forEach(rol => {    
    if (rol.name === 'visitor') return found = true;
  })
  if (!found) return res.status(401).send(new Response(0, ['Necesitas al menos estar registrado para acceder']));
  next();
}

module.exports = {isAuth, isAdmin, isUser, isVisitor}