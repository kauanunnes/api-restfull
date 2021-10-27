
exports.up = function(knex) {
  return knex.schema.createTable('jobs', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.integer('sector').references('id').inTable('sectors');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('jobs')
};
