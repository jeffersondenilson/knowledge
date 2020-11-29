// Update with your config settings.

module.exports = {
  client: 'postgresql',
  /*connection: {
    database: 'knowledge',
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },*/
  connection: process.env.MAIN_DB_URI,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
