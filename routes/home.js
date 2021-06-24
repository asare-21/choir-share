const { Router } = require("express");
const router = Router();
const { user } = require("../models/userMode");
/**
 * This is the home page where you can view all your uploads and others
 * if you are an admin, you have the opportunity to view all the unapproved registration requests
 *
 */
router.get("/", (req, res) => {
  console.log(req.session.passport);
  if (req.session.passport == undefined) {
    res.redirect("/");
  } else {
    // if the account is an admin, fetch all unapproved users and display to the admin
    //else renders as a normal user

    if (req.session.passport.user.admin) {
      var pendingUsers = [];
      user.find((err, result) => {
        if (result !== null || result !== undefined) {
          console.log(err, result);
          result.forEach((new_user) => {
            if (!new_user.approved) {
              pendingUsers.push({
                id: new_user._id,
                name: new_user.name,
                phone: new_user.phone,
                email: new_user.email,
              });
            }
          });
          res.render(
            "index.ejs",

            {
              user: JSON.stringify({
                name: req.session.passport.user.name,
                phone: req.session.passport.user.phone,
                email: req.session.passport.user.email,
                uploads: req.session.passport.user.uploads,
                admin: req.session.passport.user.admin,
                id: req.session.passport.user.id,
                pending: pendingUsers,
              }),
            }
          );
        }
      });
    } else {
      res.render("index.ejs", {
        user: JSON.stringify({
          name: req.session.passport.user.name,
          phone: req.session.passport.user.phone,
          email: req.session.passport.user.email,
          uploads: req.session.passport.user.uploads,
          admin: req.session.passport.user.admin,
          id: req.session.passport.user.id,
        }),
      });
    }
  }
});

module.exports = router;
