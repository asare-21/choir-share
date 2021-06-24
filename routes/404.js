const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.render("404.ejs");
});

module.exports = router;
