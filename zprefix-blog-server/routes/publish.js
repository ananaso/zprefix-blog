var express = require("express");
const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "development"]
);
var router = express.Router();

/* POST new blog post */
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
        ["id", "created_at"] // return timestamp as proof of success
      );
    })
    .then((postData) => res.status(201).json(postData[0]))
    .catch((err) => res.status(500).json(err));
});

/* PATCH existing blog post */
router.patch("/", async function (req, res, next) {
  const { id, title, content } = req.body;
  await knex("posts")
    .where("id", id)
    .update({ title: title, content: content }, ["created_at", "updated_at"])
    .then((updateData) => res.status(200).json(updateData[0]))
    .catch((err) => res.status(500).json(err));
});

/* DELETE existing blog post */
router.delete("/", async function (req, res, next) {
  await knex("posts")
    .where("id", req.body.id)
    .del()
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
