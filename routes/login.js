const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

router.post("/", (req, res) => {
  const details = {
    email: req.body.email,
    password: req.body.password,
  };
  console.log(details);
  res.redirect("/home");
});

module.exports = router;
