module.exports = app => {
	app.route('/users')
		.get(app.api.user.get)
		.post(app.api.user.save)

	app.route('/users/:id')
		.get(app.api.user.getById)
		.put(app.api.user.save)

	app.route('/categories')
		.get(app.api.category.get)
		.post(app.api.category.save)

	// deve vir antes de '/categories/:id'!
	app.route('/categories/tree')
		.get(app.api.category.getTree)

	app.route('/categories/:id')
		.get(app.api.category.getById)
		.put(app.api.category.save)
		.delete(app.api.category.remove)
}