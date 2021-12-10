var express = require("express");
const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "development"]
);
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  await knex
    .column("id", "author_id", "title", "content", "created_at", "updated_at")
    .select()
    .from("posts")
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
