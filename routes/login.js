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
        if (!user.approved) {
          return res.render("login.ejs", {
            haserror: true,
            error:
              "Your account has not been approved. Please contact the administrator.",
          });
        } else {
          // if the login details are approved, the user is redirected to the library page
          return res.redirect("/library");
        }
      }
    });
  })(req, res, next);
});

//
router.use(error);
// export the router
module.exports = router;
