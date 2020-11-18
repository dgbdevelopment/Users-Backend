const jwt = require('jsonwebtoken');

const getToken = (user) => {

  const payload = {
    user: {
      id: user.id,
      username: user.username,
      roles: user.roles
    }
  }
  const result = jwt.sign(payload, process.env.SECRET, {
    expiresIn: "14 days"
    })
  return result;
}
const verifyToken = (token) => {
  
  try {
    const userdata = jwt.verify(token, process.env.SECRET, {
    ignoreExpiration: false,
    });
    return userdata;

  } catch (err) {
    return {err: err.message};
  }
}

module.exports = {getToken, verifyToken}