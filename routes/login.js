const { Router } = require("express");
const error = require("../routes/404");
const router = Router();
const { passport } = require("../passport-config");

router.get("/", (req, res) => {
  res.render("login.ejs", {
    haserror: false,
    error: "",
  });
});

router.post("/mobile", (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      return res.json({
        auth: false,
        error: err,
      });
    }
    if (!user) {
      return res.json({
        auth: false,
        error: "Invalid Email Address or Password",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(400).json({ auth: false, error: err });
      } else {
        return res.json({
          auth: true,
          user: user,
        });
      }
    });
  })(req, res, next);
});

router.post("/", (req, res, next) => {
  passport.authenticate("local", { session: true }, (err, user, info) => {
    if (err) {
      return res.render("login.ejs", {
        haserror: true,
        error: err,
      });
    }
    if (!user) {
      return res.render("login.ejs", {
        haserror: true,
        error: "Invalid Email Address or Password",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return res.status(400).json({ errors: err });
      } else {
        // console.log(req.user);
        return res.redirect("/shop/1");
      }
    });
  })(req, res, next);
});

//
router.use(error);
// export the router
module.exports = router;
