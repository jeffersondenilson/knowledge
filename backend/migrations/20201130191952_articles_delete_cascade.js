
exports.up = function(knex) {
  return knex.schema.alterTable('articles', table => {
  	table.dropForeign('categoryId');

  	table.foreign('categoryId')
  	.references('id').inTable('categories')
  	.onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('articles', table => {
  	table.dropForeign('categoryId');
  });
};

