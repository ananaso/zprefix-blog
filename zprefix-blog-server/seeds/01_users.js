exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { id: 1, username: "S3L4phiel", password: "v49" },
        { id: 2, username: "D0G", password: "v55" },
        { id: 3, username: "Sheep", password: "v69" },
      ]);
    });
};
