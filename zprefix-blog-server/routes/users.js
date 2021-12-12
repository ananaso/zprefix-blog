var express = require("express");
const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "development"]
);
var router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  await knex("users")
    .select("id", "username")
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
