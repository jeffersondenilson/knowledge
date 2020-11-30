const passport = require('passport');
const passportJwt = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJwt;

module.exports = app => {
	const opts = {
		secretOrKey: process.env.AUTH_SECRET,
		jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
	}

	const strategy = new Strategy(opts, (payload, done) => {
		app.db('users')
			.where({ id: payload.id })
			.whereNull('deletedAt')
			.first()
			.then(user => done(null, user ? {...payload} : false))
			.catch(err => done(err, false))
	});

	passport.use(strategy);

	return {
		authenticate: () => passport.authenticate('jwt', {session: false})
	}
}