require('dotenv').config();

module.exports = {
  client: 'postgresql',
  connection: process.env.MAIN_DB_URI,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
