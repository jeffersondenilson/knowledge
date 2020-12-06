const queries = require('./queries');

module.exports = app => {
	const { existsOrError } = app.api.validation;

	const save = (req, res) => {
		const article = {
			name: req.body.name,
			description: req.body.description,
			imageUrl: req.body.imageUrl,
			content: req.body.content,
			userId: req.body.userId,
			categoryId: req.body.categoryId
		};
		if(req.params.id) article.id = req.params.id;

		// validação
		try{
			existsOrError(article.name, 'Nome não informado');
			existsOrError(article.description, 'Descrição não informada');
			existsOrError(article.categoryId, 'Categoria não informada');
			existsOrError(article.userId, 'Autor não informado');
			existsOrError(article.content, 'Conteúdo não informado');
		}catch(msg){
			return res.status(400).send(msg);
		}

		// salvar ou atualizar
		if(article.id){
			app.db('articles')
				.update(article)
				.where({ id: article.id })
				.then(() => res.status(204).send())
				.catch(err => res.status(500).send(err));
		}else{
			app.db('articles')
				.insert(article)
				.then(() => res.status(204).send())
				.catch(err => res.status(500).send(err));
		}
	}

	const remove = async (req, res) => {
		try{
			const rowsDeleted = await app.db('articles')
				.where({ id: req.params.id }).del();

			try{
				existsOrError(rowsDeleted, 'Artigo não foi encontrado');
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
			const query = app.db({a: 'articles', u: 'users'})
				.select('a.id', 'a.name', 'a.description', { author: 'u.name' })
				.whereRaw('?? = ??', ['u.id', 'a.userId']);
			if(page && limit){
				query.limit(limit).offset(page * limit - limit);
			}

			const [ articlesTotal, articles ] = await Promise.all([
				app.db('articles').count('id').first(),
				query
			]);
			
			res.json({ 
				count: parseInt(articlesTotal.count), 
				articles
			});
		}catch(msg){
			res.status(500).send(msg);
		}
	}

	const getById = (req, res) => {
		app.db('articles')
			.where({ id: req.params.id }).first()
			.then(article => {
				article.content = article.content.toString();
				return res.json(article);
			})
			.catch(err => res.status(500).send(err));
	}

	// retorna todos os artigos contidos na categoria e suas subcategorias
	const getByCategory = async (req, res) => {
		try{
			const categoryId = req.params.id;
			const page = req.query.page || 1;
			const limit = req.query.limit || 10;
			// busca id das subcategorias
			const categories = await app.db.raw(queries.categoryWithChildren, categoryId);
			const ids = categories.rows.map(c => c.id);

			const articles = await app.db({a: 'articles', u: 'users'})
				.select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
				.whereRaw('?? = ??', ['u.id', 'a.userId'])
				.whereIn('categoryId', ids)
				.orderBy('a.id', 'desc')
				.limit(limit).offset(page * limit - limit);
			
			res.json(articles);
		}catch(msg){
			res.status(500).send(msg);
		}
	}

	return { save, remove, get, getById, getByCategory }
}