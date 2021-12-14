var express = require("express");
const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "development"]
);
var router = express.Router();

/* POST register new user */
router.post("/", async function (req, res, next) {
  const { author, title, content } = req.body;
  // get user's id based on their username
  await knex("users")
    .where("username", author)
    .first("id")
    .then((user) => {
      // store new post in database
      return knex("posts").insert(
        { author_id: user.id, title: title, content: content },
        ["created_at"] // return timestamp as proof of success
      );
    })
    .then((postData) => res.status(201).json(postData[0]))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
