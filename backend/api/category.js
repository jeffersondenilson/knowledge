module.exports = app => {
	const { existsOrError, notExistsOrError } = app.api.validation;

	const save = async (req, res) => {
		const category = {...req.body};
		if(req.params.id) category.id = req.params.id;

		// validação
		try{
			existsOrError(category.name, 'Nome não informado');
		}catch(msg){
			return res.status(400).send(msg);
		}

		// salvar ou atualizar
		if(category.id){
			app.db('categories')
				.update(category)
				.where({ id: category.id })
				.then(() => res.status(204).send())
				.catch(err => res.status(500).send(err));
		}else{
			app.db('categories')
				.insert(category)
				.then(() => res.status(204).send())
				.catch(err => res.status(500).send(err));
		}
	}

	const remove = async (req, res) => {
		try{
			existsOrError(req.params.id, 'Código da Categoria não informado');
			// não permite excluir se tiver subcategorias/artigos
			// TODO: fazer on delete cascade
			const subcategory = await app.db('categories')
				.where({ parentId: req.params.id });
			notExistsOrError(subcategory, 'Categoria possui subcategorias');

			const articles = await app.db('articles')
				.where({ categoryId: req.params.id })
			notExistsOrError(articles, 'Categoria possui artigos');

			const rowsDeleted = await app.db('categories')
				.where({ id: req.params.id }).del();
			existsOrError(rowsDeleted, 'Categoria não foi encontrada');

			res.status(204).send();
		}catch(msg){
			res.status(400).send(msg);
		}
	}

	// adiciona atributo na categoria com as categorias pai
	// 'category > subcategory1 > subcategory2...'
	const withPath = categories => {
		// filtra na lista de categorias as que tem uma categoria como pai
		const getParent = (categories, parentId) => {
			let parent = categories.filter(parent => parent.id === parentId);
			return parent.length > 0 ? parent[0] : null;
		}

		const categoriesWithPath = categories.map(category => {
			let path = category.name;
			let parent = getParent(categories, category.parentId);

			while(parent){
				path = `${parent.name} > ${path}`;
				parent = getParent(categories, parent.parentId);
			}

			return {...category, path}
		})

		categoriesWithPath.sort((a, b) => {
			if(a.path < b.path) return -1;
			if(a.path > b.path) return 1;
			return 0;
		})

		return categoriesWithPath;
	}

	const get = (req, res) => {
		// app.db('categories')
		// 	.select('id', 'name', 'email', 'admin')
		// 	.then(categories => res.json(categories))
		// 	.catch(err => res.status(500).send(err));
	}

	const getById = (req, res) => {
		// app.db('categories')
		// 	.select('id', 'name', 'email', 'admin')
		// 	.where({ id: req.params.id }).first()
		// 	.then(category => res.json(category))
		// 	.catch(err => res.status(500).send(err));
	}

	return { save, get, getById }
}