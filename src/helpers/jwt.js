const jwt = require('jsonwebtoken');

const getToken = (user) => {

  const payload = {
    user: {
      id: user.id,
      username: user.username
    }
  }
  const result = jwt.sign(payload, process.env.SECRET, {
    expiresIn: "14 days"
    })
  return result;
}

module.exports = {getToken}