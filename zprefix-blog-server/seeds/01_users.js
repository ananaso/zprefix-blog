exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        { username: "S3L4phiel", password: "v49" },
        { username: "D0G", password: "v55" },
        { username: "Sheep", password: "v69" },
      ]);
    });
};
