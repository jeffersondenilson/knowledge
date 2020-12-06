const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
	const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation;

	const encryptPassword = password => {
		const salt = bcrypt.genSaltSync(10);
		return bcrypt.hashSync(password, salt);
	}

	const save = async (req, res) => {
		const user = {...req.body};
		if(req.params.id) user.id = req.params.id;

		// admin = false, caso esteja criando a conta em '/signup'
		if(!req.originalUrl.startsWith('/users')) user.admin = false;
		// admin = false, caso não esteja logado ou não é admin
		if(!req.user || !req.user.admin) user.admin = false;

		// validação
		try{
			existsOrError(user.name, 'Nome não informado');
			existsOrError(user.email, 'E-mail não informado');
			existsOrError(user.password, 'Senha não informada');
			existsOrError(user.confirmPassword, 'Confirmação de senha inválida');
			equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem');

			// verifica se o email já existe
			const userFromDb = await app.db('users')
				.where({ email: user.email }).first();
			if(!user.id){
				// não permite criar novo usuário com mesmo email
				notExistsOrError(userFromDb, 'Usuário já cadastrado');
			}else if(userFromDb && userFromDb.id !== parseInt(user.id) && userFromDb.email === user.email){
				// se tem id (update), verifica se outro usuário já tem o email
				throw 'E-mail já cadastrado';
			}
		}catch(msg){
			return res.status(400).send(msg);
		}

		user.password = encryptPassword(user.password);
		delete user.confirmPassword;

		// salvar ou atualizar
		if(user.id){
			app.db('users')
				.update(user)
				.where({ id: user.id })
				.whereNull('deletedAt')
				.then(() => res.status(204).send())
				.catch(err => res.status(500).send(err));
		}else{
			app.db('users')
				.insert(user)
				.then(() => res.status(204).send())
				.catch(err => res.status(500).send(err));
		}
	}

	// soft delete (adiciona deletedAt, mas não exclui os dados)
	const remove = async (req, res) => {
		try{
			const rowsUpdated = await app.db('users')
				.update({ deletedAt: new Date() })
				.where({ id: req.params.id });
				
			try{
				existsOrError(rowsUpdated, 'Usuário não foi encontrado');
			}catch(msg){
				return res.status(400).send(msg);
			}

			res.status(204).send();
		}catch(msg){
			res.status(500).send(msg);
		}
	}

	const get = async (req, res) => {
		try{
			const { page, limit } = req.query;
			const query = app.db('users')
				.select('id', 'name', 'email', 'admin')
				.whereNull('deletedAt');
			if(page && limit){
				query.limit(limit).offset(page * limit - limit);
			}

			const [ usersTotal, users ] = await Promise.all([
				app.db('users').count('id').whereNull('deletedAt').first(),
				query
			]);

			res.json({
				count: parseInt(usersTotal.count),
				users
			});
		}catch(msg){
			res.status(500).send(msg);
		}
	}

	const getById = (req, res) => {
		app.db('users')
			.select('id', 'name', 'email', 'admin')
			.whereNull('deletedAt')
			.where({ id: req.params.id }).first()
			.then(user => res.json(user))
			.catch(err => res.status(500).send(err));
	}

	return { save, get, getById, remove }
}