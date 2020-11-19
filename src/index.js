require('dotenv').config();
const express = require('express');
const app = express();
require('./database');
const createRoles = require('./libs/initialSetup');
const cors = require('cors');

createRoles();
//settings
app.set('PORT', process.env.PORT || 3300)


//middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//routes
app.use('/api', require('./routes/index.routes'));
app.use('/api/user', require('./routes/user.routes'));


//create server
app.listen(app.get('PORT'), () => console.log(`App running on http://localhost:${app.get('PORT')}/api`));