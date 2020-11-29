const mongoose = require('mongoose');

mongoose.connect(process.env.STATS_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
	.catch(e => {
		console.log('ERRO! Não foi possível conectar com o MongoDB!');
	});