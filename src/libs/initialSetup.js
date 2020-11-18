const Role = require('../models/role.model');

const createRoles = async () => {
  const count = await Role.estimatedDocumentCount();
  if (count > 0) return;

  try {
    const values = await Promise.all([
      new Role({ name: 'admin' }).save(),
      new Role({ name: 'user' }).save(),
      new Role({ name: 'visitor' }).save()
    ])
    console.log('Inicializando roles...');
    console.log(values);
  } catch (error) {
    console.log(error.message)
  }
}
module.exports = createRoles;