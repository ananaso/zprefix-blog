exports.up = function (knex) {
  return knex.schema.createTable("posts", function (table) {
    table.increments("id");
    table.integer("author_id").references("user_id").inTable("users");
    table.string("title").notNullable();
    table.text("content").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("posts");
};
