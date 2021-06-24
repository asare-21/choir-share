const { Router } = require("express");

const router = Router();

router.get("/", (req, res) => {
  req.logOut();
});

module.exports = router;
