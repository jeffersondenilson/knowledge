
exports.up = function(knex) {
  return knex.schema.alterTable('categories', table => {
  	table.dropForeign('parentId');

  	table.foreign('parentId')
	  	.references('id').inTable('categories')
	  	.onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('categories', table => {
  	table.dropForeign('parentId');

  	table.foreign('parentId')
  		.references('id').inTable('categories');
  });
};
