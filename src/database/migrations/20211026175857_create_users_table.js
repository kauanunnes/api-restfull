exports.up = async function (knex) {
  return knex.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.string('login').unique().notNullable();
      table.string('password').notNullable();
      table.specificType('phone', 'text[]');
      table.integer('job').references('id').inTable('jobs');
      table.boolean('admin').notNullable().defaultTo(false);
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable('users');
}