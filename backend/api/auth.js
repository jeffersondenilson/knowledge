const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
	const signin = async (req, res) => {
		try{
			// validação
			if(!req.body.email || !req.body.password){
				return res.status(400).send('Informe usuário e senha');
			}

			const user = await app.db('users')
				.where({ email: req.body.email })
				.whereNull('deletedAt')
				.first();

			if(!user) return res.status(400).send('Usuário não encontrado');

			const isMatch = bcrypt.compareSync(req.body.password, user.password);
			if(!isMatch) return res.status(401).send('Email/Senha inválidos');
			
			// gerar jwt
			const now = Math.floor(Date.now() / 1000);// data em segundos

			const payload = {
				id: user.id,
				name: user.name,
				email: user.email,
				admin: user.admin,
				iat: now,
				exp: now + (60 * 60 * 24 * 3)// 3 dias
			}

			res.json({
				...payload,
				token: jwt.encode(payload, process.env.AUTH_SECRET)
			});
		}catch(msg){
			res.status(500).send(msg);
		}
	}

	const validateToken = async (req, res) => {
		const userData = req.body || null;
		try{
			if(userData){
				const token = jwt.decode(userData.token, process.env.AUTH_SECRET);
				if(new Date(token.exp * 1000) > new Date()){
					return res.send(true);
				}
			}
		}catch(e){
			// problema com o token
		}

		res.send(false);
	}

	return { signin, validateToken }
}