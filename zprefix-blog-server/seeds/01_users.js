exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          username: "S3L4phiel",
          hashed_password:
            "$2b$10$mgiNEZe/U8XjiUltxdn3p.kxfcLFRri4lQnEExSNSs54thTJZuSWK",
        }, // password = v49
        {
          username: "D0G",
          hashed_password:
            "$2b$10$pmGOt.3xT5vZWkgQVgltVOxWgdeM2Tbdz833avGenDkaWuzWDTWnu",
        }, // password = v55
        {
          username: "Sheep",
          hashed_password:
            "$2b$10$H53TCGNZiw7/NPHP2PuFxeZt.kVXk5jWcxl.BxPg8eJyQ7Xa8p.5S",
        }, // password = v69
      ]);
    });
};
