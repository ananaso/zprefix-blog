exports.up = function (knex) {
  return knex.schema.createTable("posts", function (table) {
    table.increments("id");
    table.integer("author_id").references("id").inTable("users");
    table.string("title").notNullable();
    table.text("content").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("posts");
};
