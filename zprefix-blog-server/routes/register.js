var express = require("express");
const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "development"]
);
var router = express.Router();
const bcrypt = require("bcrypt");
const saltRounds = 10;

/* POST register new user */
router.post("/", async function (req, res, next) {
  const { username, password } = req.body;

  return await bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      knex("users")
        .insert({
          username: username,
          hashed_password: hash,
          salt: salt,
        })
        .then((data) => res.status(200).json(data))
        .catch((err) => res.status(500).json(err));
    });
  });
});

module.exports = router;
