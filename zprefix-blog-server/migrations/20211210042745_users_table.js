exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("user_id");
    table.string("username", 255).notNullable().unique();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
