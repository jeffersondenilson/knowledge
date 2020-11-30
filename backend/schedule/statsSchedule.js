const schedule = require('node-schedule');

module.exports = app => {
	// salva estatísticas a cada um minuto
	schedule.scheduleJob('*/1 * * * *', async function(){
		try{
			const { Stat } = app.api.stat;

			const [
				usersTotal, 
				categoriesTotal, 
				articlesTotal, 
				lastStat
			] = await Promise.all([
				app.db('users').count('id').whereNull('deletedAt').first(),
				app.db('categories').count('id').first(),
				app.db('articles').count('id').first(),
				Stat.findOne({}, {}, { sort: { 'createdAt': -1 } })
			]);

			const stat = new Stat({
				users: usersTotal.count,
				categories: categoriesTotal.count,
				articles: articlesTotal.count
			});
			// verifica se houve mudança
			const changeUsers = !lastStat || stat.users !== lastStat.users;
			const changeCategories = !lastStat || stat.categories !== lastStat.categories;
			const changeArticles = !lastStat || stat.articles !== lastStat.articles;

			if(changeUsers || changeCategories || changeArticles){
				await stat.save();
				console.log('[Stats] Estatísticas atualizadas!');
			}
		}catch(msg){
			res.status(500).send(msg);
		}
	});
}