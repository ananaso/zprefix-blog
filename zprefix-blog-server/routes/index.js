var express = require("express");
const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "development"]
);
var router = express.Router();

/* GET all posts */
router.get("/", async function (req, res, next) {
  await knex("posts")
    .join("users", "users.id", "=", "posts.author_id")
    .select(
      "posts.id",
      "users.username",
      "posts.title",
      "posts.content",
      "posts.created_at",
      "posts.updated_at"
    )
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
