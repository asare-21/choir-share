const { Router } = require("express");
const router = Router();

router.get("/", (req, res) => {
  console.log(req.session.passport);
  if (req.session.passport == undefined) {
    res.redirect("/");
  } else {
    res.render("uploads.ejs", {
      user: JSON.stringify({
        name: req.session.passport.user.name,
        phone: req.session.passport.user.phone,
        email: req.session.passport.user.email,
        uploads: req.session.passport.user.uploads,
        admin: req.session.passport.user.admin,
        id: req.session.passport.user.id,
        pending: pendingUsers,
      }),
    });
  }
});

module.exports = router;
