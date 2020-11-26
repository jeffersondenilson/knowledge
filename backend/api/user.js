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
			console.log(userFromDb, user)
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
				.then(() => res.status(204).send())
				.catch(err => res.status(500).send(err));
		}else{
			app.db('users')
				.insert(user)
				.then(() => res.status(204).send())
				.catch(err => res.status(500).send(err));
		}
	}

	const get = (req, res) => {
		app.db('users')
			.select('id', 'name', 'email', 'admin')
			.then(users => res.json(users))
			.catch(err => res.status(500).send(err));
	}

	return { save, get }
}