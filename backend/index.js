require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = require('express')();
const consign = require('consign');
const db = require('./config/db');
const mongoose = require('mongoose');

require('./config/mongodb');

app.db = db;
app.mongoose = mongoose;

consign()
	.include('./config/passport.js')
	.then('./config/middleware.js')
	.then('./api/validation.js')
	.then('./api')
	.then('./schedule')
	.then('./config/routes.js')
	.into(app);

app.listen(PORT, ()=>console.log(`Listening on port ${PORT}!`));