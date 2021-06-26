const { Router } = require("express");
const router = Router();
const { user } = require("../models/userMode");
const { song } = require("../models/songModel");
router.get("/", (req, res) => {
  console.log(req.session.passport);
  if (req.session.passport == undefined) {
    res.redirect("/");
  } else {
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
          song.find((err, result) => {
            console.log(result);
            songs = result;
            res.render("index.ejs", {
              user: JSON.stringify({
                name: req.session.passport.user.name,
                phone: req.session.passport.user.phone,
                email: req.session.passport.user.email,
                uploads: songs,
                admin: req.session.passport.user.admin,
                id: req.session.passport.user.id,
              }),
            });
          });
          // res.render("uploads.ejs", {
          //   user: JSON.stringify({
          //     name: req.session.passport.user.name,
          //     phone: req.session.passport.user.phone,
          //     email: req.session.passport.user.email,
          //     uploads: req.session.passport.user.uploads,
          //     admin: req.session.passport.user.admin,
          //     id: req.session.passport.user.id,
          //     pending: pendingUsers,
          //   }),
          // });
        }
      });
    } else {
      song.find((err, result) => {
        console.log(result);
        songs = result;
        song.find((err, result) => {
          console.log(result);
          songs = result;
          res.render("index.ejs", {
            user: JSON.stringify({
              name: req.session.passport.user.name,
              phone: req.session.passport.user.phone,
              email: req.session.passport.user.email,
              uploads: songs,
              admin: req.session.passport.user.admin,
              id: req.session.passport.user.id,
            }),
          });
        });
      });
    }
  }
});

module.exports = router;
