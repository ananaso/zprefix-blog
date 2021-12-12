exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("username", 50).notNullable().unique();
    table.string("hashed_password");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
