var express = require("express");
const knex = require("knex")(
  require("../knexfile")[process.env.NODE_ENV || "development"]
);
var router = express.Router();
const bcrypt = require("bcrypt");

/* POST login attempt */
router.post("/", async function (req, res, next) {
  const { username, password } = req.body;
  return await knex("users")
    .where({ username: username })
    .select()
    .then((userArray) => {
      if (userArray.length === 0) {
        res.status(500).json({ success: false, error: "Username not found" });
      } else {
        const user = userArray[0];
        bcrypt.compare(password, user.hashed_password, (err, result) => {
          if (result === true) {
            res
              .status(200)
              .json({ success: true, message: "Successfully logged in" });
          } else {
            res
              .status(500)
              .json({ success: false, error: "Incorrect password" });
          }
        });
      }
    })
    .catch((err) => res.status(500).json(err));
});

module.exports = router;
